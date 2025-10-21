import{_ as n,c as a,o as s,aa as e}from"./chunks/framework.DOnJscRE.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Notes/No2TechColumn/08 Aeron/04 RingBuffer.md","filePath":"Notes/No2TechColumn/08 Aeron/04 RingBuffer.md","lastUpdated":1761051585000}'),p={name:"Notes/No2TechColumn/08 Aeron/04 RingBuffer.md"},i=e(`<p>Agrona提供了环形缓冲区工具类，本篇主要从基本使用和源码的角度来学习OneToOneRingBuffer、ManyToOneRingBuffer</p><h4 id="onetooneringbuffer-使用" tabindex="-1">OneToOneRingBuffer 使用 <a class="header-anchor" href="#onetooneringbuffer-使用" aria-label="Permalink to &quot;OneToOneRingBuffer 使用&quot;">​</a></h4><h5 id="_1-写入数据write" tabindex="-1">1. 写入数据write <a class="header-anchor" href="#_1-写入数据write" aria-label="Permalink to &quot;1. 写入数据write&quot;">​</a></h5><p>缓存区的大小是预先定义的并且不能修改，在下面的示例中，底层缓冲区是在堆外分配的，并设置为接受 4096 字节的内容。需要添加RingBufferDescriptor.TRAILER_LENGTH，以便支持环形缓冲区的数据保存在同一底层缓冲区中。请注意，通过写入环形缓冲区的任何数据write都会附带一个额外的 8 字节标头，因此在调整底层缓冲区大小时一定要记住这一开销。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final int bufferLength = 4096 + RingBufferDescriptor.TRAILER_LENGTH;</span></span>
<span class="line"><span>final UnsafeBuffer internalBuffer</span></span>
<span class="line"><span>        = new UnsafeBuffer(ByteBuffer.allocateDirect(bufferLength));</span></span>
<span class="line"><span>final OneToOneRingBuffer ringBuffer</span></span>
<span class="line"><span>        = new OneToOneRingBuffer(internalBuffer);</span></span></code></pre></div><p>其中的<code>RingBufferDescriptor.TRAILER_LENGTH</code> 以及 为何write的数据需要额外写 8 字节在后续的源码分析中解答。</p><p>发送数据非常简单，调用write方法即可，返回值指示写入是否成功，如果值为false，则写入失败</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//prepare some data</span></span>
<span class="line"><span>final UnsafeBuffer toSend = new UnsafeBuffer(ByteBuffer.allocateDirect(10));</span></span>
<span class="line"><span>toSend.putStringWithoutLengthAscii(0, &quot;012345679&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//write the data</span></span>
<span class="line"><span>private sentOk = ringBuffer.write(1, toSend, 0, 10);</span></span></code></pre></div><h5 id="_2-tryclaim" tabindex="-1">2. tryClaim <a class="header-anchor" href="#_2-tryclaim" aria-label="Permalink to &quot;2. tryClaim&quot;">​</a></h5><p>在上面调用write方法写入数据时我们可以发现需要提前声明一个Buffer，在写入数据的时候会多产生一次数据的拷贝；在性能要求高的场景下我们可以考虑使用 <code>tryClaim</code> ， 允许我们直接写入底层的Buffer达到减少数据拷贝的目的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final RingBuffer ringBuffer = ...;</span></span>
<span class="line"><span>final int index = ringBuffer.tryClaim(msgTypeId, messageLength);</span></span>
<span class="line"><span>if (index &gt; 0) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        final AtomicBuffer buffer = ringBuffer.buffer();</span></span>
<span class="line"><span>        // 用户之间操作底层的buffer来写入数据</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>        ringBuffer.commit(index); // commit message</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (final Exception ex) {</span></span>
<span class="line"><span>        ringBuffer.abort(index); // allow consumer to proceed</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    } finally  {</span></span>
<span class="line"><span>        ringBuffer.commit(index); // commit message</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>首先调用tryClaim申请写入数据的空间，如果返回的索引 &gt; 0，说明空间足够，可以从这个索引的位置开始写入数据。</li><li>然后我们继续获取底层缓冲区的对象，通过这个对象写入数据 <code>buffer.put</code></li><li>最后，commit或abort</li></ul><h5 id="_3-读取数据-read、controlledread" tabindex="-1">3. 读取数据 read、controlledRead <a class="header-anchor" href="#_3-读取数据-read、controlledread" aria-label="Permalink to &quot;3. 读取数据 read、controlledRead&quot;">​</a></h5><p>数据的使用是通过 <code>agrona</code> 接口的实现完成的 <code>MessageHandler</code>，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class MessageCapture implements MessageHandler</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void onMessage(int msgTypeId, MutableDirectBuffer buffer, int index, int length)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //do something </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当我们在读取消息的是，可能会根据消息的内容来控制是否需要跳过本条消息等操作，需要实现接口<code>ControlledMessageHandler</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class ControlledMessageCapture implements ControlledMessageHandler{</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public ControlledMessageHandler.Action onMessage(int msgTypeId, MutableDirectBuffer buffer, int index, int length)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        ..do something</span></span>
<span class="line"><span>        return Action.COMMIT; //or ABORT, BREAK OR CONTINUE as required.</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该接口的返回值是<code>返回值的类型ControlledMessageHandler.Action</code>, 有 4 个选项：</p><ul><li>ABORT: 消息的head指针将会重新回到本条消息的开头，然后break读取消息的while循环；等待下一次调用read从新消费该消息</li><li>BREAK: break读取消息的while循环；等待下一次调用read从新消费该消息</li><li>COMMIT: 该消息读取有效，更新head指针的位置</li><li>CONTINUE: 继续读取，直到读取连续空间的所有消息或者超过了允许读取的最大消息条数；这个类型的效果等同于调用read</li></ul><p>可以通过RingBuffer对象的方法监视缓冲区的生产者和消费者进度。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//the current consumer position in the ring buffer</span></span>
<span class="line"><span>ringBuffer.consumerPosition();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//the current producer position in the ring buffer</span></span>
<span class="line"><span>ringBuffer.producerPosition();</span></span></code></pre></div><h4 id="onetooneringbuffer-源码" tabindex="-1">OneToOneRingBuffer 源码 <a class="header-anchor" href="#onetooneringbuffer-源码" aria-label="Permalink to &quot;OneToOneRingBuffer 源码&quot;">​</a></h4><h5 id="_1-recorddescriptor" tabindex="-1">1. RecordDescriptor <a class="header-anchor" href="#_1-recorddescriptor" aria-label="Permalink to &quot;1. RecordDescriptor&quot;">​</a></h5><p>在上文有提到写入到buffer中的数据都会多8个字节，是由于agrona在写入每条消息的时候会添加头信息(MsgTypeId、MsgLength)</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images//202510212056687.png" alt=""></p><ul><li>MsgLength: 消息的长度，占用4个字节</li><li>MsgTypeId: 消息的类型，占用4个字节，</li><li>Message: 实际消息的内容</li></ul><p>消息头信息的定义在<code>RecordDescriptor</code>中, 主要使用的方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static int typeOffset(final int recordOffset){</span></span>
<span class="line"><span>    return recordOffset + SIZE_OF_INT;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public static int lengthOffset(final int recordOffset){</span></span>
<span class="line"><span>    return recordOffset;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>public static int encodedMsgOffset(final int recordOffset){</span></span>
<span class="line"><span>    return recordOffset + HEADER_LENGTH;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>lengthOffset: 消息长度在buffer中的offset</li><li>typeOffset: 消息类型在buffer中的offset</li><li>encodedMsgOffset: 实际消息内容在buffer中的offset</li></ul><h5 id="_2-核心指针-ringbufferdescriptor" tabindex="-1">2. 核心指针（RingBufferDescriptor） <a class="header-anchor" href="#_2-核心指针-ringbufferdescriptor" aria-label="Permalink to &quot;2. 核心指针（RingBufferDescriptor）&quot;">​</a></h5><p>在开始分析源码之前我们先来看看这张图</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images//202510212057095.png" alt=""></p><p>在前面使用OneToOneRingBuffer的例子中，申请缓冲区空间的时候需要预留出TRAILER_LENGTH</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final int bufferLength = 4096 + RingBufferDescriptor.TRAILER_LENGTH;</span></span></code></pre></div><p>从图上我们可以看到 capacity = dataCapacity + trailerLength, OneToOneRingBuffer会在构造方法中计算出实际存放数据大小的空间dataCapacity，checkCapacity方法返回的就是dataCapacity；dataCapacity中存放的就是每条消息</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static int checkCapacity(final int capacity, final int minCapacity)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    final int dataCapacity = capacity - TRAILER_LENGTH;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    return dataCapacity;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>trailerLength主要是用来记录RingBuffer的指针信息，这些指针的偏移量定义在<code>RingBufferDescriptor</code>, 其中最重要的有三个：</p><ul><li>tailPositionIndex: 存放尾部指针，用来计算下条消息写入的位置，这个值会一直增加，计算实际的写入index = tail &amp; mask</li><li>headCachePositionIndex: 存放缓存的头指针，在write的时候，当计算出来的可用空间不够时会读取headPositionIndex中的值来更新为最新的head位置</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (requiredCapacity &gt; availableCapacity){</span></span>
<span class="line"><span>    head = buffer.getLongVolatile(headPositionIndex);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (requiredCapacity &gt; (capacity - (int)(tail - head))){</span></span>
<span class="line"><span>        return INSUFFICIENT_CAPACITY;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    buffer.putLong(headCachePositionIndex, head);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>headPositionIndex: 存放实际的head指针，再读取消息的时候会更新到最新位置</li></ul><blockquote><p>注意：tailPositionIndex、headPositionIndex以及headCachePositionIndex的值是固定的，在创建OneToOneRingBuffer就设置好了，它们是用来存放head和tail的，注意不要和head、tail混淆</p></blockquote><h5 id="_3-write方法" tabindex="-1">3. write方法 <a class="header-anchor" href="#_3-write方法" aria-label="Permalink to &quot;3. write方法&quot;">​</a></h5><p>在写入数据的时候最核心的方法就是<code>claimCapacity</code>,用来申请空间写入数据，这里我们就主要看<code>claimCapacity</code>是如何来申请空间的，首先我们需要说明以下几个变量方便后续源码阅读</p><ul><li>tail: 尾部指针，一直累加写入消息length，写入的时候更新</li><li>head: 头部指针，一直累加读取消息length，读取的时候更新</li><li>requiredCapacity: 写入消息需要的空间</li><li>toBufferEndLength: buffer剩余的连续空间（注意看上面的图）</li><li>availableCapacity: buffer允许写入的可用空间 <code>capacity - (int)(tail - head)</code></li><li>writeIndex: 申请的空间开始写入的位置</li></ul><p>在知道了上面的几个参数之后继续来看看<code>claimCapacity</code>的方法，主要处理了三种情况：</p><h6 id="_3-1-requiredcapacity-tobufferendlength" tabindex="-1">3.1 requiredCapacity &lt; toBufferEndLength <a class="header-anchor" href="#_3-1-requiredcapacity-tobufferendlength" aria-label="Permalink to &quot;3.1 requiredCapacity &lt; toBufferEndLength&quot;">​</a></h6><p>表示剩余空间充足，足够写入的消息，直接更新tailPositionIndex，然后返回允许写入的writeIndex</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images//202510212057660.png" alt=""></p><blockquote><p>注意图例每个格子表示1bit，图例只是展示head，tail指针变化的过程，不考虑消息的头信息</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final long tail = buffer.getLong(tailPositionIndex);</span></span>
<span class="line"><span>long nextTail = tail + alignedRecordLength;</span></span>
<span class="line"><span>buffer.putLongOrdered(tailPositionIndex, nextTail);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>final int recordIndex = (int)tail &amp; mask;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (alignedRecordLength == toBufferEndLength) {</span></span>
<span class="line"><span>    buffer.putLongOrdered(tailPositionIndex, nextTail);</span></span>
<span class="line"><span>    buffer.putLong(0, 0L); // pre-zero next message header</span></span>
<span class="line"><span>    return recordIndex;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h6 id="_3-2-alignedrecordlength-tobufferendlength" tabindex="-1">3.2 alignedRecordLength == toBufferEndLength <a class="header-anchor" href="#_3-2-alignedrecordlength-tobufferendlength" aria-label="Permalink to &quot;3.2 alignedRecordLength == toBufferEndLength&quot;">​</a></h6><p>表示剩余的空间刚好够写入消息</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images//202510212057969.png" alt=""></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (alignedRecordLength == toBufferEndLength){</span></span>
<span class="line"><span>    buffer.putLongOrdered(tailPositionIndex, nextTail);</span></span>
<span class="line"><span>    buffer.putLong(0, 0L); // pre-zero next message header</span></span>
<span class="line"><span>    return recordIndex;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h6 id="_3-3-requiredcapacity-tobufferendlength" tabindex="-1">3.3 requiredCapacity &gt; toBufferEndLength <a class="header-anchor" href="#_3-3-requiredcapacity-tobufferendlength" aria-label="Permalink to &quot;3.3 requiredCapacity &gt; toBufferEndLength&quot;">​</a></h6><p>表示剩余的空间不足写入本条消息，那么剩余的空间会填充, 保证写入数据是在连续的空间中，方便读取与写入； 设置writeInde=0, 更新nextTail 填充消息的类型<code>PADDING_MSG_TYPE_ID</code>(=-1), 填充的消息长度等于<code>toBufferEndLength</code>，在读取的时候就使用这两个值跳过填充类型的消息。 由于是从数组的开头写入，所以还需要判断需要申请的空间大小与<code>headIndex</code>比较，如果可写入的空间不够就返回 <code>-2</code></p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images//202510212058720.png" alt=""></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (requiredCapacity &gt; toBufferEndLength){</span></span>
<span class="line"><span>    writeIndex = 0;</span></span>
<span class="line"><span>    int headIndex = (int)head &amp; mask;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (requiredCapacity &gt; headIndex) { //判断空间是否足够</span></span>
<span class="line"><span>        head = buffer.getLongVolatile(headPositionIndex);</span></span>
<span class="line"><span>        headIndex = (int)head &amp; mask;</span></span>
<span class="line"><span>        if (requiredCapacity &gt; headIndex) {</span></span>
<span class="line"><span>            writeIndex = INSUFFICIENT_CAPACITY;</span></span>
<span class="line"><span>            nextTail = tail;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        buffer.putLong(headCachePositionIndex, head);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    padding = toBufferEndLength;</span></span>
<span class="line"><span>    nextTail += padding;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (0 != padding) {</span></span>
<span class="line"><span>    buffer.putLong(0, 0L);</span></span>
<span class="line"><span>    buffer.putIntOrdered(lengthOffset(recordIndex), -padding);</span></span>
<span class="line"><span>    MemoryAccess.releaseFence();</span></span>
<span class="line"><span>    buffer.putInt(typeOffset(recordIndex), PADDING_MSG_TYPE_ID); //设置填充的消息类型</span></span>
<span class="line"><span>    buffer.putIntOrdered(lengthOffset(recordIndex), padding);  //设置填充的消息长度</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>return writeIndex;</span></span></code></pre></div><p>到此<code>claimCapacity</code>方法的主要逻辑就结束了。</p><h6 id="_3-4-申请需要的写入空间之后-write方法中写入消息类型-消息长度-消息内容" tabindex="-1">3.4 申请需要的写入空间之后 write方法中写入消息类型，消息长度，消息内容 <a class="header-anchor" href="#_3-4-申请需要的写入空间之后-write方法中写入消息类型-消息长度-消息内容" aria-label="Permalink to &quot;3.4 申请需要的写入空间之后 write方法中写入消息类型，消息长度，消息内容&quot;">​</a></h6><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>buffer.putBytes(encodedMsgOffset(recordIndex), srcBuffer, offset, length);</span></span>
<span class="line"><span>buffer.putInt(typeOffset(recordIndex), msgTypeId);</span></span>
<span class="line"><span>buffer.putIntOrdered(lengthOffset(recordIndex), recordLength);</span></span></code></pre></div><h5 id="_3-tryclaim方法" tabindex="-1">3. tryClaim方法 <a class="header-anchor" href="#_3-tryclaim方法" aria-label="Permalink to &quot;3. tryClaim方法&quot;">​</a></h5><ol><li>同write方法一样先调用<code>claimCapacity</code>方法去申请写入的空间</li><li>空间申请成功后 只写入消息的类型与消息长度的负数 <code>-recordLength</code></li><li>返回了实际消息的写入位置</li></ol><p>tryClaim方法允许我们可以直接操作底层的缓冲区，不用像write方法一样需要多做一次拷贝</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int tryClaim(final int msgTypeId, final int length){</span></span>
<span class="line"><span>    checkTypeId(msgTypeId);</span></span>
<span class="line"><span>    checkMsgLength(length);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    final AtomicBuffer buffer = this.buffer;</span></span>
<span class="line"><span>    final int recordLength = length + HEADER_LENGTH;</span></span>
<span class="line"><span>    final int recordIndex = claimCapacity(buffer, recordLength);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (INSUFFICIENT_CAPACITY == recordIndex){</span></span>
<span class="line"><span>        return recordIndex;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    buffer.putIntOrdered(lengthOffset(recordIndex), -recordLength);</span></span>
<span class="line"><span>    MemoryAccess.releaseFence();</span></span>
<span class="line"><span>    buffer.putInt(typeOffset(recordIndex), msgTypeId);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return encodedMsgOffset(recordIndex);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="_4-commit方法" tabindex="-1">4. commit方法 <a class="header-anchor" href="#_4-commit方法" aria-label="Permalink to &quot;4. commit方法&quot;">​</a></h5><p>主要逻辑就是修改消息的长度，在tryClaim中写入的长度是原本消息长度的负数，在commit中修正成正确的长度</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void commit(final int index){</span></span>
<span class="line"><span>	final int recordIndex = computeRecordIndex(index);</span></span>
<span class="line"><span>	final AtomicBuffer buffer = this.buffer;</span></span>
<span class="line"><span>	final int recordLength = verifyClaimedSpaceNotReleased(buffer, recordIndex);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	buffer.putIntOrdered(lengthOffset(recordIndex), -recordLength);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="_5-abort方法" tabindex="-1">5. abort方法 <a class="header-anchor" href="#_5-abort方法" aria-label="Permalink to &quot;5. abort方法&quot;">​</a></h5><p>把在tryClaim中写入的消息类型覆盖成<code>PADDING_MSG_TYPE_ID</code>，在tryClaim中写入的长度是原本消息长度的负数，这里修改成正数,这样本次消息写入的数据将会作废，在读取的时候会直接跳过</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void abort(final int index){</span></span>
<span class="line"><span>    final int recordIndex = computeRecordIndex(index);</span></span>
<span class="line"><span>    final AtomicBuffer buffer = this.buffer;</span></span>
<span class="line"><span>    final int recordLength = verifyClaimedSpaceNotReleased(buffer, recordIndex);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    buffer.putInt(typeOffset(recordIndex), PADDING_MSG_TYPE_ID);</span></span>
<span class="line"><span>    buffer.putIntOrdered(lengthOffset(recordIndex), -recordLength);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="_6-read方法" tabindex="-1">6. read方法 <a class="header-anchor" href="#_6-read方法" aria-label="Permalink to &quot;6. read方法&quot;">​</a></h5><ol><li>从head的位置开始 循环顺序解读每一条消息（msgLength, msgTypeId, message）</li><li>解读出消息后 调用<code>MessageHandler.onMessage</code>处理消息</li><li>在读取数据的时候可能会遇到填充的数据 <code>msgType=PADDING_MSG_TYPE_ID</code>, 直接跳过这种类型的消息</li><li>循环结束条件：读取的总字节数&gt;=允许读取的连续空间<code>contiguousBlockLength=capacity - headIndex</code> 或者已经读取的消息数 &gt; 设置的最大值</li><li>finally中更新headPositionIndex到最新位置</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>try {</span></span>
<span class="line"><span>    while ((bytesRead &lt; contiguousBlockLength) &amp;&amp; (messagesRead &lt; messageCountLimit)) {</span></span>
<span class="line"><span>        final int recordIndex = headIndex + bytesRead;</span></span>
<span class="line"><span>        final int recordLength = buffer.getIntVolatile(lengthOffset(recordIndex));</span></span>
<span class="line"><span>        if (recordLength &lt;= 0) {</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        bytesRead += align(recordLength, ALIGNMENT);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        final int messageTypeId = buffer.getInt(typeOffset(recordIndex));</span></span>
<span class="line"><span>        if (PADDING_MSG_TYPE_ID == messageTypeId) {</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        handler.onMessage(messageTypeId, buffer, recordIndex + HEADER_LENGTH, recordLength - HEADER_LENGTH);</span></span>
<span class="line"><span>        ++messagesRead;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}finally {</span></span>
<span class="line"><span>    if (bytesRead &gt; 0) {</span></span>
<span class="line"><span>        buffer.putLongOrdered(headPositionIndex, head + bytesRead);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来继续看看controlledRead的返回值ControlledMessageHandler.Action，<code>ControlledMessageHandler.Action</code>在之前的使用部分已经讲过。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>try{</span></span>
<span class="line"><span>    while ((bytesRead &lt; contiguousBlockLength) &amp;&amp; (messagesRead &lt; messageCountLimit)) {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        final ControlledMessageHandler.Action action = handler.onMessage(messageTypeId, buffer, recordIndex + HEADER_LENGTH, recordLength - HEADER_LENGTH);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (ABORT == action) {</span></span>
<span class="line"><span>            bytesRead -= alignedLength;</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ++messagesRead;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (BREAK == action) {</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (COMMIT == action) {</span></span>
<span class="line"><span>            buffer.putLongOrdered(headPositionIndex, head + bytesRead);</span></span>
<span class="line"><span>            headIndex += bytesRead;</span></span>
<span class="line"><span>            head += bytesRead;</span></span>
<span class="line"><span>            bytesRead = 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}finally {</span></span>
<span class="line"><span>    if (bytesRead &gt; 0) {</span></span>
<span class="line"><span>        buffer.putLongOrdered(headPositionIndex, head + bytesRead);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后 ManyToOneRingBuffer使用和源码与 OneyToOneRingBuffer 基本一致，源码有一点需要关注的就是 ManyToOneRingBuffer允许多个producer写入数据，所以在更新tailPositionIndex的时候使用cas更新</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>do</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>while (!buffer.compareAndSetLong(tailPositionIndex, tail, newTail));</span></span></code></pre></div>`,78),l=[i];function t(c,r,d,o,f,h){return s(),a("div",null,l)}const b=n(p,[["render",t]]);export{g as __pageData,b as default};
