import{_ as a,c as s,o as e,aa as n}from"./chunks/framework.d_Ke7vMG.js";const f=JSON.parse('{"title":"07 万字长文聊缓存上","description":"","frontmatter":{"title":"07 万字长文聊缓存上","author":"Herman","updateTime":"2021-08-14 13:41","desc":"万字长文聊缓存上","categories":"Java","tags":"缓存/架构","outline":"deep"},"headers":[],"relativePath":"Notes/No2TechColumn/01 Java/07 万字长文聊缓存上.md","filePath":"Notes/No2TechColumn/01 Java/07 万字长文聊缓存上.md","lastUpdated":1723563552000}'),p={name:"Notes/No2TechColumn/01 Java/07 万字长文聊缓存上.md"},i=n(`<p><img src="https://raw.githubusercontent.com/silently9527/images/main/945a0dca424147eeb027e97e138a9779~tplv-k3u1fbpfcp-watermark.image" alt=""></p><h2 id="摘要" tabindex="-1">摘要 <a class="header-anchor" href="#摘要" aria-label="Permalink to &quot;摘要&quot;">​</a></h2><p>缓存的目的是为了提高系统的访问速度，让数据更加接近于使用者，通常也是提升性能的常用手段。缓存在生活中其实也是无处不在，比如物流系统，他们基本上在各地都有分仓库，如果本地仓库有数据，那么送货的速度就会很快；CPU读取数据也采用了缓存，寄存器-&gt;高速缓存-&gt;内存-&gt;硬盘/网络；我们经常使用的maven仓库也同样有本地仓库和远程仓库。现阶段缓存的使用场景也越来越多，比如：浏览器缓存、反向代理层缓存、应用层缓存、数据库查询缓存、分布式集中缓存。</p><p>本文我们就先从浏览器缓存和Nginx缓存开始聊起。</p><h2 id="浏览器缓存" tabindex="-1">浏览器缓存 <a class="header-anchor" href="#浏览器缓存" aria-label="Permalink to &quot;浏览器缓存&quot;">​</a></h2><p>浏览器缓存是指当我们去访问一个网站或者Http服务的时候，服务器可以设置Http的响应头信息，其中如果设置缓存相关的头信息，那么浏览器就会缓存这些数据，下次再访问这些数据的时候就直接从浏览器缓存中获取或者是只需要去服务器中校验下缓存时候有效，可以减少浏览器与服务器之间的网络时间的开销以及节省带宽。</p><blockquote><p>Htpp相关的知识，欢迎去参观 <a href="https://juejin.cn/post/6908501668325769223" target="_blank" rel="noreferrer">《面试篇》Http协议</a></p></blockquote><h3 id="cache-control" tabindex="-1">Cache-Control <a class="header-anchor" href="#cache-control" aria-label="Permalink to &quot;Cache-Control&quot;">​</a></h3><p>该命令是通用首部字段（请求首部和响应首部都可以使用），用于控制缓存的工作机制，该命令参数稍多，常用的参数：</p><ul><li>no-cache: 表示不需要缓存该资源</li><li>max-age(秒): 缓存的最大有效时间，当max-age=0时，表示不需要缓存</li></ul><h3 id="expires" tabindex="-1">Expires <a class="header-anchor" href="#expires" aria-label="Permalink to &quot;Expires&quot;">​</a></h3><p>控制资源失效的日期，当浏览器接受到<code>Expires</code>之后，浏览器都会使用本地的缓存，在过期日期之后才会向务器发送请求；如果服务器同时在响应头中也指定了<code>Cache-Control</code>的<code>max-age</code>指令时，浏览器会优先处理<code>max-age</code>。 如果服务器不想要让浏览器对资源缓存，可以把<code>Expires</code>和首部字段<code>Date</code>设置相同的值</p><h3 id="last-modified-if-modified-since" tabindex="-1">Last-Modified / If-Modified-Since <a class="header-anchor" href="#last-modified-if-modified-since" aria-label="Permalink to &quot;Last-Modified / If-Modified-Since&quot;">​</a></h3><h4 id="last-modified" tabindex="-1">Last-Modified <a class="header-anchor" href="#last-modified" aria-label="Permalink to &quot;Last-Modified&quot;">​</a></h4><p><img src="https://raw.githubusercontent.com/silently9527/images/main/1001216705-5feecf35dd915_articlex" alt=""></p><p><code>Last-Modified</code> 用于指明资源最终被修改的时间。配合<code>If-Modified-Since</code>一起使用可以通过时间对缓存是否有效进行校验；后面实战会使用到这种方式。</p><h4 id="if-modified-since" tabindex="-1">If-Modified-Since <a class="header-anchor" href="#if-modified-since" aria-label="Permalink to &quot;If-Modified-Since&quot;">​</a></h4><p><img src="https://raw.githubusercontent.com/silently9527/images/main/1337316262-5feed2b840c5c_articlex" alt=""></p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/464285711-5feed35b05352_articlex" alt=""></p><p>如果请求头中<code>If-Modified-Since</code>的日期早于请求资源的更新日期，那么服务会进行处理，返回最新的资源；如果<code>If-Modified-Since</code>指定的日期之后请求的资源都未更新过，那么服务不会处理请求并返回<code>304 Mot Modified</code>的响应，表示缓存的文件有效可以继续使用。</p><h4 id="实战事例" tabindex="-1">实战事例 <a class="header-anchor" href="#实战事例" aria-label="Permalink to &quot;实战事例&quot;">​</a></h4><p>使用SpringMVC做缓存的测试代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ResponseBody</span></span>
<span class="line"><span>@RequestMapping(&quot;/http/cache&quot;)</span></span>
<span class="line"><span>public ResponseEntity&lt;String&gt; cache(@RequestHeader(value = &quot;If-Modified-Since&quot;, required = false)</span></span>
<span class="line"><span>                                            String ifModifiedSinceStr) throws ParseException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DateFormat dateFormat = new SimpleDateFormat(&quot;EEE, d MMM yyyy HH:mm:ss &#39;GMT&#39;&quot;, Locale.US);</span></span>
<span class="line"><span>    Date ifModifiedSince = dateFormat.parse(ifModifiedSinceStr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    long lastModifiedDate = getLastModifiedDate(ifModifiedSince);//获取文档最后更新时间</span></span>
<span class="line"><span>    long now = System.currentTimeMillis();</span></span>
<span class="line"><span>    int maxAge = 30; //数据在浏览器端缓存30秒</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //判断文档是否被修改过</span></span>
<span class="line"><span>    if (Objects.nonNull(ifModifiedSince) &amp;&amp; ifModifiedSince.getTime() == lastModifiedDate) {</span></span>
<span class="line"><span>        HttpHeaders headers = new HttpHeaders();</span></span>
<span class="line"><span>        headers.add(&quot;Date&quot;, dateFormat.format(new Date(now))); //设置当前时间</span></span>
<span class="line"><span>        headers.add(&quot;Expires&quot;, dateFormat.format(new Date(now + maxAge * 1000))); //设置过期时间</span></span>
<span class="line"><span>        headers.add(&quot;Cache-Control&quot;, &quot;max-age=&quot; + maxAge);</span></span>
<span class="line"><span>        return new ResponseEntity&lt;&gt;(headers, HttpStatus.NOT_MODIFIED);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //文档已经被修改过</span></span>
<span class="line"><span>    HttpHeaders headers = new HttpHeaders();</span></span>
<span class="line"><span>    headers.add(&quot;Date&quot;, dateFormat.format(new Date(now))); //设置当前时间</span></span>
<span class="line"><span>    headers.add(&quot;Last-Modified&quot;, dateFormat.format(new Date(lastModifiedDate))); //设置最近被修改的日期</span></span>
<span class="line"><span>    headers.add(&quot;Expires&quot;, dateFormat.format(new Date(now + maxAge * 1000))); //设置过期时间</span></span>
<span class="line"><span>    headers.add(&quot;Cache-Control&quot;, &quot;max-age=&quot; + maxAge);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String responseBody = JSON.toJSONString(ImmutableMap.of(&quot;website&quot;, &quot;https://silently9527.cn&quot;));</span></span>
<span class="line"><span>    return new ResponseEntity&lt;&gt;(responseBody, headers, HttpStatus.OK);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//获取文档的最后更新时间，方便测试，每15秒换一次；去掉毫秒值</span></span>
<span class="line"><span>private long getLastModifiedDate(Date ifModifiedSince) {</span></span>
<span class="line"><span>    long now = System.currentTimeMillis();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (Objects.isNull(ifModifiedSince)) {</span></span>
<span class="line"><span>        return now;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    long seconds = (now - ifModifiedSince.getTime()) / 1000;</span></span>
<span class="line"><span>    if (seconds &gt; 15) {</span></span>
<span class="line"><span>        return now;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ifModifiedSince.getTime();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li>当第一次访问<code>http://localhost:8080/http/cache</code>的时候，我们可以看到如下的响应头信息：</li></ol><p><img src="https://raw.githubusercontent.com/silently9527/images/main/4272751113-5fef02a704eef_articlex" alt=""></p><p>前面我们已提到了<code>Cache-Control</code>的优先级高于<code>Expires</code>，实际的项目中我们可以同时使用，或者只使用<code>Cache-Control</code>。<code>Expires</code>的值通常情况下都是<code>系统当前时间+缓存过期时间</code></p><ol start="2"><li>当我们在15秒之内再次访问<code>http://localhost:8080/http/cache</code>会看到如下的请求头：</li></ol><p><img src="https://raw.githubusercontent.com/silently9527/images/main/625236506-5fef04de620f6_articlex" alt=""></p><p>此时发送到服务器端的头信息<code>If-Modified-Since</code>就是上次请求服务器返回的<code>Last-Modified</code>，浏览器会拿这个时间去和服务器校验内容是否发送了变化，由于我们后台程序在15秒之内都表示没有修改过内容，所以得到了如下的响应头信息</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/1837880240-5fef030537a05_articlex" alt=""></p><p>响应的状态码304，表示服务器告诉浏览器，你的缓存是有效的可以继续使用。</p><h3 id="if-none-match-etag" tabindex="-1">If-None-Match / ETag <a class="header-anchor" href="#if-none-match-etag" aria-label="Permalink to &quot;If-None-Match / ETag&quot;">​</a></h3><h4 id="if-none-match" tabindex="-1">If-None-Match <a class="header-anchor" href="#if-none-match" aria-label="Permalink to &quot;If-None-Match&quot;">​</a></h4><p><img src="https://raw.githubusercontent.com/silently9527/images/main/7965268-5feeada9ef830_articlex" alt=""></p><p>请求首部字段<code>If-None-Match</code>传输给服务器的值是服务器返回的ETag值，只有当服务器上请求资源的<code>ETag</code>值与<code>If-None-Match</code>不一致时，服务器才去处理该请求。</p><h4 id="etag" tabindex="-1">ETag <a class="header-anchor" href="#etag" aria-label="Permalink to &quot;ETag&quot;">​</a></h4><p>响应首部字段<code>ETag</code>能够告知客服端响应实体的标识，它是一种可将资源以字符串的形式做唯一标识的方式。服务器可以为每份资源指定一个<code>ETag</code>值。当资源被更新时，<code>ETag</code>的值也会被更新。通常生成<code>ETag</code>值的算法使用的是md5。</p><ul><li>强ETag值：不论实体发生了多么细微的变化都会改变其值</li><li>弱ETag值：只用于提示资源是否相同，只有当资源发送了根本上的变化，ETag才会被改变。使用弱ETag值需要在前面添加<code>W/</code></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ETag: W/&quot;etag-xxxx&quot;</span></span></code></pre></div><p>通常建议选择弱ETag值，因为大多数时候我们都会在代理层开启gzip压缩，弱ETag可以验证压缩和不压缩的实体，而强ETag值要求响应实体字节必须完全一致。</p><h4 id="实战事例-1" tabindex="-1">实战事例 <a class="header-anchor" href="#实战事例-1" aria-label="Permalink to &quot;实战事例&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ResponseBody</span></span>
<span class="line"><span>@RequestMapping(&quot;/http/etag&quot;)</span></span>
<span class="line"><span>public ResponseEntity&lt;String&gt; etag(@RequestHeader(value = &quot;If-None-Match&quot;, required = false)</span></span>
<span class="line"><span>                                           String ifNoneMatch) throws ParseException {</span></span>
<span class="line"><span>    long now = System.currentTimeMillis();</span></span>
<span class="line"><span>    int maxAge = 30; //数据在浏览器端缓存30秒</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String responseBody = JSON.toJSONString(ImmutableMap.of(&quot;website&quot;, &quot;https://silently9527.cn&quot;));</span></span>
<span class="line"><span>    String etag = &quot;W/\\&quot;&quot; + MD5Encoder.encode(responseBody.getBytes()) + &quot;\\&quot;&quot;; //弱ETag值</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (etag.equals(ifNoneMatch)) {</span></span>
<span class="line"><span>        return new ResponseEntity&lt;&gt;(HttpStatus.NOT_MODIFIED);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DateFormat dateFormat = new SimpleDateFormat(&quot;EEE, d MMM yyyy HH:mm:ss &#39;GMT&#39;&quot;, Locale.US);</span></span>
<span class="line"><span>    HttpHeaders headers = new HttpHeaders();</span></span>
<span class="line"><span>    headers.add(&quot;ETag&quot;, etag);</span></span>
<span class="line"><span>    headers.add(&quot;Date&quot;, dateFormat.format(new Date(now))); //设置当前时间</span></span>
<span class="line"><span>    headers.add(&quot;Cache-Control&quot;, &quot;max-age=&quot; + maxAge);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return new ResponseEntity&lt;&gt;(responseBody, headers, HttpStatus.OK);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>ETag是用于发送到服务器端进行内容变更验证的，第一次请求<code>http://localhost:8080/http/etag</code>，获取到的响应头信息：</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/2265767161-5fef0c2eaac25_articlex" alt=""></p><p>在30秒之内，我们再次刷新页面，可以看到如下的请求头信息：</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/3425460149-5fef0cc243044_articlex" alt=""></p><p>这里的<code>If-None-Match</code>就是上一次请求服务返回的<code>ETag</code>值，服务器校验<code>If-None-Match</code>值与<code>ETag</code>值相等，所以返回了304告诉浏览器缓存可以用。</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/2628387259-5fef0d8339c3e_articlex" alt=""></p><h3 id="etag与last-modified两者应该如何选择" tabindex="-1">ETag与Last-Modified两者应该如何选择？ <a class="header-anchor" href="#etag与last-modified两者应该如何选择" aria-label="Permalink to &quot;ETag与Last-Modified两者应该如何选择？&quot;">​</a></h3><p>通过上面的两个事例我们可以看出<code>ETag</code>需要服务器先查询出需要响应的内容，然后计算出ETag值，再与浏览器请求头中<code>If-None-Match</code>来比较觉得是否需要返回数据，对于服务器来说仅仅是节省了带宽，原本应该服务器调用后端服务查询的信息依然没有被省掉；而<code>Last-Modified</code>通过时间的比较，如果内容没有更新，服务器不需要调用后端服务查询出响应数据，不仅节省了服务器的带宽也降低了后端服务的压力；</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/48726737-5fef122561b82_articlex" alt=""></p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/41781774-5fef13806b57a_articlex" alt=""></p><p>对比之后得出结论：<strong>通常来说为了降低后端服务的压力<code>ETag</code>适用于图片/js/css等静态资源，而类似用户详情信息需要调用后端服务的数据适合使用<code>Last-Modified</code>来处理</strong>。</p><h2 id="nginx" tabindex="-1">Nginx <a class="header-anchor" href="#nginx" aria-label="Permalink to &quot;Nginx&quot;">​</a></h2><p>通常情况下我们都会使用到Nginx来做反向代理服务器，我们可以通过缓冲、缓存来对Nginx进行调优，本篇我们就从这两个方面来聊聊Nginx调优</p><h3 id="缓冲" tabindex="-1">缓冲 <a class="header-anchor" href="#缓冲" aria-label="Permalink to &quot;缓冲&quot;">​</a></h3><p>默认情况下，Nginx在返回响应给客户端之前会尽可能快的从上游服务器获取数据，Nginx会尽可能的将上有服务器返回的数据缓冲到本地，然后一次性的全部返回给客户端，如果每次从上游服务器返回的数据都需要写入到磁盘中，那么Nginx的性能肯定会降低；所以我们需要根据实际情况对Nginx的缓存做优化。</p><ul><li><code>proxy_buffer_size</code>: 设置Nginx缓冲区的大小，用来存储upstream端响应的header。</li><li><code>proxy_buffering</code>: 启用代理内容缓冲，当该功能禁用时，代理一接收到上游服务器的返回就立即同步的发送给客户端，<code>proxy_max_temp_file_size</code>被设置为0；通过设置<code>proxy_buffering</code>为on，<code>proxy_max_temp_file_size</code>为0 可以确保代理的过程中不适用磁盘，只是用缓冲区; 开启后<code>proxy_buffers</code>和<code>proxy_busy_buffers_size</code>参数才会起作用</li><li><code>proxy_buffers</code>: 设置响应上游服务器的缓存数量和大小，当一个缓冲区占满后会申请开启下一个缓冲区，直到缓冲区数量到达设置的最大值</li><li><code>proxy_busy_buffers_size</code>: 在从上游服务器读取响应数据时分配给发送到客户端响应的缓冲区大小，所有连接共用<code>proxy_busy_buffers_size</code>设置的缓冲区大小，一旦<code>proxy_buffers</code>设置的buffer被写入，直到buffer里面的数据被完整的传输完（传输到客户端），这个buffer将会一直处 在busy状态，我们不能对这个buffer进行任何别的操作。所有处在busy状态的buffer size加起来不能超过<code>proxy_busy_buffers_size</code>， 所以<code>proxy_busy_buffers_size</code>是用来控制同时传输到客户端的buffer数量的； 典型是设置成<code>proxy_buffers</code>的两倍。</li></ul><p><img src="https://raw.githubusercontent.com/silently9527/images/main/649495883-5fef5e956f10a_articlex" alt=""></p><p><strong>Nginx代理缓冲的设置都是作用到每一个请求的</strong>，想要设置缓冲区的大小到最佳状态，需要测量出经过反向代理服务器器的平均请求数和响应的大小；<code>proxy_buffers</code>指令的默认值 8个 4KB 或者 8个 8KB（具体依赖于操作系统），假如我们的服务器是1G，这台服务器只运行了Nginx服务，那么排除到操作系统的内存使用，保守估计Nginx能够使用的内存是768M</p><ol><li>每个活动的连接使用缓冲内存：8个4KB = 8 * 4 * 1024 = 32768字节</li><li>系统可使用的内存大小768M: 768 * 1024 * 1024 = 805306368字节</li><li>所以Nginx能够同时处理的连接数：805306368 / 32768 = 24576</li></ol><p>经过我们的粗略估计，1G的服务器只运行Nginx大概可以同时处理24576个连接。</p><p>假如我们测量和发现经过反向代理服务器响应的平均数据大小是 900KB , 而默认的 8个4KB的缓冲区是无法满足的，所以我们可以调整大小</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>http {</span></span>
<span class="line"><span>    proxy_buffers 30 32k;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样设置之后每次请求可以达到最快的响应，但是同时处理的连接数减少了，<code>(768 * 1024 * 1024) / (30 * 32 * 1024)</code>=819个活动连接；</p><p>如果我们系统的并发数不是太高，我们可以将<code>proxy_buffers</code>缓冲区的个数下调，设置稍大的<code>proxy_busy_buffers_size</code>加大往客户端发送的缓冲区，以确保Nginx在传输的过程中能够把从上游服务器读取到的数据全部写入到缓冲区中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>http {</span></span>
<span class="line"><span>    proxy_buffers 10 32k;</span></span>
<span class="line"><span>    proxy_busy_buffers_size 64k;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="缓存" tabindex="-1">缓存 <a class="header-anchor" href="#缓存" aria-label="Permalink to &quot;缓存&quot;">​</a></h3><p><img src="https://raw.githubusercontent.com/silently9527/images/main/2828597428-5ff03e77adf98_articlex" alt=""></p><p>Nignx除了可以缓冲上游服务器的响应达到快速返回给客户端，它还可以是实现响应的缓存，通过上图我们可以看到</p><ul><li>1A: 一个请求到达Nginx，先从缓存中尝试获取</li><li>1B: 缓存不存在直接去上游服务器获取数据</li><li>1C: 上游服务器返回响应，Nginx把响应放入到缓存</li><li>1D: 把响应返回到客户端</li><li>2A: 另一个请求达到Nginx, 到缓存中查找</li><li>2B: 缓存中有对应的数据，直接返回，不去上游服务器获取数据</li></ul><p>Nginx的缓存常用配置：</p><ul><li><code>proxy_cache_path</code>: 放置缓存响应和共享的目录。<code>levels</code> 设置缓存文件目录层次, levels=1:2 表示两级目录，最多三层，其中 1 表示一级目录使用一位16进制作为目录名，2 表示二级目录使用两位16进制作为目录名，如果文件都存放在一个目录中，文件量大了会导致文件访问变慢。<code>keys_zone</code>设置缓存名字和共享内存大小，<code>inactive</code> 当被放入到缓存后如果不被访问的最大存活时间，<code>max_size</code>设置缓存的最大空间</li><li><code>proxy_cache</code>: 定义响应应该存放到哪个缓存区中（<code>keys_zone</code>设置的名字）</li><li><code>proxy_cache_key</code>: 设置缓存使用的Key, 默认是完整的访问URL，可以自己根据实际情况设置</li><li><code>proxy_cache_lock</code>: 当多个客户端同时访问一下URL时，如果开启了这个配置，那么只会有一个客户端会去上游服务器获取响应，获取完成后放入到缓存中，其他的客户端会等待从缓存中获取。</li><li><code>proxy_cache_lock_timeout</code>: 启用了<code>proxy_cache_lock</code>之后，如果第一个请求超过了<code>proxy_cache_lock_timeout</code>设置的时间默认是5s，那么所有等待的请求会同时到上游服务器去获取数据，可能会导致后端压力增大。</li><li><code>proxy_cache_min_uses</code>: 设置资源被请求多少次后才会被缓存</li><li><code>proxy_cache_use_stale</code>: 在访问上游服务器发生错误时，返回已经过期的数据给客户端；当缓存内容对于过期时间不敏感，可以选择采用这种方式</li><li><code>proxy_cache_valid</code>: 为不同响应状态码设置缓存时间。如果设置<code>proxy_cache_valid 5s</code>，那么所有的状态码都会被缓存。</li></ul><p>设置所有的响应被缓存后最大不被访问的存活时间6小时，缓存的大小设置为1g，缓存的有效期是1天，配置如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>http {</span></span>
<span class="line"><span>    proxy_cache_path /export/cache/proxy_cache keys_zone=CACHE:10m levels=1:2 inactive=6h max_size=1g;</span></span>
<span class="line"><span>    server {</span></span>
<span class="line"><span>        location / {</span></span>
<span class="line"><span>            proxy_cache CACHE; //指定存放响应到CACHE这个缓存中</span></span>
<span class="line"><span>            proxy_cache_valid 1d; //所有的响应状态码都被缓存1d</span></span>
<span class="line"><span>            proxy_pass: http://upstream;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果当前响应中设置了Set-Cookie头信息，那么当前的响应不会被缓存，可以通过使用<code>proxy_ignore_headers</code>来忽略头信息以达到缓存</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>proxy_ignore_headers Set-Cookie</span></span></code></pre></div><p>如果这样做了，我们需要把cookie中的值作为<code>proxy_cache_key</code>的一部分，防止同一个URL响应的数据不同导致缓存数据被覆盖，返回到客户端错误的数据</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>proxy_cache_key &quot;$host$request_uri$cookie_user&quot;</span></span></code></pre></div><p>注意，这种情况还是有问题，因为在缓存的key中添加cookie信息，那么可能导致公共资源被缓存多份导致浪费空间；要解决这个问题我们可以把不同的资源分开配置，比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>server {</span></span>
<span class="line"><span>    proxy_ignore_headers Set-Cookie;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    location /img {</span></span>
<span class="line"><span>        proxy_cache_key &quot;$host$request_uri&quot;;</span></span>
<span class="line"><span>        proxy_pass http://upstream;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    location / {</span></span>
<span class="line"><span>        proxy_cache_key &quot;$host$request_uri$cookie_user&quot;;</span></span>
<span class="line"><span>        proxy_pass http://upstream;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="清理缓存" tabindex="-1">清理缓存 <a class="header-anchor" href="#清理缓存" aria-label="Permalink to &quot;清理缓存&quot;">​</a></h3><p>虽然我们设置了缓存加快了响应，但是有时候会遇到缓存错误的请求，通常我们需要为自己开一个后面，方便发现问题之后通过手动的方式及时的清理掉缓存。Nginx可以考虑使用<code>ngx_cache_purge</code>模块进行缓存清理。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>location ~ /purge/.* {</span></span>
<span class="line"><span>    allow 127.0.0.1;</span></span>
<span class="line"><span>    deny all;</span></span>
<span class="line"><span>    proxy_cache_purge cache_one $host$1$is_args$args</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>该方法要限制访问权限</strong>； <code>proxy_cache_purge</code>缓存清理的模块，<code>cache_one</code>指定的key_zone，<code>$host$1$is_args$args</code> 指定的生成缓存key的参数</p><h2 id="存储" tabindex="-1">存储 <a class="header-anchor" href="#存储" aria-label="Permalink to &quot;存储&quot;">​</a></h2><p>如果有大的静态文件，这些静态文件基本不会别修改，那么我们就可以不用给它设置缓存的有效期，让Nginx直接存储这些文件直接。如果上游服务器修改了这些文件，那么可以单独提供一个程序把对应的静态文件删除。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>http {</span></span>
<span class="line"><span>    proxy_temp_path /var/www/tmp;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    server {</span></span>
<span class="line"><span>        root /var/www/data;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        location /img {</span></span>
<span class="line"><span>            error_page 404 = @store</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        location @store {</span></span>
<span class="line"><span>            internal;</span></span>
<span class="line"><span>            proxy_store on;</span></span>
<span class="line"><span>            proxy_store_access group:r all:r;</span></span>
<span class="line"><span>            proxy_pass http://upstream;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>请求首先会去<code>/img</code>中查找文件，如果不存在再去上游服务器查找；<code>internal</code> 指令用于指定只允许来自本地 Nginx 的内部调用，来自外部的访问会直接返回 404 not found 状态。<code>proxy_store</code>表示需要把从上游服务器返回的文件存储到 <code>/var/www/data</code>； <code>proxy_store_access</code>设置访问权限</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><ul><li><code>Cache-Control</code>和<code>Expires</code> 设置资源缓存的有效期</li><li>使用<code>Last-Modified / If-Modified-Since</code>判断缓存是否有效</li><li>使用<code>If-None-Match / ETag</code>判断缓存是否有效</li><li>通过配置Nginx缓冲区大小对Nginx调优</li><li>使用Nginx缓存加快请求响应速度</li></ul><p>如何加快请求响应的速度，本篇我们主要围绕着Http缓存和Nignx反向代理两个方面来聊了缓存，你以为这样就完了吗，不！<strong>下一篇我们将从应用程序的维度来聊聊缓存</strong></p>`,92),t=[i];function o(c,l,d,r,h,u){return e(),s("div",null,t)}const m=a(p,[["render",o]]);export{f as __pageData,m as default};
