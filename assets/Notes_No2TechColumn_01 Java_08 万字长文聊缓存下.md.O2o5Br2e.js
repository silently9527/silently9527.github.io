import{_ as a,c as n,o as s,aa as e}from"./chunks/framework.d_Ke7vMG.js";const C=JSON.parse('{"title":"08 万字长文聊缓存下","description":"","frontmatter":{"title":"08 万字长文聊缓存下","author":"Herman","updateTime":"2021-08-14 13:41","desc":"万字长文聊缓存上","categories":"Java","tags":"缓存/架构","outline":"deep"},"headers":[],"relativePath":"Notes/No2TechColumn/01 Java/08 万字长文聊缓存下.md","filePath":"Notes/No2TechColumn/01 Java/08 万字长文聊缓存下.md","lastUpdated":1724593073000}'),p={name:"Notes/No2TechColumn/01 Java/08 万字长文聊缓存下.md"},i=e(`<p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/945a0dca424147eeb027e97e138a9779%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><h2 id="摘要" tabindex="-1">摘要 <a class="header-anchor" href="#摘要" aria-label="Permalink to &quot;摘要&quot;">​</a></h2><p>在上一篇文章 万字长文聊缓存（上）中，我们主要如何围绕着Http做缓存优化，在后端服务器的应用层同样有很多地方可以做缓存，提高服务的效率；本篇我们就来继续聊聊应用级的缓存。</p><h2 id="缓存的命中率" tabindex="-1">缓存的命中率 <a class="header-anchor" href="#缓存的命中率" aria-label="Permalink to &quot;缓存的命中率&quot;">​</a></h2><p>缓存的命中率是指从缓存中获取到数据的次数和总读取次数的比率，命中率越高证明缓存的效果越好。这是一个很重要的指标，应该通过监控这个指标来判断我们的缓存是否设置的合理。</p><h2 id="缓存的回收策略" tabindex="-1">缓存的回收策略 <a class="header-anchor" href="#缓存的回收策略" aria-label="Permalink to &quot;缓存的回收策略&quot;">​</a></h2><h3 id="基于时间" tabindex="-1">基于时间 <a class="header-anchor" href="#基于时间" aria-label="Permalink to &quot;基于时间&quot;">​</a></h3><ul><li>存活期：在设置缓存的同时设置该缓存可以存活多久，不论在存活期内被访问了多少次，时间到了都会过期</li><li>空闲期：是指缓存的数据多久没有被访问就过期</li></ul><h3 id="基于空间" tabindex="-1">基于空间 <a class="header-anchor" href="#基于空间" aria-label="Permalink to &quot;基于空间&quot;">​</a></h3><p>设置缓存的存储空间，比如：设置缓存的空间是 1G，当达到了1G之后就会按照一定的策略将部分数据移除</p><h3 id="基于缓存数量" tabindex="-1">基于缓存数量 <a class="header-anchor" href="#基于缓存数量" aria-label="Permalink to &quot;基于缓存数量&quot;">​</a></h3><p>设置缓存的最大条目数，当达到了设置的最大条目数之后按照一定的策略将旧的数据移除</p><h3 id="基于java对象引用" tabindex="-1">基于Java对象引用 <a class="header-anchor" href="#基于java对象引用" aria-label="Permalink to &quot;基于Java对象引用&quot;">​</a></h3><ul><li>弱引用：当垃圾回收器开始回收内存的时候，如果发现了弱引用，它将立即被回收。</li><li>软引用：当垃圾回收器发现内存已不足的情况下会回收软引用的对象，从而腾出一下空间，防止发生内存溢出。软引用适合用来做堆缓存</li></ul><h3 id="缓存的回收算法" tabindex="-1">缓存的回收算法 <a class="header-anchor" href="#缓存的回收算法" aria-label="Permalink to &quot;缓存的回收算法&quot;">​</a></h3><ul><li>FIFO 先进先出算法</li><li>LRU 最近最少使用算法</li><li>LFU 最不常用算法</li></ul><h2 id="java缓存的类型" tabindex="-1">Java缓存的类型 <a class="header-anchor" href="#java缓存的类型" aria-label="Permalink to &quot;Java缓存的类型&quot;">​</a></h2><h3 id="堆缓存" tabindex="-1">堆缓存 <a class="header-anchor" href="#堆缓存" aria-label="Permalink to &quot;堆缓存&quot;">​</a></h3><p>堆缓存是指把数据缓存在JVM的堆内存中，使用堆缓存的好处是没有序列化和反序列化的操作，是最快的缓存。如果缓存的数据量很大，为了避免造成OOM通常情况下使用的时软引用来存储缓存对象；堆缓存的缺点是缓存的空间有限，并且垃圾回收器暂停的时间会变长。</p><h4 id="gauva-cache实现堆缓存" tabindex="-1">Gauva Cache实现堆缓存 <a class="header-anchor" href="#gauva-cache实现堆缓存" aria-label="Permalink to &quot;Gauva Cache实现堆缓存&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Cache&lt;String, String&gt; cache = CacheBuilder.newBuilder()</span></span>
<span class="line"><span>                .build();</span></span></code></pre></div><p>通过<code>CacheBuilder</code>构建缓存对象</p><p>Gauva Cache的主要配置和方法</p><ul><li><code>put</code> : 向缓存中设置key-value</li><li><code>V get(K key, Callable&lt;? extends V&gt; loader)</code> : 获取一个缓存值，如果缓存中没有，那么就调用loader获取一个然后放入到缓存</li><li><code>expireAfterWrite</code> : 设置缓存的存活期，写入数据后指定时间之后失效</li><li><code>expireAfterAccess</code> : 设置缓存的空闲期，在给定的时间内没有被访问就会被回收</li><li><code>maximumSize</code> : 设置缓存的最大条目数</li><li><code>weakKeys/weakValues</code> : 设置弱引用缓存</li><li><code>softValues</code> : 设置软引用缓存</li><li><code>invalidate/invalidateAll</code>: 主动失效指定key的缓存数据</li><li><code>recordStats</code> : 启动记录统计信息，可以查看到命中率</li><li><code>removalListener</code> : 当缓存被删除的时候会调用此监听器，可以用于查看为什么缓存会被删除</li></ul><h4 id="caffeine实现堆缓存" tabindex="-1">Caffeine实现堆缓存 <a class="header-anchor" href="#caffeine实现堆缓存" aria-label="Permalink to &quot;Caffeine实现堆缓存&quot;">​</a></h4><p>Caffeine是使用Java8对Guava缓存的重写版本，高性能Java本地缓存组件，也是Spring推荐的堆缓存的实现，与spring的集成可以查看文档<a href="https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#cache-store-configuration-caffeine" target="_blank" rel="noreferrer">https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#cache-store-configuration-caffeine</a>。</p><p>由于是对Guava缓存的重写版本，所以很多的配置参数都是和Guava缓存一致：</p><ul><li><code>initialCapacity</code>: 初始的缓存空间大小</li><li><code>maximumSize</code>: 缓存的最大条数</li><li><code>maximumWeight</code>: 缓存的最大权重</li><li><code>expireAfterAccess</code>: 最后一次写入或访问后经过固定时间过期</li><li><code>expireAfterWrite</code>: 最后一次写入后经过固定时间过期</li><li><code>expireAfter</code> : 自定义过期策略</li><li><code>refreshAfterWrite</code>: 创建缓存或者最近一次更新缓存后经过固定的时间间隔，刷新缓存</li><li><code>weakKeys</code>: 打开key的弱引用</li><li><code>weakValues</code>：打开value的弱引用</li><li><code>softValues</code>：打开value的软引用</li><li><code>recordStats</code>：开启统计功能</li></ul><p>Caffeine的官方文档：<a href="https://github.com/ben-manes/caffeine/wiki" target="_blank" rel="noreferrer">https://github.com/ben-manes/caffeine/wiki</a></p><ol><li>pom.xml中添加依赖</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.github.ben-manes.caffeine&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;caffeine&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;2.8.4&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><ol start="2"><li>Caffeine Cache提供了三种缓存填充策略：手动、同步加载和异步加载。</li></ol><ul><li>手动加载：在每次get key的时候指定一个同步的函数，如果key不存在就调用这个函数生成一个值</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Object manual(String key) {</span></span>
<span class="line"><span>    Cache&lt;String, Object&gt; cache = Caffeine.newBuilder()</span></span>
<span class="line"><span>            .expireAfterAccess(1, TimeUnit.SECONDS) //设置空闲期时长</span></span>
<span class="line"><span>            .maximumSize(10)</span></span>
<span class="line"><span>            .build();</span></span>
<span class="line"><span>    return cache.get(key, t -&gt; setValue(key).apply(key));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public Function&lt;String, Object&gt; setValue(String key){</span></span>
<span class="line"><span>    return t -&gt; &quot;https://silently9527.cn&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>同步加载：构造Cache时候，build方法传入一个CacheLoader实现类。实现load方法，通过key加载value。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Object sync(String key){</span></span>
<span class="line"><span>    LoadingCache&lt;String, Object&gt; cache = Caffeine.newBuilder()</span></span>
<span class="line"><span>            .maximumSize(100)</span></span>
<span class="line"><span>            .expireAfterWrite(1, TimeUnit.MINUTES) //设置存活期时长</span></span>
<span class="line"><span>            .build(k -&gt; setValue(key).apply(key));</span></span>
<span class="line"><span>    return cache.get(key);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public Function&lt;String, Object&gt; setValue(String key){</span></span>
<span class="line"><span>    return t -&gt; &quot;https://silently9527.cn&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>异步加载：AsyncLoadingCache是继承自LoadingCache类的，异步加载使用Executor去调用方法并返回一个CompletableFuture</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public CompletableFuture async(String key) {</span></span>
<span class="line"><span>    AsyncLoadingCache&lt;String, Object&gt; cache = Caffeine.newBuilder()</span></span>
<span class="line"><span>            .maximumSize(100)</span></span>
<span class="line"><span>            .expireAfterWrite(1, TimeUnit.MINUTES)</span></span>
<span class="line"><span>            .buildAsync(k -&gt; setAsyncValue().get());</span></span>
<span class="line"><span>    return cache.get(key);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public CompletableFuture&lt;Object&gt; setAsyncValue() {</span></span>
<span class="line"><span>    return CompletableFuture.supplyAsync(() -&gt; &quot;公众号：贝塔学JAVA&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="3"><li>监听缓存被清理的事件</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void removeListener() {</span></span>
<span class="line"><span>    Cache&lt;String, Object&gt; cache = Caffeine.newBuilder()</span></span>
<span class="line"><span>            .removalListener((String key, Object value, RemovalCause cause) -&gt; {</span></span>
<span class="line"><span>                System.out.println(&quot;remove lisitener&quot;);</span></span>
<span class="line"><span>                System.out.println(&quot;remove Key:&quot; + key);</span></span>
<span class="line"><span>                System.out.println(&quot;remove Value:&quot; + value);</span></span>
<span class="line"><span>            })</span></span>
<span class="line"><span>            .build();</span></span>
<span class="line"><span>    cache.put(&quot;name&quot;, &quot;silently9527&quot;);</span></span>
<span class="line"><span>    cache.invalidate(&quot;name&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="4"><li>统计</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void recordStats() {</span></span>
<span class="line"><span>    Cache&lt;String, Object&gt; cache = Caffeine.newBuilder()</span></span>
<span class="line"><span>            .maximumSize(10000)</span></span>
<span class="line"><span>            .recordStats()</span></span>
<span class="line"><span>            .build();</span></span>
<span class="line"><span>    cache.put(&quot;公众号&quot;, &quot;贝塔学JAVA&quot;);</span></span>
<span class="line"><span>    cache.get(&quot;公众号&quot;, (t) -&gt; &quot;&quot;);</span></span>
<span class="line"><span>    cache.get(&quot;name&quot;, (t) -&gt; &quot;silently9527&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    CacheStats stats = cache.stats();</span></span>
<span class="line"><span>    System.out.println(stats);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过 <code>Cache.stats()</code> 获取到<code>CacheStats</code>。<code>CacheStats</code>提供以下统计方法：</p><ul><li><code>hitRate()</code>: 返回缓存命中率</li><li><code>evictionCount()</code>: 缓存回收数量</li><li><code>averageLoadPenalty()</code>: 加载新值的平均时间</li></ul><h4 id="ehcache实现堆缓存" tabindex="-1">EhCache实现堆缓存 <a class="header-anchor" href="#ehcache实现堆缓存" aria-label="Permalink to &quot;EhCache实现堆缓存&quot;">​</a></h4><p>EhCache 是老牌Java开源缓存框架，早在2003年就已经出现了，发展到现在已经非常成熟稳定，在Java应用领域应用也非常广泛，而且和主流的Java框架比如Srping可以很好集成。相比于 Guava Cache，EnCache 支持的功能更丰富，包括堆外缓存、磁盘缓存，当然使用起来要更重一些。使用 Ehcache 的Maven 依赖如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.ehcache&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;ehcache&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;3.6.3&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CacheManager cacheManager = CacheManagerBuilder.newCacheManagerBuilder().build(true);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ResourcePoolsBuilder resource = ResourcePoolsBuilder.heap(10); //设置最大缓存条目数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CacheConfiguration&lt;String, String&gt; cacheConfig = CacheConfigurationBuilder</span></span>
<span class="line"><span>        .newCacheConfigurationBuilder(String.class, String.class, resource)</span></span>
<span class="line"><span>        .withExpiry(ExpiryPolicyBuilder.timeToIdleExpiration(Duration.ofMinutes(10)))</span></span>
<span class="line"><span>        .build();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Cache&lt;String, String&gt; cache = cacheManager.createCache(&quot;userInfo&quot;, cacheConfig);</span></span></code></pre></div><ul><li><code>ResourcePoolsBuilder.heap(10)</code>设置缓存的最大条目数，这是简写方式，等价于<code>ResourcePoolsBuilder.newResourcePoolsBuilder().heap(10, EntryUnit.ENTRIES); </code></li><li><code>ResourcePoolsBuilder.newResourcePoolsBuilder().heap(10, MemoryUnit.MB)</code>设置缓存最大的空间10MB</li><li><code>withExpiry(ExpiryPolicyBuilder.timeToIdleExpiration(Duration.ofMinutes(10)))</code> 设置缓存空闲时间</li><li><code>withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofMinutes(10)))</code> 设置缓存存活时间</li><li><code>remove/removeAll</code>主动失效缓存，与Guava Cache类似，调用方法后不会立即去清除回收，只有在get或者put的时候判断缓存是否过期</li><li><code>withSizeOfMaxObjectSize(10,MemoryUnit.KB)</code>限制单个缓存对象的大小，超过这两个限制的对象则不被缓存</li></ul><h3 id="堆外缓存" tabindex="-1">堆外缓存 <a class="header-anchor" href="#堆外缓存" aria-label="Permalink to &quot;堆外缓存&quot;">​</a></h3><p>堆外缓存即缓存数据在堆外内存中，空间大小只受本机内存大小限制，不受GC管理，使用堆外缓存可以减少GC暂停时间，但是堆外内存中的对象都需要序列化和反序列化，KEY和VALUE必须实现Serializable接口，因此速度会比堆内缓存慢。在Java中可以通过 <code>-XX:MaxDirectMemorySize</code> 参数设置堆外内存的上限</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CacheManager cacheManager = CacheManagerBuilder.newCacheManagerBuilder().build(true);</span></span>
<span class="line"><span>// 堆外内存不能按照存储条目限制，只能按照内存大小进行限制，超过限制则回收缓存</span></span>
<span class="line"><span>ResourcePoolsBuilder resource = ResourcePoolsBuilder.newResourcePoolsBuilder().offheap(10, MemoryUnit.MB);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CacheConfiguration&lt;String, String&gt; cacheConfig = CacheConfigurationBuilder</span></span>
<span class="line"><span>        .newCacheConfigurationBuilder(String.class, String.class, resource)</span></span>
<span class="line"><span>        .withDispatcherConcurrency(4)</span></span>
<span class="line"><span>        .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofMinutes(10)))</span></span>
<span class="line"><span>        .withSizeOfMaxObjectSize(10, MemoryUnit.KB)</span></span>
<span class="line"><span>        .build();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Cache&lt;String, String&gt; cache = cacheManager.createCache(&quot;userInfo2&quot;, cacheConfig);</span></span>
<span class="line"><span>cache.put(&quot;website&quot;, &quot;https://silently9527.cn&quot;);</span></span>
<span class="line"><span>System.out.println(cache.get(&quot;website&quot;));</span></span></code></pre></div><h3 id="磁盘缓存" tabindex="-1">磁盘缓存 <a class="header-anchor" href="#磁盘缓存" aria-label="Permalink to &quot;磁盘缓存&quot;">​</a></h3><p>把缓存数据存放到磁盘上，在JVM重启时缓存的数据不会受到影响，而堆缓存和堆外缓存都会丢失；并且磁盘缓存有更大的存储空间；但是缓存在磁盘上的数据也需要支持序列化，速度会被比内存更慢，在使用时推荐使用更快的磁盘带来更大的吞吐率，比如使用闪存代替机械磁盘。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CacheManagerConfiguration&lt;PersistentCacheManager&gt; persistentManagerConfig = CacheManagerBuilder</span></span>
<span class="line"><span>        .persistence(new File(&quot;/Users/huaan9527/Desktop&quot;, &quot;ehcache-cache&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PersistentCacheManager persistentCacheManager = CacheManagerBuilder.newCacheManagerBuilder()</span></span>
<span class="line"><span>        .with(persistentManagerConfig).build(true);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//disk 第三个参数设置为 true 表示将数据持久化到磁盘上</span></span>
<span class="line"><span>ResourcePoolsBuilder resource = ResourcePoolsBuilder.newResourcePoolsBuilder().disk(100, MemoryUnit.MB, true);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CacheConfiguration&lt;String, String&gt; config = CacheConfigurationBuilder</span></span>
<span class="line"><span>        .newCacheConfigurationBuilder(String.class, String.class, resource).build();</span></span>
<span class="line"><span>Cache&lt;String, String&gt; cache = persistentCacheManager.createCache(&quot;userInfo&quot;,</span></span>
<span class="line"><span>        CacheConfigurationBuilder.newCacheConfigurationBuilder(config));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>cache.put(&quot;公众号&quot;, &quot;贝塔学JAVA&quot;);</span></span>
<span class="line"><span>System.out.println(cache.get(&quot;公众号&quot;));</span></span>
<span class="line"><span>persistentCacheManager.close();</span></span></code></pre></div><p>在JVM停止时，一定要记得调用<code>persistentCacheManager.close()</code>，保证内存中的数据能够dump到磁盘上。</p><p><img src="https://coderxing.gitbooks.io/architecture-evolution/content/assets/1DD82EC4-C835-49AA-84AE-33162D23B530.png" alt=""> 这是典型 heap + offheap + disk 组合的结构图，上层比下层速度快，下层比上层存储空间大，在ehcache中，空间大小设置 <code>heap &gt; offheap &gt; disk</code>，否则会报错； ehcache 会将最热的数据保存在高一级的缓存。这种结构的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CacheManagerConfiguration&lt;PersistentCacheManager&gt; persistentManagerConfig = CacheManagerBuilder</span></span>
<span class="line"><span>        .persistence(new File(&quot;/Users/huaan9527/Desktop&quot;, &quot;ehcache-cache&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PersistentCacheManager persistentCacheManager = CacheManagerBuilder.newCacheManagerBuilder()</span></span>
<span class="line"><span>        .with(persistentManagerConfig).build(true);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ResourcePoolsBuilder resource = ResourcePoolsBuilder.newResourcePoolsBuilder()</span></span>
<span class="line"><span>        .heap(10, MemoryUnit.MB)</span></span>
<span class="line"><span>        .offheap(100, MemoryUnit.MB)</span></span>
<span class="line"><span>        //第三个参数设置为true，支持持久化</span></span>
<span class="line"><span>        .disk(500, MemoryUnit.MB, true);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CacheConfiguration&lt;String, String&gt; config = CacheConfigurationBuilder</span></span>
<span class="line"><span>        .newCacheConfigurationBuilder(String.class, String.class, resource).build();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Cache&lt;String, String&gt; cache = persistentCacheManager.createCache(&quot;userInfo&quot;,</span></span>
<span class="line"><span>        CacheConfigurationBuilder.newCacheConfigurationBuilder(config));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//写入缓存</span></span>
<span class="line"><span>cache.put(&quot;name&quot;, &quot;silently9527&quot;);</span></span>
<span class="line"><span>// 读取缓存</span></span>
<span class="line"><span>System.out.println(cache.get(&quot;name&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 再程序关闭前，需要手动释放资源</span></span>
<span class="line"><span>persistentCacheManager.close();</span></span></code></pre></div><h3 id="分布式集中缓存" tabindex="-1">分布式集中缓存 <a class="header-anchor" href="#分布式集中缓存" aria-label="Permalink to &quot;分布式集中缓存&quot;">​</a></h3><p>前面提到的堆内缓存和堆外缓存如果在多个JVM实例的情况下会有两个问题：1.单机容量毕竟有限；2.多台JVM实例缓存的数据可能不一致；3.如果缓存数据同一时间都失效了，那么请求都会打到数据库上，数据库压力增大。这时候我们就需要引入分布式缓存来解决，现在使用最多的分布式缓存是redis</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/3235751237-5ff1976c1abc8_articlex" alt=""></p><p>当引入分布式缓存之后就可以把应用缓存的架构调整成上面的结构。</p><h2 id="缓存使用模式的实践" tabindex="-1">缓存使用模式的实践 <a class="header-anchor" href="#缓存使用模式的实践" aria-label="Permalink to &quot;缓存使用模式的实践&quot;">​</a></h2><p>缓存使用的模式大概分为两类：Cache-Aside、Cache-As-SoR（SoR表示实际存储数据的系统，也就是数据源）</p><h3 id="cache-aside" tabindex="-1">Cache-Aside <a class="header-anchor" href="#cache-aside" aria-label="Permalink to &quot;Cache-Aside&quot;">​</a></h3><p>业务代码围绕着缓存来写，通常都是从缓存中来获取数据，如果缓存没有命中，则从数据库中查找，查询到之后就把数据放入到缓存；当数据被更新之后，也需要对应的去更新缓存中的数据。这种模式也是我们通常使用最多的。</p><ul><li>读场景</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>value = cache.get(key); //从缓存中读取数据</span></span>
<span class="line"><span>if(value == null) {</span></span>
<span class="line"><span>    value = loadFromDatabase(key); //从数据库中查询</span></span>
<span class="line"><span>    cache.put(key, value); //放入到缓存中</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>写场景</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>wirteToDatabase(key, value); //写入到数据库</span></span>
<span class="line"><span>cache.put(key, value); //放入到缓存中 或者 可以删除掉缓存 cache.remove(key) ，再读取的时候再查一次</span></span></code></pre></div><p>Spring的Cache扩展就是使用的Cache-Aside模式，Spring为了把业务代码和缓存的读取更新分离，对Cache-Aside模式使用AOP进行了封装，提供了多个注解来实现读写场景。官方参考文档：<a href="https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#cache-annotations" target="_blank" rel="noreferrer"></a></p><ul><li><code>@Cacheable</code> : 通常是放在查询方法上，实现的就是<code>Cache-Aside</code>读的场景，先查缓存，如果不存在在查询数据库，最后把查询出来的结果放入到缓存。</li><li><code>@CachePut</code> : 通常用在保存更新方法上面，实现的就是<code>Cache-Aside</code>写的场景，更新完成数据库后把数据放入到缓存中。</li><li><code>@CacheEvict</code> : 从缓存中删除指定key的缓存</li></ul><blockquote><p>对于一些允许有一点点更新延迟基础数据可以考虑使用canal订阅binlog日志来完成缓存的增量更新。</p><p>Cache-Aside还有个问题，如果某个时刻热点数据缓存失效，那么会有很多请求同时打到后端数据库上，数据库的压力会瞬间增大</p></blockquote><h3 id="cache-as-sor" tabindex="-1">Cache-As-SoR <a class="header-anchor" href="#cache-as-sor" aria-label="Permalink to &quot;Cache-As-SoR&quot;">​</a></h3><p>Cache-As-SoR模式也就会把Cache看做是数据源，所有的操作都是针对缓存，Cache在委托给真正的SoR去实现读或者写。业务代码中只会看到Cache的操作，这种模式又分为了三种</p><h4 id="read-through" tabindex="-1">Read Through <a class="header-anchor" href="#read-through" aria-label="Permalink to &quot;Read Through&quot;">​</a></h4><p>应用程序始终从缓存中请求数据，如果缓存中没有数据，则它负责使用提供的数据加载程序从数据库中检索数据，检索数据后，缓存会自行更新并将数据返回给调用的应用程序。Gauva Cache、Caffeine、EhCache都支持这种模式；</p><ol><li>Caffeine实现Read Through 由于Gauva Cache和Caffeine实现类似，所以这里只展示Caffeine的实现，以下代码来自Caffeine官方文档</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>LoadingCache&lt;Key, Graph&gt; cache = Caffeine.newBuilder()</span></span>
<span class="line"><span>    .maximumSize(10_000)</span></span>
<span class="line"><span>    .expireAfterWrite(10, TimeUnit.MINUTES)</span></span>
<span class="line"><span>    .build(key -&gt; createExpensiveGraph(key));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Lookup and compute an entry if absent, or null if not computable</span></span>
<span class="line"><span>Graph graph = cache.get(key);</span></span>
<span class="line"><span>// Lookup and compute entries that are absent</span></span>
<span class="line"><span>Map&lt;Key, Graph&gt; graphs = cache.getAll(keys);</span></span></code></pre></div><p>在build Cache的时候指定一个<code>CacheLoader</code></p><ul><li>[1] 在应用程序中直接调用<code>cache.get(key)</code></li><li>[2] 首先查询缓存，如果缓存存在就直接返回数据</li><li>[3] 如果不存在，就会委托给<code>CacheLoader</code>去数据源中查询数据，之后在放入到缓存，返回给应用程序</li></ul><blockquote><p><code>CacheLoader</code>不要直接返回null，建议封装成自己定义的Null对像，在放入到缓存中，可以防止缓存击穿</p></blockquote><p>为了防止因为某个热点数据失效导致后端数据库压力增大的情况，我可以在<code>CacheLoader</code>中使用锁限制只允许一个请求去查询数据库，其他的请求都等待第一个请求查询完成后从缓存中获取，在上一篇 《万字长文聊缓存（上）》中我们聊到了Nginx也有类似的配置参数</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>value = loadFromCache(key);</span></span>
<span class="line"><span>if(value != null) {</span></span>
<span class="line"><span>    return value;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>synchronized (lock) {</span></span>
<span class="line"><span>    value = loadFromCache(key);</span></span>
<span class="line"><span>    if(value != null) {</span></span>
<span class="line"><span>        return value;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return loadFromDatabase(key);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>EhCache实现Read Through</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CacheManager cacheManager = CacheManagerBuilder.newCacheManagerBuilder().build(true);</span></span>
<span class="line"><span>ResourcePoolsBuilder resource = ResourcePoolsBuilder.newResourcePoolsBuilder().heap(10, MemoryUnit.MB); //设置最大缓存条目数</span></span>
<span class="line"><span>CacheConfiguration&lt;String, String&gt; cacheConfig = CacheConfigurationBuilder</span></span>
<span class="line"><span>        .newCacheConfigurationBuilder(String.class, String.class, resource)</span></span>
<span class="line"><span>        .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofMinutes(10)))</span></span>
<span class="line"><span>        .withLoaderWriter(new CacheLoaderWriter&lt;String, String&gt;(){</span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public String load(String key) throws Exception {</span></span>
<span class="line"><span>                //load from database</span></span>
<span class="line"><span>                return &quot;silently9527&quot;;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void write(String key, String value) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void delete(String key) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        })</span></span>
<span class="line"><span>        .build();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Cache&lt;String, String&gt; cache = cacheManager.createCache(&quot;userInfo&quot;, cacheConfig);</span></span>
<span class="line"><span>System.out.println(cache.get(&quot;name&quot;));</span></span></code></pre></div><p>在EhCache中使用的是<code>CacheLoaderWriter</code>来从数据库中加载数据；解决因为某个热点数据失效导致后端数据库压力增大的问题和上面的方式一样，也可以在<code>load</code>中实现。</p><h4 id="write-through" tabindex="-1">Write Through <a class="header-anchor" href="#write-through" aria-label="Permalink to &quot;Write Through&quot;">​</a></h4><p>和Read Through模式类似，当数据进行更新时，先去更新SoR，成功之后在更新缓存。</p><ol><li>Caffeine实现Write Through</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Cache&lt;String, String&gt; cache = Caffeine.newBuilder()</span></span>
<span class="line"><span>        .maximumSize(100)</span></span>
<span class="line"><span>        .writer(new CacheWriter&lt;String, String&gt;() {</span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void write(@NonNull String key, @NonNull String value) {</span></span>
<span class="line"><span>                //write data to database</span></span>
<span class="line"><span>                System.out.println(key);</span></span>
<span class="line"><span>                System.out.println(value);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void delete(@NonNull String key, @Nullable String value, @NonNull RemovalCause removalCause) {</span></span>
<span class="line"><span>                //delete from database</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        })</span></span>
<span class="line"><span>        .build();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>cache.put(&quot;name&quot;, &quot;silently9527&quot;);</span></span></code></pre></div><p>Caffeine通过使用<code>CacheWriter</code>来实现Write Through，<code>CacheWriter</code>可以同步的监听到缓存的创建、变更和删除操作，只有写成功了才会去更新缓存</p><ol start="2"><li>EhCache实现Write Through</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CacheManager cacheManager = CacheManagerBuilder.newCacheManagerBuilder().build(true);</span></span>
<span class="line"><span>ResourcePoolsBuilder resource = ResourcePoolsBuilder.newResourcePoolsBuilder().heap(10, MemoryUnit.MB); //设置最大缓存条目数</span></span>
<span class="line"><span>CacheConfiguration&lt;String, String&gt; cacheConfig = CacheConfigurationBuilder</span></span>
<span class="line"><span>        .newCacheConfigurationBuilder(String.class, String.class, resource)</span></span>
<span class="line"><span>        .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofMinutes(10)))</span></span>
<span class="line"><span>        .withLoaderWriter(new CacheLoaderWriter&lt;String, String&gt;(){</span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public String load(String key) throws Exception {</span></span>
<span class="line"><span>                return &quot;silently9527&quot;;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void write(String key, String value) throws Exception {</span></span>
<span class="line"><span>                //write data to database</span></span>
<span class="line"><span>                System.out.println(key);</span></span>
<span class="line"><span>                System.out.println(value);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void delete(String key) throws Exception {</span></span>
<span class="line"><span>                //delete from database</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        })</span></span>
<span class="line"><span>        .build();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Cache&lt;String, String&gt; cache = cacheManager.createCache(&quot;userInfo&quot;, cacheConfig);</span></span>
<span class="line"><span>System.out.println(cache.get(&quot;name&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>cache.put(&quot;website&quot;,&quot;https://silently9527.cn&quot;);</span></span></code></pre></div><p>EhCache还是通过<code>CacheLoaderWriter</code>来实现的，当我们调用<code>cache.put(&quot;xxx&quot;,&quot;xxx&quot;)</code>进行写缓存的时候，EhCache首先会将写的操作委托给<code>CacheLoaderWriter</code>，有<code>CacheLoaderWriter.write</code>去负责写数据源</p><h4 id="write-behind" tabindex="-1">Write Behind <a class="header-anchor" href="#write-behind" aria-label="Permalink to &quot;Write Behind&quot;">​</a></h4><p>这种模式通常先将数据写入缓存，再异步地写入数据库进行数据同步。这样的设计既可以减少对数据库的直接访问，降低压力，同时对数据库的多次修改可以合并操作，极大地提升了系统的承载能力。但是这种模式也存在风险，如当缓存机器出现宕机时，数据有丢失的可能。</p><ol><li>Caffeine要想实现Write Behind可以在<code>CacheLoaderWriter.write</code>方法中把数据发送到MQ中，实现异步的消费，这样可以保证数据的安全，但是要想实现合并操作就需要扩展功能更强大的<code>CacheLoaderWriter</code>。</li><li>EhCache实现Write Behind</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//1 定义线程池</span></span>
<span class="line"><span>PooledExecutionServiceConfiguration testWriteBehind = PooledExecutionServiceConfigurationBuilder</span></span>
<span class="line"><span>        .newPooledExecutionServiceConfigurationBuilder()</span></span>
<span class="line"><span>        .pool(&quot;testWriteBehind&quot;, 5, 10)</span></span>
<span class="line"><span>        .build();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CacheManager cacheManager = CacheManagerBuilder.newCacheManagerBuilder()</span></span>
<span class="line"><span>        .using(testWriteBehind)</span></span>
<span class="line"><span>        .build(true);</span></span>
<span class="line"><span>ResourcePoolsBuilder resource = ResourcePoolsBuilder.newResourcePoolsBuilder().heap(10, MemoryUnit.MB); //设置最大缓存条目数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//2 设置回写模式配置</span></span>
<span class="line"><span>WriteBehindConfiguration testWriteBehindConfig = WriteBehindConfigurationBuilder</span></span>
<span class="line"><span>        .newUnBatchedWriteBehindConfiguration()</span></span>
<span class="line"><span>        .queueSize(10)</span></span>
<span class="line"><span>        .concurrencyLevel(2)</span></span>
<span class="line"><span>        .useThreadPool(&quot;testWriteBehind&quot;)</span></span>
<span class="line"><span>        .build();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CacheConfiguration&lt;String, String&gt; cacheConfig = CacheConfigurationBuilder</span></span>
<span class="line"><span>        .newCacheConfigurationBuilder(String.class, String.class, resource)</span></span>
<span class="line"><span>        .withLoaderWriter(new CacheLoaderWriter&lt;String, String&gt;() {</span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public String load(String key) throws Exception {</span></span>
<span class="line"><span>                return &quot;silently9527&quot;;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void write(String key, String value) throws Exception {</span></span>
<span class="line"><span>                //write data to database</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void delete(String key) throws Exception {</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        })</span></span>
<span class="line"><span>        .add(testWriteBehindConfig)</span></span>
<span class="line"><span>        .build();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Cache&lt;String, String&gt; cache = cacheManager.createCache(&quot;userInfo&quot;, cacheConfig);</span></span></code></pre></div><p>首先使用<code>PooledExecutionServiceConfigurationBuilder</code>定义了线程池配置；然后使用<code>WriteBehindConfigurationBuilder</code>设置会写模式配置，其中<code>newUnBatchedWriteBehindConfiguration</code>表示不进行批量写操作，因为是异步写，所以需要把写操作先放入到队列中，通过<code>queueSize</code>设置队列大小，<code>useThreadPool</code>指定使用哪个线程池; <code>concurrencyLevel</code>设置使用多少个并发线程和队列进行Write Behind</p><p>EhCache实现批量写的操作也很容易</p><ul><li>首先把<code>newUnBatchedWriteBehindConfiguration()</code>替换成<code>newBatchedWriteBehindConfiguration(10, TimeUnit.SECONDS, 20)</code>，这里设置的是数量达到20就进行批处理，如果10秒内没有达到20个也会进行处理</li><li>其次在<code>CacheLoaderWriter</code>中实现wirteAll 和 deleteAll进行批处理</li></ul><blockquote><p>如果需要把对相同的key的操作合并起来只记录最后一次数据，可以通过<code>enableCoalescing()</code>来启用合并</p></blockquote>`,103),l=[i];function t(c,o,r,u,d,h){return s(),n("div",null,l)}const b=a(p,[["render",t]]);export{C as __pageData,b as default};
