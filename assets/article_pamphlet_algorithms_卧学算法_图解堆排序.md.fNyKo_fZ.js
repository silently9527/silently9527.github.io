import{_ as r}from"./chunks/ArticleMetadata.IwlMn1X8.js";import{_ as o,D as c,o as p,c as d,I as h,w as _,k as s,a as m,R as t,b as u,e as g}from"./chunks/framework.412fhWlr.js";import"./chunks/md5.6OGdLw3O.js";const S=JSON.parse('{"title":"图解堆排序","description":"","frontmatter":{"title":"图解堆排序","author":"Herman","date":"2021/08/14 13:58","categories":["算法"],"tags":["排序算法","堆排序"]},"headers":[],"relativePath":"article/pamphlet/algorithms/卧学算法/图解堆排序.md","filePath":"article/pamphlet/algorithms/卧学算法/图解堆排序.md","lastUpdated":1723379109000}'),k={name:"article/pamphlet/algorithms/卧学算法/图解堆排序.md"},b=s("h1",{id:"图解堆排序",tabindex:"-1"},[m("图解堆排序 "),s("a",{class:"header-anchor",href:"#图解堆排序","aria-label":'Permalink to "图解堆排序"'},"​")],-1),f=t(`<h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>在上一篇中我们一起使用二叉堆实现了优先级队列，假如我们从构建好的优先级队列中持续调用删除最小（或者最大），把结果输出到另一个数组中，那么就可以把数组的所有元素进行排序，这就是本篇我们需要学习的<strong>堆排序</strong>。在看本篇之前需要先看下前一篇《原来实现优先级队列如此简单》</p><p>堆排序的过程主要有两个阶段：</p><ul><li>把原始数据构造成一个有序堆（构造堆）</li><li>从堆中按照递减顺序取出所有元素就可以得到排序结果（下沉排序）</li></ul><p>开始之前，我们需要把上一篇中的sink()方法修改一下；</p><p>保证我们在进行排序的时候直接使用原始的数组，无需建立一个辅助数组浪费空间；由于我们需要动态的缩小堆的大小，需要把size通过参数传入；</p><p>其次我们数组的下标是从0开始的，与之前的优先级排序有些差别，<strong>对于k节点的左边节点下标是2k+1，右边下标是2k+2</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>private void sink(Comparable[] queue, int k, int size) {</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><h2 id="构造堆" tabindex="-1">构造堆 <a class="header-anchor" href="#构造堆" aria-label="Permalink to &quot;构造堆&quot;">​</a></h2><p>把一个输入的数组构建成一个堆有序，我们有两种方式：</p><ol><li>从左向右遍历数组，然后把调用swim()上浮操作保证指针左边的元素都是堆有序的，就和优先级队列的插入过一样</li><li>由于数组中的每个位置已经是堆的节点，我们可以从右向左调用sink()下沉操作构造堆，这个过程我们可以跳过子堆为1的元素，所以我们只需要扫描数组的一半元素。这种方式会更高效。</li></ol>`,11),v=s("p",{"8,3,6,1,4,7,2":""},"例如：输入数组 a[]=",-1),q=t(`<p><img src="https://tva1.sinaimg.cn/large/e6c9d24egy1gojdooh0s2j20xf0690sq.jpg" alt=""></p><h2 id="下沉排序" tabindex="-1">下沉排序 <a class="header-anchor" href="#下沉排序" aria-label="Permalink to &quot;下沉排序&quot;">​</a></h2><p>下沉是堆排序的第二个阶段，我们把最大元素删除，然后放入到堆缩小后数组中空出来的位置，当操作完成所有的元素之后，整个数组将会是有序的</p><p>下沉排序演示过程（图未完全画完）：</p><p><img src="https://tva1.sinaimg.cn/large/e6c9d24egy1goje0efsqvj21150g93yx.jpg" alt=""></p><h2 id="堆排序代码实现" tabindex="-1">堆排序代码实现 <a class="header-anchor" href="#堆排序代码实现" aria-label="Permalink to &quot;堆排序代码实现&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void sort(Comparable[] array) {</span></span>
<span class="line"><span>    int size = array.length;</span></span>
<span class="line"><span>    for (int k = size / 2; k &gt;= 0; k--) {</span></span>
<span class="line"><span>        sink(array, k, size);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    while (size &gt; 0) {</span></span>
<span class="line"><span>        exch(array, 0, --size);</span></span>
<span class="line"><span>        sink(array, 0, size);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,7);function y(a,C,T,x,P,z){const i=r,l=c("ClientOnly");return p(),d("div",null,[b,h(l,null,{default:_(()=>{var n,e;return[(((n=a.$frontmatter)==null?void 0:n.aside)??!0)&&(((e=a.$frontmatter)==null?void 0:e.showArticleMetadata)??!0)?(p(),u(i,{key:0,article:a.$frontmatter},null,8,["article"])):g("",!0)]}),_:1}),f,v,q])}const $=o(k,[["render",y]]);export{S as __pageData,$ as default};
