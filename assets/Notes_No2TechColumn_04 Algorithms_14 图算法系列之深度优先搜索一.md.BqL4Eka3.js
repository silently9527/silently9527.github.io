import{_ as a,c as s,o as n,aa as p}from"./chunks/framework.d_Ke7vMG.js";const m=JSON.parse('{"title":"14 图算法之深度优先搜索一","description":"","frontmatter":{"title":"14 图算法之深度优先搜索一","author":"Herman","updateTime":"2024-07-16 21:34","desc":"图算法系列之深度优先搜索一","categories":"算法","tags":"数据结构/深度优先搜索/图算法","outline":"deep"},"headers":[],"relativePath":"Notes/No2TechColumn/04 Algorithms/14 图算法系列之深度优先搜索一.md","filePath":"Notes/No2TechColumn/04 Algorithms/14 图算法系列之深度优先搜索一.md","lastUpdated":1723563552000}'),e={name:"Notes/No2TechColumn/04 Algorithms/14 图算法系列之深度优先搜索一.md"},l=p(`<h1 id="图算法系列之深度优先搜索-一" tabindex="-1">图算法系列之深度优先搜索（一） <a class="header-anchor" href="#图算法系列之深度优先搜索-一" aria-label="Permalink to &quot;图算法系列之深度优先搜索（一）&quot;">​</a></h1><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>在上一篇中我们把图通过邻接表数组表示出来了，这个数据结构将会做我们实现图算法的基础，本篇我们将一起开始学习图算法的第一个搜索算法 - 深度优先搜索</p><h2 id="搜索api的定义" tabindex="-1">搜索API的定义 <a class="header-anchor" href="#搜索api的定义" aria-label="Permalink to &quot;搜索API的定义&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Search {</span></span>
<span class="line"><span>    Search(Graph graph, int s);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    boolean marked(int v);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    int count();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在开始实现算法之前，我们依然先来定义搜索的API</p><ol><li>构造方法提供了一个图对象，以及一个起点s，需要找到与s连通的所有顶点</li><li>marked判断顶点s与v是否相邻</li><li>count返回与顶点s相连的总顶点数</li></ol><h2 id="深度优先搜索" tabindex="-1">深度优先搜索 <a class="header-anchor" href="#深度优先搜索" aria-label="Permalink to &quot;深度优先搜索&quot;">​</a></h2><p><img src="https://raw.githubusercontent.com/silently9527/images/main/b0e06abdd6f540978af8f3e7a6c00f15%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>假如上图是一个迷宫，我们需要从顶点0开始找到一条出路，假设我们有一条无限长的绳子，和一支粉笔，那么可以这样考虑找到出路：</p><ol><li>先选择一条通道走，在走的路上放上一根绳子</li><li>每遇到一个路口就用笔标记一下，继续选择一条未走过的通道</li><li>当遇到一个已经被标记的路口时就退回到上一个路口继续选择一个未走过的通道</li><li>当回退的路口已经没有路可以走的时候就在继续往后回退</li></ol><p>这种方式绳子总能帮你找到一条出路，而标记不会让你重复走已经走过的通道。</p><p>深度优先搜索的实现思路就和走迷宫的方式一样；</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class DepthFirstSearch {</span></span>
<span class="line"><span>    private boolean marked[]; </span></span>
<span class="line"><span>    private int count;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public DepthFirstSearch(Graph graph, int s) {</span></span>
<span class="line"><span>        this.marked = new boolean[graph.V()];</span></span>
<span class="line"><span>        this.dfs(graph, s);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void dfs(Graph graph, int v) {</span></span>
<span class="line"><span>        marked[v] = true;</span></span>
<span class="line"><span>        count++;</span></span>
<span class="line"><span>        for (int w : graph.adj(v)) {</span></span>
<span class="line"><span>            if (!marked[w]) {</span></span>
<span class="line"><span>                dfs(graph, w);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean marked(int v) {</span></span>
<span class="line"><span>        return marked[v];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int count() {</span></span>
<span class="line"><span>        return count;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在搜索一张图的时候，使用递归来遍历所有的顶点，在访问其中一个顶点时：</p><ol><li>标记它被已经访问</li><li>递归的访问与之相连的所有邻接点</li></ol><p><strong>单元测试：</strong> 构建下面这张图，然后测试深度优先搜索</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/7c7556f2ba204332b7d920d5b58c71d5%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void test() {</span></span>
<span class="line"><span>    Graph graph = new Graph(8); //构建一张图</span></span>
<span class="line"><span>    graph.addEdge(0, 1);</span></span>
<span class="line"><span>    graph.addEdge(0, 2);</span></span>
<span class="line"><span>    graph.addEdge(0, 5);</span></span>
<span class="line"><span>    graph.addEdge(1, 3);</span></span>
<span class="line"><span>    graph.addEdge(2, 4);</span></span>
<span class="line"><span>    graph.addEdge(4, 3);</span></span>
<span class="line"><span>    graph.addEdge(5, 3);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    graph.addEdge(6, 7); //为了展示</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    SeDepthFirstSearcharch search = new DepthFirstSearch(graph, 0);</span></span>
<span class="line"><span>    System.out.println(search.count());</span></span>
<span class="line"><span>    System.out.println(search.marked(6));</span></span>
<span class="line"><span>    System.out.println(search.marked(7));</span></span>
<span class="line"><span>    System.out.println(search.marked(2));</span></span>
<span class="line"><span>    System.out.println(search.marked(5));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="https://raw.githubusercontent.com/silently9527/images/main/322bab4a5e7e45008684ea286e9be503%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><h2 id="寻找路径的api" tabindex="-1">寻找路径的API <a class="header-anchor" href="#寻找路径的api" aria-label="Permalink to &quot;寻找路径的API&quot;">​</a></h2><p>以上的递归算法只是一个开始，从上面的结果我们可以看出，我们只能判断出哪些顶点与起点s是连通的，无法给出具体的路径出来；换句话说，<strong>我们需要实现从顶点s到顶点v是否存在路径可达，如果存在请打印出来</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Paths {</span></span>
<span class="line"><span>    Paths(Graph graph, int s);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    boolean hasPathTo(int v); //判断出从s-&gt;v是否存在路径</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    Iterable&lt;Integer&gt; pathTo(int v); //如果存在路径，返回路径</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="基于深度优先搜索查找图中的可达路径" tabindex="-1">基于深度优先搜索查找图中的可达路径 <a class="header-anchor" href="#基于深度优先搜索查找图中的可达路径" aria-label="Permalink to &quot;基于深度优先搜索查找图中的可达路径&quot;">​</a></h2><p><img src="https://raw.githubusercontent.com/silently9527/images/main/7d8547f0ac3143939aa2e5ce9ea23277%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>我们依然基于这张图来看，由于我们需要找出可达的路径，所以我们在进行搜索的时候需要记录下图中的边，这里我们使用的是一个数组edgeTo[]，如果存在一条边是v-&gt;w，那么可以表示成edgeTo[w]=v，在深度搜索完成之后这个edgeTo[]数组就是一颗由父链表示的一颗树 （父链树在之前的文章中也使用过<a href="https://juejin.cn/post/6930395454739841037" target="_blank" rel="noreferrer">《如何检测社交网络中两个人是否是朋友关系（union-find算法）》</a>）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class DepthFirstPaths {</span></span>
<span class="line"><span>    private boolean marked[];</span></span>
<span class="line"><span>    private int[] edgeTo;</span></span>
<span class="line"><span>    private int s;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DepthFirstPaths(Graph graph, int s) {</span></span>
<span class="line"><span>        this.s = s;</span></span>
<span class="line"><span>        this.marked = new boolean[graph.V()];</span></span>
<span class="line"><span>        this.edgeTo = new int[graph.V()];</span></span>
<span class="line"><span>        this.dfs(graph, s);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void dfs(Graph graph, int v) {</span></span>
<span class="line"><span>        this.marked[v] = true;</span></span>
<span class="line"><span>        for (int w : graph.adj(v)) {</span></span>
<span class="line"><span>            if (!marked[w]) {</span></span>
<span class="line"><span>                this.edgeTo[w] = v;</span></span>
<span class="line"><span>                this.dfs(graph, w);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean hasPathTo(int v) {</span></span>
<span class="line"><span>        return marked[v];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Iterable&lt;Integer&gt; pathTo(int v) {</span></span>
<span class="line"><span>        if (!hasPathTo(v)) {</span></span>
<span class="line"><span>            throw new IllegalStateException(&quot;s不能到达v&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        Stack&lt;Integer&gt; stack = new LinkedListStack&lt;&gt;();</span></span>
<span class="line"><span>        stack.push(v);</span></span>
<span class="line"><span>        while (edgeTo[v] != s) {</span></span>
<span class="line"><span>            stack.push(edgeTo[v]);</span></span>
<span class="line"><span>            v = edgeTo[v];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        stack.push(s);</span></span>
<span class="line"><span>        return stack;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>画图来详细跟踪深度优先搜索的运行轨迹，记录了edgeTo的变化以及父链树的逐渐形成</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/df521e755a8a4a2ab64e3647bfa37709%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/708c04bce39146e9bf37c1ada3fdeba3%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/80f4afebaec24bfba794dc66fca116de%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>最终父链树形成了，接下来我们来写单元测试校验下生成的父链树和实际的运行结果是否一致</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void test() {</span></span>
<span class="line"><span>    Graph graph = new Graph(8);</span></span>
<span class="line"><span>    graph.addEdge(0, 1);</span></span>
<span class="line"><span>    graph.addEdge(0, 2);</span></span>
<span class="line"><span>    graph.addEdge(0, 5);</span></span>
<span class="line"><span>    graph.addEdge(1, 3);</span></span>
<span class="line"><span>    graph.addEdge(2, 4);</span></span>
<span class="line"><span>    graph.addEdge(4, 3);</span></span>
<span class="line"><span>    graph.addEdge(5, 3);</span></span>
<span class="line"><span>    graph.addEdge(6, 7);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DepthFirstPaths paths = new DepthFirstPaths(graph, 0);</span></span>
<span class="line"><span>    System.out.println(paths.hasPathTo(5));</span></span>
<span class="line"><span>    System.out.println(paths.hasPathTo(2));</span></span>
<span class="line"><span>    System.out.println(paths.hasPathTo(6));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    paths.pathTo(5).forEach(System.out::print);</span></span>
<span class="line"><span>    System.out.println();</span></span>
<span class="line"><span>    paths.pathTo(4).forEach(System.out::print);</span></span>
<span class="line"><span>    System.out.println();</span></span>
<span class="line"><span>    paths.pathTo(2).forEach(System.out::print);</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>验证结果完全匹配了父链树</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/1cb5b06a5ebc4e318ac4d72e7114106b%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p>`,35),i=[l];function t(c,r,o,h,d,g){return n(),s("div",null,i)}const b=a(e,[["render",t]]);export{m as __pageData,b as default};
