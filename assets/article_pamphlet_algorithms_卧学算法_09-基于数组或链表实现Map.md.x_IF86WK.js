import{_ as t}from"./chunks/ArticleMetadata.IwlMn1X8.js";import{_ as c,D as o,o as p,c as d,I as r,w as u,k as e,a as h,R as k,b as m,e as g}from"./chunks/framework.412fhWlr.js";import"./chunks/md5.6OGdLw3O.js";const j=JSON.parse('{"title":"基于数组或链表实现Map","description":"","frontmatter":{"title":"基于数组或链表实现Map","author":"Herman","date":"2021/08/14 13:58","categories":["算法"],"tags":["数据结构"]},"headers":[],"relativePath":"article/pamphlet/algorithms/卧学算法/09-基于数组或链表实现Map.md","filePath":"article/pamphlet/algorithms/卧学算法/09-基于数组或链表实现Map.md","lastUpdated":1723379536000}'),v={name:"article/pamphlet/algorithms/卧学算法/09-基于数组或链表实现Map.md"},y=e("h1",{id:"基于数组或链表实现map",tabindex:"-1"},[h("基于数组或链表实现Map "),e("a",{class:"header-anchor",href:"#基于数组或链表实现map","aria-label":'Permalink to "基于数组或链表实现Map"'},"​")],-1),b=k(`<h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>JAVA中的Map主要就是将一个键和一个值联系起来。虽然JAVA中已经提供了很多Map的实现，为了学习并掌握常用的数据结构，从本篇开始我将自己实现Map的功能，本篇主要是通过数组和链表两种方式实现，之后提供二叉树，红黑树，散列表的版本实现。通过自己手写各个版本的Map实现，掌握每种数据结构的优缺点，可以在实际的工作中根据需要选择适合的Map。</p><h2 id="map-api的定义" tabindex="-1">Map API的定义 <a class="header-anchor" href="#map-api的定义" aria-label="Permalink to &quot;Map API的定义&quot;">​</a></h2><p>在开始之前，我们需要先定义出Map的接口定义，后续的版本都会基于此接口实现</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public interface Map&lt;K, V&gt; {</span></span>
<span class="line"><span>    void put(K key, V value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    V get(K key);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void delete(K key);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    int size();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Iterable&lt;K&gt; keys();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    default boolean contains(K key) {</span></span>
<span class="line"><span>        return get(key) != null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    default boolean isEmpty() {</span></span>
<span class="line"><span>        return size() == 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个接口是最简单的一个Map定义，相信这些方法对于java程序员来说不会陌生；</p><h2 id="基于链表实现map" tabindex="-1">基于链表实现Map <a class="header-anchor" href="#基于链表实现map" aria-label="Permalink to &quot;基于链表实现Map&quot;">​</a></h2><ol><li>基于链表实现首先我们需要定义一个Node节点，表示我们需要存储的key、vlaue</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>class Node {</span></span>
<span class="line"><span>    K key;</span></span>
<span class="line"><span>    V value;</span></span>
<span class="line"><span>    Node next;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Node(K key, V value, Node next) {</span></span>
<span class="line"><span>        this.key = key;</span></span>
<span class="line"><span>        this.value = value;</span></span>
<span class="line"><span>        this.next = next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>get方法的实现思路是遍历链表，然后比较每个Node中的key是否相等，如果相等就返回value，否则返回null</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public V get(K key) {</span></span>
<span class="line"><span>    return searchNode(key).map(node -&gt; node.value).orElse(null);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public Optional&lt;Node&gt; searchNode(K key) {</span></span>
<span class="line"><span>    for (Node node = root; node != null; node = node.next) {</span></span>
<span class="line"><span>        if (node.key.equals(key)) {</span></span>
<span class="line"><span>            return Optional.of(node);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return Optional.empty();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="3"><li>put方法的实现思路也是遍历链表，然后比较每个Node的key值是否相等，如果相等那么覆盖掉value，如果未查找到有key相等的node，那么就新建一个Node放到链表的开头</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void put(K key, V value) {</span></span>
<span class="line"><span>    Optional&lt;Node&gt; optionalNode = searchNode(key);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (optionalNode.isPresent()) {</span></span>
<span class="line"><span>        optionalNode.get().value = value;</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.root = new Node(key, value, root);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="4"><li>delete方法实现同样也需要遍历链表，因为我们的是单向链表，删除某个节点有两种思路，第一种，在遍历链表的时候记录下当前节点的上一个节点，把上一个节点的next指向当前节点next;第二种，当遍历到需要删除的节点时，把需要删除节点的next的key、value完全复制到需要删除的节点，把next指针指向next.next，比如：first - &gt; A -&gt; B -&gt; C -&gt; D -&gt; E -&gt; F -&gt; G -&gt; NULL,要删除 C 节点，就把D节点完全复制到c中，然后C -&gt; E，变相删除了C</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void delete(K key) {</span></span>
<span class="line"><span>// 第一种实现：</span></span>
<span class="line"><span>//        for (Node node = first, preNode = null; node != null; preNode = node, node = node.next) {</span></span>
<span class="line"><span>//            if (node.key.equals(key)) {</span></span>
<span class="line"><span>//                if (Objects.isNull(preNode)) {</span></span>
<span class="line"><span>//                    first = first.next;</span></span>
<span class="line"><span>//                } else {</span></span>
<span class="line"><span>//                    preNode.next = node.next;</span></span>
<span class="line"><span>//                }</span></span>
<span class="line"><span>//            }</span></span>
<span class="line"><span>//        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 第二中实现:</span></span>
<span class="line"><span>    for (Node node = first; node != null; node = node.next) {</span></span>
<span class="line"><span>        if (node.key.equals(key)) {</span></span>
<span class="line"><span>            Node next = node.next;</span></span>
<span class="line"><span>            node.key = next.key;</span></span>
<span class="line"><span>            node.value =next.value;</span></span>
<span class="line"><span>            node.next = next.next;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><blockquote><p>分析上面基于链表实现的map，每次的put、get、delete都需要遍历整个链表，非常的低效，无法处理大量的数据，时间复杂度为O(N)</p></blockquote><h2 id="基于数组实现map" tabindex="-1">基于数组实现Map <a class="header-anchor" href="#基于数组实现map" aria-label="Permalink to &quot;基于数组实现Map&quot;">​</a></h2><p>基于链表的实现非常低效，因为每次操作都需要遍历链表，假如我们的数据是有序的，那么查找的时候我们可以使用二分查找法，那么get方法会加快很多</p><p>为了体现出我们的Map是有序的，我们需要重新定义一个有序的Map</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public interface SortedMap&lt;K extends Comparable&lt;K&gt;, V&gt; extends Map&lt;K, V&gt; {</span></span>
<span class="line"><span>    int rank(K key);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该定义要求key必须实现接口<code>Comparable</code>，rank方法如果key值存在就返回对应在数组中的下标，如果不存在就返回小于key键的数量</p><ul><li>在基于数组的实现中，我们会定义两个数组变量分部存放keys、values；</li><li>rank方法的实现：由于我们整个数组都是有序的，我们可以二分查找法（可以查看《老哥是时候来复习下数据结构与算法了》），如果存在就返回所在数组的下表，如果不存在就返回0</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public int rank(K key) {</span></span>
<span class="line"><span>    int lo = 0, hi = size - 1;</span></span>
<span class="line"><span>    while (lo &lt;= hi) {</span></span>
<span class="line"><span>        int mid = (hi - lo) / 2 + lo;</span></span>
<span class="line"><span>        int compare = key.compareTo(keys[mid]);</span></span>
<span class="line"><span>        if (compare &gt; 0) {</span></span>
<span class="line"><span>            lo = mid + 1;</span></span>
<span class="line"><span>        } else if (compare &lt; 0) {</span></span>
<span class="line"><span>            hi = mid - 1;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            return mid;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return lo;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>get方法实现：基于rank方法，判断返回的keys[index]与key进行比较，如果相等返回values[index]，不相等就返回null</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public V get(K key) {</span></span>
<span class="line"><span>    int index = this.rank(key);</span></span>
<span class="line"><span>    if (index &lt; size &amp;&amp; key.compareTo(keys[index]) == 0) {</span></span>
<span class="line"><span>        return values[index];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>put方法实现：基于rank方法，判断返回的keys[index]与key进行比较，如果相等直接修改values[index]的值，如果不相等表示不存在该key，需要插入并且移动数组</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void put(K key, V value) {</span></span>
<span class="line"><span>    int index = this.rank(key);</span></span>
<span class="line"><span>    if (index &lt; size &amp;&amp; key.compareTo(keys[index]) == 0) {</span></span>
<span class="line"><span>        values[index] = value;</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (int j = size; j &gt; index; j--) {</span></span>
<span class="line"><span>        this.keys[j] = this.keys[j--];</span></span>
<span class="line"><span>        this.values[j] = this.values[j--];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    keys[index] = key;</span></span>
<span class="line"><span>    values[index] = value;</span></span>
<span class="line"><span>    size++;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>delete方法实现：通过rank方法判断该key是否存在，如果不存在就直接返回，如果存在需要移动数组</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void delete(K key) {</span></span>
<span class="line"><span>    int index = this.rank(key);</span></span>
<span class="line"><span>    if (Objects.isNull(keys[index]) || key.compareTo(keys[index]) != 0) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int j = index; j &lt; size - 1; j++) {</span></span>
<span class="line"><span>        keys[j] = keys[j + 1];</span></span>
<span class="line"><span>        values[j] = values[j + 1];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    keys[size - 1] = null;</span></span>
<span class="line"><span>    values[size - 1] = null;</span></span>
<span class="line"><span>    size--;</span></span>
<span class="line"><span>}</span></span></code></pre></div><blockquote><p>基于数组实现的Map，虽然get方法采用的二分查找法，很快O(logN)，但是在处理大量数据的情况下效率依然很低，因为put方法还是太慢；下篇我们将基于二叉树来实现Map，继续改进提升效率</p></blockquote>`,30);function x(s,_,f,N,C,M){const l=t,i=o("ClientOnly");return p(),d("div",null,[y,r(i,null,{default:u(()=>{var n,a;return[(((n=s.$frontmatter)==null?void 0:n.aside)??!0)&&(((a=s.$frontmatter)==null?void 0:a.showArticleMetadata)??!0)?(p(),m(l,{key:0,article:s.$frontmatter},null,8,["article"])):g("",!0)]}),_:1}),b])}const q=c(v,[["render",x]]);export{j as __pageData,q as default};
