#### BroadcastTransmitter、BroadcastReceiver使用

`OneToOneRingBuffer`和`ManyToOneRingBuffer`支持一个或多个生产者，但只有一个消费者。我们有时候可能需要一个生产者对多消费者 - Agrona为此提供了`BroadcastTransmitter`和`BroadcastReceiver`

> 注意：如果发送者的生产速度快于消费者的消费速度`BroadcastTransmitter` `BroadcastReceiver` 将会丢弃消息

##### 发送

发送操作是通过 `BroadcastTransmitter` 完成的。必须提前创建一个buffer，然后将其交给 `BroadcastTransmitter` 进行传输。

```
private final BroadcastTransmitter transmitter;
private final MutableDirectBuffer msgBuffer = new ExpandableArrayBuffer();

public SendAgent(final AtomicBuffer buffer...){
    this.transmitter = new BroadcastTransmitter(buffer);
}

@Override
public int doWork(){
    ...
    msgBuffer.putInt(0, lastSend);
    transmitter.transmit(1, msgBuffer, 0, Integer.BYTES);
    ...
    lastSend++;
}
```


##### 接受
接收操作是通过 CopyBroadcastReceiver 完成的。这使得接收消息变得更简单，并允许通过 MessageHandler 接口接收消息

```
public class ReceiveAgent implements Agent, MessageHandler{
    ...
    private final BroadcastReceiver broadcastReceiver;
    private final CopyBroadcastReceiver copyBroadcastReceiver;

    public ReceiveAgent(final AtomicBuffer atomicBuffer, final String name) {
        this.broadcastReceiver = new BroadcastReceiver(atomicBuffer);
        this.copyBroadcastReceiver = new CopyBroadcastReceiver(broadcastReceiver);
        ...
    }

    @Override
    public int doWork(){
        copyBroadcastReceiver.receive(this::onMessage);
        return 0;
    }

    @Override
    public void onMessage(int msgTypeId, MutableDirectBuffer buffer, int index, int length) {
        LOGGER.info("Received {}", buffer.getInt(index));
    }
...
}

```



#### 源码

##### 1. 消息的结构
消息结构和OneToOneRingBuffer中相同

![b7386ae826c42923f823ff1016fb611f.png](evernotecid://6FF9FFB1-4418-4BC7-B513-008A9C1B4B1C/appyinxiangcom/27568155/ENResource/p36)


* MsgLength: 消息的长度，占用4个字节
* MsgTypeId: 消息的类型，占用4个字节，
* Message: 实际消息的内容

`RecordDescriptor`与上篇提到的方法基本一致


##### 2. 核心指针

![f984d2ab88be1f055624a27243f175fb.png](evernotecid://6FF9FFB1-4418-4BC7-B513-008A9C1B4B1C/appyinxiangcom/27568155/ENResource/p35)

capacity = dataCapacity + trailerLength, BroadcastTransmitter会在构造方法中计算出实际存放数据大小的空间dataCapacity，所以在AtomicBuffer创建的时候需要考虑
```
public BroadcastTransmitter(final AtomicBuffer buffer){
    this.buffer = buffer;
    this.capacity = buffer.capacity() - TRAILER_LENGTH;
    ...
}
```

* tailIntentCountIndex、tailCounterIndex: 存放尾部指针，用来计算下条消息写入的位置
* latestCounterIndex: 存放当前消息开始写入的位置，每次写入的时候都会更新，读取的时候从该位置开始
* toEndOfBuffer: 剩余的空间大小


##### 3. 发送消息 BroadcastTransmitter

![1621de6a42a3d6105d1e93985ab11e1d.png](evernotecid://6FF9FFB1-4418-4BC7-B513-008A9C1B4B1C/appyinxiangcom/27568155/ENResource/p37)

当需要发送的消息长度大于剩余的空间大小后会写入填充消息(type=PADDING_MSG_TYPE_ID)，

```
if (toEndOfBuffer < recordLengthAligned){
    signalTailIntent(buffer, newTail + toEndOfBuffer);
    insertPaddingRecord(buffer, recordOffset, toEndOfBuffer);

    currentTail += toEndOfBuffer;
    recordOffset = 0;
}
```

在发送完成之后会更新tailCounterIndex、tailIntentCountIndex (等于开始写入的位置+消息的长度)，这两个值相同 ；还会更新latestCounterIndex等于开始写入消息的位置
```
public void transmit(final int msgTypeId, final DirectBuffer srcBuffer, final int srcIndex, final int length){
        ...
        long currentTail = buffer.getLong(tailCounterIndex);
        final int recordLength = HEADER_LENGTH + length;
        final int recordLengthAligned = BitUtil.align(recordLength, RECORD_ALIGNMENT);
        final long newTail = currentTail + recordLengthAligned;
        ...
        buffer.putLongOrdered(latestCounterIndex, currentTail);
        buffer.putLongOrdered(tailCounterIndex, currentTail + recordLengthAligned);
    }
```


##### 3. 接受消息 BroadcastReceiver
在BroadcastReceiver的构造方法中会初始化读取的游标`cursor = buffer.getLongVolatile(latestCounterIndex);`,

接下来看下`receiveNext`的代码：
```
public boolean receiveNext(){
    boolean isAvailable = false;
    final AtomicBuffer buffer = this.buffer;
    final long tail = buffer.getLongVolatile(tailCounterIndex);
    long cursor = nextRecord;

    if (tail > cursor) { //判断是否有新的消息可读
        final int capacity = this.capacity;
        int recordOffset = (int)cursor & (capacity - 1);

        if (!validate(cursor, buffer, capacity)) { //校验消费者的速度是否能够跟上生产者
            lappedCount.lazySet(lappedCount.get() + 1);

            cursor = buffer.getLongVolatile(latestCounterIndex);
            recordOffset = (int)cursor & (capacity - 1);
        }

        this.cursor = cursor;
        nextRecord = cursor + align(buffer.getInt(lengthOffset(recordOffset)), RECORD_ALIGNMENT);

        if (PADDING_MSG_TYPE_ID == buffer.getInt(typeOffset(recordOffset)))  { //跳过填充类型的消息
            recordOffset = 0;
            this.cursor = nextRecord;
            nextRecord += align(buffer.getInt(lengthOffset(recordOffset)), RECORD_ALIGNMENT);
        }

        this.recordOffset = recordOffset;
        isAvailable = true;
    }

    return isAvailable;
}
```


消费者的速度是否能够跟上生产者, `cursor + capacity > tail` 表示消费者能跟上

![e29849860d7824c00d9ca6237b5c9b6f.png](evernotecid://6FF9FFB1-4418-4BC7-B513-008A9C1B4B1C/appyinxiangcom/27568155/ENResource/p38)

如果生产者的速度大于消费者，那么最终tail会比cursor快一圈，这时候 `BroadcastReceiver` 会重新更新cursor，然后从新的cursor开始读取数据，因此agrona的广播模式会出现丢数据的情况。

`CopyBroadcastReceiver` 实际就是在 `BroadcastReceiver` 的基础上进行了封装，让我们可以通过使用`MessageHandler`来处理消息，如果出现了丢消息的情况，`CopyBroadcastReceiver` 会抛出异常 `throw new IllegalStateException("unable to keep up with broadcast")`


原文链接: [http://herman7z.site](http://herman7z.site)
