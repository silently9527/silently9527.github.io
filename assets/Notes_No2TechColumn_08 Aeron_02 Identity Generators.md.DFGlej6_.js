import{_ as n,c as s,o as a,aa as p}from"./chunks/framework.DOnJscRE.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Notes/No2TechColumn/08 Aeron/02 Identity Generators.md","filePath":"Notes/No2TechColumn/08 Aeron/02 Identity Generators.md","lastUpdated":1761051585000}'),e={name:"Notes/No2TechColumn/08 Aeron/02 Identity Generators.md"},l=p(`<h4 id="snowflake概要" tabindex="-1">Snowflake概要 <a class="header-anchor" href="#snowflake概要" aria-label="Permalink to &quot;Snowflake概要&quot;">​</a></h4><p>Snowflake是一种分布式全局唯一ID的算法，最初是由Twitter创建，看图：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images//202510212059170.png" alt=""></p><p>Snowflake由64bit组成，共有4部分组成：</p><ol><li>占用1bit，目前暂时未使用，始终是0；</li><li>时间戳占用41bit，由于当前时间戳的二进制就是41bit，所以这个时间是精确到毫秒，这个时间是由1970年开始计算的，由于41bit的最大值限制，往后可以使用69年。</li><li>机器id占用10bit，最多可以表示1024台机器</li><li>序列号占用12bit，表示同一台机器上同一时刻最多可以同时生成4096个id</li></ol><h4 id="agrona中的snowflakeidgenerator源码解析" tabindex="-1">agrona中的SnowflakeIdGenerator源码解析 <a class="header-anchor" href="#agrona中的snowflakeidgenerator源码解析" aria-label="Permalink to &quot;agrona中的SnowflakeIdGenerator源码解析&quot;">​</a></h4><h5 id="构造方法" tabindex="-1">构造方法 <a class="header-anchor" href="#构造方法" aria-label="Permalink to &quot;构造方法&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> public SnowflakeIdGenerator(</span></span>
<span class="line"><span>        final int nodeIdBits,</span></span>
<span class="line"><span>        final int sequenceBits,</span></span>
<span class="line"><span>        final long nodeId,</span></span>
<span class="line"><span>        final long timestampOffsetMs,</span></span>
<span class="line"><span>        final EpochClock clock)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>    .....</span></span>
<span class="line"><span>    }</span></span></code></pre></div><ul><li>nodeIdBits: 设置机器id占用多少字节，默认是10bit</li><li>sequenceBits: 设置序列号占用多少字节，默认值12bit</li><li>nodeId: 设置机器的ID</li><li>timestampOffsetMs: 在Snowflake概要中提到，雪花算法中的时间戳占用41bit，从1970开始只能支持69年，也就是2039年；timestampOffsetMs就是解决这个问题，设置从指定的时间开始而不是1970</li><li>clock: agrona中的时钟，默认使用的是系统时钟<code>SystemEpochClock</code></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class SystemEpochClock implements EpochClock</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * As there is no instance state then this object can be used to save on allocation.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static final SystemEpochClock INSTANCE = new SystemEpochClock();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * {@inheritDoc}</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public long time()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return System.currentTimeMillis();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>timestampSequence: 记录时间戳左移22位后的值，为了防止出现并发问题，agrona更新这个字段使用了cas；</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>abstract class AbstractSnowflakeIdGeneratorPaddingLhs</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    byte p000, p001, p002, p003, p004, p005, p006, p007, p008, p009, p010, p011, p012, p013, p014, p015;</span></span>
<span class="line"><span>    byte p016, p017, p018, p019, p020, p021, p022, p023, p024, p025, p026, p027, p028, p029, p030, p031;</span></span>
<span class="line"><span>    byte p032, p033, p034, p035, p036, p037, p038, p039, p040, p041, p042, p043, p044, p045, p046, p047;</span></span>
<span class="line"><span>    byte p048, p049, p050, p051, p052, p053, p054, p055, p056, p057, p058, p059, p060, p061, p062, p063;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>abstract class AbstractSnowflakeIdGeneratorValue extends AbstractSnowflakeIdGeneratorPaddingLhs</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    static final AtomicLongFieldUpdater&lt;AbstractSnowflakeIdGeneratorValue&gt; TIMESTAMP_SEQUENCE_UPDATER =</span></span>
<span class="line"><span>        AtomicLongFieldUpdater.newUpdater(AbstractSnowflakeIdGeneratorValue.class, &quot;timestampSequence&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    volatile long timestampSequence;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>abstract class AbstractSnowflakeIdGeneratorPaddingRhs extends AbstractSnowflakeIdGeneratorValue</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    byte p064, p065, p066, p067, p068, p069, p070, p071, p072, p073, p074, p075, p076, p077, p078, p079;</span></span>
<span class="line"><span>    byte p080, p081, p082, p083, p084, p085, p086, p087, p088, p089, p090, p091, p092, p093, p094, p095;</span></span>
<span class="line"><span>    byte p096, p097, p098, p099, p100, p101, p102, p103, p104, p105, p106, p107, p108, p109, p110, p111;</span></span>
<span class="line"><span>    byte p112, p113, p114, p115, p116, p117, p118, p119, p120, p121, p122, p123, p124, p125, p126, p127;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上面的代码我们可以看到在timestampSequence字段的前后都填充了64bit，这是为了解决伪共享的问题，现在的CPU都有缓存行通常是64bit，timestampSequence的字段类型是long占用8个字节，如果不填充，加载了timestampSequence缓存行还包含了其他数据，如果这些数据过期会导致整个缓存行都过期，这在高并发的场景下会影响性能。</p><h5 id="生成id的核心方法nextid" tabindex="-1">生成id的核心方法nextId <a class="header-anchor" href="#生成id的核心方法nextid" aria-label="Permalink to &quot;生成id的核心方法nextId&quot;">​</a></h5><p>该方法主要分为三种情况：</p><ol><li><code>timestampMs &gt; oldTimestampMs</code>，说明雪花算法中的时间戳部分没有冲突，那么把当前时间戳<code>timestampMs &lt;&lt; nodeIdAndSequenceBits</code>, 然后cas更新timestampSequence；返回<code>newTimestampSequence | nodeBits</code>;</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> if (timestampMs &gt; oldTimestampMs)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    final long newTimestampSequence = timestampMs &lt;&lt; nodeIdAndSequenceBits;</span></span>
<span class="line"><span>    if (TIMESTAMP_SEQUENCE_UPDATER.compareAndSet(this, oldTimestampSequence, newTimestampSequence))</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return newTimestampSequence | nodeBits;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中的<code>nodeIdAndSequenceBits</code>与<code>nodeBits</code>是在构造方法中设置的</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> this.nodeIdAndSequenceBits = nodeIdBits + sequenceBits; //10+12=22bit</span></span>
<span class="line"><span> this.nodeBits = nodeId &lt;&lt; sequenceBits; //机器id左移12bit</span></span></code></pre></div><ol start="2"><li><code>timestampMs == oldTimestampMs</code>，说明时间戳部分冲突，需要通过递增序列号来保证唯一，从oldTimestampMs中解析出序列号oldSequence，只要没有超过允许的最大序列号就+1后继续cas；如果序列号超过了最大值就继续循环直到下一毫秒在生成id，这样时间戳就不会冲突</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (timestampMs == oldTimestampMs)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    final long oldSequence = oldTimestampSequence &amp; maxSequence;</span></span>
<span class="line"><span>    if (oldSequence &lt; maxSequence)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        final long newTimestampSequence = oldTimestampSequence + 1;</span></span>
<span class="line"><span>        if (TIMESTAMP_SEQUENCE_UPDATER.compareAndSet(this, oldTimestampSequence, newTimestampSequence))</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return newTimestampSequence | nodeBits;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="3"><li><code>timestampMs == oldTimestampMs</code>, 说明时间出现了回拨，可能是人为原因，把系统时间改了，或者是机器之间的时间同步出现了误差，在这种情况下agrona之间抛异常</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>else</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    throw new IllegalStateException(</span></span>
<span class="line"><span>        &quot;clock has gone backwards: timestampMs=&quot; + timestampMs + &quot; &lt; oldTimestampMs=&quot; + oldTimestampMs);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="扩展" tabindex="-1">扩展 <a class="header-anchor" href="#扩展" aria-label="Permalink to &quot;扩展&quot;">​</a></h4><p>以上我们讲完了SnowflakeIdGenerator所有的核心，现在我们考虑下，通常情况我们的服务都会部署多个实例，那么在创建SnowflakeIdGenerator应该如何设置nodeId, 如果是命令行jar的方式启动，可以通过设置命令行参数，但如果是k8s容器启动并且可以随机增加减少实例就不太方便，此时我们可以考虑使用zk的零时节点来动态生成nodeId。</p><h5 id="设计配置参数yml-snowflakeidgeneratorproperties" tabindex="-1">设计配置参数yml, SnowflakeIdGeneratorProperties <a class="header-anchor" href="#设计配置参数yml-snowflakeidgeneratorproperties" aria-label="Permalink to &quot;设计配置参数yml, SnowflakeIdGeneratorProperties&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>snowflake:</span></span>
<span class="line"><span>  zookeeper:</span></span>
<span class="line"><span>    servers: zoo1.com:2181</span></span>
<span class="line"><span>    namespace: snowflake</span></span>
<span class="line"><span>  group: \${project_name}</span></span>
<span class="line"><span>  timestampOffsetMs: xxx</span></span>
<span class="line"><span>  nodeIdBits: 10</span></span></code></pre></div><ul><li>zookeeper: 配置zk相关的参数信息</li><li>timestampOffsetMs: 配置SnowflakeIdGenerator的时间戳偏移量</li><li>nodeIdBits: 配置机器id占用的字节数</li></ul><h5 id="扩展agrona中的snowflakeidgenerator" tabindex="-1">扩展agrona中的SnowflakeIdGenerator <a class="header-anchor" href="#扩展agrona中的snowflakeidgenerator" aria-label="Permalink to &quot;扩展agrona中的SnowflakeIdGenerator&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ExtendedSnowflakeIdGenerator implement ConnectStateListener{</span></span>
<span class="line"><span>    private SnowflakeIdGenerator idGenerator;</span></span>
<span class="line"><span>    private long timestampOffSetMs;</span></span>
<span class="line"><span>    private boolean suspend;</span></span>
<span class="line"><span>    private boolean inactive;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    private LongSupplier nodeIdSupplier;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public ExtendedSnowflakeIdGenerator(LongSupplier nodeIdSupplier, long timestampOffSetMs){</span></span>
<span class="line"><span>        this.timestampOffSetMs = timestampOffSetMs;</span></span>
<span class="line"><span>        this.idGenerator = new SnowflakeIdGenerator(...);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public long nextId(){</span></span>
<span class="line"><span>        if(inactive){</span></span>
<span class="line"><span>            throw new IllegalStatExecption(...);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return idGenerator.nextId();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public void stateChanged(CuratorFramework zkClient, ConnectionState state){</span></span>
<span class="line"><span>        if(state == SUSPEND){</span></span>
<span class="line"><span>            this.suspend=true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>        if(state == LOST){</span></span>
<span class="line"><span>            this.inactive=true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        if(state == RECONNECTED){</span></span>
<span class="line"><span>            long nodeId = nodeIdSupplier.getAsLong();</span></span>
<span class="line"><span>            this.idGenerator = new SnowflakeIdGenerator(...);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //geter, setter ...</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>因为我们考虑使用zk来扩展SnowflakeIdGenerator, 如果出现了zk的链接状态不稳定时，我们需要对SnowflakeIdGenerator做相应的控制，所以这增加了两个字段<code>suspend</code> <code>inactive</code>,然后实现了ConnectStateListener来感知zk链接的状态变化; 如果链接状态是RECONNECTED, 那么需要重新生成nodeId和SnowflakeIdGenerator避免出现了不同的实例使用了相同的nodeId</p><p>接下来创建SnowFlakeFactory，主要的职责就是创建<code>ExtendedSnowflakeIdGenerator</code> 以及获取一个可用的nodeId,主要是通过判断zk的节点是否存在来校验nodeId是否被使用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class SnowFlakeFactory {</span></span>
<span class="line"><span>    private CuratorFrameWork zkClient;</span></span>
<span class="line"><span>    private ExtendedSnowflakeIdGenerator idGenerator;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public SnowFlakeFactory(){</span></span>
<span class="line"><span>       </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>   </span></span>
<span class="line"><span>    public void destroy(){</span></span>
<span class="line"><span>        if(zkClient.getState() != STOPPED){</span></span>
<span class="line"><span>            zkClient.close();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public ExtendedSnowflakeIdGenerator createIdGenerator(){</span></span>
<span class="line"><span>        return new ExtendedSnowflakeIdGenerator(</span></span>
<span class="line"><span>            ()-&gt;this.getAvailableNodeId(),</span></span>
<span class="line"><span>            ...</span></span>
<span class="line"><span>        );</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public long getAvailableNodeId(){</span></span>
<span class="line"><span>        String groupPath = String.format(&quot;/%s/id_node&quot;, group);</span></span>
<span class="line"><span>        Stat stat = zkClient.checkExists().forPath(groupPaht);</span></span>
<span class="line"><span>        List&lt;String&gt; existNodes ;</span></span>
<span class="line"><span>        if(stat==null){</span></span>
<span class="line"><span>            zkClient.create().creatingParentsIfNeeded()</span></span>
<span class="line"><span>            .forPath(groupPath,&quot;&quot;.getBytes();</span></span>
<span class="line"><span>            existNodes=new ArrayList();</span></span>
<span class="line"><span>        }else {</span></span>
<span class="line"><span>            existNodes=zkClient.getChildren().forPath(groupPath);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        String workPath;</span></span>
<span class="line"><span>        long maxNodeId = (long) (Math.pow(2, nodeIdBits) -1);</span></span>
<span class="line"><span>        for(long i=1; i&lt; maxNodeId; i++){</span></span>
<span class="line"><span>            workPath = String.format(&quot;work_%d&quot;,i);</span></span>
<span class="line"><span>            if(!existNodes.contains(workPath)){</span></span>
<span class="line"><span>                try{</span></span>
<span class="line"><span>                    zkClient.create.withMode(EPHEMERAL)</span></span>
<span class="line"><span>                    .forPath(groupPath+&quot;/&quot;+workPath,&quot;&quot;.getBytes());</span></span>
<span class="line"><span>                    return i;</span></span>
<span class="line"><span>                }catch(NodeExistsException e){</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>原文链接: <a href="http://herman7z.site" target="_blank" rel="noreferrer">http://herman7z.site</a></p>`,34),t=[l];function i(o,c,d,r,u,h){return a(),s("div",null,t)}const k=n(e,[["render",i]]);export{g as __pageData,k as default};
