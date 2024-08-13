import{_ as a,c as s,o as n,aa as p}from"./chunks/framework.d_Ke7vMG.js";const b=JSON.parse('{"title":"12 基于拉链式和线性探测式散列表实现Map","description":"","frontmatter":{"title":"12 基于拉链式和线性探测式散列表实现Map","author":"Herman","updateTime":"2024-07-16 21:34","desc":"基于拉链式和线性探测式散列表实现Map","categories":"算法","tags":"数据结构/线性探索式/拉链式/HashMap","outline":"deep"},"headers":[],"relativePath":"Notes/Algorithms/12 基于拉链式和线性探测式散列表实现Map.md","filePath":"Notes/Algorithms/12 基于拉链式和线性探测式散列表实现Map.md","lastUpdated":1723551387000}'),e={name:"Notes/Algorithms/12 基于拉链式和线性探测式散列表实现Map.md"},l=p(`<h1 id="基于拉链式和线性探测式散列表实现map" tabindex="-1">基于拉链式和线性探测式散列表实现Map <a class="header-anchor" href="#基于拉链式和线性探测式散列表实现map" aria-label="Permalink to &quot;基于拉链式和线性探测式散列表实现Map&quot;">​</a></h1><blockquote><p>程序员必读书单：<a href="https://github.com/silently9527/ProgrammerBooks" target="_blank" rel="noreferrer">https://github.com/silently9527/ProgrammerBooks</a> 微信公众号：贝塔学Java</p></blockquote><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>前几篇我们一起学习了基于数组、链表、二叉树、红黑树来实现Map的操作，本篇我们将会一起来学习基于散列表来实现Map，这种方式对应着java里面的HashMap，这也是使用最多的一种方式</p><p>散列表实现Map主要分为了两个步骤:</p><ol><li>基于散列函数将被查找键转换为数组的下标</li><li>处理散列值冲突的情况，有两种方式来处理冲突：拉链式和线性探测</li></ol><h2 id="散列函数" tabindex="-1">散列函数 <a class="header-anchor" href="#散列函数" aria-label="Permalink to &quot;散列函数&quot;">​</a></h2><p>实现散列表的第一步就是需要考虑如何把一个键转换为数组的下标，这时候就需要使用到散列函数，先把键值转换成一个整数然后在使用<strong>除留余数法</strong>计算出数组的下标。<strong>每种类型的键我们都需要一个不同的散列函数。</strong></p><p>在java中对于常用的数据类型已经实现了hashCode，我们只需要根据hashCode的值使用除留余数法即可转换成数组的下标</p><p>java中的约定：如果两个对象的equals相等，那么hashCode一定相同；如果hashCode相同，equals不一定相同。对于自定义类型的键我们通常需要自定义实现hashCode和equals；默认的hashCode返回的是对象的内存地址，这种散列值不会太好。</p><p>下面我来看看Java中常用类型的hashCode计算方式</p><h4 id="integer" tabindex="-1">Integer <a class="header-anchor" href="#integer" aria-label="Permalink to &quot;Integer&quot;">​</a></h4><p>由于hashCode需要返回的值就是一个int值，所以Integer的hashCode实现很简单，直接返回当前的value值</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public int hashCode() {</span></span>
<span class="line"><span>    return Integer.hashCode(value);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public static int hashCode(int value) {</span></span>
<span class="line"><span>    return value;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="long" tabindex="-1">Long <a class="header-anchor" href="#long" aria-label="Permalink to &quot;Long&quot;">​</a></h4><p>Java中Long类型的hashCode计算是先把值无符号右移32位，之后再与值相异或，保证每一位都用用到，最后强制转换成int值</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public int hashCode() {</span></span>
<span class="line"><span>    return Long.hashCode(value);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public static int hashCode(long value) {</span></span>
<span class="line"><span>    return (int)(value ^ (value &gt;&gt;&gt; 32));</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="double、float" tabindex="-1">Double、Float <a class="header-anchor" href="#double、float" aria-label="Permalink to &quot;Double、Float&quot;">​</a></h4><p>浮点类型的键java中hashCode的实现是将键表示为二进制</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static int hashCode(float value) {</span></span>
<span class="line"><span>    return floatToIntBits(value);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public static int floatToIntBits(float value) {</span></span>
<span class="line"><span>    int result = floatToRawIntBits(value);</span></span>
<span class="line"><span>    // Check for NaN based on values of bit fields, maximum</span></span>
<span class="line"><span>    // exponent and nonzero significand.</span></span>
<span class="line"><span>    if ( ((result &amp; FloatConsts.EXP_BIT_MASK) ==</span></span>
<span class="line"><span>          FloatConsts.EXP_BIT_MASK) &amp;&amp;</span></span>
<span class="line"><span>         (result &amp; FloatConsts.SIGNIF_BIT_MASK) != 0)</span></span>
<span class="line"><span>        result = 0x7fc00000;</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="string" tabindex="-1">String <a class="header-anchor" href="#string" aria-label="Permalink to &quot;String&quot;">​</a></h4><p>java中每个char都可以表示成一个int值，所以字符串转换成一个int值</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int hashCode() {</span></span>
<span class="line"><span>    int h = hash;</span></span>
<span class="line"><span>    if (h == 0 &amp;&amp; value.length &gt; 0) {</span></span>
<span class="line"><span>        char val[] = value;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int i = 0; i &lt; value.length; i++) {</span></span>
<span class="line"><span>            h = 31 * h + val[i];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        hash = h;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return h;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="软缓存" tabindex="-1">软缓存 <a class="header-anchor" href="#软缓存" aria-label="Permalink to &quot;软缓存&quot;">​</a></h4><p>如果计算一个散列值比较耗时，那么我可以这个计算好的值缓存起来，即使用一个变量把这个值保存起来，在下一次调用时直接返回。Java中的String就是采用的这种方式。</p><h2 id="拉链式的散列表" tabindex="-1">拉链式的散列表 <a class="header-anchor" href="#拉链式的散列表" aria-label="Permalink to &quot;拉链式的散列表&quot;">​</a></h2><p>散列函数能够将键值转换成数组的下标；第二步就是需要处理碰撞冲突，也就是需要处理遇到了两个散列值相同的对象应该如何存储。有一种方式是数组中的每一个元素都指向一个链表用来存放散列值相同的对象，这种方式被称为拉链法</p><p>拉链法可以使用原始的链表保存键，也可以采用我们之前实现的红黑树来表示，在java8中采用的这两种方式的混合，在节点数超过了8之后变为红黑树。</p><p>这里我们就采用简单的链表来实现拉链式散列表，数据结构使用在前几篇中已经实现的<code>LinkedMap</code>，可以参考前面的文章<a href="https://juejin.cn/post/6940442429229105183" target="_blank" rel="noreferrer">《基于数组或链表实现Map》</a>。</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/ff76067884aa4aa78b3221f598104621%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class SeparateChainingHashMap&lt;K, V&gt; implements Map&lt;K, V&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private int size;</span></span>
<span class="line"><span>    private LinkedMap&lt;K, V&gt;[] table;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public SeparateChainingHashMap(int capacity) {</span></span>
<span class="line"><span>        this.table = (LinkedMap&lt;K, V&gt;[]) new LinkedMap[capacity];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; capacity; i++) {</span></span>
<span class="line"><span>            this.table[i] = new LinkedMap&lt;&gt;();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void put(K key, V value) {</span></span>
<span class="line"><span>        this.table[hash(key)].put(key, value);</span></span>
<span class="line"><span>        size++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private int hash(K key) {</span></span>
<span class="line"><span>        return (key.hashCode() &amp; 0x7fffffff) % table.length;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public V get(K key) {</span></span>
<span class="line"><span>        return this.table[hash(key)].get(key);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void delete(K key) {</span></span>
<span class="line"><span>        this.table[hash(key)].delete(key);</span></span>
<span class="line"><span>        size--;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int size() {</span></span>
<span class="line"><span>        return size;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这的hash函数使用key的hashCode与上0x7fffffff得到一个非负的整数，然后再使用除留余数法计算出数组的下标。其中0x7FFFFFFF 的二进制表示就是除了首位是 0，其余都是1，也就是说，这是最大的整型数 int（因为第一位是符号位，0 表示他是正数）,可以使用Integer.MAX_VALUE代替</p><p>散列表的主要目的在于把键值均匀的分布到数组中，所以散列表是无序的，如果你需要的Map需要支持取出最大值，最小值，那么散列表都不适合。</p><p>这里我们实现的拉链式散列表的数组大小是固定的，但是通常在随着数据量的增大，越短的数组出现碰撞的几率会增大，所以需要数组支持动态的扩容，扩容之后需要把原来的值重新插入到扩容之后的数组中。数组的扩容可以参考之前的文章<a href="https://juejin.cn/post/6926685994347397127" target="_blank" rel="noreferrer">《老哥是时候来复习下数据结构与算法了》</a></p><h2 id="线性探测式散列表" tabindex="-1">线性探测式散列表 <a class="header-anchor" href="#线性探测式散列表" aria-label="Permalink to &quot;线性探测式散列表&quot;">​</a></h2><p>实现散列表的另一种方式就是用大小为M来保存N个键值，其中M&gt;N；解决碰撞冲突就需要利用数组中的空位；这种方式中最简单的实现就是线性探测。</p><p>线性探测的主要思路：当插入一个键，发生碰撞冲突之后直接把索引加一来检查下一个位置，这时候会出现三种情况:</p><ol><li>下一个位置和待插入的键相等，那么值就修改值</li><li>下一个位置和待插入的键不相等，那么索引加一继续查找</li><li>如果下一个位置还是一个空位，那么直接把待插入对象放入到这个空位</li></ol><h4 id="初始化" tabindex="-1">初始化 <a class="header-anchor" href="#初始化" aria-label="Permalink to &quot;初始化&quot;">​</a></h4><p>线性探测式散列表使用两个数组来存放keys和values，<code>capacity</code>表示初始化数组的大小</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private int size;</span></span>
<span class="line"><span>private int capacity;</span></span>
<span class="line"><span>private K[] keys;</span></span>
<span class="line"><span>private V[] values;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public LinearProbingHashMap(int capacity) {</span></span>
<span class="line"><span>    this.capacity = capacity;</span></span>
<span class="line"><span>    this.keys = (K[]) new Object[capacity];</span></span>
<span class="line"><span>    this.values = (V[]) new Object[capacity];</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="插入" tabindex="-1">插入 <a class="header-anchor" href="#插入" aria-label="Permalink to &quot;插入&quot;">​</a></h4><ol><li>当插入键的位置超过了数组的大小，就需要回到数组的开始位置继续查找，直到找到一个位置为null的才结束；<code>index = (index + 1) % capacity</code></li><li>当数组已存放的容量超过了数组总容量的一半，就需要扩容到原来的2倍</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void put(K key, V value) {</span></span>
<span class="line"><span>    if (Objects.isNull(key)) {</span></span>
<span class="line"><span>        throw new IllegalArgumentException(&quot;Key can not null&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (this.size &gt; this.capacity / 2) {</span></span>
<span class="line"><span>        resize(2 * this.capacity);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int index;</span></span>
<span class="line"><span>    for (index = hash(key); this.keys[index] != null; index = (index + 1) % capacity) {</span></span>
<span class="line"><span>        if (this.keys[index].equals(key)) {</span></span>
<span class="line"><span>            this.values[index] = value;</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.keys[index] = key;</span></span>
<span class="line"><span>    this.values[index] = value;</span></span>
<span class="line"><span>    size++;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="动态调整数组的大小" tabindex="-1">动态调整数组的大小 <a class="header-anchor" href="#动态调整数组的大小" aria-label="Permalink to &quot;动态调整数组的大小&quot;">​</a></h4><p>我们可以参考之前在文章<a href="https://juejin.cn/post/6926685994347397127" target="_blank" rel="noreferrer">《老哥是时候来复习下数据结构与算法了》</a>中实现的动态调整数据的大小；在线性探测中需要把原来的数据重新插入到扩容之后的数据，因为数组的大小变了需要重新计算索引的位置。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void resize(int cap) {</span></span>
<span class="line"><span>    LinearProbingHashMap&lt;K, V&gt; linearProbingHashMap = new LinearProbingHashMap&lt;&gt;(cap);</span></span>
<span class="line"><span>    for (int i = 0; i &lt; capacity; i++) {</span></span>
<span class="line"><span>        linearProbingHashMap.put(keys[i], values[i]);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.keys = linearProbingHashMap.keys;</span></span>
<span class="line"><span>    this.values = linearProbingHashMap.values;</span></span>
<span class="line"><span>    this.capacity = linearProbingHashMap.capacity;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="查询" tabindex="-1">查询 <a class="header-anchor" href="#查询" aria-label="Permalink to &quot;查询&quot;">​</a></h4><p>线性探测散列表中实现查询的思路：根据待查询key的hash函数计算出索引的位置，然后开始判断当前位置上的key是否和待查询key相等，如果相等那么就直接返回value，如果不相等那么就继续查找下一个索引直到遇到某个位置是null才结束，表示查询的key不存在；</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public V get(K key) {</span></span>
<span class="line"><span>    if (Objects.isNull(key)) {</span></span>
<span class="line"><span>        throw new IllegalArgumentException(&quot;Key can not null&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int index;</span></span>
<span class="line"><span>    for (index = hash(key); this.keys[index] != null; index = (index + 1) % capacity) {</span></span>
<span class="line"><span>        if (this.keys[index].equals(key)) {</span></span>
<span class="line"><span>            return this.values[index];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="删除元素" tabindex="-1">删除元素 <a class="header-anchor" href="#删除元素" aria-label="Permalink to &quot;删除元素&quot;">​</a></h4><p>线性探测式的删除稍微麻烦一些，首先需要查找出待删除的元素位置，删除元素之后需要把当前索引之后的连续位置上的元素重新插入；因为是否有空位对于线性探测式散列表的查找至关重要；例如：5-&gt;7-&gt;9，删除了7之后，如果不重新插入7的位置就是空位，那么get方法将无法查询到9这个元素；</p><p>每次删除之后都需要检测一次数组中实际元素的个数，如果与数组的容量相差较大，就可以进行缩容操作；</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void delete(K key) {</span></span>
<span class="line"><span>    if (Objects.isNull(key)) {</span></span>
<span class="line"><span>        throw new IllegalArgumentException(&quot;Key can not null&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int index;</span></span>
<span class="line"><span>    for (index = hash(key); this.keys[index] != null; index = (index + 1) % capacity) {</span></span>
<span class="line"><span>        if (this.keys[index].equals(key)) {</span></span>
<span class="line"><span>            this.keys[index] = null;</span></span>
<span class="line"><span>            this.values[index] = null;</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (index = (index + 1) % capacity; this.keys[index] != null; index = (index + 1) % capacity) {</span></span>
<span class="line"><span>        this.size--;</span></span>
<span class="line"><span>        this.put(this.keys[index], this.values[index]);</span></span>
<span class="line"><span>        this.keys[index] = null;</span></span>
<span class="line"><span>        this.values[index] = null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.size--;</span></span>
<span class="line"><span>    if (size &gt; 0 &amp;&amp; size &lt; capacity / 4) {</span></span>
<span class="line"><span>        resize(capacity / 2);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div>`,54),i=[l];function t(c,o,h,r,d,u){return n(),s("div",null,i)}const v=a(e,[["render",t]]);export{b as __pageData,v as default};
