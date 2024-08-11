import{_ as n,o as s,c as a,R as p}from"./chunks/framework.412fhWlr.js";const b=JSON.parse('{"title":"如何检测社交网络中两个人是否是朋友关系（union-find算法）","description":"","frontmatter":{"title":"如何检测社交网络中两个人是否是朋友关系（union-find算法）","date":"2021-08-14T13:57:36.496Z","updated":"2021-08-15T12:03:03.108Z","url":"/?p=41","categories":"算法","tags":null},"headers":[],"relativePath":"article/pamphlet/algorithms/基础算法/如何检测社交网络中两个人是否是朋友关系（union-find算法）.md","filePath":"article/pamphlet/algorithms/基础算法/如何检测社交网络中两个人是否是朋友关系（union-find算法）.md","lastUpdated":1723372096000}'),i={name:"article/pamphlet/algorithms/基础算法/如何检测社交网络中两个人是否是朋友关系（union-find算法）.md"},l=p(`<h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>春节放假会了老家，停更了很多天，这是年后连夜肝出来的第一篇文章，先来聊聊春节放假期间发生的事，这次回家遇到了我学生时代的女神，当年她在我心目中那是</p><blockquote><p>&quot;出淤泥而不染、濯清涟而不妖&quot;</p></blockquote><p>没想到这次遇到了她，身体发福，心目中女神的形象瞬间碎了，就像达芬奇再次遇到了蒙娜丽莎</p><blockquote><p>&quot;菡萏香销翠叶残&quot;</p></blockquote><p>好了，言归正传。</p><p>有时候我们可以需要判断在大型网络中两台计算机是否相连，是否需要建立一条新的连接才能通信；或者是在社交网络中判断两个人是否是朋友关系（相连表示是朋友关系）。在这种应用中，通常我们可能需要处理数百万的对象和数亿的连接，如何能够快速的判断出是否相连呢？这就需要使用到union-find算法</p><h2 id="概念" tabindex="-1">概念 <a class="header-anchor" href="#概念" aria-label="Permalink to &quot;概念&quot;">​</a></h2><h4 id="相连" tabindex="-1">相连 <a class="header-anchor" href="#相连" aria-label="Permalink to &quot;相连&quot;">​</a></h4><p>假如输入一对整数，其中每个数字表示的是某种对象（人、地址或者计算机等等），整数对p,q理解为“p与q相连”，相连具有以下特性：</p><ul><li>自反性：p与p是相连的</li><li>对称性：如果p与q相连，那么q与p相连</li><li>传递性：如果p与q相连，q与r相连，那么p与r也相连</li></ul><blockquote><p>对象如何与数字关联起来，后面我们聊到一种算法符号表</p></blockquote><h4 id="等价类" tabindex="-1">等价类 <a class="header-anchor" href="#等价类" aria-label="Permalink to &quot;等价类&quot;">​</a></h4><p>假设相连是一个种等价关系，那么等价关系能够将对象划分为多个等价类，在该算法中，当且仅当两个对象相连时他们才属于同一个等价类</p><h4 id="触点" tabindex="-1">触点 <a class="header-anchor" href="#触点" aria-label="Permalink to &quot;触点&quot;">​</a></h4><p>整个网络中的某种对象称为触点</p><h4 id="连通分量" tabindex="-1">连通分量 <a class="header-anchor" href="#连通分量" aria-label="Permalink to &quot;连通分量&quot;">​</a></h4><p>将整数对称为连接，将等价类称作连通分量或者简称分量</p><p><img src="https://tva1.sinaimg.cn/large/008eGmZEgy1gnquyr8nktj30te0o812y.jpg" alt=""></p><h4 id="动态连通性" tabindex="-1">动态连通性 <a class="header-anchor" href="#动态连通性" aria-label="Permalink to &quot;动态连通性&quot;">​</a></h4><p>union-find算法的目标是当程序从输入中读取了整数对p q时，如果已知的所有整数对都不能说明p q是相连的，那么将这一对整数输出，否则忽略掉这对整数；我们需要设计数据结构来保存已知的所有整数对的信息，判断出输入的整数对是否是相连的，这种问题叫做动态连通性问题。</p><h2 id="union-find算法api定义" tabindex="-1">union-find算法API定义 <a class="header-anchor" href="#union-find算法api定义" aria-label="Permalink to &quot;union-find算法API定义&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public interface UF {</span></span>
<span class="line"><span>    void union(int p, int q); //在p与q之间添加一条连接</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int find(int p); //返回p所在分量的标识符</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    boolean connected(int p, int q); //判断出p与q是否存在于同一个分量中</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int count(); //统计出连通分量的数量</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果两个触点在不同的分量中，union操作会使两个分量归并。一开始我们有N个分量（每个触点表示一个分量），将两个分量归并之后数量减一。</p><p>抽象实现如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public abstract class AbstractUF implements UF {</span></span>
<span class="line"><span>    protected int[] id;</span></span>
<span class="line"><span>    protected int count;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public AbstractUF(int N) {</span></span>
<span class="line"><span>        count = N;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        id = new int[N];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; N; i++) {</span></span>
<span class="line"><span>            id[i] = i;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean connected(int p, int q) {</span></span>
<span class="line"><span>        return find(p) == find(q);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int count() {</span></span>
<span class="line"><span>        return count;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来我们就主要来讨论如何实现union方法和find方法</p><h2 id="quick-find算法" tabindex="-1">quick-find算法 <a class="header-anchor" href="#quick-find算法" aria-label="Permalink to &quot;quick-find算法&quot;">​</a></h2><p>这种算法的实现思路是在同一个连通分量中所有触点在id[]中的值都是相同的，判断是否连通的connected的方法就是判断id[p]是否等于id[q]。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class QuickFindImpl extends AbstractUF {</span></span>
<span class="line"><span>    public QuickFindImpl(int N) {</span></span>
<span class="line"><span>        super(N);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int find(int p) {</span></span>
<span class="line"><span>        return id[p];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void union(int p, int q) {</span></span>
<span class="line"><span>        int pId = find(p);</span></span>
<span class="line"><span>        int qId = find(q);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (pId == qId) { //如果相等表示p与q已经属于同一分量中</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int i = 0; i &lt; id.length; i++) {</span></span>
<span class="line"><span>            if (id[i] == pId) {</span></span>
<span class="line"><span>                id[i] = qId; //把分量中所有的值都统一成qId</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        count--; //连通分量数减一</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>算法分析： find()操作显然是很快的，时间复杂度O(1), 但是union的算法是无法处理大型数据的，因为每次都需要变量整个数组，那么union方法的时间复杂度是O(n)</li></ul><h2 id="quick-union算法" tabindex="-1">quick-union算法 <a class="header-anchor" href="#quick-union算法" aria-label="Permalink to &quot;quick-union算法&quot;">​</a></h2><p>为了提高union方法的速度，我们需要考虑另外一种算法；使用同样的数据结构，只是重新定义id[]表示的意义，每个触点所对应的id[]值都是在同一分量中的另一个触点的名称</p><p><img src="https://tva1.sinaimg.cn/large/008eGmZEgy1gnqwakuizxj30p40gotdj.jpg" alt=""></p><p>在数组初始化之后，每个节点的链接都指向自己；id[]数组用<code>父链接</code>的形式表示了<code>森林</code>，每一次union操作都会找出每个分量的<code>根节点</code>进行归并。</p><p><img src="https://tva1.sinaimg.cn/large/008eGmZEgy1gnqwjdd6gpj30pq0yythe.jpg" alt=""></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class QuickUnionImpl extends AbstractUF {</span></span>
<span class="line"><span>    public QuickUnionImpl(int N) {</span></span>
<span class="line"><span>        super(N);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int find(int p) {</span></span>
<span class="line"><span>        //找出p所在分量的根触点</span></span>
<span class="line"><span>        while (p != id[p]) {</span></span>
<span class="line"><span>            p = id[p];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return p;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void union(int p, int q) {</span></span>
<span class="line"><span>        int pRoot = find(p); //找出q p的根触点</span></span>
<span class="line"><span>        int qRoot = find(q);</span></span>
<span class="line"><span>        if (pRoot == qRoot) { //处于同一分量不做处理</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        id[pRoot] = qRoot; //根节点</span></span>
<span class="line"><span>        count--;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>算法分析： 看起来quick-union算法比quick-find算法更快，因为union不需要为每对输入遍历整个数组， 考虑最佳情况下，find方法只需要访问一次数组就可以得到根触点，那么union方法的时间复杂度O(n)； 考虑到最糟糕的输入情况，如下图：</li></ul><p><img src="https://tva1.sinaimg.cn/large/008eGmZEgy1gnqxeav0cmj30k00k2goc.jpg" alt=""></p><p>find方法需要访问数组n-1次，那么union方法的时间复杂度是O(n²)</p><h2 id="加权quick-union算法" tabindex="-1">加权quick-union算法 <a class="header-anchor" href="#加权quick-union算法" aria-label="Permalink to &quot;加权quick-union算法&quot;">​</a></h2><p>为了保证quick-union算法最糟糕的情况不在出现，我需要记录每一个树的大小，在进行分量归并操作时总是把小的树连接到大的树上，这种算法构造出来树的高度会远远小于未加权版本所构造的树高度。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class WeightedQuickUnionImpl extends AbstractUF {</span></span>
<span class="line"><span>    private int[] sz;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public WeightedQuickUnionImpl(int N) {</span></span>
<span class="line"><span>        super(N);</span></span>
<span class="line"><span>        sz = new int[N];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; N; i++) {</span></span>
<span class="line"><span>            sz[i] = 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void union(int p, int q) {</span></span>
<span class="line"><span>        int pRoot = find(p); //找出q p的根触点</span></span>
<span class="line"><span>        int qRoot = find(q);</span></span>
<span class="line"><span>        if (pRoot == qRoot) { //处于同一分量不做处理</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //小树合并到大树</span></span>
<span class="line"><span>        if (sz[pRoot] &lt; sz[qRoot]) {</span></span>
<span class="line"><span>            sz[qRoot] += sz[pRoot]; </span></span>
<span class="line"><span>            id[pRoot] = qRoot;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            sz[pRoot] += sz[qRoot];</span></span>
<span class="line"><span>            id[qRoot] = pRoot;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        count--;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int find(int p) {</span></span>
<span class="line"><span>        //找出p所在分量的根触点</span></span>
<span class="line"><span>        while (p != id[p]) {</span></span>
<span class="line"><span>            p = id[p];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return p;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>算法分析： 最坏的情况下，每次union归并的树都是大小相等的，他们都包含了2的n次方个节点，高度都是n，合并之后的高度变成了n+1，由此可以得出union方法的时间复杂度是O(lgN)</li></ul><p><img src="https://tva1.sinaimg.cn/large/008eGmZEgy1gnqy1kcf0pj30uo0nudp9.jpg" alt=""></p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>union-find算法只能判断出给定的两个整数是否是相连的，无法给出具体达到的路径；后期我们聊到图算法可以给出具体的路径</p><table><thead><tr><th>算法</th><th>union()</th><th>find()</th></tr></thead><tbody><tr><td>quick-find算法</td><td>N</td><td>1</td></tr><tr><td>quick-union算法</td><td>树的高度</td><td>树的高度</td></tr><tr><td>加权quick-union算法</td><td>lgN</td><td>lgN</td></tr></tbody></table><hr><blockquote><p>参考书籍：算法第四版</p></blockquote>`,50),e=[l];function t(c,o,d,u,r,h){return s(),a("div",null,e)}const g=n(i,[["render",t]]);export{b as __pageData,g as default};
