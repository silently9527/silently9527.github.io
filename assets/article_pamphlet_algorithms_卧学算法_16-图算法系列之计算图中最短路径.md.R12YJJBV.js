import{_ as t}from"./chunks/ArticleMetadata.IwlMn1X8.js";import{_ as c,D as r,o as p,c as o,I as h,w as d,k as e,a as u,R as g,b as m,e as b}from"./chunks/framework.412fhWlr.js";import"./chunks/md5.6OGdLw3O.js";const x=JSON.parse('{"title":"图算法系列之计算图中最短路径","description":"","frontmatter":{"title":"图算法系列之计算图中最短路径","author":"Herman","date":"2021/08/14 13:58","categories":["算法"],"tags":["广度优先搜索","图算法"]},"headers":[],"relativePath":"article/pamphlet/algorithms/卧学算法/16-图算法系列之计算图中最短路径.md","filePath":"article/pamphlet/algorithms/卧学算法/16-图算法系列之计算图中最短路径.md","lastUpdated":1723379826000}'),v={name:"article/pamphlet/algorithms/卧学算法/16-图算法系列之计算图中最短路径.md"},k=e("h1",{id:"图算法系列之计算图中最短路径",tabindex:"-1"},[u("图算法系列之计算图中最短路径 "),e("a",{class:"header-anchor",href:"#图算法系列之计算图中最短路径","aria-label":'Permalink to "图算法系列之计算图中最短路径"'},"​")],-1),f=g(`<h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>在前面两篇中我们通过深度优先搜索可以从图中找出一条通过顶点v到顶点w的路径，但是深度优先搜索与顶点的输入有很大的关系，找出来的路径也不一定是最短的，通常情况下我们很多时候需要找出图中的最短路径，比如：地图功能。这里我们就需要使用到广度优先搜索算法</p><h2 id="广度优先搜索" tabindex="-1">广度优先搜索 <a class="header-anchor" href="#广度优先搜索" aria-label="Permalink to &quot;广度优先搜索&quot;">​</a></h2><p>依然使用之前定义的寻找路径的API</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class Paths {</span></span>
<span class="line"><span>    Paths(Graph graph, int s);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    boolean hasPathTo(int v); //判断出从s-&gt;v是否存在路径</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    Iterable&lt;Integer&gt; pathTo(int v); //如果存在路径，返回路径</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在广度优先搜索中，为了找出最短路径，我们需要按照起点的顺序来遍历所有的顶点，而不在是使用递归来实现；算法的思路：</p><ol><li>使用队列来保存已经被标记过但是邻接表还未被遍历过的顶点</li><li>取出队列中的下一个顶点v并标记它</li><li>将v相邻的所有未被标记的顶点加入到队列</li></ol><p>在该算法中，为了保存路径，我们依然需要使用一个边的数组edgeTo[]，用一颗父链树来表示根节点到所有连通顶点的最短路径。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class BreadthFirstPaths {</span></span>
<span class="line"><span>    private boolean marked[];</span></span>
<span class="line"><span>    private int[] edgeTo;</span></span>
<span class="line"><span>    private int s;</span></span>
<span class="line"><span>    private Queue&lt;Integer&gt; queue = new LinkedListQueue&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public BreadthFirstPaths(Graph graph, int s) {</span></span>
<span class="line"><span>        this.s = s;</span></span>
<span class="line"><span>        this.marked = new boolean[graph.V()];</span></span>
<span class="line"><span>        this.edgeTo = new int[graph.V()];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        bfs(graph, s);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void bfs(Graph graph, int s) {</span></span>
<span class="line"><span>        this.marked[s] = true;</span></span>
<span class="line"><span>        this.queue.enqueue(s);</span></span>
<span class="line"><span>        while (!this.queue.isEmpty()) {</span></span>
<span class="line"><span>            Integer v = this.queue.dequeue();</span></span>
<span class="line"><span>            for (int w : graph.adj(v)) {</span></span>
<span class="line"><span>                if (!this.marked[w]) {</span></span>
<span class="line"><span>                    this.marked[w] = true;</span></span>
<span class="line"><span>                    this.edgeTo[w] = v;</span></span>
<span class="line"><span>                    this.queue.enqueue(w);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean hasPathTo(int v) {</span></span>
<span class="line"><span>        return this.marked[v];</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>以下图为列，来看看广度优先搜索的运行轨迹</p><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0965db8ae1cd4b84ab7453e31c768db1~tplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8c5b8f000754f0f8bb3027dc531b2c0~tplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>单元测试的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>@Test</span></span>
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
<span class="line"><span>    BreadthFirstPaths paths = new BreadthFirstPaths(graph, 0);</span></span>
<span class="line"><span>    System.out.println(paths.hasPathTo(5));</span></span>
<span class="line"><span>    System.out.println(paths.hasPathTo(2));</span></span>
<span class="line"><span>    System.out.println(paths.hasPathTo(6));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    paths.pathTo(5).forEach(System.out::print);</span></span>
<span class="line"><span>    System.out.println();</span></span>
<span class="line"><span>    paths.pathTo(4).forEach(System.out::print);</span></span>
<span class="line"><span>    System.out.println();</span></span>
<span class="line"><span>    paths.pathTo(2).forEach(System.out::print);</span></span>
<span class="line"><span>    System.out.println();</span></span>
<span class="line"><span>    paths.pathTo(3).forEach(System.out::print);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行的结果与我们分析的运行轨迹一致</p><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccd3716f1c514baf9238b8fa83300075~tplv-k3u1fbpfcp-zoom-1.image" alt=""></p><h2 id="符号图" tabindex="-1">符号图 <a class="header-anchor" href="#符号图" aria-label="Permalink to &quot;符号图&quot;">​</a></h2><p>最近几篇文章一起学习到的图算法都是以数字作为了顶点，是因为数字来实现这些算法会非常的简洁方便，但是在实际的场景中，通常都是使用的字符作为顶点而非数字，比如：地图上的位置、电影与演员的关系。</p><p>为了满足实际的场景，我们只需要在数字与字符串的关系做一个映射，此时我们会想到之前文章实现的map(通过二叉树实现map、红黑树实现map、哈希表实现map等等，有兴趣的同学可以去翻翻)，使用Map来维护字符串和数字的映射关系。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public interface SymbolGraph {</span></span>
<span class="line"><span>    boolean contains(String key); //判断是否存在顶点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int index(String key); //通过名称返回对应的数字顶点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String name(int v); //通过数字顶点返回对应的字符名称</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Graph graph();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>实现的思路：</p><ol><li>使用Map来保存字符串-数字的映射，key为字符串，value为数字</li><li>使用一个数组来反向映射数字-字符串，数组的下标对应数字顶点，值对应字符串名称</li></ol><p>假设构造图的顶点与边是通过字符串来表示的，如：<code>a,b,c,d\\nb,a,h,l,p\\ng,s,z</code> 使用\\n分隔的每段第一个字符串表示顶点v，后面的表示与顶点v相连的相邻顶点；</p><blockquote><p>实际的过程可以根据具体情况来确定，不一定非得这种字符串，可以来源于数据库，也可以来源于网路的请求。</p></blockquote><p>代码实现如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class SymbolGraph {</span></span>
<span class="line"><span>    private Map&lt;String, Integer&gt; map = new RedBlack23RedBlackTreeMap&lt;&gt;();</span></span>
<span class="line"><span>    private String[] keys;</span></span>
<span class="line"><span>    private Graph graph;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public SymbolGraph(String text) {</span></span>
<span class="line"><span>        Arrays.stream(text.split(&quot;\\n&quot;)).forEach(line -&gt; {</span></span>
<span class="line"><span>            String[] split = line.split(&quot;,&quot;);</span></span>
<span class="line"><span>            for (int i = 0; i &lt; split.length; i++) {</span></span>
<span class="line"><span>                map.put(split[i], i);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this.keys = new String[map.size()];</span></span>
<span class="line"><span>        map.keys().forEach(key -&gt; {</span></span>
<span class="line"><span>            this.keys[this.map.get(key)] = key;</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this.graph = new Graph(this.keys.length);</span></span>
<span class="line"><span>        Arrays.stream(text.split(&quot;\\n&quot;)).forEach(line -&gt; {</span></span>
<span class="line"><span>            String[] split = line.split(&quot;,&quot;);</span></span>
<span class="line"><span>            int v = this.map.get(split[0]);</span></span>
<span class="line"><span>            for (int i = 1; i &lt; split.length; i++) {</span></span>
<span class="line"><span>                this.graph.addEdge(v, this.map.get(split[i]));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean contains(String key) {</span></span>
<span class="line"><span>        return map.contains(key);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int index(String key) {</span></span>
<span class="line"><span>        return map.get(key);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String name(int index) {</span></span>
<span class="line"><span>        return this.keys[index];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Graph graph() {</span></span>
<span class="line"><span>        return this.graph;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        System.out.println(Arrays.toString(&quot;323\\n2323&quot;.split(&quot;\\n&quot;)));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,26);function y(s,_,S,q,T,w){const l=t,i=r("ClientOnly");return p(),o("div",null,[k,h(i,null,{default:d(()=>{var n,a;return[(((n=s.$frontmatter)==null?void 0:n.aside)??!0)&&(((a=s.$frontmatter)==null?void 0:a.showArticleMetadata)??!0)?(p(),m(l,{key:0,article:s.$frontmatter},null,8,["article"])):b("",!0)]}),_:1}),f])}const I=c(v,[["render",y]]);export{x as __pageData,I as default};
