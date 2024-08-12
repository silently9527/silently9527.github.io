import{_ as t}from"./chunks/ArticleMetadata.XuUbZ1GH.js";import{_ as c,D as o,o as p,c as d,I as r,w as u,k as e,a as h,R as m,b as g,e as b}from"./chunks/framework.PNf1_BA9.js";import"./chunks/md5.c4H53MUT.js";const O=JSON.parse('{"title":"基于二叉树实现Map","description":"","frontmatter":{"title":"基于二叉树实现Map","author":"Herman","date":"2021/08/14 13:58","categories":["算法"],"tags":["数据结构","二叉树"]},"headers":[],"relativePath":"article/pamphlet/algorithms/卧学算法/10-基于二叉树实现Map.md","filePath":"article/pamphlet/algorithms/卧学算法/10-基于二叉树实现Map.md","lastUpdated":1723429417000}'),f={name:"article/pamphlet/algorithms/卧学算法/10-基于二叉树实现Map.md"},k=e("h1",{id:"基于二叉树实现map",tabindex:"-1"},[h("基于二叉树实现Map "),e("a",{class:"header-anchor",href:"#基于二叉树实现map","aria-label":'Permalink to "基于二叉树实现Map"'},"​")],-1),v=m(`<h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>在上一篇中我们基于数组和链表实现了Map的相关操作，但是对于数据量稍大的情况下，这两种实现方式效率都比较低，为了改进这个问题，本篇我们将来学习二叉树，并通过二叉树来实现上一篇中定义的Map结构</p><h2 id="二叉树简介" tabindex="-1">二叉树简介 <a class="header-anchor" href="#二叉树简介" aria-label="Permalink to &quot;二叉树简介&quot;">​</a></h2><p>虽然大家都知道二叉树是什么，但是为了保证文章的完整性，这里还是简单说说什么是二叉树</p><p>二叉树中每个节点都包含了两个指针指向自己的左子树和右子树。</p><p>二叉树的每个节点都包含了一个Key, 并且每个节点的Key都大于其左子树中的任意节点，小于右子树中的任意节点。</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/28f4367ecbfb422bb9ff087cc681126e%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>节点的数据结构定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>class Node {</span></span>
<span class="line"><span>    private K key;</span></span>
<span class="line"><span>    private V value;</span></span>
<span class="line"><span>    private Node left;</span></span>
<span class="line"><span>    private Node right;</span></span>
<span class="line"><span>    private int size = 1; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Node(K key, V value) {</span></span>
<span class="line"><span>        this.key = key;</span></span>
<span class="line"><span>        this.value = value;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>size</code> 记录当前节点所在子树的节点个数，计算方式：<code>size=左子树的个数 + 1 + 右子树的个数</code></p><h2 id="基于二叉树实现map-1" tabindex="-1">基于二叉树实现Map <a class="header-anchor" href="#基于二叉树实现map-1" aria-label="Permalink to &quot;基于二叉树实现Map&quot;">​</a></h2><p>在上一篇《基于数组或链表实现Map》中我们定义了Map的接口，本篇我们继续使用该map接口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public interface Map&lt;K, V&gt; {</span></span>
<span class="line"><span>    void put(K key, V value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    V get(K key);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void delete(K key);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int size();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Iterable&lt;K&gt; keys();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Iterable&lt;TreeNode&gt; nodes();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    default boolean contains(K key) {</span></span>
<span class="line"><span>        return get(key) != null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    default boolean isEmpty() {</span></span>
<span class="line"><span>        return size() == 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public interface SortedMap&lt;K extends Comparable&lt;K&gt;, V&gt; extends Map&lt;K, V&gt; {</span></span>
<span class="line"><span>    int rank(K key);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void deleteMin();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void deleteMax();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    K min();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    K max();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="查询" tabindex="-1">查询 <a class="header-anchor" href="#查询" aria-label="Permalink to &quot;查询&quot;">​</a></h4><p>在二叉树中查找一个键最简单直接的方式就是使用递归，把查找的key和节点的key进行比较，如果较小就去左子树中继续递归查找，如果较大就在右子树中查找，如果相等，表示已找到直接返回value，如果递归结束还未找到就返回null</p><p>代码实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public V get(K key) {</span></span>
<span class="line"><span>    if (Objects.isNull(key)) {</span></span>
<span class="line"><span>        throw new IllegalArgumentException(&quot;key can not null&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Node node = get(root, key);</span></span>
<span class="line"><span>    return Objects.isNull(node) ? null : node.value;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private Node get(Node node, K key) {</span></span>
<span class="line"><span>    if (Objects.isNull(node)) {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int compare = key.compareTo(node.key);</span></span>
<span class="line"><span>    if (compare &gt; 0) {</span></span>
<span class="line"><span>        return get(node.right, key);</span></span>
<span class="line"><span>    } else if (compare &lt; 0) {</span></span>
<span class="line"><span>        return get(node.left, key);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        return node;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="查询出最大值和最小值" tabindex="-1">查询出最大值和最小值 <a class="header-anchor" href="#查询出最大值和最小值" aria-label="Permalink to &quot;查询出最大值和最小值&quot;">​</a></h4><p>在二叉树中我们可能会经常使用到查询树中的最大值和最小值，包括后面我们的删除操作也会使用到，所以这里我们需要实现这两个方法；</p><p>最大值的实现： 从根节点开始沿着右子树递归，直到遇到右子树为null的时候就结束，此时的节点就是最大值 最小值的实现： 从根节点开始沿着左子树递归，知道遇到左子树为null的时候就结束，此时的节点就是最小值</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public K max() {</span></span>
<span class="line"><span>    Node max = max(root);</span></span>
<span class="line"><span>    return max.key;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>protected Node min(Node node) {</span></span>
<span class="line"><span>    if (Objects.isNull(node.left)) {</span></span>
<span class="line"><span>        return node;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return min(node.left);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>protected Node max(Node node) {</span></span>
<span class="line"><span>    if (Objects.isNull(node.right)) {</span></span>
<span class="line"><span>        return node;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return max(node.right);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="插入" tabindex="-1">插入 <a class="header-anchor" href="#插入" aria-label="Permalink to &quot;插入&quot;">​</a></h4><p>从上面的实现我们可以看出二叉树的查询方法和上篇中数组二分查找法实现的一样简单高效，这是二叉树的一个重要特性，而且二叉树的插入与查询操作一样简单，理想情况下插入和查询操作时间复杂度都是log(N)</p><p>插入操作的实现思路： 与查询操作类似，依然是递归，如果put的key值比当前节点大就需要去右子树递归，如果较小就去左子树递归，如果相等就直接更新节点的值。如果递归结束后还未找到值就新建一个节点并返回</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/0e00781c357b415c9ca57fd9f5d56025%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>private Node put(Node node, K key, V value) {</span></span>
<span class="line"><span>    if (Objects.isNull(node)) {</span></span>
<span class="line"><span>        return new Node(key, value);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int compare = key.compareTo(node.key);</span></span>
<span class="line"><span>    if (compare &gt; 0) {</span></span>
<span class="line"><span>        node.right = put(node.right, key, value);</span></span>
<span class="line"><span>    } else if (compare &lt; 0) {</span></span>
<span class="line"><span>        node.left = put(node.left, key, value);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        node.value = value;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    node.size = size(node.left) + 1 + size(node.right);</span></span>
<span class="line"><span>    return node;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int size(Node node) {</span></span>
<span class="line"><span>    if (Objects.isNull(node)) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return node.size;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中size的计算在前面已经说到，当前节点的<code>size = 左子树.size + 1 + 右子树.size</code></p><h4 id="删除最大值和最小值" tabindex="-1">删除最大值和最小值 <a class="header-anchor" href="#删除最大值和最小值" aria-label="Permalink to &quot;删除最大值和最小值&quot;">​</a></h4><p>二叉树中相对比较麻烦的操作就是删除操作，所以我们先来了解下删除最大值和最小值应该如何实现。</p><p>删除最小值：和前面实现查找最小值有些相似，沿着左边路径一直深入，直到遇到一个节点的左子树为null, 那么这个当前节点就是最小值，在递归中把当前节点的右子树返回即可；</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/52396f43b7234025916a10859f10ee8d%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>最大值实现思路类似</p><p>代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void deleteMin() {</span></span>
<span class="line"><span>    root = deleteMin(root);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public Node deleteMin(Node node) {</span></span>
<span class="line"><span>    if (Objects.isNull(node.left)) {</span></span>
<span class="line"><span>        return node.right;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    node.left = deleteMin(node.left);</span></span>
<span class="line"><span>    node.size = size(node.left) + 1 + size(node.right);</span></span>
<span class="line"><span>    return node;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void deleteMax() {</span></span>
<span class="line"><span>    root = deleteMax(root);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public Node deleteMax(Node node) {</span></span>
<span class="line"><span>    if (Objects.isNull(node.right)) {</span></span>
<span class="line"><span>        return node.left;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    node.right = deleteMax(node.right);</span></span>
<span class="line"><span>    node.size = size(node.left) + 1 + size(node.right);</span></span>
<span class="line"><span>    return node;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="删除" tabindex="-1">删除 <a class="header-anchor" href="#删除" aria-label="Permalink to &quot;删除&quot;">​</a></h4><p>我们可以通过类似的方式去删除只有一个子节点或者是没有子节点的节点；但是如果遇到需要删除有两个节点的节点应该怎么操作呢？</p><p>两种思路：用左子树的最大值替换待删除节点，然后删除掉左子树的最大值；或者是用右子树中的最小值替换待删除节点，然后删除右子树中的最小值</p><p>步骤：</p><ol><li>从该节点的左子树中取出最大值或者是从右子树中取出最小值</li><li>用最大值或者最小值替换当前的节点</li><li>调用删除最大值或者删除最小值</li></ol><p><img src="https://raw.githubusercontent.com/silently9527/images/main/569e327806bf4e668a8a19e18c14219a%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>代码实现</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void delete(K key) {</span></span>
<span class="line"><span>    root = delete(root, key);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private Node delete(Node node, K key) {</span></span>
<span class="line"><span>    if (Objects.isNull(node)) {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int compare = key.compareTo(node.key);</span></span>
<span class="line"><span>    if (compare &gt; 0) {</span></span>
<span class="line"><span>        node.right = delete(node.right, key);</span></span>
<span class="line"><span>    } else if (compare &lt; 0) {</span></span>
<span class="line"><span>        node.left = delete(node.left, key);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        if (Objects.isNull(node.left)) {</span></span>
<span class="line"><span>            return node.right;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (Objects.isNull(node.right)) {</span></span>
<span class="line"><span>            return node.left;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Node max = max(node.left);</span></span>
<span class="line"><span>        node.key = max.key;</span></span>
<span class="line"><span>        node.value = max.value;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        node.left = deleteMax(node.left);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    node.size = size(node.left) + 1 + size(node.right);</span></span>
<span class="line"><span>    return node;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="分析" tabindex="-1">分析 <a class="header-anchor" href="#分析" aria-label="Permalink to &quot;分析&quot;">​</a></h4><p>使用二叉树实现的Map运行的效率取决于树的形状，而树的形状取决于数据输入的顺序；最好的情况下二叉树是平衡的，那么get、put的时间复杂度都是log(N); 但是如果插入的数据是有序的，那么二叉树就会演变成链表，那么get、put的性能将会大大减低；</p><p>基于这个问题，我们会继续改进我们实现的Map，下一篇我们将会学习使用红黑树来实现我们的Map操作，无论数据插入的顺序如何都能保证二叉树近似平衡</p>`,45);function y(n,N,_,M,x,z){const l=t,i=o("ClientOnly");return p(),d("div",null,[k,r(i,null,{default:u(()=>{var s,a;return[(((s=n.$frontmatter)==null?void 0:s.aside)??!0)&&(((a=n.$frontmatter)==null?void 0:a.showArticleMetadata)??!0)?(p(),g(l,{key:0,article:n.$frontmatter},null,8,["article"])):b("",!0)]}),_:1}),v])}const V=c(f,[["render",y]]);export{O as __pageData,V as default};
