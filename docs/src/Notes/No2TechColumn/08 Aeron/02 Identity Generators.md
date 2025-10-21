#### Snowflake概要
Snowflake是一种分布式全局唯一ID的算法，最初是由Twitter创建，看图：

![5363f0db689819b1c93c9d08ecdc0965.png](evernotecid://6FF9FFB1-4418-4BC7-B513-008A9C1B4B1C/appyinxiangcom/27568155/ENResource/p25)

Snowflake由64bit组成，共有4部分组成：

1. 占用1bit，目前暂时未使用，始终是0；
2. 时间戳占用41bit，由于当前时间戳的二进制就是41bit，所以这个时间是精确到毫秒，这个时间是由1970年开始计算的，由于41bit的最大值限制，往后可以使用69年。
3. 机器id占用10bit，最多可以表示1024台机器
4. 序列号占用12bit，表示同一台机器上同一时刻最多可以同时生成4096个id


#### agrona中的SnowflakeIdGenerator源码解析
##### 构造方法
```
 public SnowflakeIdGenerator(
        final int nodeIdBits,
        final int sequenceBits,
        final long nodeId,
        final long timestampOffsetMs,
        final EpochClock clock)
    {
    .....
    }
```

* nodeIdBits: 设置机器id占用多少字节，默认是10bit
* sequenceBits: 设置序列号占用多少字节，默认值12bit
* nodeId: 设置机器的ID
* timestampOffsetMs: 在Snowflake概要中提到，雪花算法中的时间戳占用41bit，从1970开始只能支持69年，也就是2039年；timestampOffsetMs就是解决这个问题，设置从指定的时间开始而不是1970
* clock: agrona中的时钟，默认使用的是系统时钟`SystemEpochClock`
```
public class SystemEpochClock implements EpochClock
{
    /**
     * As there is no instance state then this object can be used to save on allocation.
     */
    public static final SystemEpochClock INSTANCE = new SystemEpochClock();

    /**
     * {@inheritDoc}
     */
    public long time()
    {
        return System.currentTimeMillis();
    }
}
```

* timestampSequence: 记录时间戳左移22位后的值，为了防止出现并发问题，agrona更新这个字段使用了cas；

```
abstract class AbstractSnowflakeIdGeneratorPaddingLhs
{
    byte p000, p001, p002, p003, p004, p005, p006, p007, p008, p009, p010, p011, p012, p013, p014, p015;
    byte p016, p017, p018, p019, p020, p021, p022, p023, p024, p025, p026, p027, p028, p029, p030, p031;
    byte p032, p033, p034, p035, p036, p037, p038, p039, p040, p041, p042, p043, p044, p045, p046, p047;
    byte p048, p049, p050, p051, p052, p053, p054, p055, p056, p057, p058, p059, p060, p061, p062, p063;
}

abstract class AbstractSnowflakeIdGeneratorValue extends AbstractSnowflakeIdGeneratorPaddingLhs
{
    static final AtomicLongFieldUpdater<AbstractSnowflakeIdGeneratorValue> TIMESTAMP_SEQUENCE_UPDATER =
        AtomicLongFieldUpdater.newUpdater(AbstractSnowflakeIdGeneratorValue.class, "timestampSequence");

    volatile long timestampSequence;
}

abstract class AbstractSnowflakeIdGeneratorPaddingRhs extends AbstractSnowflakeIdGeneratorValue
{
    byte p064, p065, p066, p067, p068, p069, p070, p071, p072, p073, p074, p075, p076, p077, p078, p079;
    byte p080, p081, p082, p083, p084, p085, p086, p087, p088, p089, p090, p091, p092, p093, p094, p095;
    byte p096, p097, p098, p099, p100, p101, p102, p103, p104, p105, p106, p107, p108, p109, p110, p111;
    byte p112, p113, p114, p115, p116, p117, p118, p119, p120, p121, p122, p123, p124, p125, p126, p127;
}
```

从上面的代码我们可以看到在timestampSequence字段的前后都填充了64bit，这是为了解决伪共享的问题，现在的CPU都有缓存行通常是64bit，timestampSequence的字段类型是long占用8个字节，如果不填充，加载了timestampSequence缓存行还包含了其他数据，如果这些数据过期会导致整个缓存行都过期，这在高并发的场景下会影响性能。



##### 生成id的核心方法nextId

该方法主要分为三种情况：
1. `timestampMs > oldTimestampMs`，说明雪花算法中的时间戳部分没有冲突，那么把当前时间戳`timestampMs << nodeIdAndSequenceBits`, 然后cas更新timestampSequence；返回`newTimestampSequence | nodeBits`;

```
 if (timestampMs > oldTimestampMs)
{
    final long newTimestampSequence = timestampMs << nodeIdAndSequenceBits;
    if (TIMESTAMP_SEQUENCE_UPDATER.compareAndSet(this, oldTimestampSequence, newTimestampSequence))
    {
        return newTimestampSequence | nodeBits;
    }
}
```

其中的`nodeIdAndSequenceBits`与`nodeBits`是在构造方法中设置的

```
 this.nodeIdAndSequenceBits = nodeIdBits + sequenceBits; //10+12=22bit
 this.nodeBits = nodeId << sequenceBits; //机器id左移12bit
```

2. `timestampMs == oldTimestampMs`，说明时间戳部分冲突，需要通过递增序列号来保证唯一，从oldTimestampMs中解析出序列号oldSequence，只要没有超过允许的最大序列号就+1后继续cas；如果序列号超过了最大值就继续循环直到下一毫秒在生成id，这样时间戳就不会冲突

```
if (timestampMs == oldTimestampMs)
{
    final long oldSequence = oldTimestampSequence & maxSequence;
    if (oldSequence < maxSequence)
    {
        final long newTimestampSequence = oldTimestampSequence + 1;
        if (TIMESTAMP_SEQUENCE_UPDATER.compareAndSet(this, oldTimestampSequence, newTimestampSequence))
        {
            return newTimestampSequence | nodeBits;
        }
    }
}
```

3. `timestampMs == oldTimestampMs`, 说明时间出现了回拨，可能是人为原因，把系统时间改了，或者是机器之间的时间同步出现了误差，在这种情况下agrona之间抛异常

```
else
{
    throw new IllegalStateException(
        "clock has gone backwards: timestampMs=" + timestampMs + " < oldTimestampMs=" + oldTimestampMs);
}
```


#### 扩展
以上我们讲完了SnowflakeIdGenerator所有的核心，现在我们考虑下，通常情况我们的服务都会部署多个实例，那么在创建SnowflakeIdGenerator应该如何设置nodeId, 如果是命令行jar的方式启动，可以通过设置命令行参数，但如果是k8s容器启动并且可以随机增加减少实例就不太方便，此时我们可以考虑使用zk的零时节点来动态生成nodeId。

##### 设计配置参数yml, SnowflakeIdGeneratorProperties
```
snowflake:
  zookeeper:
    servers: zoo1.com:2181
    namespace: snowflake
  group: ${project_name}
  timestampOffsetMs: xxx
  nodeIdBits: 10
```

* zookeeper: 配置zk相关的参数信息
* timestampOffsetMs: 配置SnowflakeIdGenerator的时间戳偏移量
* nodeIdBits: 配置机器id占用的字节数

##### 扩展agrona中的SnowflakeIdGenerator

```
public class ExtendedSnowflakeIdGenerator implement ConnectStateListener{
    private SnowflakeIdGenerator idGenerator;
    private long timestampOffSetMs;
    private boolean suspend;
    private boolean inactive;
    
    private LongSupplier nodeIdSupplier;
    
    public ExtendedSnowflakeIdGenerator(LongSupplier nodeIdSupplier, long timestampOffSetMs){
        this.timestampOffSetMs = timestampOffSetMs;
        this.idGenerator = new SnowflakeIdGenerator(...);
    }
    
    public long nextId(){
        if(inactive){
            throw new IllegalStatExecption(...);
        }
        return idGenerator.nextId();
    }
    
    public void stateChanged(CuratorFramework zkClient, ConnectionState state){
        if(state == SUSPEND){
            this.suspend=true;
        }
    
        if(state == LOST){
            this.inactive=true;
        }
        
        if(state == RECONNECTED){
            long nodeId = nodeIdSupplier.getAsLong();
            this.idGenerator = new SnowflakeIdGenerator(...);
        }
    }
    
    
    //geter, setter ...
    
}

```

因为我们考虑使用zk来扩展SnowflakeIdGenerator, 如果出现了zk的链接状态不稳定时，我们需要对SnowflakeIdGenerator做相应的控制，所以这增加了两个字段`suspend` `inactive`,然后实现了ConnectStateListener来感知zk链接的状态变化; 如果链接状态是RECONNECTED, 那么需要重新生成nodeId和SnowflakeIdGenerator避免出现了不同的实例使用了相同的nodeId


接下来创建SnowFlakeFactory，主要的职责就是创建`ExtendedSnowflakeIdGenerator` 以及获取一个可用的nodeId,主要是通过判断zk的节点是否存在来校验nodeId是否被使用。

```
public class SnowFlakeFactory {
    private CuratorFrameWork zkClient;
    private ExtendedSnowflakeIdGenerator idGenerator;
    
    public SnowFlakeFactory(){
       
    }
   
    public void destroy(){
        if(zkClient.getState() != STOPPED){
            zkClient.close();
        }
    }
    
    public ExtendedSnowflakeIdGenerator createIdGenerator(){
        return new ExtendedSnowflakeIdGenerator(
            ()->this.getAvailableNodeId(),
            ...
        );
    }
    
    public long getAvailableNodeId(){
        String groupPath = String.format("/%s/id_node", group);
        Stat stat = zkClient.checkExists().forPath(groupPaht);
        List<String> existNodes ;
        if(stat==null){
            zkClient.create().creatingParentsIfNeeded()
            .forPath(groupPath,"".getBytes();
            existNodes=new ArrayList();
        }else {
            existNodes=zkClient.getChildren().forPath(groupPath);
        }
        
        String workPath;
        long maxNodeId = (long) (Math.pow(2, nodeIdBits) -1);
        for(long i=1; i< maxNodeId; i++){
            workPath = String.format("work_%d",i);
            if(!existNodes.contains(workPath)){
                try{
                    zkClient.create.withMode(EPHEMERAL)
                    .forPath(groupPath+"/"+workPath,"".getBytes());
                    return i;
                }catch(NodeExistsException e){
                }
            }
        }
    } 
    
}
```


原文链接: [http://herman7z.site](http://herman7z.site)
