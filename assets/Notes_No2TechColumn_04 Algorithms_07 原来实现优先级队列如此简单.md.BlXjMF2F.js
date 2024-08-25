import{_ as s,c as a,o as n,aa as p}from"./chunks/framework.d_Ke7vMG.js";const m=JSON.parse('{"title":"07 原来实现优先级队列如此简单","description":"","frontmatter":{"title":"07 原来实现优先级队列如此简单","author":"Herman","updateTime":"2024-07-16 21:34","desc":"原来实现优先级队列如此简单","categories":"算法","tags":"数据结构/二叉堆","outline":"deep"},"headers":[],"relativePath":"Notes/No2TechColumn/04 Algorithms/07 原来实现优先级队列如此简单.md","filePath":"Notes/No2TechColumn/04 Algorithms/07 原来实现优先级队列如此简单.md","lastUpdated":1724593073000}'),e={name:"Notes/No2TechColumn/04 Algorithms/07 原来实现优先级队列如此简单.md"},l=p(`<h1 id="原来实现优先级队列如此简单" tabindex="-1">原来实现优先级队列如此简单 <a class="header-anchor" href="#原来实现优先级队列如此简单" aria-label="Permalink to &quot;原来实现优先级队列如此简单&quot;">​</a></h1><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>假如你设计的事件系统中有很多的事件，每个事件都定义了不同的权重值，系统需要优先处理权重较高的事件，这里你就需要使用到优先级队列，本篇我们一起来学习实现优先级队列的常用方式</p><h2 id="队列api定义" tabindex="-1">队列API定义 <a class="header-anchor" href="#队列api定义" aria-label="Permalink to &quot;队列API定义&quot;">​</a></h2><p>在实现之前，首先我们需要先定义出优先级队的API，优先级队列是一种抽象的数据结构，我们依然可以基于前面我们使用到的队列API来修改；需要了解之前的队列的实现可以查看《面试的季节到了，老哥确定不来复习下数据结构吗》</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Queue&lt;T&gt; extends Iterable&lt;T&gt; {</span></span>
<span class="line"><span>    void enqueue(T item); //入队列</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    T dequeue(); //出队列</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int size();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    boolean isEmpty();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中的入队列<code>enqueue</code>和出队列<code>dequeue</code>是我们主要需要实现的方式，也是优先级队列的核心方法</p><h2 id="初级版本的实现" tabindex="-1">初级版本的实现 <a class="header-anchor" href="#初级版本的实现" aria-label="Permalink to &quot;初级版本的实现&quot;">​</a></h2><h4 id="队列api的抽象类" tabindex="-1">队列API的抽象类 <a class="header-anchor" href="#队列api的抽象类" aria-label="Permalink to &quot;队列API的抽象类&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class AbstractQueue&lt;T&gt; implements Queue&lt;T&gt; {</span></span>
<span class="line"><span>    private Comparator&lt;T&gt; comparator;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public AbstractQueue(Comparator&lt;T&gt; comparator) {</span></span>
<span class="line"><span>        this.comparator = comparator;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean less(T a, T b) {</span></span>
<span class="line"><span>        return comparator.compare(a, b) &lt; 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void exch(T[] array, int i, int j) {</span></span>
<span class="line"><span>        T tmp = array[i];</span></span>
<span class="line"><span>        array[i] = array[j];</span></span>
<span class="line"><span>        array[j] = tmp;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="基于无序数组实现" tabindex="-1">基于无序数组实现 <a class="header-anchor" href="#基于无序数组实现" aria-label="Permalink to &quot;基于无序数组实现&quot;">​</a></h4><p>实现优先级队列的最简单实现可以参考《面试的季节到了，老哥确定不来复习下数据结构吗》中栈的实现方式，<code>enqueue</code>和栈的<code>push</code>方式实现方式一致，<code>dequeue</code>可以参考选择排序的实现，循环一遍数组，找出最大值和数组最后一个元素交换，然后删除它；</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class DisorderPriorityQueue&lt;T&gt; extends AbstractQueue&lt;T&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private T[] queue;</span></span>
<span class="line"><span>    private int size;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public DisorderPriorityQueue(int max, Comparator&lt;T&gt; comparator) {</span></span>
<span class="line"><span>        super(comparator);</span></span>
<span class="line"><span>        this.queue = (T[]) new Object[max];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void enqueue(T item) {</span></span>
<span class="line"><span>        queue[size++] = item;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public T dequeue() {</span></span>
<span class="line"><span>        int index = 0;</span></span>
<span class="line"><span>        for (int i = 1; i &lt; size; i++) {</span></span>
<span class="line"><span>            if (less(queue[index], queue[i])) {</span></span>
<span class="line"><span>                index = i;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        size--;</span></span>
<span class="line"><span>        exch(queue, index, size);</span></span>
<span class="line"><span>        T data = queue[size];</span></span>
<span class="line"><span>        queue[size] = null;</span></span>
<span class="line"><span>        return data;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //省略其他函数</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里只实现了定长的优先级队列，如何实现自动扩容呢？也可以参考这篇文章《面试的季节到了，老哥确定不来复习下数据结构吗》；基于无序数组实现的enqueue时间复杂度是O(1)，dequeue时间复杂度是O(n)</p><h4 id="基于有序数组实现" tabindex="-1">基于有序数组实现 <a class="header-anchor" href="#基于有序数组实现" aria-label="Permalink to &quot;基于有序数组实现&quot;">​</a></h4><p>基于有序数组实现就是在入队的时候保证数组有序，那么在出队列的时候可以直接删掉最大值；插入的过程和插入排序类似的操作</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class OrderPriorityQueue&lt;T&gt; extends AbstractQueue&lt;T&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private T[] queue;</span></span>
<span class="line"><span>    private int size;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public OrderPriorityQueue(int max, Comparator&lt;T&gt; comparator) {</span></span>
<span class="line"><span>        super(comparator);</span></span>
<span class="line"><span>        this.queue = (T[]) new Object[max];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void enqueue(T item) {</span></span>
<span class="line"><span>        queue[size++] = item;</span></span>
<span class="line"><span>        for (int i = size - 1; i &gt; 1 &amp;&amp; less(queue[i], queue[i - 1]); i--) {</span></span>
<span class="line"><span>            exch(queue, i, i - 1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public T dequeue() {</span></span>
<span class="line"><span>        size--;</span></span>
<span class="line"><span>        T data = queue[size];</span></span>
<span class="line"><span>        queue[size] = null;</span></span>
<span class="line"><span>        return data;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //省略其他函数</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>enqueue时间复杂度是O(n)，dequeue时间复杂度是O(1)</p><h4 id="基于链表实现" tabindex="-1">基于链表实现 <a class="header-anchor" href="#基于链表实现" aria-label="Permalink to &quot;基于链表实现&quot;">​</a></h4><p>基于链表的实现与上面的类似，有兴趣的可以自己实现</p><blockquote><p>在《面试的季节到了，老哥确定不来复习下数据结构吗》中我们实现的栈和队列的操作都能够在常数时间内完成，但是优先级队列从上面的实现过程，我们发现初级版本的实现插入或删除最大值的操作最糟糕的情况会是线性时间。</p></blockquote><h2 id="二叉堆实现" tabindex="-1">二叉堆实现 <a class="header-anchor" href="#二叉堆实现" aria-label="Permalink to &quot;二叉堆实现&quot;">​</a></h2><h4 id="二叉堆的定义" tabindex="-1">二叉堆的定义 <a class="header-anchor" href="#二叉堆的定义" aria-label="Permalink to &quot;二叉堆的定义&quot;">​</a></h4><p>在二叉堆中，每个节点都将大于等于它的子节点，也成为堆有序；其中根节点是最大的节点。</p><p>二叉堆的表示：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/b98dc1760a6e407892ac6af85cc436d2%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>重点： 在一个二叉堆中，位置k节点的父节点的位置为<code>k/2</code>,它的两个子节点的位置为<code>2k</code>和<code>2k+1</code>; 基于这点，我们可以用数组来表示二叉堆，通过移动数组的下标来找到节点父节点和子节点</p><p>在元素进行插入和删除操作的过程中，会破坏堆有序，所以我们需要做一些操作来保证堆再次有序；主要有两种情况，当某个节点的优先级上升，我们需要<strong>由下向上恢复堆有序（下沉）</strong>；当某个节点优先级下降，我们需要<strong>由上向下恢复堆有序（上浮）</strong></p><h4 id="由上向下恢复堆有序-上浮" tabindex="-1">由上向下恢复堆有序（上浮） <a class="header-anchor" href="#由上向下恢复堆有序-上浮" aria-label="Permalink to &quot;由上向下恢复堆有序（上浮）&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void swim(int k) {</span></span>
<span class="line"><span>    while (k &gt; 0 &amp;&amp; less(queue[k / 2], queue[k])) {</span></span>
<span class="line"><span>        exch(queue, k / 2, k);</span></span>
<span class="line"><span>        k = k / 2;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>根据当前的节点k找到父节点的位置k/2，比较当前节点和父节点，如果比父节点大就交换，直到找个比当前节点大的父节点或者已上浮到了根节点</p><h4 id="由下向上恢复堆有序-下沉" tabindex="-1">由下向上恢复堆有序（下沉） <a class="header-anchor" href="#由下向上恢复堆有序-下沉" aria-label="Permalink to &quot;由下向上恢复堆有序（下沉）&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void sink(int k) {</span></span>
<span class="line"><span>    while (2 * k &lt;= size) {</span></span>
<span class="line"><span>        int i = 2 * k;</span></span>
<span class="line"><span>        if (less(queue[i], queue[i + 1])) {</span></span>
<span class="line"><span>            i++;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (less(queue[i], queue[k])) {</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        exch(queue, i, k);</span></span>
<span class="line"><span>        k = i;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="二叉堆实现优先级队列" tabindex="-1">二叉堆实现优先级队列 <a class="header-anchor" href="#二叉堆实现优先级队列" aria-label="Permalink to &quot;二叉堆实现优先级队列&quot;">​</a></h4><ul><li>入队操作：将新的元素添加到数组末尾，让新元素上浮到适合位置，增加堆的大小</li><li>出队操作：将最大的根节点删除，然后把最后一个元素放入到顶端，下层顶端元素到合适位置，减小堆大小</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class BinaryHeapPriorityQueue&lt;T&gt; extends AbstractQueue&lt;T&gt; {</span></span>
<span class="line"><span>    private T[] queue;</span></span>
<span class="line"><span>    private int size;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public BinaryHeapPriorityQueue(int max, Comparator&lt;T&gt; comparator) {</span></span>
<span class="line"><span>        super(comparator);</span></span>
<span class="line"><span>        this.queue = (T[]) new Object[max + 1];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void enqueue(T item) {</span></span>
<span class="line"><span>        this.queue[++size] = item;</span></span>
<span class="line"><span>        this.swim(size);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public T dequeue() {</span></span>
<span class="line"><span>        T max = this.queue[1];</span></span>
<span class="line"><span>        exch(this.queue, 1, size--);</span></span>
<span class="line"><span>        this.queue[size + 1] = null; //释放内存</span></span>
<span class="line"><span>        this.sink(1);</span></span>
<span class="line"><span>        return max;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>     //省略其他函数</span></span>
<span class="line"><span>}</span></span></code></pre></div><blockquote><p>注意：</p><p>由于我们为了方便计算父节点和子节点的索引位置，所以数组中的第一个位置是不会使用的；可以自己思考下使用第一个位置，那么子节点和父节点的位置应该如何计算？</p><p>基于堆的实现，入队和出队的时间复杂对都是logN，解决了初级版本实现的问题。</p><p>数组大小动态扩容和缩容依然可以参考之前栈的实现方式</p></blockquote>`,37),i=[l];function t(c,o,r,u,d,h){return n(),a("div",null,i)}const q=s(e,[["render",t]]);export{m as __pageData,q as default};
