import{_ as s,c as a,o as n,aa as e}from"./chunks/framework.DtK4gh9F.js";const b=JSON.parse('{"title":"01 CompletableFuture让你的代码免受阻塞之苦","description":"","frontmatter":{"title":"01 CompletableFuture让你的代码免受阻塞之苦","author":"Herman","updateTime":"2021-08-14 13:41","desc":"CompletableFuture让你的代码免受阻塞之苦","categories":"Java","tags":"Java8新特性/多线程","outline":"deep"},"headers":[],"relativePath":"Notes/No2TechColumn/01 Java/01 CompletableFuture让你的代码免受阻塞之苦.md","filePath":"Notes/No2TechColumn/01 Java/01 CompletableFuture让你的代码免受阻塞之苦.md","lastUpdated":1724593073000}'),p={name:"Notes/No2TechColumn/01 Java/01 CompletableFuture让你的代码免受阻塞之苦.md"},l=e(`<h4 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h4><p>现在大部分的CPU都是多核，我们都知道想要提升我们应用程序的运行效率，就必须得充分利用多核CPU的计算能力；Java早已经为我们提供了多线程的API，但是实现方式略微麻烦，今天我们就来看看Java8在这方面提供的改善。</p><hr><h4 id="假设场景" tabindex="-1">假设场景 <a class="header-anchor" href="#假设场景" aria-label="Permalink to &quot;假设场景&quot;">​</a></h4><p>现在你需要为在线教育平台提供一个查询用户详情的API，该接口需要返回用户的基本信息，标签信息，这两个信息存放在不同位置，需要远程调用来获取这两个信息；为了模拟远程调用，我们需要在代码里面延迟 1s;</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface RemoteLoader {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String load();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    default void delay() {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            Thread.sleep(1000L);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class CustomerInfoService implements RemoteLoader {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String load() {</span></span>
<span class="line"><span>        this.delay();</span></span>
<span class="line"><span>        return &quot;基本信息&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class LearnRecordService implements RemoteLoader {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String load() {</span></span>
<span class="line"><span>        this.delay();</span></span>
<span class="line"><span>        return &quot;学习信息&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><hr><h4 id="同步方式实现版本" tabindex="-1">同步方式实现版本 <a class="header-anchor" href="#同步方式实现版本" aria-label="Permalink to &quot;同步方式实现版本&quot;">​</a></h4><p>如果我们采用同步的方式来完成这个API接口，我们的实现代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void testSync() {</span></span>
<span class="line"><span>    long start = System.currentTimeMillis();</span></span>
<span class="line"><span>    List&lt;RemoteLoader&gt; remoteLoaders = Arrays.asList(new CustomerInfoService(), new LearnRecordService());</span></span>
<span class="line"><span>    List&lt;String&gt; customerDetail = remoteLoaders.stream().map(RemoteLoader::load).collect(toList());</span></span>
<span class="line"><span>    System.out.println(customerDetail);</span></span>
<span class="line"><span>    long end = System.currentTimeMillis();</span></span>
<span class="line"><span>    System.out.println(&quot;总共花费时间:&quot; + (end - start));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>不出所料，因为调用的两个接口都是延迟了 1s ，所以结果大于2秒 <img src="https://cdn.jsdelivr.net/gh/silently9527/images/462092667-5fb92e076071d_articlex" alt=""></p><hr><h4 id="future实现的版本" tabindex="-1">Future实现的版本 <a class="header-anchor" href="#future实现的版本" aria-label="Permalink to &quot;Future实现的版本&quot;">​</a></h4><p>接下来我们把这个例子用Java7提供的<code>Future</code>来实现异步的版本，看下效果如何呢？代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void testFuture() {</span></span>
<span class="line"><span>    long start = System.currentTimeMillis();</span></span>
<span class="line"><span>    ExecutorService executorService = Executors.newFixedThreadPool(2);</span></span>
<span class="line"><span>    List&lt;RemoteLoader&gt; remoteLoaders = Arrays.asList(new CustomerInfoService(), new LearnRecordService());</span></span>
<span class="line"><span>    List&lt;Future&lt;String&gt;&gt; futures = remoteLoaders.stream()</span></span>
<span class="line"><span>            .map(remoteLoader -&gt; executorService.submit(remoteLoader::load))</span></span>
<span class="line"><span>            .collect(toList());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;String&gt; customerDetail = futures.stream()</span></span>
<span class="line"><span>            .map(future -&gt; {</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    return future.get();</span></span>
<span class="line"><span>                } catch (InterruptedException | ExecutionException e) {</span></span>
<span class="line"><span>                    e.printStackTrace();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                return null;</span></span>
<span class="line"><span>            })</span></span>
<span class="line"><span>            .filter(Objects::nonNull)</span></span>
<span class="line"><span>            .collect(toList());</span></span>
<span class="line"><span>    System.out.println(customerDetail);</span></span>
<span class="line"><span>    long end = System.currentTimeMillis();</span></span>
<span class="line"><span>    System.out.println(&quot;总共花费时间:&quot; + (end - start));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这次我们采用多线程的方式来改造了我们这个例子，结果还是比较满意的，时间大概花费了1s多一点 <img src="https://cdn.jsdelivr.net/gh/silently9527/images/1730588490-5fb9317d21529_articlex" alt=""></p><blockquote><p>注意：这里我分成了两个Stream，如何合在一起用同一个Stream，那么在用<code>future.get()</code>的时候会导致阻塞，相当于提交一个任务执行完后才提交下一个任务，这样达不到异步的效果</p></blockquote><p>这里我们可以看到虽然<code>Future</code>达到了我们预期的效果，但是如果需要实现将两个异步的结果进行合并处理就稍微麻一些，这里就不细说，后面主要看下<code>CompletableFuture</code>在这方面的改进</p><hr><h4 id="java8并行流" tabindex="-1">Java8并行流 <a class="header-anchor" href="#java8并行流" aria-label="Permalink to &quot;Java8并行流&quot;">​</a></h4><p>以上我们用的是Java8之前提供的方法来实现，接下来我们来看下Java8中提供的并行流来实习我们这个例子效果怎样呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void testParallelStream() {</span></span>
<span class="line"><span>    long start = System.currentTimeMillis();</span></span>
<span class="line"><span>    List&lt;RemoteLoader&gt; remoteLoaders = Arrays.asList(new CustomerInfoService(), new LearnRecordService());</span></span>
<span class="line"><span>    List&lt;String&gt; customerDetail = remoteLoaders.parallelStream().map(RemoteLoader::load).collect(toList());</span></span>
<span class="line"><span>    System.out.println(customerDetail);</span></span>
<span class="line"><span>    long end = System.currentTimeMillis();</span></span>
<span class="line"><span>    System.out.println(&quot;总共花费时间:&quot; + (end - start));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行的结果还是相当的满意，花费时间 1s 多点 <img src="https://cdn.jsdelivr.net/gh/silently9527/images/1092883515-5fb9e2210d779_articlex" alt=""></p><p>和Java8之前的实现对比，我们发现整个代码会更加的简洁；</p><p>接下来我们把我们的例子改变一下，查询用户详情的接口还需要返回视频观看记录，用户的标签信息，购买订单</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class WatchRecordService implements RemoteLoader {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public String load() {</span></span>
<span class="line"><span>        this.delay();</span></span>
<span class="line"><span>        return &quot;观看记录&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class OrderService implements RemoteLoader {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public String load() {</span></span>
<span class="line"><span>        this.delay();</span></span>
<span class="line"><span>        return &quot;订单信息&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class LabelService implements RemoteLoader {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public String load() {</span></span>
<span class="line"><span>        this.delay();</span></span>
<span class="line"><span>        return &quot;标签信息&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们继续使用Java8提供的并行流来实现，看下运行的结果是否理想</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void testParallelStream2() {</span></span>
<span class="line"><span>    long start = System.currentTimeMillis();</span></span>
<span class="line"><span>    List&lt;RemoteLoader&gt; remoteLoaders = Arrays.asList(</span></span>
<span class="line"><span>            new CustomerInfoService(),</span></span>
<span class="line"><span>            new LearnRecordService(),</span></span>
<span class="line"><span>            new LabelService(),</span></span>
<span class="line"><span>            new OrderService(),</span></span>
<span class="line"><span>            new WatchRecordService());</span></span>
<span class="line"><span>    List&lt;String&gt; customerDetail = remoteLoaders.parallelStream().map(RemoteLoader::load).collect(toList());</span></span>
<span class="line"><span>    System.out.println(customerDetail);</span></span>
<span class="line"><span>    long end = System.currentTimeMillis();</span></span>
<span class="line"><span>    System.out.println(&quot;总共花费时间:&quot; + (end - start));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>但是这次运行的结果不是太理想，花费时间超过了2秒 <img src="https://cdn.jsdelivr.net/gh/silently9527/images/1480299383-5fb9e56464af9_articlex" alt=""></p><hr><h4 id="completablefuture" tabindex="-1">CompletableFuture <a class="header-anchor" href="#completablefuture" aria-label="Permalink to &quot;CompletableFuture&quot;">​</a></h4><h5 id="基本的用法" tabindex="-1">基本的用法 <a class="header-anchor" href="#基本的用法" aria-label="Permalink to &quot;基本的用法&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void testCompletableFuture() {</span></span>
<span class="line"><span>    CompletableFuture&lt;String&gt; future = new CompletableFuture&lt;&gt;();</span></span>
<span class="line"><span>    new Thread(() -&gt; {</span></span>
<span class="line"><span>        doSomething();</span></span>
<span class="line"><span>        future.complete(&quot;Finish&quot;);          //任务执行完成后 设置返回的结果</span></span>
<span class="line"><span>    }).start();</span></span>
<span class="line"><span>    System.out.println(future.join());      //获取任务线程返回的结果</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void doSomething() {</span></span>
<span class="line"><span>    System.out.println(&quot;doSomething...&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这种用法还有个问题，就是任务出现了异常，主线程会无感知，任务线程不会把异常给抛出来；这会导致主线程会一直等待，通常我们也需要知道出现了什么异常，做出对应的响应；改进的方式是在任务中try-catch所有的异常，然后调用<code>future.completeExceptionally(e)</code> ，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void testCompletableFuture() throws ExecutionException, InterruptedException {</span></span>
<span class="line"><span>    CompletableFuture&lt;String&gt; future = new CompletableFuture&lt;&gt;();</span></span>
<span class="line"><span>    new Thread(() -&gt; {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            doSomething();</span></span>
<span class="line"><span>            future.complete(&quot;Finish&quot;);</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            future.completeExceptionally(e);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }).start();</span></span>
<span class="line"><span>    System.out.println(future.get());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void doSomething() {</span></span>
<span class="line"><span>    System.out.println(&quot;doSomething...&quot;);</span></span>
<span class="line"><span>    throw new RuntimeException(&quot;Test Exception&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从现在来看<code>CompletableFuture</code>的使用过程需要处理的事情很多，不太简洁，你会觉得看起来很麻烦；但是这只是表象，Java8其实对这个过程进行了封装，提供了很多简洁的操作方式；接下来我们看下如何改造上面的代码</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void testCompletableFuture2() throws ExecutionException, InterruptedException {</span></span>
<span class="line"><span>    CompletableFuture&lt;String&gt; future = CompletableFuture.supplyAsync(() -&gt; {</span></span>
<span class="line"><span>        doSomething();</span></span>
<span class="line"><span>        return &quot;Finish&quot;;</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    System.out.println(future.get());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里我们采用了<code>supplyAsync</code>，这下看起来简洁了许多，世界都明亮了; Java8不仅提供允许任务返回结果的<code>supplyAsync</code>，还提供了没有返回值的<code>runAsync</code>；让我们可以更加的关注业务的开发，不需要处理异常错误的管理</p><hr><h5 id="completablefuture异常处理" tabindex="-1">CompletableFuture异常处理 <a class="header-anchor" href="#completablefuture异常处理" aria-label="Permalink to &quot;CompletableFuture异常处理&quot;">​</a></h5><p>如果说主线程需要关心任务到底发生了什么异常，需要对其作出相应操作，这个时候就需要用到<code>exceptionally</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void testCompletableFuture2() throws ExecutionException, InterruptedException {</span></span>
<span class="line"><span>    CompletableFuture&lt;String&gt; future = CompletableFuture</span></span>
<span class="line"><span>            .supplyAsync(() -&gt; {</span></span>
<span class="line"><span>                doSomething();</span></span>
<span class="line"><span>                return &quot;Finish&quot;;</span></span>
<span class="line"><span>            })</span></span>
<span class="line"><span>            .exceptionally(throwable -&gt; &quot;Throwable exception message:&quot; + throwable.getMessage());</span></span>
<span class="line"><span>    System.out.println(future.get());</span></span>
<span class="line"><span>}</span></span></code></pre></div><hr><h5 id="使用completablefuture来完成我们查询用户详情的api接口" tabindex="-1">使用CompletableFuture来完成我们查询用户详情的API接口 <a class="header-anchor" href="#使用completablefuture来完成我们查询用户详情的api接口" aria-label="Permalink to &quot;使用CompletableFuture来完成我们查询用户详情的API接口&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void testCompletableFuture3() throws ExecutionException, InterruptedException {</span></span>
<span class="line"><span>    long start = System.currentTimeMillis();</span></span>
<span class="line"><span>    List&lt;RemoteLoader&gt; remoteLoaders = Arrays.asList(</span></span>
<span class="line"><span>            new CustomerInfoService(),</span></span>
<span class="line"><span>            new LearnRecordService(),</span></span>
<span class="line"><span>            new LabelService(),</span></span>
<span class="line"><span>            new OrderService(),</span></span>
<span class="line"><span>            new WatchRecordService());</span></span>
<span class="line"><span>    List&lt;CompletableFuture&lt;String&gt;&gt; completableFutures = remoteLoaders</span></span>
<span class="line"><span>            .stream()</span></span>
<span class="line"><span>            .map(loader -&gt; CompletableFuture.supplyAsync(loader::load))</span></span>
<span class="line"><span>            .collect(toList());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;String&gt; customerDetail = completableFutures</span></span>
<span class="line"><span>            .stream()</span></span>
<span class="line"><span>            .map(CompletableFuture::join)</span></span>
<span class="line"><span>            .collect(toList());</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    System.out.println(customerDetail);</span></span>
<span class="line"><span>    long end = System.currentTimeMillis();</span></span>
<span class="line"><span>    System.out.println(&quot;总共花费时间:&quot; + (end - start));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里依然是采用的两个Stream来完成的，执行的结果如下：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/830895141-5fb9fce3659c5_articlex" alt=""></p><p>这个结果不太满意，和并行流的结果差不多，消耗时间 2秒多点；在这种场景下我们用<code>CompletableFuture</code>做了这么多工作，但是效果不理想，难道就有没有其他的方式可以让它在快一点吗？</p><p>为了解决这个问题，我们必须深入了解下并行流和<code>CompletableFuture</code>的实现原理，它们底层使用的线程池的大小都是CPU的核数<code>Runtime.getRuntime().availableProcessors()</code>；那么我们来尝试一下修改线程池的大小，看看效果如何？</p><hr><h5 id="自定义线程池-优化completablefuture" tabindex="-1">自定义线程池，优化CompletableFuture <a class="header-anchor" href="#自定义线程池-优化completablefuture" aria-label="Permalink to &quot;自定义线程池，优化CompletableFuture&quot;">​</a></h5><p>使用并行流无法自定义线程池，但是<code>CompletableFuture</code>可以</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void testCompletableFuture4() throws ExecutionException, InterruptedException {</span></span>
<span class="line"><span>    long start = System.currentTimeMillis();</span></span>
<span class="line"><span>    List&lt;RemoteLoader&gt; remoteLoaders = Arrays.asList(</span></span>
<span class="line"><span>            new CustomerInfoService(),</span></span>
<span class="line"><span>            new LearnRecordService(),</span></span>
<span class="line"><span>            new LabelService(),</span></span>
<span class="line"><span>            new OrderService(),</span></span>
<span class="line"><span>            new WatchRecordService());</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ExecutorService executorService = Executors.newFixedThreadPool(Math.min(remoteLoaders.size(), 50));</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    List&lt;CompletableFuture&lt;String&gt;&gt; completableFutures = remoteLoaders</span></span>
<span class="line"><span>            .stream()</span></span>
<span class="line"><span>            .map(loader -&gt; CompletableFuture.supplyAsync(loader::load, executorService))</span></span>
<span class="line"><span>            .collect(toList());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;String&gt; customerDetail = completableFutures</span></span>
<span class="line"><span>            .stream()</span></span>
<span class="line"><span>            .map(CompletableFuture::join)</span></span>
<span class="line"><span>            .collect(toList());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    System.out.println(customerDetail);</span></span>
<span class="line"><span>    long end = System.currentTimeMillis();</span></span>
<span class="line"><span>    System.out.println(&quot;总共花费时间:&quot; + (end - start));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们使用自定义线程池，设置最大的线程池数量50，来看下执行的结果 <img src="https://cdn.jsdelivr.net/gh/silently9527/images/1005772194-5fba03262a97f_articlex" alt=""></p><p>这下执行的结果比较满意了，1秒多点；理论上来说这个结果可以一直持续，直到达到线程池的大小50</p><hr><h5 id="并行流和completablefuture两者该如何选择" tabindex="-1">并行流和<code>CompletableFuture</code>两者该如何选择 <a class="header-anchor" href="#并行流和completablefuture两者该如何选择" aria-label="Permalink to &quot;并行流和\`CompletableFuture\`两者该如何选择&quot;">​</a></h5><p>这两者如何选择主要看任务类型，建议</p><ol><li>如果你的任务是计算密集型的，并且没有I/O操作的话，那么推荐你选择Stream的并行流，实现简单并行效率也是最高的</li><li>如果你的任务是有频繁的I/O或者网络连接等操作，那么推荐使用<code>CompletableFuture</code>，采用自定义线程池的方式，根据服务器的情况设置线程池的大小，尽可能的让CPU忙碌起来</li></ol><hr><h5 id="completablefuture的其他常用方法" tabindex="-1"><code>CompletableFuture</code>的其他常用方法 <a class="header-anchor" href="#completablefuture的其他常用方法" aria-label="Permalink to &quot;\`CompletableFuture\`的其他常用方法&quot;">​</a></h5><ol><li>thenApply、thenApplyAsync: 假如任务执行完成后，还需要后续的操作，比如返回结果的解析等等；可以通过这两个方法来完成</li><li>thenCompose、thenComposeAsync: 允许你对两个异步操作进行流水线的操作，当第一个操作完成后，将其结果传入到第二个操作中</li><li>thenCombine、thenCombineAsync：允许你把两个异步的操作整合；比如把第一个和第二个操作返回的结果做字符串的连接操作</li></ol><hr><h4 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h4><ol><li>Java8并行流的使用方式</li><li>CompletableFuture的使用方式、异常处理机制，让我们有机会管理任务执行中发送的异常</li><li>Java8并行流和<code>CompletableFuture</code>两者该如何选择</li><li><code>CompletableFuture</code>的常用方法</li></ol>`,65),t=[l];function i(c,o,r,u,d,m){return n(),a("div",null,t)}const g=s(p,[["render",i]]);export{b as __pageData,g as default};
