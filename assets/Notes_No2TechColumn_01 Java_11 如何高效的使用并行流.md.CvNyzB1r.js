import{_ as s,c as a,o as n,aa as p}from"./chunks/framework.DlhgB44u.js";const g=JSON.parse('{"title":"11 如何高效的使用并行流","description":"","frontmatter":{"title":"11 如何高效的使用并行流","author":"Herman","updateTime":"2021-08-14 13:41","desc":"如何高效的使用并行流","categories":"Java","tags":"Java8新特性/多线程","outline":"deep"},"headers":[],"relativePath":"Notes/No2TechColumn/01 Java/11 如何高效的使用并行流.md","filePath":"Notes/No2TechColumn/01 Java/11 如何高效的使用并行流.md","lastUpdated":1724595807000}'),e={name:"Notes/No2TechColumn/01 Java/11 如何高效的使用并行流.md"},l=p(`<p>在Java7之前想要并行处理大量数据是很困难的，首先把数据拆分成很多个部分，然后把这这些子部分放入到每个线程中去执行计算逻辑，最后在把每个线程返回的计算结果进行合并操作；在Java7中提供了一个处理大数据的fork/join框架，屏蔽掉了线程之间交互的处理，更加专注于数据的处理。</p><hr><h4 id="fork-join框架" tabindex="-1">Fork/Join框架 <a class="header-anchor" href="#fork-join框架" aria-label="Permalink to &quot;Fork/Join框架&quot;">​</a></h4><p>Fork/Join框架采用的是思想就是分而治之，把大的任务拆分成小的任务，然后放入到独立的线程中去计算，同时为了最大限度的利用多核CPU，采用了一个种<code>工作窃取</code>的算法来运行任务，也就是说当某个线程处理完自己工作队列中的任务后，尝试当其他线程的工作队列中窃取一个任务来执行，直到所有任务处理完毕。所以为了减少线程之间的竞争，通常会使用双端队列，被窃取任务线程永远从双端队列的头部拿任务执行，而窃取任务的线程永远从双端队列的尾部拿任务执行；在百度找了一张图</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/1491165985-5fc1b9ba8ea44_articlex" alt=""></p><ul><li>使用<code>RecursiveTask</code> 使用Fork/Join框架首先需要创建自己的任务，需要继承<code>RecursiveTask</code>，实现抽象方法</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected abstract V compute();</span></span></code></pre></div><p>实现类需要在该方法中实现任务的拆分，计算，合并；伪代码可以表示成这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if(任务已经不可拆分){</span></span>
<span class="line"><span>    return 顺序计算结果;</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>    1.任务拆分成两个子任务</span></span>
<span class="line"><span>    2.递归调用本方法，拆分子任务</span></span>
<span class="line"><span>    3.等待子任务执行完成</span></span>
<span class="line"><span>    4.合并子任务的结果</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>Fork/Join实战</li></ul><p>任务：完成对一亿个自然数求和</p><p>我们先使用串行的方式实现，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>long result = LongStream.rangeClosed(1, 100000000)</span></span>
<span class="line"><span>                .reduce(0, Long::sum);</span></span>
<span class="line"><span>System.out.println(&quot;result：&quot; + result);</span></span></code></pre></div><p>使用Fork/Join框架实现，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class SumRecursiveTask extends RecursiveTask&lt;Long&gt; {</span></span>
<span class="line"><span>    private long[] numbers;</span></span>
<span class="line"><span>    private int start;</span></span>
<span class="line"><span>    private int end;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public SumRecursiveTask(long[] numbers) {</span></span>
<span class="line"><span>        this.numbers = numbers;</span></span>
<span class="line"><span>        this.start = 0;</span></span>
<span class="line"><span>        this.end = numbers.length;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public SumRecursiveTask(long[] numbers, int start, int end) {</span></span>
<span class="line"><span>        this.numbers = numbers;</span></span>
<span class="line"><span>        this.start = start;</span></span>
<span class="line"><span>        this.end = end;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected Long compute() {</span></span>
<span class="line"><span>        int length = end - start;</span></span>
<span class="line"><span>        if (length &lt; 20000) {  //小于20000个就不在进行拆分</span></span>
<span class="line"><span>            return sum();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        SumRecursiveTask leftTask = new SumRecursiveTask(numbers, start, start + length / 2); //进行任务拆分</span></span>
<span class="line"><span>        SumRecursiveTask rightTask = new SumRecursiveTask(numbers, start + (length / 2), end); //进行任务拆分</span></span>
<span class="line"><span>        leftTask.fork(); //把该子任务交友ForkJoinPoll线程池去执行</span></span>
<span class="line"><span>        rightTask.fork(); //把该子任务交友ForkJoinPoll线程池去执行</span></span>
<span class="line"><span>        return leftTask.join() + rightTask.join(); //把子任务的结果相加</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private long sum() {</span></span>
<span class="line"><span>        int sum = 0;</span></span>
<span class="line"><span>        for (int i = start; i &lt; end; i++) {</span></span>
<span class="line"><span>            sum += numbers[i];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return sum;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        long[] numbers = LongStream.rangeClosed(1, 100000000).toArray();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Long result = new ForkJoinPool().invoke(new SumRecursiveTask(numbers));</span></span>
<span class="line"><span>        System.out.println(&quot;result：&quot; +result);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><blockquote><p>Fork/Join默认的线程数量就是你的处理器数量，这个值是由<code>Runtime.getRuntime().available- Processors()</code>得到的。 但是你可以通过系统属性<code>java.util.concurrent.ForkJoinPool.common. parallelism</code>来改变线程池大小，如下所示： <code>System.setProperty(&quot;java.util.concurrent.ForkJoinPool.common.parallelism&quot;,&quot;12&quot;);</code> 这是一个全局设置，因此它将影响代码中所有的并行流。目前还无法专为某个 并行流指定这个值。因为会影响到所有的并行流，所以在任务中经历避免网络/IO操作，否则可能会拖慢其他并行流的运行速度</p></blockquote><hr><h4 id="parallelstream" tabindex="-1">parallelStream <a class="header-anchor" href="#parallelstream" aria-label="Permalink to &quot;parallelStream&quot;">​</a></h4><p>以上我们说到的都是在Java7中使用并行流的操作，Java8并没有止步于此，为我们提供更加便利的方式，那就是<code>parallelStream</code>；<code>parallelStream</code>底层还是通过Fork/Join框架来实现的。</p><ul><li>常见的使用方式 1.串行流转化成并行流</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>LongStream.rangeClosed(1,1000)</span></span>
<span class="line"><span>                .parallel()</span></span>
<span class="line"><span>                .forEach(System.out::println);</span></span></code></pre></div><p>2.直接生成并行流</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> List&lt;Integer&gt; values = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>        for (int i = 0; i &lt; 10000; i++) {</span></span>
<span class="line"><span>            values.add(i);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        values.parallelStream()</span></span>
<span class="line"><span>                .forEach(System.out::println);</span></span></code></pre></div><ul><li>正确的使用parallelStream</li></ul><p>我们使用<code>parallelStream</code>来实现上面的累加例子看看效果，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    Summer summer = new Summer();</span></span>
<span class="line"><span>    LongStream.rangeClosed(1, 100000000)</span></span>
<span class="line"><span>            .parallel()</span></span>
<span class="line"><span>            .forEach(summer::add);</span></span>
<span class="line"><span>    System.out.println(&quot;result：&quot; + summer.sum);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static class Summer {</span></span>
<span class="line"><span>    public long sum = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void add(long value) {</span></span>
<span class="line"><span>        sum += value;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果如下：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/2932651169-5fc2019b12d96_articlex" alt=""></p><p>运行之后，我们发现运行的结果不正确，并且每次运行的结果都不一样，这是为什么呢？ 这里其实就是错用<code>parallelStream</code>常见的情况，<code>parallelStream</code>是非线程安全的，在这个里面中使用多个线程去修改了共享变量sum, 执行了<code>sum += value</code>操作，这个操作本身是非原子性的，所以在使用并行流时应该避免去修改共享变量。</p><p>修改上面的例子，正确使用<code>parallelStream</code>来实现，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>long result = LongStream.rangeClosed(1, 100000000)</span></span>
<span class="line"><span>        .parallel()</span></span>
<span class="line"><span>        .reduce(0, Long::sum);</span></span>
<span class="line"><span>System.out.println(&quot;result：&quot; + result);</span></span></code></pre></div><p>在前面我们已经说过了fork/join的操作流程是：拆子部分，计算，合并结果；因为<code>parallelStream</code>底层使用的也是fork/join框架，所以这些步骤也是需要做的，但是从上面的代码，我们看到<code>Long::sum</code>做了计算，<code>reduce</code>做了合并结果，我们并没有去做任务的拆分，所以这个过程肯定是<code>parallelStream</code>已经帮我们实现了，这个时候就必须的说说<code>Spliterator</code></p><p><code>Spliterator</code>是Java8加入的新接口，是为了并行执行任务而设计的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Spliterator&lt;T&gt; {</span></span>
<span class="line"><span>    boolean tryAdvance(Consumer&lt;? super T&gt; action);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Spliterator&lt;T&gt; trySplit();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    long estimateSize();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int characteristics();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>tryAdvance: 遍历所有的元素，如果还有可以遍历的就返回ture，否则返回false</p><p>trySplit: 对所有的元素进行拆分成小的子部分，如果已经不能拆分就返回null</p><p>estimateSize: 当前拆分里面还剩余多少个元素</p><p>characteristics: 返回当前Spliterator特性集的编码</p><hr><h4 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h4><ol><li>要证明并行处理比顺序处理效率高，只能通过测试，不能靠猜测（本文累加的例子在多台电脑上运行了多次，也并不能证明采用并行来处理累加就一定比串行的快多少，所以只能通过多测试，环境不同可能结果就会不同）</li><li>数据量较少，并且计算逻辑简单，通常不建议使用并行流</li><li>需要考虑流的操作时间消耗</li><li>在有些情况下需要自己去实现拆分的逻辑，并行流才能高效</li></ol><hr><blockquote><p>感谢大家可以耐心地读到这里。 当然，文中或许会存在或多或少的不足、错误之处，有建议或者意见也非常欢迎大家在评论交流。 最后，希望朋友们可以点赞评论关注三连，因为这些就是我分享的全部动力来源🙏</p></blockquote>`,43),i=[l];function t(c,o,r,u,d,m){return n(),a("div",null,i)}const v=s(e,[["render",t]]);export{g as __pageData,v as default};
