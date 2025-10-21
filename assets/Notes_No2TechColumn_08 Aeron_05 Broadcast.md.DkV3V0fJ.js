import{_ as a,c as n,o as s,aa as e}from"./chunks/framework.DOnJscRE.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Notes/No2TechColumn/08 Aeron/05 Broadcast.md","filePath":"Notes/No2TechColumn/08 Aeron/05 Broadcast.md","lastUpdated":1761051585000}'),p={name:"Notes/No2TechColumn/08 Aeron/05 Broadcast.md"},t=e(`<h4 id="broadcasttransmitter、broadcastreceiver使用" tabindex="-1">BroadcastTransmitter、BroadcastReceiver使用 <a class="header-anchor" href="#broadcasttransmitter、broadcastreceiver使用" aria-label="Permalink to &quot;BroadcastTransmitter、BroadcastReceiver使用&quot;">​</a></h4><p><code>OneToOneRingBuffer</code>和<code>ManyToOneRingBuffer</code>支持一个或多个生产者，但只有一个消费者。我们有时候可能需要一个生产者对多消费者 - Agrona为此提供了<code>BroadcastTransmitter</code>和<code>BroadcastReceiver</code></p><blockquote><p>注意：如果发送者的生产速度快于消费者的消费速度<code>BroadcastTransmitter</code> <code>BroadcastReceiver</code> 将会丢弃消息</p></blockquote><h5 id="发送" tabindex="-1">发送 <a class="header-anchor" href="#发送" aria-label="Permalink to &quot;发送&quot;">​</a></h5><p>发送操作是通过 <code>BroadcastTransmitter</code> 完成的。必须提前创建一个buffer，然后将其交给 <code>BroadcastTransmitter</code> 进行传输。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private final BroadcastTransmitter transmitter;</span></span>
<span class="line"><span>private final MutableDirectBuffer msgBuffer = new ExpandableArrayBuffer();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public SendAgent(final AtomicBuffer buffer...){</span></span>
<span class="line"><span>    this.transmitter = new BroadcastTransmitter(buffer);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public int doWork(){</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    msgBuffer.putInt(0, lastSend);</span></span>
<span class="line"><span>    transmitter.transmit(1, msgBuffer, 0, Integer.BYTES);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    lastSend++;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="接受" tabindex="-1">接受 <a class="header-anchor" href="#接受" aria-label="Permalink to &quot;接受&quot;">​</a></h5><p>接收操作是通过 CopyBroadcastReceiver 完成的。这使得接收消息变得更简单，并允许通过 MessageHandler 接口接收消息</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ReceiveAgent implements Agent, MessageHandler{</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    private final BroadcastReceiver broadcastReceiver;</span></span>
<span class="line"><span>    private final CopyBroadcastReceiver copyBroadcastReceiver;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ReceiveAgent(final AtomicBuffer atomicBuffer, final String name) {</span></span>
<span class="line"><span>        this.broadcastReceiver = new BroadcastReceiver(atomicBuffer);</span></span>
<span class="line"><span>        this.copyBroadcastReceiver = new CopyBroadcastReceiver(broadcastReceiver);</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int doWork(){</span></span>
<span class="line"><span>        copyBroadcastReceiver.receive(this::onMessage);</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void onMessage(int msgTypeId, MutableDirectBuffer buffer, int index, int length) {</span></span>
<span class="line"><span>        LOGGER.info(&quot;Received {}&quot;, buffer.getInt(index));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="源码" tabindex="-1">源码 <a class="header-anchor" href="#源码" aria-label="Permalink to &quot;源码&quot;">​</a></h4><h5 id="_1-消息的结构" tabindex="-1">1. 消息的结构 <a class="header-anchor" href="#_1-消息的结构" aria-label="Permalink to &quot;1. 消息的结构&quot;">​</a></h5><p>消息结构和OneToOneRingBuffer中相同</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images//202510212054895.png" alt=""></p><ul><li>MsgLength: 消息的长度，占用4个字节</li><li>MsgTypeId: 消息的类型，占用4个字节，</li><li>Message: 实际消息的内容</li></ul><p><code>RecordDescriptor</code>与上篇提到的方法基本一致</p><h5 id="_2-核心指针" tabindex="-1">2. 核心指针 <a class="header-anchor" href="#_2-核心指针" aria-label="Permalink to &quot;2. 核心指针&quot;">​</a></h5><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images//202510212054701.png" alt=""></p><p>capacity = dataCapacity + trailerLength, BroadcastTransmitter会在构造方法中计算出实际存放数据大小的空间dataCapacity，所以在AtomicBuffer创建的时候需要考虑</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public BroadcastTransmitter(final AtomicBuffer buffer){</span></span>
<span class="line"><span>    this.buffer = buffer;</span></span>
<span class="line"><span>    this.capacity = buffer.capacity() - TRAILER_LENGTH;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>tailIntentCountIndex、tailCounterIndex: 存放尾部指针，用来计算下条消息写入的位置</li><li>latestCounterIndex: 存放当前消息开始写入的位置，每次写入的时候都会更新，读取的时候从该位置开始</li><li>toEndOfBuffer: 剩余的空间大小</li></ul><h5 id="_3-发送消息-broadcasttransmitter" tabindex="-1">3. 发送消息 BroadcastTransmitter <a class="header-anchor" href="#_3-发送消息-broadcasttransmitter" aria-label="Permalink to &quot;3. 发送消息 BroadcastTransmitter&quot;">​</a></h5><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images//202510212054007.png" alt="202510212054007"></p><p>当需要发送的消息长度大于剩余的空间大小后会写入填充消息(type=PADDING_MSG_TYPE_ID)，</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (toEndOfBuffer &lt; recordLengthAligned){</span></span>
<span class="line"><span>    signalTailIntent(buffer, newTail + toEndOfBuffer);</span></span>
<span class="line"><span>    insertPaddingRecord(buffer, recordOffset, toEndOfBuffer);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    currentTail += toEndOfBuffer;</span></span>
<span class="line"><span>    recordOffset = 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在发送完成之后会更新tailCounterIndex、tailIntentCountIndex (等于开始写入的位置+消息的长度)，这两个值相同 ；还会更新latestCounterIndex等于开始写入消息的位置</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void transmit(final int msgTypeId, final DirectBuffer srcBuffer, final int srcIndex, final int length){</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>        long currentTail = buffer.getLong(tailCounterIndex);</span></span>
<span class="line"><span>        final int recordLength = HEADER_LENGTH + length;</span></span>
<span class="line"><span>        final int recordLengthAligned = BitUtil.align(recordLength, RECORD_ALIGNMENT);</span></span>
<span class="line"><span>        final long newTail = currentTail + recordLengthAligned;</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>        buffer.putLongOrdered(latestCounterIndex, currentTail);</span></span>
<span class="line"><span>        buffer.putLongOrdered(tailCounterIndex, currentTail + recordLengthAligned);</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h5 id="_3-接受消息-broadcastreceiver" tabindex="-1">3. 接受消息 BroadcastReceiver <a class="header-anchor" href="#_3-接受消息-broadcastreceiver" aria-label="Permalink to &quot;3. 接受消息 BroadcastReceiver&quot;">​</a></h5><p>在BroadcastReceiver的构造方法中会初始化读取的游标<code>cursor = buffer.getLongVolatile(latestCounterIndex);</code>,</p><p>接下来看下<code>receiveNext</code>的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean receiveNext(){</span></span>
<span class="line"><span>    boolean isAvailable = false;</span></span>
<span class="line"><span>    final AtomicBuffer buffer = this.buffer;</span></span>
<span class="line"><span>    final long tail = buffer.getLongVolatile(tailCounterIndex);</span></span>
<span class="line"><span>    long cursor = nextRecord;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (tail &gt; cursor) { //判断是否有新的消息可读</span></span>
<span class="line"><span>        final int capacity = this.capacity;</span></span>
<span class="line"><span>        int recordOffset = (int)cursor &amp; (capacity - 1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (!validate(cursor, buffer, capacity)) { //校验消费者的速度是否能够跟上生产者</span></span>
<span class="line"><span>            lappedCount.lazySet(lappedCount.get() + 1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            cursor = buffer.getLongVolatile(latestCounterIndex);</span></span>
<span class="line"><span>            recordOffset = (int)cursor &amp; (capacity - 1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this.cursor = cursor;</span></span>
<span class="line"><span>        nextRecord = cursor + align(buffer.getInt(lengthOffset(recordOffset)), RECORD_ALIGNMENT);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (PADDING_MSG_TYPE_ID == buffer.getInt(typeOffset(recordOffset)))  { //跳过填充类型的消息</span></span>
<span class="line"><span>            recordOffset = 0;</span></span>
<span class="line"><span>            this.cursor = nextRecord;</span></span>
<span class="line"><span>            nextRecord += align(buffer.getInt(lengthOffset(recordOffset)), RECORD_ALIGNMENT);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this.recordOffset = recordOffset;</span></span>
<span class="line"><span>        isAvailable = true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return isAvailable;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>消费者的速度是否能够跟上生产者, <code>cursor + capacity &gt; tail</code> 表示消费者能跟上</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images//202510212051106.png" alt="202510212051106"></p><p>如果生产者的速度大于消费者，那么最终tail会比cursor快一圈，这时候 <code>BroadcastReceiver</code> 会重新更新cursor，然后从新的cursor开始读取数据，因此agrona的广播模式会出现丢数据的情况。</p><p><code>CopyBroadcastReceiver</code> 实际就是在 <code>BroadcastReceiver</code> 的基础上进行了封装，让我们可以通过使用<code>MessageHandler</code>来处理消息，如果出现了丢消息的情况，<code>CopyBroadcastReceiver</code> 会抛出异常 <code>throw new IllegalStateException(&quot;unable to keep up with broadcast&quot;)</code></p><p>原文链接: <a href="http://herman7z.site" target="_blank" rel="noreferrer">http://herman7z.site</a></p>`,35),i=[t];function l(c,r,o,d,f,u){return s(),n("div",null,i)}const b=a(p,[["render",l]]);export{g as __pageData,b as default};
