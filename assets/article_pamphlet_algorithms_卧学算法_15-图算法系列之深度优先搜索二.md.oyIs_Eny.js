import{_ as t}from"./chunks/ArticleMetadata.4oKRY2Hc.js";import{_ as c,D as r,o as p,c as o,I as d,w as h,k as e,a as u,R as g,b as m,e as v}from"./chunks/framework.YqjYndaU.js";import"./chunks/md5.wJRuYMDo.js";const T=JSON.parse('{"title":"图算法系列之深度优先搜索（二）","description":"","frontmatter":{"title":"图算法系列之深度优先搜索（二）","author":"Herman","date":"2021/08/14 13:58","categories":["算法"],"tags":["深度优先搜索","图算法"]},"headers":[],"relativePath":"article/pamphlet/algorithms/卧学算法/15-图算法系列之深度优先搜索二.md","filePath":"article/pamphlet/algorithms/卧学算法/15-图算法系列之深度优先搜索二.md","lastUpdated":1723429417000}'),b={name:"article/pamphlet/algorithms/卧学算法/15-图算法系列之深度优先搜索二.md"},f=e("h1",{id:"图算法系列之深度优先搜索-二",tabindex:"-1"},[u("图算法系列之深度优先搜索（二） "),e("a",{class:"header-anchor",href:"#图算法系列之深度优先搜索-二","aria-label":'Permalink to "图算法系列之深度优先搜索（二）"'},"​")],-1),_=g(`<p>在上篇中我们学习了深度优先搜索，知道了如何通过深度优先搜索在图中寻找路径；本篇我们继续一起来学习深度优先搜索算法的其他应用场景</p><h2 id="连通分量" tabindex="-1">连通分量 <a class="header-anchor" href="#连通分量" aria-label="Permalink to &quot;连通分量&quot;">​</a></h2><p>从一幅图中找出所有的连通分量，这是也是深度优先搜索的一个应用场景。什么是连通分量？这个定义在之前的文章中已有提到<a href="https://juejin.cn/post/6930395454739841037" target="_blank" rel="noreferrer">《如何检测社交网络中两个人是否是朋友关系（union-find算法）》</a></p><p>在这篇采用的是union-find算法实现的连通性检查，本篇我们将采用深度优先搜索的方式来找出图中的所有连通分量</p><h4 id="连通分量的api定义" tabindex="-1">连通分量的API定义 <a class="header-anchor" href="#连通分量的api定义" aria-label="Permalink to &quot;连通分量的API定义&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class DepthFirstCC {</span></span>
<span class="line"><span>    public DepthFirstCC(Graph graph); </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public boolean connected(int v, int w); //检查两个顶点是否连通</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int count(); //统计连通分量的总数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int id(int v); //顶点v所在连通分量的标识</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="连通分量的api实现" tabindex="-1">连通分量的API实现 <a class="header-anchor" href="#连通分量的api实现" aria-label="Permalink to &quot;连通分量的API实现&quot;">​</a></h4><p>与之前一样没扫描到一个顶点我们就需要标记这个顶点，所以依然需要定义一个marked[]数组</p><p>为了统计出图中总共有多少连通分量，所以需要定义一个变量count</p><p>为了判断两个顶点是否相连，我们需要把相连的顶点对应的标识值记录成相同值，当在调用connected方法的时候直接取出两个顶点的标识值比较，如果相同就是连通的，否则就是非连通；</p><p>这个的标识值我们使用的是count的值，每个顶点都需要存一个标识值，所以还需要一个ids[]数组。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class DepthFirstCC {</span></span>
<span class="line"><span>    private boolean marked[];</span></span>
<span class="line"><span>    private int count;</span></span>
<span class="line"><span>    private int[] ids;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public DepthFirstCC(Graph graph) {</span></span>
<span class="line"><span>        this.marked = new boolean[graph.V()];</span></span>
<span class="line"><span>        this.ids = new int[graph.V()];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int v = 0; v &lt; graph.V(); v++) {</span></span>
<span class="line"><span>            if (!this.marked[v]) {</span></span>
<span class="line"><span>                dfs(graph, v);</span></span>
<span class="line"><span>                count++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void dfs(Graph graph, int v) {</span></span>
<span class="line"><span>        this.marked[v] = true;</span></span>
<span class="line"><span>        this.ids[v] = count;</span></span>
<span class="line"><span>        for (int w : graph.adj(v)) {</span></span>
<span class="line"><span>            if (!this.marked[w]) {</span></span>
<span class="line"><span>                dfs(graph, w);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean connected(int v, int w) {</span></span>
<span class="line"><span>        return id(v) == id(w);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int count() {</span></span>
<span class="line"><span>        return count;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int id(int v) {</span></span>
<span class="line"><span>        return ids[v];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="单元测试" tabindex="-1">单元测试 <a class="header-anchor" href="#单元测试" aria-label="Permalink to &quot;单元测试&quot;">​</a></h4><p><img src="https://raw.githubusercontent.com/silently9527/images/main/d5dd95fdc26242ffaacd395891193375%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>构造这样一个图，连通分量的总数应该是3</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void test() {</span></span>
<span class="line"><span>    Graph graph = new Graph(10);</span></span>
<span class="line"><span>    graph.addEdge(0, 1);</span></span>
<span class="line"><span>    graph.addEdge(0, 2);</span></span>
<span class="line"><span>    graph.addEdge(0, 5);</span></span>
<span class="line"><span>    graph.addEdge(1, 3);</span></span>
<span class="line"><span>    graph.addEdge(2, 4);</span></span>
<span class="line"><span>    graph.addEdge(4, 3);</span></span>
<span class="line"><span>    graph.addEdge(5, 3);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    graph.addEdge(6, 7);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    graph.addEdge(8, 9);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DepthFirstCC cc = new DepthFirstCC(graph);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    System.out.println(cc.connected(0,5));</span></span>
<span class="line"><span>    System.out.println(cc.connected(1,2));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    System.out.println(cc.count());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="https://raw.githubusercontent.com/silently9527/images/main/d59c6123ec994ac9b55c65464f561c12%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><blockquote><p>基于深度优先搜索实现的连通性检查理论上说要比以前实现的union-find算法更快，因为检查连通性深度优先搜索实现的版本能够保证在常量时间内完成，而union-find算法不行；</p><p>但是union-find也有自己的优势: 不需要把完整的构造并表示一张图，更重要的是union-find算法是动态的添加节点。</p></blockquote><h2 id="检查无向图中是否有环" tabindex="-1">检查无向图中是否有环 <a class="header-anchor" href="#检查无向图中是否有环" aria-label="Permalink to &quot;检查无向图中是否有环&quot;">​</a></h2><p>为了减小实现的复杂度，我们假设图中不存在自环和平行边；</p><p>假如从顶点v出发存在环，表示从顶点v出发的连通分量中某个顶点的邻接顶点是v，那么在搜索的过程中必定会再次遇到顶点v</p><p>实现的思路：</p><ol><li>标记已经搜索过的每个顶点</li><li>当遇到了一个已经被标记过的顶点，表示已经图中存在环；</li><li>由于图是无向图，如果v-w相连，那么顶点v中的邻接表中有w，w邻接表中也会有v，但是他们没有构成环，所以需要排除掉该情况。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class Cycle {</span></span>
<span class="line"><span>    private boolean marked[];</span></span>
<span class="line"><span>    private boolean hashCycle;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Cycle(Graph graph) {</span></span>
<span class="line"><span>        this.marked = new boolean[graph.V()];</span></span>
<span class="line"><span>        for (int s = 0; s &lt; graph.V(); s++) {</span></span>
<span class="line"><span>            if (!this.marked[s]) {</span></span>
<span class="line"><span>                dfs(graph, s, s);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void dfs(Graph graph, int v, int pV) {</span></span>
<span class="line"><span>        this.marked[v] = true;</span></span>
<span class="line"><span>        for (int w : graph.adj(v)) {</span></span>
<span class="line"><span>            if (!this.marked[w]) {</span></span>
<span class="line"><span>                this.dfs(graph, w, v);</span></span>
<span class="line"><span>            } else if (w != pV) {</span></span>
<span class="line"><span>                this.hashCycle = true;</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean hasCycle() {</span></span>
<span class="line"><span>        return hashCycle;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>方法dfs的参数v表示需要待搜索的顶点，pV表示的是到达v的顶点，所以如果v的邻接表中有个顶点已被标记过并且该顶点不等于到达v的顶点，那么表示图中有环</p><h2 id="检查无向图是否是二分图" tabindex="-1">检查无向图是否是二分图 <a class="header-anchor" href="#检查无向图是否是二分图" aria-label="Permalink to &quot;检查无向图是否是二分图&quot;">​</a></h2><p>何为二分图? 图中每条边所连接的顶点都属于不同的部分；如下图：</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/e41927a074134d0c8782416244bef414%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>其中红色节点表示一个集合，白色节点是另一个集合，每条边连接的两个顶点属于不同的集合；</p><p>举个实际的例子就很好理解，电影与演员的关系，电影作为一个顶点，演员作为一个顶点，电影与电影直接是不会有边，演员与演员直接也不会有边，这就是一张二分图。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class TwoColorGraph {</span></span>
<span class="line"><span>    private boolean twoColor = true;</span></span>
<span class="line"><span>    private boolean[] marked;</span></span>
<span class="line"><span>    private boolean[] color;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public TwoColorGraph(Graph graph) {</span></span>
<span class="line"><span>        this.marked = new boolean[graph.V()];</span></span>
<span class="line"><span>        this.color = new boolean[graph.V()];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int v = 0; v &lt; graph.V(); v++) {</span></span>
<span class="line"><span>            if (!this.marked[v]) {</span></span>
<span class="line"><span>                dfs(graph, v);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void dfs(Graph graph, int v) {</span></span>
<span class="line"><span>        this.marked[v] = true;</span></span>
<span class="line"><span>        for (int w : graph.adj(v)) {</span></span>
<span class="line"><span>            if (!this.marked[w]) {</span></span>
<span class="line"><span>                this.color[w] = !this.color[v];</span></span>
<span class="line"><span>                dfs(graph, w);</span></span>
<span class="line"><span>            } else if (this.color[w] == this.color[v]) {</span></span>
<span class="line"><span>                this.twoColor = false;</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean isTwoColor() {</span></span>
<span class="line"><span>        return twoColor;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,31);function k(s,C,w,y,V,P){const l=t,i=r("ClientOnly");return p(),o("div",null,[f,d(i,null,{default:h(()=>{var a,n;return[(((a=s.$frontmatter)==null?void 0:a.aside)??!0)&&(((n=s.$frontmatter)==null?void 0:n.showArticleMetadata)??!0)?(p(),m(l,{key:0,article:s.$frontmatter},null,8,["article"])):v("",!0)]}),_:1}),_])}const x=c(b,[["render",k]]);export{T as __pageData,x as default};
