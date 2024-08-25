import{_ as s,c as n,o as a,aa as p}from"./chunks/framework.DtK4gh9F.js";const b=JSON.parse('{"title":"02 老哥不来复习下数据结构吗","description":"","frontmatter":{"title":"02 老哥不来复习下数据结构吗","author":"Herman","updateTime":"2024-07-16 21:34","desc":"老哥确定不来复习下数据结构吗","categories":"算法","tags":"数据结构/堆栈","outline":"deep"},"headers":[],"relativePath":"Notes/No2TechColumn/04 Algorithms/02 老哥确定不来复习下数据结构吗.md","filePath":"Notes/No2TechColumn/04 Algorithms/02 老哥确定不来复习下数据结构吗.md","lastUpdated":1724593073000}'),e={name:"Notes/No2TechColumn/04 Algorithms/02 老哥确定不来复习下数据结构吗.md"},l=p(`<h1 id="老哥确定不来复习下数据结构吗" tabindex="-1">老哥确定不来复习下数据结构吗 <a class="header-anchor" href="#老哥确定不来复习下数据结构吗" aria-label="Permalink to &quot;老哥确定不来复习下数据结构吗&quot;">​</a></h1><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>在上一次《面试篇》Http协议中，面试官原本想的是http问的差不多了，想要继续问我JAVA相关的一些问题，结果我突然觉得嗓子不舒服咳嗽了几声，（在这个敏感的时候）吓退了面试官，面试官带起口罩后就说面试先暂时到这里，下次再聊；两周之后我又收到了HR的电话；</p><p>HR：感冒好了吗？上次面试的结果不错，你什么时候有时间来我们公司二面呢？</p><p>我：随时准备着</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/75ef6ed9673a4a3388c6934eeb2c0715%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>到公司后，我依然被带到了那个小黑屋，等待着面试官的到来。没想等来的是一位美女小姐姐。</p><p>我：人美声甜的小姐姐，你是本次的面试官？（我窃喜中）</p><p>美女面试官：是的，上次面试你的面试官开会去了，这次面试我来和你聊聊</p><h4 id="面试官-看你这么会说话-让我先来帮你开个胃-说说二分查找吧" tabindex="-1">面试官：看你这么会说话，让我先来帮你开个胃，说说二分查找吧 <a class="header-anchor" href="#面试官-看你这么会说话-让我先来帮你开个胃-说说二分查找吧" aria-label="Permalink to &quot;面试官：看你这么会说话，让我先来帮你开个胃，说说二分查找吧&quot;">​</a></h4><p>我：（果然是开胃啊，这位小姐姐竟然如此善良）</p><p>我：二分查找法是在一个有序的数组中查到一个值，如果存在就返回在数组中的索引，否则就返回-1；算法维护了两个变量lo(最小)和hi(最大)，每次查找都与中间值(mid)进行比较，如果等于就返回mid，大于就查询右半边的数组，小于就查询左半边数组。二分查找法之所以快是因为每次一次查询都会排除掉一半的值。</p><blockquote><p>No BB, show you the code（不废话，直接看代码）</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class BinarySearch {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 二分查找</span></span>
<span class="line"><span>     * @param key</span></span>
<span class="line"><span>     * @param arr</span></span>
<span class="line"><span>     * @return 存在返回对应的下标，不存在返回 -1</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static int search(int key, int[] arr) {</span></span>
<span class="line"><span>        int lo = 0, hi = arr.length - 1;</span></span>
<span class="line"><span>        while (lo &lt;= hi) {</span></span>
<span class="line"><span>            int mid = lo + (hi - lo) / 2;</span></span>
<span class="line"><span>            if (key &gt; arr[mid]) {</span></span>
<span class="line"><span>                lo = mid + 1;</span></span>
<span class="line"><span>            } else if (key &lt; arr[mid]) {</span></span>
<span class="line"><span>                hi = mid - 1;</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                return mid;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>对于一个包含n个元素的列表，用二分查找法最多需要log2n（前面的2是底数）次就可以判断出元素是否存在；所以二分查找法的时间复杂度是<code>O(log n)</code></strong></p><h4 id="面试官-说说使用数组如何实现栈" tabindex="-1">面试官：说说使用数组如何实现栈？ <a class="header-anchor" href="#面试官-说说使用数组如何实现栈" aria-label="Permalink to &quot;面试官：说说使用数组如何实现栈？&quot;">​</a></h4><p>我：小姐姐，栈的特点就是后进先出，使用数组和链表都可以实现栈的功能，首先看下栈的定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Stack&lt;T&gt; extends Iterable {</span></span>
<span class="line"><span>    void push(T item); //向栈添加元素</span></span>
<span class="line"><span>    T pop(); //从栈中弹出</span></span>
<span class="line"><span>    boolean isEmpty();</span></span>
<span class="line"><span>    int size(); //返回元素的个数</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>栈在使用的时候有可能也会遍历全部的元素，所以继承了<code>Iterable</code>，使用数组实现栈的完整代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class FixCapacityArrayStack&lt;T&gt; implements Stack&lt;T&gt; {</span></span>
<span class="line"><span>    private T[] arr;</span></span>
<span class="line"><span>    private int size;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public FixCapacityArrayStack(int capacity) {</span></span>
<span class="line"><span>        this.arr = (T[]) new Object[capacity]; //初始化数组大小</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void push(T item) {</span></span>
<span class="line"><span>        this.arr[size++] = item;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public T pop() {</span></span>
<span class="line"><span>        return this.arr[--size];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean isEmpty() {</span></span>
<span class="line"><span>        return size == 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int size() {</span></span>
<span class="line"><span>        return this.size;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Iterator&lt;T&gt; iterator() {</span></span>
<span class="line"><span>        return new Iterator&lt;T&gt;() {</span></span>
<span class="line"><span>            int index;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public boolean hasNext() {</span></span>
<span class="line"><span>                return index &lt; size;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public T next() {</span></span>
<span class="line"><span>                return arr[index++];</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        };</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="面试官-你刚才实现的栈是定容的-那如何实现动态调整栈的大小" tabindex="-1">面试官：你刚才实现的栈是定容的，那如何实现动态调整栈的大小 <a class="header-anchor" href="#面试官-你刚才实现的栈是定容的-那如何实现动态调整栈的大小" aria-label="Permalink to &quot;面试官：你刚才实现的栈是定容的，那如何实现动态调整栈的大小&quot;">​</a></h4><p>我：（已猜到你会问这个问题了，刚才故意没说动态调整大小；经过多年的面试经验总结，最和谐的面试过程就是与面试官<code>你推我挡</code>，一上来就说出了最优解，如何体现面试官的优越感？）</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/67002370a964460bb4d6dd2814df3ad8%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>我：要实现动态的调整大小，首先需要在提供一个 resize 的方法，把数组扩容到指定的大小并拷贝原来的数据到新的数组中；</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void resize(int newCapacity) {</span></span>
<span class="line"><span>    Object[] tmp = new Object[newCapacity];</span></span>
<span class="line"><span>    for (int index = 0; index &lt; size; index++) {</span></span>
<span class="line"><span>        tmp[index] = arr[index];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.arr = (T[]) tmp;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>需要<code>push</code>方法中检查当前的size是否已经达到了数组的最大容量，如果是，就把数组扩容2倍</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void push(T item) {</span></span>
<span class="line"><span>    if (this.arr.length == size) {</span></span>
<span class="line"><span>        this.resize(2 * this.arr.length);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.arr[size++] = item;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在<code>pop</code>方法中需要检查当前占用的空间是否是数组的四分之一，如果是，就需要把数据的容量缩小到原来的一半</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public T pop() {</span></span>
<span class="line"><span>    T item = this.arr[--size];</span></span>
<span class="line"><span>    this.arr[size] = null;  //避免游离对象，让垃圾回收器回收无用对象</span></span>
<span class="line"><span>    if (size &gt; 0 &amp;&amp; size == this.arr.length / 4) {</span></span>
<span class="line"><span>        this.resize(this.arr.length / 2);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return item;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="面试官-刚才你提到了链表-那么使用链表如何实现栈" tabindex="-1">面试官：刚才你提到了链表，那么使用链表如何实现栈 <a class="header-anchor" href="#面试官-刚才你提到了链表-那么使用链表如何实现栈" aria-label="Permalink to &quot;面试官：刚才你提到了链表，那么使用链表如何实现栈&quot;">​</a></h4><p>我：（这就是<code>你推我挡</code>的结果，和小姐姐的互动很和谐）</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/37dc3e48af4e46f0bb09b335a1e2104c%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>我：使用链表，首先需要先定义个Node，单向的链表包含了值和下一个节点的引用</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Node&lt;T&gt; {</span></span>
<span class="line"><span>    private T item;</span></span>
<span class="line"><span>    private Node next;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>采用链表实现的栈相对于数组实现还较为简单一些，不需要考虑扩容的问题。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LinkedListStack&lt;T&gt; implements Stack&lt;T&gt; {</span></span>
<span class="line"><span>    private Node&lt;T&gt; first;</span></span>
<span class="line"><span>    private int size;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void push(T item) {//先栈顶添加元素</span></span>
<span class="line"><span>        this.first = new Node&lt;&gt;(item, first);</span></span>
<span class="line"><span>        size++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public T pop() { //从栈顶删除元素</span></span>
<span class="line"><span>        T item = first.getItem();</span></span>
<span class="line"><span>        size--;</span></span>
<span class="line"><span>        first = first.getNext();</span></span>
<span class="line"><span>        return item;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean isEmpty() {</span></span>
<span class="line"><span>        return first == null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int size() {</span></span>
<span class="line"><span>        return this.size;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Iterator&lt;T&gt; iterator() {</span></span>
<span class="line"><span>        return new Iterator&lt;T&gt;() {</span></span>
<span class="line"><span>            private Node&lt;T&gt; current = first;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public boolean hasNext() {</span></span>
<span class="line"><span>                return current != null;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public T next() {</span></span>
<span class="line"><span>                T item = current.getItem();</span></span>
<span class="line"><span>                current = current.getNext();</span></span>
<span class="line"><span>                return item;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        };</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="面试官-使用链表如何实现先进先出队列" tabindex="-1">面试官：使用链表如何实现先进先出队列 <a class="header-anchor" href="#面试官-使用链表如何实现先进先出队列" aria-label="Permalink to &quot;面试官：使用链表如何实现先进先出队列&quot;">​</a></h4><p>我：与栈的实现过程类似，首先需要定义出队列</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Queue&lt;T&gt; extends Iterable {</span></span>
<span class="line"><span>    void enqueue(T item); //入队列</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    T dequeue(); //出队列</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int size();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    boolean isEmpty();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用链表实现队列需要维护两个变量first、last；first表示的是队列的头结点，last表示队列的尾结点；当入队列时<code>enqueue</code>向尾部结点添加元素，当出队列时<code>dequeue</code>从头结点删除元素。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LinkedListQueue&lt;T&gt; implements Queue&lt;T&gt; {</span></span>
<span class="line"><span>    private Node&lt;T&gt; first;</span></span>
<span class="line"><span>    private Node&lt;T&gt; last;</span></span>
<span class="line"><span>    private int size;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void enqueue(T item) {</span></span>
<span class="line"><span>        Node&lt;T&gt; node = new Node&lt;&gt;(item, null);</span></span>
<span class="line"><span>        if (isEmpty()) {</span></span>
<span class="line"><span>            first = node; //当队列为空，first和last指向同一个元素</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            last.setNext(node);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        last = node;</span></span>
<span class="line"><span>        size++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public T dequeue() {</span></span>
<span class="line"><span>        T item = first.getItem();</span></span>
<span class="line"><span>        first = first.getNext();</span></span>
<span class="line"><span>        if (isEmpty()) { //当队列为空时，需要把last设置为null</span></span>
<span class="line"><span>            last = null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        size--;</span></span>
<span class="line"><span>        return item;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int size() {</span></span>
<span class="line"><span>        return this.size;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean isEmpty() {</span></span>
<span class="line"><span>        return first == null;  //首节点为空</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Iterator&lt;T&gt; iterator() {</span></span>
<span class="line"><span>        return new Iterator&lt;T&gt;() {</span></span>
<span class="line"><span>            private Node&lt;T&gt; current = first;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public boolean hasNext() {</span></span>
<span class="line"><span>                return current != null;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public T next() {</span></span>
<span class="line"><span>                T item = current.getItem();</span></span>
<span class="line"><span>                current = current.getNext();</span></span>
<span class="line"><span>                return item;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        };</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="面试官-胃开的差不多了-来聊一点算法吧-你来设计一个算法对算术表示式求值-比如-1-2-3-4-5" tabindex="-1">面试官：胃开的差不多了，来聊一点算法吧；你来设计一个算法对算术表示式求值，比如：<code>( 1 + ( ( 2 + 3 ) * ( 4 * 5 ) ) )</code> <a class="header-anchor" href="#面试官-胃开的差不多了-来聊一点算法吧-你来设计一个算法对算术表示式求值-比如-1-2-3-4-5" aria-label="Permalink to &quot;面试官：胃开的差不多了，来聊一点算法吧；你来设计一个算法对算术表示式求值，比如：\`( 1 + ( ( 2 + 3 ) * ( 4 * 5 ) ) )\`&quot;">​</a></h4><p>我：（昨天晚上熬夜看算法没白辛苦啊，刚好看到了这个解法。）</p><p>我：（挠挠头），这个问题有点麻烦，我需要思考一会。(这样显得我是没有提前准备的，属于临场发挥)</p><p>我：定义两个栈，一个用于保存运算符，一个用户保存操作数；具体的操作过程如下：</p><ul><li>忽略左边括号</li><li>遇到数字就压入操作数栈</li><li>遇到符号就压入符号栈</li><li>遇到右括号，弹出一个运算符，弹出所需要的操作数，将计算的结果再次压入到操作数栈</li></ul><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/8f2ff41a51bf41128f0c11239a10d8d2%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static int calculate(String expression) {</span></span>
<span class="line"><span>    Stack&lt;String&gt; operate = new LinkedListStack&lt;&gt;();</span></span>
<span class="line"><span>    Stack&lt;Integer&gt; numbers = new LinkedListStack&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String[] split = expression.split(&quot; &quot;);</span></span>
<span class="line"><span>    for (String str : split) {</span></span>
<span class="line"><span>        if (&quot;(&quot;.equals(str)) {</span></span>
<span class="line"><span>        } else if (&quot;+&quot;.equals(str) || &quot;-&quot;.equals(str) || &quot;*&quot;.equals(str) || &quot;/&quot;.equals(str)) {</span></span>
<span class="line"><span>            operate.push(str);</span></span>
<span class="line"><span>        } else if (&quot;)&quot;.equals(str)) {</span></span>
<span class="line"><span>            String op = operate.pop();</span></span>
<span class="line"><span>            int resut = 0;</span></span>
<span class="line"><span>            if (&quot;+&quot;.equals(op)) {</span></span>
<span class="line"><span>                resut = numbers.pop() + numbers.pop();</span></span>
<span class="line"><span>            } else if (&quot;-&quot;.equals(op)) {</span></span>
<span class="line"><span>                resut = numbers.pop() - numbers.pop();</span></span>
<span class="line"><span>            } else if (&quot;*&quot;.equals(op)) {</span></span>
<span class="line"><span>                resut = numbers.pop() * numbers.pop();</span></span>
<span class="line"><span>            } else if (&quot;/&quot;.equals(op)) {</span></span>
<span class="line"><span>                resut = numbers.pop() / numbers.pop();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            numbers.push(resut);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            numbers.push(Integer.valueOf(str));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return numbers.pop();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="面试官-一个int类型的数组-其中存在三个数字相加等于0-你来设计个算法帮我统计出有多少组这样的数字" tabindex="-1">面试官：一个int类型的数组，其中存在三个数字相加等于0，你来设计个算法帮我统计出有多少组这样的数字 <a class="header-anchor" href="#面试官-一个int类型的数组-其中存在三个数字相加等于0-你来设计个算法帮我统计出有多少组这样的数字" aria-label="Permalink to &quot;面试官：一个int类型的数组，其中存在三个数字相加等于0，你来设计个算法帮我统计出有多少组这样的数字&quot;">​</a></h4><p>我：这个简单，请看代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static int count1(int[] arr) {</span></span>
<span class="line"><span>    int length = arr.length;</span></span>
<span class="line"><span>    int count = 0;</span></span>
<span class="line"><span>    for (int i = 0; i &lt; length; i++) {</span></span>
<span class="line"><span>        for (int j = i + 1; j &lt; length; j++) {</span></span>
<span class="line"><span>            for (int k = j + 1; k &lt; length; k++) {</span></span>
<span class="line"><span>                if (arr[i] + arr[j] + arr[k] == 0) {</span></span>
<span class="line"><span>                    count++;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return count;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="面试官-假如这个数组有100万的int值-你这个算法得运行到什么时候" tabindex="-1">面试官：假如这个数组有100万的int值，你这个算法得运行到什么时候 <a class="header-anchor" href="#面试官-假如这个数组有100万的int值-你这个算法得运行到什么时候" aria-label="Permalink to &quot;面试官：假如这个数组有100万的int值，你这个算法得运行到什么时候&quot;">​</a></h4><p>我：（对的哦，这个算法的时间复杂度是O(n³)，在遇到数据量较大时效率极低）</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/144333dcdc8f4a45ac92198bb256e391%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>（经过大脑快速思考后）</p><p>我：这个算法确实有问题，我大意了，没有考虑到大量数据的情况；用这个算法会浪费小姐姐的大好青春，所以刚才我思考了下，对这个算法进行改进一下；</p><p>首先把<code>3-sum</code>简化成<code>2-sum</code>。</p><p>在<code>2-sum</code>中，一个数a[i]要与另一个数相加等于0；有两种方法：</p><p>第一种：与3-sum实现类似使用两层循环，时间复杂度是O(n²)</p><p>第二种：只需要找出数组中是否有-a[i]，查找的算法使用二分查找法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static int count2(int[] arr) {</span></span>
<span class="line"><span>    Arrays.sort(arr); //首先排序</span></span>
<span class="line"><span>    int length = arr.length;</span></span>
<span class="line"><span>    int count = 0;</span></span>
<span class="line"><span>    for (int i = 0; i &lt; length; i++) {</span></span>
<span class="line"><span>        if (BinarySearch.search(-arr[i], arr) &gt; i) {</span></span>
<span class="line"><span>            count++;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return count;</span></span>
<span class="line"><span>}</span></span></code></pre></div><blockquote><p>二分查找法的时间复杂度是O(log n), 实现<code>2-sum</code>的算法多了一层循环，所以时间复杂度O(nlog n)</p></blockquote><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/556f56178db44b33a648980fc20c6834%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>对待<code>3-sum</code>也是用类似的方法，直接上机撸代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static int count3(int[] arr) {</span></span>
<span class="line"><span>    Arrays.sort(arr);</span></span>
<span class="line"><span>    int length = arr.length;</span></span>
<span class="line"><span>    int count = 0;</span></span>
<span class="line"><span>    for (int i = 0; i &lt; length; i++) {</span></span>
<span class="line"><span>        for (int j = i + 1; j &lt; length; j++) {</span></span>
<span class="line"><span>            if (BinarySearch.search(-arr[i]-arr[j], arr) &gt; j) {</span></span>
<span class="line"><span>                count++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return count;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我：小姐姐，这个算法改进之后的时间复杂度是O(n²log n)，我已经尽力了，只能这么快了。（面试官露出迷人的微笑）</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/c5a981e7af6d4a3a85cfb605b8945c63%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><h4 id="面试官-假如你是微信的开发人员-随便给你两个用户-如何判断这两个用户是否连通的。何为连通-a是b的好友-b是c的好友-那么a与c就是连通的" tabindex="-1">面试官：假如你是微信的开发人员，随便给你两个用户，如何判断这两个用户是否连通的。何为连通？A是B的好友，B是C的好友，那么A与C就是连通的 <a class="header-anchor" href="#面试官-假如你是微信的开发人员-随便给你两个用户-如何判断这两个用户是否连通的。何为连通-a是b的好友-b是c的好友-那么a与c就是连通的" aria-label="Permalink to &quot;面试官：假如你是微信的开发人员，随便给你两个用户，如何判断这两个用户是否连通的。何为连通？A是B的好友，B是C的好友，那么A与C就是连通的&quot;">​</a></h4><p>我：（这小姐姐的问题是越来越难了）</p><p>我：美丽的面试官，今天烧脑严重，我可以趴下休息一会吗？（其实是没想到好的解法，拖延时间战术）</p><p>面试官：可以，那你先休息10分钟。</p><p><strong>面试未完，待续</strong></p>`,72),i=[l];function t(c,r,o,d,u,h){return a(),n("div",null,i)}const m=s(e,[["render",t]]);export{b as __pageData,m as default};
