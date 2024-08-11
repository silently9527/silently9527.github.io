import{_ as a,o as s,c as n,R as p}from"./chunks/framework.412fhWlr.js";const u=JSON.parse('{"title":"常见的初级排序算法，这次全搞懂","description":"","frontmatter":{"title":"常见的初级排序算法，这次全搞懂","author":"Herman","date":"2021/08/14 13:58","categories":["算法"],"tags":["数据结构","排序算法"]},"headers":[],"relativePath":"article/pamphlet/algorithms/基础算法/常见的初级排序算法，这次全搞懂.md","filePath":"article/pamphlet/algorithms/基础算法/常见的初级排序算法，这次全搞懂.md","lastUpdated":1723373794000}'),l={name:"article/pamphlet/algorithms/基础算法/常见的初级排序算法，这次全搞懂.md"},e=p(`<h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>相信所有的程序员刚开始接触到的算法都会是排序算法，因为排序在对数据处理和计算有这重要的地位，排序算法往往是其他算法的基础；本文我们就先从初级排序算法开始学习算法。</p><h2 id="排序算法的模板" tabindex="-1">排序算法的模板 <a class="header-anchor" href="#排序算法的模板" aria-label="Permalink to &quot;排序算法的模板&quot;">​</a></h2><p>在开始之前我们先定义一个排序算法通用的模板，在后面的排序算法都会实现这个模板</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public interface SortTemplate {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void sort(Comparable[] array);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    default void print(Comparable[] array) {</span></span>
<span class="line"><span>        for (Comparable a : array) {</span></span>
<span class="line"><span>            System.out.print(a + &quot; &quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    default boolean less(Comparable a, Comparable b) {</span></span>
<span class="line"><span>        return a.compareTo(b) &lt; 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    default void exch(Comparable[] array, int i, int j) {</span></span>
<span class="line"><span>        Comparable tmp = array[i];</span></span>
<span class="line"><span>        array[i] = array[j];</span></span>
<span class="line"><span>        array[j] = tmp;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>Comparable: 为了让我们实现的排序算法更加的通用，可以排序任意的对象，所以我们这里使用了Comparable数组</li><li>sort: 不同的排序算法实现的方式不一样，子类自己去实现</li><li>less: 定义的公用方法，如果a &lt; b就返回true</li><li>exch: 定义的公用方法，交换数组中的两个对象</li><li>print: 打印出数据中的每个元素</li></ul><h2 id="选择排序" tabindex="-1">选择排序 <a class="header-anchor" href="#选择排序" aria-label="Permalink to &quot;选择排序&quot;">​</a></h2><p>算法实现的思路：</p><ul><li>首先找到数组中的最小元素，</li><li>其实将它和数组中的第一个元素进行交换，这样就排定了一个元素；</li><li>再次找出剩余元素中最小的元素与数组中的第二个元素进行交换，如此反复直到所有元素都是有序的</li></ul><p><img src="https://tva1.sinaimg.cn/large/008eGmZEgy1gnt6w1z5pzg30gx06saf1.gif" alt=""></p><p>代码实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class SelectionSort implements SortTemplate {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void sort(Comparable[] array) {</span></span>
<span class="line"><span>        int length = array.length;</span></span>
<span class="line"><span>        for (int i = 0; i &lt; length; i++) {</span></span>
<span class="line"><span>            int min = i;</span></span>
<span class="line"><span>            for (int j = i + 1; j &lt; length; j++) {</span></span>
<span class="line"><span>                if (less(array[j], array[min])) {</span></span>
<span class="line"><span>                    min = j;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            exch(array, i, min);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>假如输入的数组是有序的，我们会发现选择排序运行的时候和未排序的时间一样长！</p><p>对于N个元素的数组，使用<strong>选择排序的时间复杂度是O(n²)</strong></p><p>选择排序的是<strong>数据移动最少</strong>的，交换的次数与数组的大小是线性关系，N个元素的数组需要N次交换</p><h2 id="冒泡排序" tabindex="-1">冒泡排序 <a class="header-anchor" href="#冒泡排序" aria-label="Permalink to &quot;冒泡排序&quot;">​</a></h2><p>算法实现的思路：</p><ul><li>比较相邻的两个元素，如果前一个比后一个大，那么就交换两个元素的位置</li><li>对每一组相邻的元素执行同样的操作，直到最后一个元素，操作完成之后就可以排定一个最大的元素</li><li>如此往复，直到数组中所有的元素都有序</li></ul><p><img src="https://tva1.sinaimg.cn/large/008eGmZEgy1gnt7ku8jm2g30lo08x10s.gif" alt=""></p><p>代码实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class BubbleSort implements SortTemplate {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void sort(Comparable[] array) {</span></span>
<span class="line"><span>        int length = array.length - 1;</span></span>
<span class="line"><span>        for (int i = 0; i &lt; length; i++) {</span></span>
<span class="line"><span>            for (int j = 0; j &lt; length - i; j++) {</span></span>
<span class="line"><span>                if (less(array[j + 1], array[j])) {</span></span>
<span class="line"><span>                    exch(array, j, j + 1);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于N个元素的数组，使用<strong>冒泡排序的时间复杂度是O(n²)</strong></p><h2 id="插入排序" tabindex="-1">插入排序 <a class="header-anchor" href="#插入排序" aria-label="Permalink to &quot;插入排序&quot;">​</a></h2><p>想象我们在玩扑克牌时，整理扑克牌都是把每一张插入到左边已经排好序的牌中适当的位置。插入排序的思路类似</p><p>算法实现的思路：</p><ul><li>初始默认第一个元素就是有序的，当前索引的位置从0开始</li><li>先后移动当前索引的位置，当前索引位置左边的元素是有序的，从后往前开始扫码与当前索引位置元素进行比较</li><li>当确定当前索引位置上的元素在左边有序适合的位置之后，插入到该位置上</li><li>如果当确定当前索引位置上的元素大于了已排序的最后一个元素，那么当前索引位置直接往后移动</li><li>如此反复，直到所有元素有序</li></ul><p><img src="https://tva1.sinaimg.cn/large/008eGmZEgy1gnt8d0ap55g30hq06a0z5.gif" alt=""></p><p>代码实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class InsertionSort implements SortTemplate {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void sort(Comparable[] array) {</span></span>
<span class="line"><span>        int length = array.length;</span></span>
<span class="line"><span>        for (int i = 1; i &lt; length; i++) {</span></span>
<span class="line"><span>            for (int j = i; j &gt; 0 &amp;&amp; less(array[j], array[j - 1]); j--) {</span></span>
<span class="line"><span>                exch(array, j, j - 1);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从代码的实现我们可以看出，当遇到了当前索引的元素大于了左边有序数组的最后一个元素时，内层循环就直接结束了，所以所我们排序的数组中存在着部分有序，那么插入排序算法会很快。</p><p>考虑最糟糕的情况，如果输入数组是一个倒置的，那么插入排序的效率和选择排序一样，<strong>时间复杂度是O(n²)</strong></p><h2 id="希尔排序" tabindex="-1">希尔排序 <a class="header-anchor" href="#希尔排序" aria-label="Permalink to &quot;希尔排序&quot;">​</a></h2><p>对于大规模的乱序数组插入排序很慢，是因为它只交换相邻的元素，元素只能一点一点的从数组中移动到正确的位置；插入排序对于部分有序的数组排序是的效率很高；</p><p>希尔排序基于这两个特点对插入排序进行了改进；</p><p>算法实现的思路</p><ul><li>首先设置一个步长h用来分隔出子数组</li><li>用插入排序将h个子数组独立排序</li><li>减小h步长继续排序子数组，直到h步长为1</li><li>当步长为1时就成了普通的插入排序，这样数组一定是有序的</li></ul><p>希尔排序高效的原因，在排序之初，各个子数组都很短，子数组排序之后都是部分有序的，这两种情况都很适合插入排序。</p><p><img src="https://tva1.sinaimg.cn/large/008eGmZEgy1gnv4fgl47vg30hs07r11a.gif" alt=""></p><p>代码实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>public class ShellSort implements SortTemplate {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void sort(Comparable[] array) {</span></span>
<span class="line"><span>        int gap = 1;</span></span>
<span class="line"><span>        int length = array.length;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while (gap &lt; length / 3) {</span></span>
<span class="line"><span>            gap = 3 * gap + 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while (gap &gt;= 1) {</span></span>
<span class="line"><span>            for (int i = gap; i &lt; length; i++) {</span></span>
<span class="line"><span>                for (int j = i; j &gt;= gap &amp;&amp; less(array[j], array[j - gap]); j -= gap) {</span></span>
<span class="line"><span>                    exch(array, j, j - gap);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            gap = gap / 3;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><hr><blockquote><p>参考书籍：算法第四版</p></blockquote>`,42),i=[e];function t(r,c,o,h,g,d){return s(),n("div",null,i)}const b=a(l,[["render",t]]);export{u as __pageData,b as default};
