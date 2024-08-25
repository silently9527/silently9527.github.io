import{_ as a,c as s,o as n,aa as p}from"./chunks/framework.DtK4gh9F.js";const b=JSON.parse('{"title":"13 图算法之无向图的数据结构","description":"","frontmatter":{"title":"13 图算法之无向图的数据结构","author":"Herman","updateTime":"2024-07-16 21:34","desc":"图算法系列之无向图的数据结构","categories":"算法","tags":"数据结构/图算法","outline":"deep"},"headers":[],"relativePath":"Notes/No2TechColumn/04 Algorithms/13 图算法系列之无向图的数据结构.md","filePath":"Notes/No2TechColumn/04 Algorithms/13 图算法系列之无向图的数据结构.md","lastUpdated":1724593073000}'),e={name:"Notes/No2TechColumn/04 Algorithms/13 图算法系列之无向图的数据结构.md"},l=p(`<h1 id="图算法系列之无向图的数据结构" tabindex="-1">图算法系列之无向图的数据结构 <a class="header-anchor" href="#图算法系列之无向图的数据结构" aria-label="Permalink to &quot;图算法系列之无向图的数据结构&quot;">​</a></h1><blockquote><p>吐血整理程序员必读书单：<a href="https://github.com/silently9527/ProgrammerBooks" target="_blank" rel="noreferrer">https://github.com/silently9527/ProgrammerBooks</a></p><p>微信公众号：贝塔学Java</p></blockquote><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>从本篇开始我们将会一起来学习图相关的算法，图算有很多相当实用算法，比如：垃圾回收器的标记清除算法、地图上求路径的最短距离、拓扑排序等。在开始学习这些算法之前我们需要先来了解下图的基本定义，以及使用哪种数据结构来表示一张图，本篇我们先从无向图开始学习。</p><h2 id="图的定义" tabindex="-1">图的定义 <a class="header-anchor" href="#图的定义" aria-label="Permalink to &quot;图的定义&quot;">​</a></h2><p>图：是有一组顶点和一组能够将两个订单相连组成的。连接两个顶点的边没有方向，这种图称之为无向图。</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/400c87ea10024c17b69d2ed19c64aec1%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><h2 id="图的术语" tabindex="-1">图的术语 <a class="header-anchor" href="#图的术语" aria-label="Permalink to &quot;图的术语&quot;">​</a></h2><p>通过同一条边相连的两个顶点我们称这两个顶点<strong>相邻</strong>；</p><p>某个顶点的<strong>度数</strong>即表示连接这个顶点的边的总数；如上图：顶点1的度数是3</p><p>一条边连接了一个顶点与其自身，我们称为<strong>自环</strong></p><p>连接同一对顶点的边称为<strong>平行边</strong></p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/c3740af4054646f19bdbf7f82c4436b0%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><blockquote><p>术语还有很多，暂时这里只列出本篇我们需要使用到的术语，后面有在使用到其他的术语再做解释，太多也不太容易记得住</p></blockquote><h2 id="如何表示出图" tabindex="-1">如何表示出图 <a class="header-anchor" href="#如何表示出图" aria-label="Permalink to &quot;如何表示出图&quot;">​</a></h2><p>图用什么数据结构来表示主要参考两个要求：</p><ol><li>在开发图的相关算法时，图的表示的数据结构是基础，所以这种数据结构效率的高</li><li>在实际的过程中图的大小不确定，可能会很大，所以需要预留出足够的空间</li></ol><p>考虑了这两个要求之后大佬们提出以下三个方法来供选择：</p><ul><li>邻接矩阵 键入有v个顶点的图，我们可以使用v乘以v的矩阵来表示，如果顶点v与w相连，那么把v行w列设置为true，这样就可以表示两个顶点相连，但是这个方式有个问题，如果遇到图很大，会造成空间的浪费。不满足第二点。其次这种方式没办法表示平行边</li><li>边的数组 可以定义一个表示的边对象，包含两个int属性表示顶点，但是如果需要找到某个顶点的相连顶点有哪些，我们就需要遍历一遍全部的边。这种数据结构的效率较差</li><li>邻接表数组 定义一个数组，数组的大小为顶点的个数，数据下标表示顶点，数组中每个元素都是一个链表对象（LinkedListQueue）,链表中存放的值就是与该顶点相连的顶点。（LinkedListQueue我们已经在之前的文章中实现，可以参考文章《<a href="https://juejin.cn/post/6926685994347397127%E3%80%8B%EF%BC%89" target="_blank" rel="noreferrer">https://juejin.cn/post/6926685994347397127》）</a></li></ul><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/dee81e6b35d142ca9df1cadb833e6acd%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><h2 id="无向图的api定义" tabindex="-1">无向图的API定义 <a class="header-anchor" href="#无向图的api定义" aria-label="Permalink to &quot;无向图的API定义&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Graph {</span></span>
<span class="line"><span>    public Graph(int V); //创建含有v个顶点不含边的图</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public int V(); //返回顶点的个数</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public int E(); //返回图中边的总数</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public void addEdge(int v, int w); //向图中添加一条边 v-W </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>    public Iterable&lt;Integer&gt; adj(int v); //返回与v相邻的所有顶点</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public String toString(); //使用字符串打印出图的关系</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="无向图api的实现" tabindex="-1">无向图API的实现 <a class="header-anchor" href="#无向图api的实现" aria-label="Permalink to &quot;无向图API的实现&quot;">​</a></h2><p>要实现上面定义的API，我们需要三个成员变量，v表示图中顶点的个数，e表示图总共边的数据，LinkedListQueue的数组用来存储顶点v的相邻节点；</p><p>构造函数会初始化空的邻接表数组</p><p>因为是无向图，所以addEdge方法在向图中添加边既要添加一条v-&gt;w的边，有需要添加一条w-&gt;v的边</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Graph {</span></span>
<span class="line"><span>    private final int v;</span></span>
<span class="line"><span>    private int e;</span></span>
<span class="line"><span>    private LinkedListQueue&lt;Integer&gt;[] adj;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Graph(int v) {</span></span>
<span class="line"><span>        this.v = v;</span></span>
<span class="line"><span>        this.adj = (LinkedListQueue&lt;Integer&gt;[]) new LinkedListQueue[v];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; v; i++) {</span></span>
<span class="line"><span>            this.adj[i] = new LinkedListQueue&lt;&gt;();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int V() {</span></span>
<span class="line"><span>        return v;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int E() {</span></span>
<span class="line"><span>        return e;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void addEdge(int v, int w) {</span></span>
<span class="line"><span>        this.adj[v].enqueue(w);</span></span>
<span class="line"><span>        this.adj[w].enqueue(v);</span></span>
<span class="line"><span>        this.e++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Iterable&lt;Integer&gt; adj(int v) {</span></span>
<span class="line"><span>        return this.adj[v];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public String toString() {</span></span>
<span class="line"><span>        StringBuilder sb = new StringBuilder();</span></span>
<span class="line"><span>        sb.append(v).append(&quot; 个顶点，&quot;).append(e).append(&quot; 条边\\n&quot;);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; v; i++) {</span></span>
<span class="line"><span>            sb.append(i).append(&quot;: &quot;);</span></span>
<span class="line"><span>            for (int j : this.adj[i]) {</span></span>
<span class="line"><span>                sb.append(j).append(&quot; &quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            sb.append(&quot;\\n&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return sb.toString();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="图的常用工具方法" tabindex="-1">图的常用工具方法 <a class="header-anchor" href="#图的常用工具方法" aria-label="Permalink to &quot;图的常用工具方法&quot;">​</a></h2><p>基于图数据结构的实现，我们可以提供一些工具方法</p><ol><li>计算顶点v的度数 顶点的度数就等于与之相连接顶点的个数</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static int degree(Graph graph, int v) {</span></span>
<span class="line"><span>    int degree = 0;</span></span>
<span class="line"><span>    for (int w : graph.adj(v)) {</span></span>
<span class="line"><span>        degree++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return degree;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>计算所有顶点的最大度数</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static int maxDegree(Graph graph) {</span></span>
<span class="line"><span>    int maxDegree = 0;</span></span>
<span class="line"><span>    for (int v = 0; v &lt; graph.V(); v++) {</span></span>
<span class="line"><span>        int degree = degree(graph, v);</span></span>
<span class="line"><span>        if (maxDegree &lt; degree) {</span></span>
<span class="line"><span>            maxDegree = degree;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return maxDegree;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="3"><li>计算所有顶点的平均度数 每条边都有两个顶点，所以图所有顶点的总度数是边的2倍</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static double avgDegree(Graph graph) {</span></span>
<span class="line"><span>    return 2.0 * graph.E() / graph.V();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="4"><li>计算图中的自环个数 对于顶点v，如果v同时也出现了在v的邻接表中，那么表示v存在一个自环；由于是无向图，每条边都被记录了两次（如果不好理解可以把图的toString打印出来就可以理解了）</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static int numberOfSelfLoops(Graph graph) {</span></span>
<span class="line"><span>    int count = 0;</span></span>
<span class="line"><span>    for (int v = 0; v &lt; graph.V(); v++) {</span></span>
<span class="line"><span>        for (int w : graph.adj(v)) {</span></span>
<span class="line"><span>            if (v == w) {</span></span>
<span class="line"><span>                count++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return count / 2;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>本篇我们主要学习使用何种数据结构来表示一张图，以及基于这种数据结构实现了几个简单的工具方法，在下一篇我们将来学习图的第一个搜索算法 - 深度优先搜索</p>`,39),i=[l];function t(c,r,o,d,h,u){return n(),s("div",null,i)}const v=a(e,[["render",t]]);export{b as __pageData,v as default};
