import{_ as t}from"./chunks/ArticleMetadata.IwlMn1X8.js";import{_ as r,D as c,o as p,c as o,I as d,w as m,k as l,a as h,R as u,b as g,e as b}from"./chunks/framework.412fhWlr.js";import"./chunks/md5.6OGdLw3O.js";const P=JSON.parse('{"title":"死磕归并排序算法","description":"","frontmatter":{"title":"死磕归并排序算法","author":"Herman","date":"2021/08/14 13:58","categories":["算法"],"tags":["数据结构","排序算法"]},"headers":[],"relativePath":"article/pamphlet/algorithms/卧学算法/05-死磕归并排序算法.md","filePath":"article/pamphlet/algorithms/卧学算法/05-死磕归并排序算法.md","lastUpdated":1723379536000}'),v={name:"article/pamphlet/algorithms/卧学算法/05-死磕归并排序算法.md"},y=l("h1",{id:"死磕归并排序算法",tabindex:"-1"},[h("死磕归并排序算法 "),l("a",{class:"header-anchor",href:"#死磕归并排序算法","aria-label":'Permalink to "死磕归并排序算法"'},"​")],-1),k=u(`<blockquote><p>微信公众号：贝塔学Java</p></blockquote><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>在上一篇《常见的初级排序算法，这次全搞懂》，主要谈了常用的初级算法，这些算法的时间复杂度都是O(n²)，这些算法无法处理大量数据；本篇我们谈一种基于归并操作完成排序的算法。</p><h2 id="归并排序算法思路" tabindex="-1">归并排序算法思路 <a class="header-anchor" href="#归并排序算法思路" aria-label="Permalink to &quot;归并排序算法思路&quot;">​</a></h2><p>要将一个数组排序，可以先将数组分为两个数组分别排序，然后再将结果归并在一起，重复递归这个过程，直到数组整体有序，这就是归并排序的算法思路。</p><p>归并排序的优点是它能够保证任意长度为N的数组排序所需的时间与 NlogN 成正比，这个优点是初级排序无法达到的。</p><p>缺点是因为归并操作需要引入额外的数组，额外的空间与N成正比</p><h2 id="原地归并实现" tabindex="-1">原地归并实现 <a class="header-anchor" href="#原地归并实现" aria-label="Permalink to &quot;原地归并实现&quot;">​</a></h2><p>在实现归并排序之前，我们需要先完成两个有序数组的归并操作，即将两个有序的数组合并成一个有序的数组；</p><ul><li>在此过程中我们需要引入一个辅助数组；</li><li>定义的方法签名为merge(a, lo, mid, hi)，这个方法将数组a[lo..mid]与a[mid..hi]归并成一个有序的数组，结果存放到a[lo..mid]中；</li><li>该方法中需要使用的上一篇中的公共函数 <code>less</code> ，参考上一篇文章《常见的初级排序算法，这次全搞懂》</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class MergeSort implements SortTemplate {</span></span>
<span class="line"><span>    private Comparable[] aux;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void sort(Comparable[] array) {</span></span>
<span class="line"><span>        //待实现</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void merge(Comparable[] a, int lo, int mid, int hi) {</span></span>
<span class="line"><span>        for (int i = lo; i &lt;= hi; i++) {</span></span>
<span class="line"><span>            aux[i] = a[i];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        int i = lo, j = mid + 1;</span></span>
<span class="line"><span>        for (int k = lo; k &lt;= hi; k++) {</span></span>
<span class="line"><span>            if (i &gt; mid) {</span></span>
<span class="line"><span>                a[k] = aux[j++];</span></span>
<span class="line"><span>            } else if (j &gt; hi) {</span></span>
<span class="line"><span>                a[k] = aux[i++];</span></span>
<span class="line"><span>            } else if (less(aux[i], aux[j])) {</span></span>
<span class="line"><span>                a[k] = aux[i++];</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                a[k] = aux[j++];</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="自顶向下的归并排序" tabindex="-1">自顶向下的归并排序 <a class="header-anchor" href="#自顶向下的归并排序" aria-label="Permalink to &quot;自顶向下的归并排序&quot;">​</a></h2><p>基于分而治之的思想，大的数组排序，先递归拆分成小的数组，保证小的数组有序再归并，直到整个数组有序，这个操作就是自顶向下的归并排序</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class MergeSort implements SortTemplate {</span></span>
<span class="line"><span>    private Comparable[] aux;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void sort(Comparable[] array) {</span></span>
<span class="line"><span>        aux = new Comparable[array.length];</span></span>
<span class="line"><span>        doSort(array, 0, array.length - 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void doSort(Comparable[] array, int lo, int hi) {</span></span>
<span class="line"><span>        if (lo &gt;= hi) {</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        int mid = (hi - lo) / 2 + lo;</span></span>
<span class="line"><span>        doSort(array, lo, mid);</span></span>
<span class="line"><span>        doSort(array, mid + 1, hi);</span></span>
<span class="line"><span>        merge(array, lo, mid, hi);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void merge(Comparable[] a, int lo, int mid, int hi) {</span></span>
<span class="line"><span>        //省略</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上代码是标准的递归归并排序操作，但是经过仔细思考之后，该算法还有可以优化的地方</p><ol><li><strong>测试数组是否已经有序</strong>；如果a[mid]&lt;=a[mid+1]，那么我们就可以跳过merge方法，减少merge操作；修复之后的doSort方法</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>private void doSort(Comparable[] array, int lo, int hi) {</span></span>
<span class="line"><span>    if (lo &gt;= hi) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int mid = (hi - lo) / 2 + lo;</span></span>
<span class="line"><span>    doSort(array, lo, mid);</span></span>
<span class="line"><span>    doSort(array, mid + 1, hi);</span></span>
<span class="line"><span>    if (array[mid].compareTo(array[mid + 1]) &gt;= 0) {</span></span>
<span class="line"><span>        merge(array, lo, mid, hi);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li><strong>对于小规模的数组可以是用插入排序</strong>；对于小规模的数组使用归并排序会增加递归调用栈，所以我们可以考虑使用插入排序来处理子数组的排序</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>private void doSort(Comparable[] array, int lo, int hi) {</span></span>
<span class="line"><span>    if (lo &gt;= hi) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (hi - lo &lt; 5) { //测试，小于5就使用插入排序</span></span>
<span class="line"><span>        insertionSort(array, lo, hi);</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int mid = (hi - lo) / 2 + lo;</span></span>
<span class="line"><span>    doSort(array, lo, mid);</span></span>
<span class="line"><span>    doSort(array, mid + 1, hi);</span></span>
<span class="line"><span>    if (less(array[mid + 1], array[mid])) {</span></span>
<span class="line"><span>        merge(array, lo, mid, hi);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//插入排序</span></span>
<span class="line"><span>private void insertionSort(Comparable[] array, int lo, int hi) {</span></span>
<span class="line"><span>    for (int i = lo; i &lt;= hi; i++) {</span></span>
<span class="line"><span>        for (int j = i; j &gt; lo &amp;&amp; less(array[j], array[j - 1]); j--) {</span></span>
<span class="line"><span>            exch(array, j, j - 1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="3"><li><strong>节省复制元素到辅助数组的时间</strong>；要实现该操作较麻烦，需要在每一层递归的时候交换输入数据和输出数组的角色；修改之后的完整代码如下：</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class MergeSort implements SortTemplate {</span></span>
<span class="line"><span>    private Comparable[] aux;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void sort(Comparable[] array) {</span></span>
<span class="line"><span>        aux = array.clone();</span></span>
<span class="line"><span>        doSort(aux, array, 0, array.length - 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void doSort(Comparable[] src, Comparable[] dest, int lo, int hi) {</span></span>
<span class="line"><span>        if (lo &gt;= hi) {</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (hi - lo &lt; 5) { //测试，小于5就使用插入排序</span></span>
<span class="line"><span>            insertionSort(dest, lo, hi);</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int mid = (hi - lo) / 2 + lo;</span></span>
<span class="line"><span>        doSort(dest, src, lo, mid);</span></span>
<span class="line"><span>        doSort(dest, src, mid + 1, hi);</span></span>
<span class="line"><span>        if (less(src[mid + 1], src[mid])) {</span></span>
<span class="line"><span>            merge(src, dest, lo, mid, hi);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //插入排序</span></span>
<span class="line"><span>    private void insertionSort(Comparable[] array, int lo, int hi) {</span></span>
<span class="line"><span>        for (int i = lo; i &lt;= hi; i++) {</span></span>
<span class="line"><span>            for (int j = i; j &gt; lo &amp;&amp; less(array[j], array[j - 1]); j--) {</span></span>
<span class="line"><span>                exch(array, j, j - 1);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void merge(Comparable[] src, Comparable[] dest, int lo, int mid, int hi) {</span></span>
<span class="line"><span>        int i = lo, j = mid + 1;</span></span>
<span class="line"><span>        for (int k = lo; k &lt;= hi; k++) {</span></span>
<span class="line"><span>            if (i &gt; mid) {</span></span>
<span class="line"><span>                dest[k] = src[j++];</span></span>
<span class="line"><span>            } else if (j &gt; hi) {</span></span>
<span class="line"><span>                dest[k] = src[i++];</span></span>
<span class="line"><span>            } else if (less(src[i], src[j])) {</span></span>
<span class="line"><span>                dest[k] = src[i++];</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                dest[k] = src[j++];</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>每一层递归操作都会让子数组有序，但是子数组可能是aux[lo..hi]也有可能是a[lo..hi]；由于第一次调用doSort传入的是src=aux，dest=array，所以递归最后的结果一定是输入到了array中，保证了array整体排序完成</p><h2 id="自底向上的归并排序" tabindex="-1">自底向上的归并排序 <a class="header-anchor" href="#自底向上的归并排序" aria-label="Permalink to &quot;自底向上的归并排序&quot;">​</a></h2><p>实现归并算法还有另一种思路，就是先归并哪些小的数组，然后再成对归并得到子数组，直到整个数组有序</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class MergeSort implements SortTemplate {</span></span>
<span class="line"><span>    private Comparable[] aux;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void sort(Comparable[] array) {</span></span>
<span class="line"><span>        int length = array.length;</span></span>
<span class="line"><span>        aux = new Comparable[length];</span></span>
<span class="line"><span>        for (int sz = 1; sz &lt; length; sz += sz) {</span></span>
<span class="line"><span>            for (int i = 0; i &lt; length - sz; i += 2 * sz) {</span></span>
<span class="line"><span>                merge(array, i, i + sz - 1, Math.min(i + 2 * sz - 1, length - 1));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void merge(Comparable[] a, int lo, int mid, int hi) {</span></span>
<span class="line"><span>        for (int i = lo; i &lt;= hi; i++) {</span></span>
<span class="line"><span>            aux[i] = a[i];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        int i = lo, j = mid + 1;</span></span>
<span class="line"><span>        for (int k = lo; k &lt;= hi; k++) {</span></span>
<span class="line"><span>            if (i &gt; mid) {</span></span>
<span class="line"><span>                a[k] = aux[j++];</span></span>
<span class="line"><span>            } else if (j &gt; hi) {</span></span>
<span class="line"><span>                a[k] = aux[i++];</span></span>
<span class="line"><span>            } else if (less(aux[i], aux[j])) {</span></span>
<span class="line"><span>                a[k] = aux[i++];</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                a[k] = aux[j++];</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span></span></span></code></pre></div>`,26);function f(a,_,C,x,S,j){const i=t,e=c("ClientOnly");return p(),o("div",null,[y,d(e,null,{default:m(()=>{var s,n;return[(((s=a.$frontmatter)==null?void 0:s.aside)??!0)&&(((n=a.$frontmatter)==null?void 0:n.showArticleMetadata)??!0)?(p(),g(i,{key:0,article:a.$frontmatter},null,8,["article"])):b("",!0)]}),_:1}),k])}const z=r(v,[["render",f]]);export{P as __pageData,z as default};
