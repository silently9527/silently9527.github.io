import{_ as a,c as s,o as n,aa as e}from"./chunks/framework.d_Ke7vMG.js";const b=JSON.parse('{"title":"08 图解堆排序","description":"","frontmatter":{"title":"08 图解堆排序","author":"Herman","updateTime":"2024-07-16 21:34","desc":"图解堆排序","categories":"算法","tags":"数据结构/排序算法/堆排序","outline":"deep"},"headers":[],"relativePath":"Notes/No2TechColumn/04 Algorithms/08 图解堆排序.md","filePath":"Notes/No2TechColumn/04 Algorithms/08 图解堆排序.md","lastUpdated":1724592993000}'),p={name:"Notes/No2TechColumn/04 Algorithms/08 图解堆排序.md"},i=e(`<h1 id="图解堆排序" tabindex="-1">图解堆排序 <a class="header-anchor" href="#图解堆排序" aria-label="Permalink to &quot;图解堆排序&quot;">​</a></h1><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>在上一篇中我们一起使用二叉堆实现了优先级队列，假如我们从构建好的优先级队列中持续调用删除最小（或者最大），把结果输出到另一个数组中，那么就可以把数组的所有元素进行排序，这就是本篇我们需要学习的堆排序。在看本篇之前需要先看下前一篇《原来实现优先级队列如此简单》</p><p>堆排序的过程主要有两个阶段：</p><ul><li>把原始数据构造成一个有序堆（构造堆）</li><li>从堆中按照递减顺序取出所有元素就可以得到排序结果（下沉排序）</li></ul><p>开始之前，我们需要把上一篇中的sink()方法修改一下；</p><p>保证我们在进行排序的时候直接使用原始的数组，无需建立一个辅助数组浪费空间；由于我们需要动态的缩小堆的大小，需要把size通过参数传入；</p><p>其次我们数组的下标是从0开始的，与之前的优先级排序有些差别，对于k节点的左边节点下标是2k+1，右边下标是2k+2</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void sink(Comparable[] queue, int k, int size) {</span></span>
<span class="line"><span>    while (2 * k + 1 &lt; size) {</span></span>
<span class="line"><span>        int i = 2 * k + 1;</span></span>
<span class="line"><span>        if (i &lt; size - 1 &amp;&amp; less(queue[i], queue[i + 1])) {</span></span>
<span class="line"><span>            i++;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (less(queue[i], queue[k])) {</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        exch(queue, i, k);</span></span>
<span class="line"><span>        k = i;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="构造堆" tabindex="-1">构造堆 <a class="header-anchor" href="#构造堆" aria-label="Permalink to &quot;构造堆&quot;">​</a></h2><p>把一个输入的数组构建成一个堆有序，我们有两种方式：</p><ol><li>从左向右遍历数组，然后把调用swim()上浮操作保证指针左边的元素都是堆有序的，就和优先级队列的插入过一样</li><li>由于数组中的每个位置已经是堆的节点，我们可以从右向左调用sink()下沉操作构造堆，这个过程我们可以跳过子堆为1的元素，所以我们只需要扫描数组的一半元素。这种方式会更高效。</li></ol><p>例如：输入数组</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>a[]={8,3,6,1,4,7,2}</span></span></code></pre></div><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images//05b58b16dfb449f7b8e1a0323ccf8e71~tplv-k3u1fbpfcp-zoom-1.image" alt=""></p><h2 id="下沉排序" tabindex="-1">下沉排序 <a class="header-anchor" href="#下沉排序" aria-label="Permalink to &quot;下沉排序&quot;">​</a></h2><p>下沉是堆排序的第二个阶段，我们把最大元素删除，然后放入到堆缩小后数组中空出来的位置，当操作完成所有的元素之后，整个数组将会是有序的</p><p>下沉排序演示过程（图未完全画完）：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images//66031114d70b4a3bb2bd98d220a7249a~tplv-k3u1fbpfcp-zoom-1.image" alt=""></p><h2 id="堆排序代码实现" tabindex="-1">堆排序代码实现 <a class="header-anchor" href="#堆排序代码实现" aria-label="Permalink to &quot;堆排序代码实现&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void sort(Comparable[] array) {</span></span>
<span class="line"><span>    int size = array.length;</span></span>
<span class="line"><span>    for (int k = size / 2; k &gt;= 0; k--) {</span></span>
<span class="line"><span>        sink(array, k, size);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    while (size &gt; 0) {</span></span>
<span class="line"><span>        exch(array, 0, --size);</span></span>
<span class="line"><span>        sink(array, 0, size);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,21),l=[i];function t(c,o,r,d,h,u){return n(),s("div",null,l)}const k=a(p,[["render",t]]);export{b as __pageData,k as default};
