import{_ as a,c as s,o as n,aa as e}from"./chunks/framework.d_Ke7vMG.js";const g=JSON.parse('{"title":"06 JVM故障诊断和处理工具","description":"","frontmatter":{"title":"06 JVM故障诊断和处理工具","author":"Herman","updateTime":"2021-08-14 13:41","desc":"JVM故障诊断和处理工具","categories":"Java","tags":"虚拟机调优/Java虚拟机","outline":"deep"},"headers":[],"relativePath":"Notes/No2TechColumn/01 Java/06 JVM故障诊断和处理工具.md","filePath":"Notes/No2TechColumn/01 Java/06 JVM故障诊断和处理工具.md","lastUpdated":1723563552000}'),p={name:"Notes/No2TechColumn/01 Java/06 JVM故障诊断和处理工具.md"},t=e(`<h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>前几天中午正在和同事最近聊股市较好，这几天每天都可以喝点肉汤，心里还是挺高兴的；正在这个时候收到了线上告警邮件和运维同学的消息，“你们有服务挂了！”，心里一紧，立马打开电脑看来下线上cat监控大盘，发现很多服务都在报错，根据cat上的监控日志很快发现了其中一个服务内存溢出导致其他调用服务也有问题，竟然已经定位到了出问题的服务，那就简单了，没有是重启解决不了的问题，重启之后很快服务都恢复正常了。几分钟之后又报错了，同样也是这个服务内存溢出，经过排查后发现该服务的堆内存被改小了，好家伙，运维同学不讲武德，搞偷袭，趁我没反应过来调了内存，内存调整回去之后服务就恢复了正常。</p><p>事后把线上的快照文件拖了下来分析，发现本身这个项目的代码也有些问题，本文就整理了一下JVM常用的分析工具。</p><h2 id="命令行工具" tabindex="-1">命令行工具 <a class="header-anchor" href="#命令行工具" aria-label="Permalink to &quot;命令行工具&quot;">​</a></h2><p>在安装完JDK之后在JAVA_HOME/bin目录下JDK已经提供了很多命令行的工具</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/1921805616-5ff98132e67e9_articlex" alt=""></p><p>可能我们最常用的就是<code>java</code>、<code>javac</code>这两个命令，除了这两个命令之外还有提供很多其他的实用工具，本文主要来一起学习对JVM监控诊断工具</p><h4 id="虚拟机进程状况工具-jps" tabindex="-1">虚拟机进程状况工具（jps） <a class="header-anchor" href="#虚拟机进程状况工具-jps" aria-label="Permalink to &quot;虚拟机进程状况工具（jps）&quot;">​</a></h4><p>该工具的功能比较单一，与linux中的ps功能类似，用来列出正在运行的虚拟机进程，并显示出运行的主类和进程号</p><p>命令格式：<code>jps [option] [hostid]</code></p><blockquote><p>如果需要查看远程机器的jvm进程需要填写<code>hostid</code>，并且需要使用RMI，比如：<code>rmi://192.168.2.128:12345</code></p></blockquote><p>常用的选项：</p><ul><li><code>-q</code> : 只显示出虚拟机的进程id（lvmid），省略主类名</li><li><code>-m</code> : 输出启动时传递给主类的参数</li><li><code>-l</code> : 显示出主类的全名，包括jar包路径</li><li><code>-v</code> : 输出虚拟机进程启动时的JVM参数</li></ul><p><img src="https://raw.githubusercontent.com/silently9527/images/main/2909510064-5ff983209a1d2_articlex" alt=""></p><h4 id="虚拟机统计信息监控工具-jstat" tabindex="-1">虚拟机统计信息监控工具（jstat） <a class="header-anchor" href="#虚拟机统计信息监控工具-jstat" aria-label="Permalink to &quot;虚拟机统计信息监控工具（jstat）&quot;">​</a></h4><p>用于监控虚拟机运行状态信息的命令行工具，可以提供内存，垃圾收集等云行时的数据</p><p>命令格式：<code>jstat [option vmid] [interval [s|ms] [count]]</code></p><p>interval表示间隔多久时间查询一次，count表示查询多少次，比如：每个两秒查询一次进程52412的垃圾收集情况，共查询5次</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>jstat -gc 52412 2s 5</span></span></code></pre></div><p><img src="https://raw.githubusercontent.com/silently9527/images/main/3357602985-5ff988b3e88d9_articlex" alt=""></p><p>常用的选项：</p><ul><li><code>-class</code>: 监控类装载，卸载次数和总空间以及加载类的耗时</li><li><code>-gc</code>: 监控java堆的情况</li><li><code>-gcutil</code>: 主要输出各个空间使用的百分比</li><li><code>-gcnew</code>: 主要是监控新生代的GC状况</li><li><code>-gcold</code>: 监控老年代的GC状况</li><li><code>-compiler</code>: 输出JIT编译器编译过的方法和耗时信息</li></ul><p>查看堆空间的使用百分比: <code>jstat -gcutil 52412 2s 5</code></p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/2486125884-5ff98c0ae7508_articlex" alt=""></p><h4 id="java配置信息工具-jinfo" tabindex="-1">java配置信息工具（jinfo） <a class="header-anchor" href="#java配置信息工具-jinfo" aria-label="Permalink to &quot;java配置信息工具（jinfo）&quot;">​</a></h4><p>可以通过<code>jinfo</code>实时的查看和调整虚拟机的各项参数；可以通过<code>jps -v</code>查看虚拟机启动时候指定的参数信息，如果需要查看未显示指定的参数默认值也可以通过<code>jinfo -flag</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>jinfo -flag CMSInitiatingOccupancyFraction 52412</span></span></code></pre></div><p><img src="https://raw.githubusercontent.com/silently9527/images/main/3247812341-5ff98ecabf29b_articlex" alt=""></p><p>jinfo除了可以查看参数以外，还可以在运行时修改一些允许被修改的参数</p><h4 id="java内存映像工具-jmap" tabindex="-1">Java内存映像工具（jmap） <a class="header-anchor" href="#java内存映像工具-jmap" aria-label="Permalink to &quot;Java内存映像工具（jmap）&quot;">​</a></h4><p>jmap用于生成JVM堆的快照文件，除了使用jmap工具，我们通常也会在配置JVM的启动参数 <code>-XX:+HeapDumpOnOutOfMemoryError</code> 让JVM在发送内存溢出之后自动生成dump文件。</p><p>命令格式：<code>jmap [option] vmid</code></p><p>比如生成java堆的快照文件</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>jmap -dump:live,format=b,file=/Users/huaan9527/Desktop/heap.hprof 59950</span></span></code></pre></div><p>常用的选项：</p><ul><li><code>-F</code>: 当虚拟机对-dump选项没有响应时可用选择使用这个参数强制生成快照</li><li><code>-histo</code>: 显示出堆中对象统计信息。</li></ul><h4 id="堆栈跟踪工具-jstack" tabindex="-1">堆栈跟踪工具（jstack） <a class="header-anchor" href="#堆栈跟踪工具-jstack" aria-label="Permalink to &quot;堆栈跟踪工具（jstack）&quot;">​</a></h4><p>用于生成JVM当前线程的快照信息。通常用于查询什么原因导致线程长时间的停顿，比如：线程死循环，死锁，等待网络/IO</p><p>命令格式：<code>jstack [option] vmid</code></p><p>常用的选项：</p><ul><li><code>-F</code>: 当请求不被响应时强制输出</li><li><code>-l</code>: 除了显示堆栈外，还需要显示锁的信息</li><li><code>-m</code>: 如果调用到本地方法，显示出C/C++的堆栈</li></ul><h2 id="visualvm-可视化工具" tabindex="-1">VisualVM 可视化工具 <a class="header-anchor" href="#visualvm-可视化工具" aria-label="Permalink to &quot;VisualVM 可视化工具&quot;">​</a></h2><p>VisualVM是目前JDK自带的功能最强的运行监视和故障处理程序，在VisualVM之前，JDK也提供了一款可视化工具JConsole，由于JConsole的所有功能在VisualVM都有，所以可视化工具大家几乎都选择使用VisualVM。</p><p>VisualVM本身是基于Netbean开发的，所以具备了插件扩展功能，安装插件之后上面介绍的所有命令行的工具的功能都可以在VisualVM中使用。可以在在JAVA_HOME/bin目录下执行<code>jvisualvm</code>启动。</p><ul><li>插件安装 默认情况VisualVM提供的功能很少，需要我们在菜单栏-&gt;工具-&gt;插件里面安装插件，我这是全部插件都安装了</li></ul><p><img src="https://raw.githubusercontent.com/silently9527/images/main/2457906903-5ff9b307c095d_articlex" alt=""></p><h3 id="功能演示" tabindex="-1">功能演示 <a class="header-anchor" href="#功能演示" aria-label="Permalink to &quot;功能演示&quot;">​</a></h3><ul><li>应用程序、概述、监视</li></ul><p><img src="https://raw.githubusercontent.com/silently9527/images/main/3062129011-5ff9b5fbaaa2e_articlex" alt=""></p><p>显示出当前本机所有的JVM进程，这里显示的内容和前面说的命令行<code>jps</code>显示的内容一样</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/189450313-5ff9b67e66599_articlex" alt=""></p><p>当前虚拟机启动信息的展示，比如：JVM启动参数、系统参数</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/3196895080-5ff9b74a64a05_articlex" alt=""></p><p>这个页面相当于命令jstat的功能，显示出了CPU, 内存，线程，类装载当前处于什么情况</p><p>生成dump文件可以在应用程序窗口右键菜单中选择，也可以在这个页面点击右上角的<code>堆dump</code></p><ul><li>Visual GC 此页主要展示了GC相关的信息，这是在性能调优时常用的页面之一</li></ul><p><img src="https://raw.githubusercontent.com/silently9527/images/main/19093410-5ff9bc393bfa4_articlex" alt=""></p><p>我们可以写个程序来观看下这个截图各个内存区域的变化情况，为了让图的效果明显需要修改JVM的启动参数</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-Xmx100m -Xms100m -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/Users/huaan9527/Desktop</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    List&lt;DataTest&gt; datas = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    IntStream.range(0, 10000).forEach(index -&gt; {</span></span>
<span class="line"><span>        datas.add(new DataTest());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            Thread.sleep(50);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    System.gc();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static class DataTest {</span></span>
<span class="line"><span>    byte[] bytes = new byte[1024];</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="https://raw.githubusercontent.com/silently9527/images/main/2920321350-5ffa69dc242b1_articlex" alt=""></p><ul><li>线程 本页的功能相当于命令行工具<code>jstack</code>，主要是用于检查什么原因导致线程长时间等待，我们写程序来演示下等待外部资源、锁等待、死循环这几种请求</li></ul><p><strong>等待外部资源</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) throws IOException {</span></span>
<span class="line"><span>    BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));</span></span>
<span class="line"><span>    System.out.println(reader.readLine());</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        Thread.sleep(1000000);</span></span>
<span class="line"><span>    } catch (InterruptedException e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>选中main线程，右侧会看到当前线程运行到了readBytes，等待键盘输入</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/1280102571-5ffa6c4037c12_articlex" alt=""></p><p>当我们在控制台输入之后再次查看main线程的状态，此时进入了TIME_WAIT状态</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/3185550591-5ffa6d2baec4b_articlex" alt=""></p><p><strong>锁等待</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) throws IOException, InterruptedException {</span></span>
<span class="line"><span>    Thread thread = createLockThread(new Object());</span></span>
<span class="line"><span>    thread.join();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public static Thread createLockThread(final Object lock) {</span></span>
<span class="line"><span>    Thread lockThread = new Thread(() -&gt; {</span></span>
<span class="line"><span>        synchronized (lock) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                lock.wait();</span></span>
<span class="line"><span>            } catch (InterruptedException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }, &quot;lockThread&quot;);</span></span>
<span class="line"><span>    lockThread.start();</span></span>
<span class="line"><span>    return lockThread;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="https://raw.githubusercontent.com/silently9527/images/main/3433413024-5ffa71ef869c2_articlex" alt=""></p><p>lockThread线程在等待lock对象的notify方法被调用，此时处于WAITING状态，在被唤醒之前是不会再分配执行时间</p><p><strong>死循环</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) throws IOException, InterruptedException {</span></span>
<span class="line"><span>    while (true) ;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="https://raw.githubusercontent.com/silently9527/images/main/3596376279-5ffa742eb325a_articlex" alt=""></p><p>线程一直处于运行状态，从堆栈追踪里可以看出代码一直停留在了191行，在空循环上用尽分配的执行时间</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>本篇介绍了命令行工具和可视化工具，下篇实战演示下如何通过这些工具对Idea运行速度调优</p>`,78),i=[t];function l(c,o,r,d,h,u){return n(),s("div",null,i)}const b=a(p,[["render",l]]);export{g as __pageData,b as default};
