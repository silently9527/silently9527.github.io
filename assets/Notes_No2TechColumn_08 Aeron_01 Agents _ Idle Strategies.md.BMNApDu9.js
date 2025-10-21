import{_ as n,c as s,o as a,aa as e}from"./chunks/framework.DOnJscRE.js";const b=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Notes/No2TechColumn/08 Aeron/01 Agents & Idle Strategies.md","filePath":"Notes/No2TechColumn/08 Aeron/01 Agents & Idle Strategies.md","lastUpdated":1761049051000}'),p={name:"Notes/No2TechColumn/08 Aeron/01 Agents & Idle Strategies.md"},l=e(`<p>考虑实现一个简单的功能：一个线程每隔1s打印 <code>Hello Agrona Agent</code>, 使用Java Runnable实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Task implement Runnable{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void run(){</span></span>
<span class="line"><span>        while(true){</span></span>
<span class="line"><span>            System.out.println(&quot;Hello Agrona Agent&quot;);</span></span>
<span class="line"><span>            sleep(1000);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在Agrona中需要在应用程序中使用线程完成任务可以使用Agrona Agents（Agrona代理） 和 Idle Strategies（空闲策略）</p><h4 id="agent" tabindex="-1">Agent <a class="header-anchor" href="#agent" aria-label="Permalink to &quot;Agent&quot;">​</a></h4><p>Agent主要用来实现核心的任务逻辑，Agent可以调度在专门的线程上，也可以作为一组Agent放到一线线程中执行</p><p>首先来看看Agent的接口定义</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Agent {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    default void onStart(){}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int doWork() throws Exception;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    default void onClose(){}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String roleName();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>onStart: Agent启动的时候被调用，主要用来完成初始化工作</li><li>doWork: 在这里实现任务的主要逻辑，对于开头的例子来说就是 <code>System.out.println(&quot;Hello Agrona Agent&quot;);</code>；如果想要停止任务不再轮询就抛出异常<code>AgentTerminationException</code>; 返回值表示当前任务workCount</li><li>onClose: 释放和清理工作</li><li>roleName: 定义这个Agent角色名字</li></ul><blockquote><p><code>CompositeAgent</code>支持将多个Agent放到同一个线程中执行；<code>DynamicCompositeAgent</code>支持在运行的过程中动态的添加Agent</p></blockquote><h4 id="idlestrategy-空闲策略" tabindex="-1">IdleStrategy 空闲策略 <a class="header-anchor" href="#idlestrategy-空闲策略" aria-label="Permalink to &quot;IdleStrategy 空闲策略&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface IdleStrategy {</span></span>
<span class="line"><span>    void idle(int workCount);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>核心方法就是idle，根据workCount实现不同的闲置策略，Agrona 提供了一系列闲置策略，但是，如果需要，可以轻松实施自定义策略。</p><ul><li>SleepingIdleStrategy: 使用parkNanos在给定的时间段内停放线程</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void idle(int workCount) {</span></span>
<span class="line"><span>    if (workCount &lt;= 0) {</span></span>
<span class="line"><span>        LockSupport.parkNanos(this.sleepPeriodNs);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>SleepingMillisIdleStrategy: 使用 thread.sleep 使线程在给定的时间段内空闲。通常用在本地开发</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void idle(int workCount) {</span></span>
<span class="line"><span>    if (workCount &lt;= 0) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            Thread.sleep(this.sleepPeriodMs);</span></span>
<span class="line"><span>        } catch (InterruptedException var3) {</span></span>
<span class="line"><span>            Thread.currentThread().interrupt();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>YieldingIdleStrategy: 使用 thread.yield 让出cpu时间片</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void idle(int workCount) {</span></span>
<span class="line"><span>    if (workCount &lt;= 0) {</span></span>
<span class="line"><span>        Thread.yield();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>BackoffIdleStrategy: 这是一种激进的策略，它的机制为先是自旋，然后过渡到让步，然后再过渡到阻塞在可进行配置的纳秒时间内的一种复合策略。 这是 Aeron Cluster 的默认策略。可以看到它的idle()方法是随着运行不断升级空闲处理策略的（与synchronized锁膨胀类型）</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void idle(){</span></span>
<span class="line"><span>    switch (state){</span></span>
<span class="line"><span>        case NOT_IDLE: //先进入自旋</span></span>
<span class="line"><span>            state = SPINNING;</span></span>
<span class="line"><span>            spins++;</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        case SPINNING: //自旋</span></span>
<span class="line"><span>            ThreadHints.onSpinWait();</span></span>
<span class="line"><span>            if (++spins &gt; maxSpins){</span></span>
<span class="line"><span>                state = YIELDING;</span></span>
<span class="line"><span>                yields = 0;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        case YIELDING: //让出Cpu</span></span>
<span class="line"><span>            if (++yields &gt; maxYields){</span></span>
<span class="line"><span>                state = PARKING;</span></span>
<span class="line"><span>                parkPeriodNs = minParkPeriodNs;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else{</span></span>
<span class="line"><span>                Thread.yield();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        case PARKING: //阻塞线程指定时间</span></span>
<span class="line"><span>            LockSupport.parkNanos(parkPeriodNs);</span></span>
<span class="line"><span>            parkPeriodNs = Math.min(parkPeriodNs &lt;&lt; 1, maxParkPeriodNs);</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>NoOpIdleStrategy: 最激进的闲置策略，什么都不做，线程永远都不会闲着</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void idle(int workCount) {</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>BusySpinIdleStrategy: java.lang.Thread.onSpinWait()如果正在运行的 JVM 上可用，即 JVM 正在运行 Java 9+ ，则将调用该函数。这向 CPU 提供了一个弱提示，即该线程处于紧密循环中但正忙于等待某些内容，然后 CPU 可以将额外的资源分配给另一个线程，而无需涉及操作系统调度程序。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void idle(int workCount) {</span></span>
<span class="line"><span>    if (workCount &lt;= 0) {</span></span>
<span class="line"><span>        ThreadHints.onSpinWait();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="scheduling-agent-代理调度机制" tabindex="-1">Scheduling Agent 代理调度机制 <a class="header-anchor" href="#scheduling-agent-代理调度机制" aria-label="Permalink to &quot;Scheduling Agent 代理调度机制&quot;">​</a></h4><p>当你已经决定了如何实现Agent和IdleStrategy，那么就可以使用AgentRunner启动线程来执行Agent或者使用AgentInvoker使用调用线程执行，示例代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final AgentRunner runner = new AgentRunner(idleStrategy, errorHandler,  errorCounter, agent);</span></span>
<span class="line"><span>AgentRunner.startOnThread(runner);</span></span></code></pre></div><p>通过调用<code>AgentRunner.startOnThread</code>告诉Agrona将Agent调度在一个新线程上。</p><p>最后我们使用Agent来改造开头的功能</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class PrintAgent implement Agent{</span></span>
<span class="line"><span>    public int doWork(){</span></span>
<span class="line"><span>        System.out.println(&quot;Hello Agrona Agent&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>main(){</span></span>
<span class="line"><span>    IdleStrategy idleStrategy = new SleepingMillisIdleStrategy(1000);</span></span>
<span class="line"><span>    final AgentRunner runner = new AgentRunner(idleStrategy, errorHandler,  errorCounter, new PrintAgent());</span></span>
<span class="line"><span>    AgentRunner.startOnThread(runner);</span></span>
<span class="line"><span>}</span></span></code></pre></div><blockquote><p>注意: 并不是所有的空闲策略都是线程安全的。因此通常我们建议为每个被调度的Agent制定不同的空闲策略。</p></blockquote><p>原文链接: <a href="http://herman7z.site" target="_blank" rel="noreferrer">http://herman7z.site</a></p>`,32),t=[l];function i(o,c,r,d,g,u){return a(),s("div",null,t)}const k=n(p,[["render",i]]);export{b as __pageData,k as default};
