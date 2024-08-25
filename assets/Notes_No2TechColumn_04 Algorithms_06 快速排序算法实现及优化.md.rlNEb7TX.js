import{_ as a,c as s,o as n,aa as p}from"./chunks/framework.DtK4gh9F.js";const b=JSON.parse('{"title":"06 快速排序算法实现及优化","description":"","frontmatter":{"title":"06 快速排序算法实现及优化","author":"Herman","updateTime":"2024-07-16 21:34","desc":"快速排序算法实现及优化","categories":"算法","tags":"数据结构/排序算法","outline":"deep"},"headers":[],"relativePath":"Notes/No2TechColumn/04 Algorithms/06 快速排序算法实现及优化.md","filePath":"Notes/No2TechColumn/04 Algorithms/06 快速排序算法实现及优化.md","lastUpdated":1724593073000}'),l={name:"Notes/No2TechColumn/04 Algorithms/06 快速排序算法实现及优化.md"},i=p(`<h1 id="快速排序算法实现及优化" tabindex="-1">快速排序算法实现及优化 <a class="header-anchor" href="#快速排序算法实现及优化" aria-label="Permalink to &quot;快速排序算法实现及优化&quot;">​</a></h1><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>快速排序可以说是使用最广的排序算法了，主要的特点是基于原地排序（不需要使用辅助数组，节省空间）；其实对于长度为N的数组使用快速排序时间复杂度为 NlogN；在前几篇也一起讨论了其他的排序算法，都没能够把这两个特点结合起来。</p><h2 id="快速排序思路" tabindex="-1">快速排序思路 <a class="header-anchor" href="#快速排序思路" aria-label="Permalink to &quot;快速排序思路&quot;">​</a></h2><p>快速排序也是一种分治的排序算法，把数组划分为两个子数组，然后递归对子数组进行排序，最终保证整个数组有序。</p><p>算法思路：</p><ol><li>随机选择一个切分元素，通常选择的是数组的第一个元素</li><li>从数组的左边开始扫描找出大于等于切分元素的值，从数组的右边开始扫描找出小于等于切分元素的值，交换这两个值</li><li>循环这个过程直到左右两个指针相遇，这样就排定了一个元素，保证了切分元素左边的值都是小于它的值，右边的元素都是大于它的值</li><li>递归这个过程，最终保证整个数组有序</li></ol><h2 id="算法实现" tabindex="-1">算法实现 <a class="header-anchor" href="#算法实现" aria-label="Permalink to &quot;算法实现&quot;">​</a></h2><p>根据快速排序算法的思路，我们可以写出第一版实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class QuickSort implements SortTemplate {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void sort(Comparable[] array) {</span></span>
<span class="line"><span>        quickSort(array, 0, array.length - 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void quickSort(Comparable[] array, int lo, int hi) {</span></span>
<span class="line"><span>        if (lo &gt;= hi) {</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        int partition = partition(array, lo, hi);</span></span>
<span class="line"><span>        quickSort(array, lo, partition - 1);</span></span>
<span class="line"><span>        quickSort(array, partition + 1, hi);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private int partition(Comparable[] array, int lo, int hi) {</span></span>
<span class="line"><span>        int i = lo, j = hi + 1;</span></span>
<span class="line"><span>        Comparable el = array[lo];</span></span>
<span class="line"><span>        while (true) {</span></span>
<span class="line"><span>            while (less(array[++i], el)) {</span></span>
<span class="line"><span>                if (i == hi) {</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            while (less(el, array[--j])) {</span></span>
<span class="line"><span>                if (j == lo) {</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (i &gt;= j) {</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            exch(array, i, j);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        exch(array, lo, j);</span></span>
<span class="line"><span>        return j;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><blockquote><p>其中<code>exch</code> 、<code>less</code>方法的实现请看之前的文章《常见的初级排序算法，这次全搞懂》</p></blockquote><p>这段代码是实现快速排序的常规实现，考虑最糟糕的情况，假如需要排序的数组是已经有序的[1,2,3,4,5,6,7,8]，执行快速排序的过程如图：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/cb03927c97b54ebca0c2432c98d1c566%7Etplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>对一个长度为N的数组，最糟糕的情况下需要递归N-1次，所以时间复杂度是O(n²)，为了避免这种情况出现，我们来看下算法如何改进</p><h2 id="算法改进" tabindex="-1">算法改进 <a class="header-anchor" href="#算法改进" aria-label="Permalink to &quot;算法改进&quot;">​</a></h2><ul><li>保证随机性 为了避免最糟糕的情况出现，有两个办法，第一是在排序数组之前先随机打乱数组；第二是在partition方法中随机取切分元素，而不是固定取第一个，简单实现：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private int partition(Comparable[] array, int lo, int hi) {</span></span>
<span class="line"><span>    int i = lo, j = hi + 1;</span></span>
<span class="line"><span>    int random = new Random().nextInt(hi - lo) + lo;</span></span>
<span class="line"><span>    exch(array, lo, random);</span></span>
<span class="line"><span>    Comparable el = array[lo];</span></span>
<span class="line"><span>    while (true) {</span></span>
<span class="line"><span>        while (less(array[++i], el)) {</span></span>
<span class="line"><span>            if (i == hi) {</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        while (less(el, array[--j])) {</span></span>
<span class="line"><span>            if (j == lo) {</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (i &gt;= j) {</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        exch(array, i, j);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    exch(array, lo, j);</span></span>
<span class="line"><span>    return j;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>切换到插入排序 这点和归并排序一样，对于小数组的排序直接切换成插入排序</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void quickSort(Comparable[] array, int lo, int hi) {</span></span>
<span class="line"><span>    if (lo &gt;= hi) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if (hi - lo &lt; 5) {  //测试，小于5就切换到插入排序</span></span>
<span class="line"><span>        insertionSort(array, lo, hi);</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int partition = partition(array, lo, hi);</span></span>
<span class="line"><span>    quickSort(array, lo, partition - 1);</span></span>
<span class="line"><span>    quickSort(array, partition + 1, hi);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//插入排序</span></span>
<span class="line"><span>private void insertionSort(Comparable[] array, int lo, int hi) {</span></span>
<span class="line"><span>    for (int i = lo; i &lt;= hi; i++) {</span></span>
<span class="line"><span>        for (int j = i; j &gt; lo &amp;&amp; less(array[j], array[j - 1]); j--) {</span></span>
<span class="line"><span>            exch(array, j, j - 1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>三向切分 当我们需要排序的数组中出现了大量的重复元素，我们实现的快速排序在递归的时候会遇到许多全部重复的子数组，我们的算法依然会对其进行切分，这里有很大的提升空间。</li></ul><p>思路就是先随意选择一个切分元素(el)，然后把数组切换成大于、等于、小于三个部分，一次递归可以排定所有等于切分元素的值； 维护一个指针lt、gt，使得a[lo..lt-1]都小于切分元素，a[gt+1..hi]都大于切分元素；</p><ul><li>初始化变量：lt=lo, i=lo+1, gt=hi</li><li>if a[i] &lt; el ; 交换a[i]与a[lt], i++, lt++</li><li>if a[i] &gt; el ; 交换a[gt]与a[i], gt--</li><li>a[i] == el; i++</li></ul><p>代码实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Quick3waySort implements SortTemplate {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void sort(Comparable[] array) {</span></span>
<span class="line"><span>        quickSort(array, 0, array.length - 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>    private void quickSort(Comparable[] array, int lo, int hi) {</span></span>
<span class="line"><span>        if (lo &gt;= hi) {</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        int lt = lo, i = lo + 1, gt = hi;</span></span>
<span class="line"><span>        Comparable el = array[lo];</span></span>
<span class="line"><span>        while (i &lt;= gt) {</span></span>
<span class="line"><span>            int tmp = el.compareTo(array[i]);</span></span>
<span class="line"><span>            if (tmp &gt; 0) {</span></span>
<span class="line"><span>                exch(array, lt++, i++);</span></span>
<span class="line"><span>            } else if (tmp &lt; 0) {</span></span>
<span class="line"><span>                exch(array, i, gt--);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                i++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        quickSort(array, lo, lt - 1);</span></span>
<span class="line"><span>        quickSort(array, gt + 1, hi);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,24),e=[i];function t(c,r,o,h,d,u){return n(),s("div",null,e)}const g=a(l,[["render",t]]);export{b as __pageData,g as default};
