import{_ as a,c as s,o as e,aa as t}from"./chunks/framework.d_Ke7vMG.js";const m=JSON.parse('{"title":"09 从零开始学习java8stream看这篇就够了","description":"","frontmatter":{"title":"09 从零开始学习java8stream看这篇就够了","author":"Herman","updateTime":"2021-08-14 13:41","desc":"从零开始学习java8stream看这篇就够了","categories":"Java","tags":"Java8新特性/stream","outline":"deep"},"headers":[],"relativePath":"Notes/No2TechColumn/01 Java/09 从零开始学习java8stream看这篇就够了.md","filePath":"Notes/No2TechColumn/01 Java/09 从零开始学习java8stream看这篇就够了.md","lastUpdated":1723563552000}'),n={name:"Notes/No2TechColumn/01 Java/09 从零开始学习java8stream看这篇就够了.md"},l=t(`<hr><h3 id="为何需要引入流" tabindex="-1">为何需要引入流 <a class="header-anchor" href="#为何需要引入流" aria-label="Permalink to &quot;为何需要引入流&quot;">​</a></h3><p>在我们平常的开发中几乎每天都会有到List、Map等集合API，若是问Java什么API使用最多，我想也应该是集合了。举例：假如我有个集合List，里面元素有<code>1,7,3,8,2,4,9</code>，需要找出里面大于5的元素，具体实现代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List&lt;Integer&gt; getGt5Data() {</span></span>
<span class="line"><span>    List&lt;Integer&gt; data = Arrays.asList(1, 7, 3, 8, 2, 4, 9);</span></span>
<span class="line"><span>    List&lt;Integer&gt; result = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    for (Integer num : data) {</span></span>
<span class="line"><span>        if (num &gt; 5) {</span></span>
<span class="line"><span>            result.add(num);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个实现让我们感觉到了集合的操作不是太完美，如果是数据库的话，我们只需要简单的在where后面加一个条件大于5就可以得到我们想要的结果，为什么Java的集合就没有这种API呢？ 其次，如果我们遇到有大集合需要处理，为了提高性能，我们可能需要使用到多线程来处理，但是写并行程序的复杂度有提高了不少。</p><p>基于以上的问题，所有Java8推出了Stream</p><hr><h3 id="stream简介" tabindex="-1">Stream简介 <a class="header-anchor" href="#stream简介" aria-label="Permalink to &quot;Stream简介&quot;">​</a></h3><p>Stream有哪些特点：</p><ul><li>元素的序列：与集合一样可以访问里面的元素，集合讲的是数据，而流讲的是操作，比如：filter、map</li><li>源: 流也需要又一个提供数据的源，顺序和生成时的顺序一致</li><li>数据的操作：流支持类似于数据库的操作，支持顺序或者并行处理数据；上面的例子用流来实现会更加的简洁</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List&lt;Integer&gt; getGt5Data() {</span></span>
<span class="line"><span>    return Stream.of(1, 7, 3, 8, 2, 4, 9)</span></span>
<span class="line"><span>            .filter(num -&gt; num &gt; 5)</span></span>
<span class="line"><span>            .collect(toList());</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>流水线操作：很多流的方法本身也会返回一个流，这样可以把多个操作连接起来，形成流水线操作</li><li>内部迭代：与以往的迭代不同，流使用的内部迭代，用户只需要专注于数据处理</li><li>只能遍历一次： 遍历完成之后我们的流就已经消费完了，再次遍历的话会抛出异常</li></ul><hr><h3 id="使用stream" tabindex="-1">使用Stream <a class="header-anchor" href="#使用stream" aria-label="Permalink to &quot;使用Stream&quot;">​</a></h3><p>Java8中的Stream定义了很多方法，基本可以把他们分为两类：中间操作、终端操作；要使用一个流一般都需要三个操作：</p><ol><li>定义一个数据源</li><li>定义中间操作形成流水线</li><li>定义终端操作，执行流水线，生成计算结果</li></ol><h4 id="构建流" tabindex="-1">构建流 <a class="header-anchor" href="#构建流" aria-label="Permalink to &quot;构建流&quot;">​</a></h4><ol><li>使用<code>Stream.of</code>方法构建一个流</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Stream.of(&quot;silently&quot;,&quot;9527&quot;,&quot;silently9527.cn&quot;)</span></span>
<span class="line"><span>        .forEach(System.out::println);</span></span></code></pre></div><ol start="2"><li>使用数组构建一个流</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int[] nums = {3, 5, 2, 7, 8, 9};</span></span>
<span class="line"><span>Arrays.stream(nums).sorted().forEach(System.out::println);</span></span></code></pre></div><ol start="3"><li>通过文件构建一个流 使用java.nio.file.Files.lines方法可以轻松构建一个流对象</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Files.lines(Paths.get(&quot;/Users/huaan9527/Desktop/data.txt&quot;))</span></span>
<span class="line"><span>                .forEach(System.out::println);</span></span></code></pre></div><h4 id="中间操作" tabindex="-1">中间操作 <a class="header-anchor" href="#中间操作" aria-label="Permalink to &quot;中间操作&quot;">​</a></h4><p>中间操作会返回另外一个流，这样可以让多个操作连接起来形成一个流水线的操作，只要不触发终端操作，那么这个中间操作都不会实际执行。</p><h5 id="filter" tabindex="-1">filter <a class="header-anchor" href="#filter" aria-label="Permalink to &quot;filter&quot;">​</a></h5><p>该操作接受一个返回boolean的函数，当返回false的元素将会被排除掉</p><p>举例：假如我们100个客户，需要筛选出年龄大于20岁的客户</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List&lt;Customer&gt; matchCustomers = allCustomers.stream()</span></span>
<span class="line"><span>                .filter(customer -&gt; customer.getAge()&gt;20)</span></span>
<span class="line"><span>                .collect(toList());</span></span></code></pre></div><h5 id="distinct" tabindex="-1">distinct <a class="header-anchor" href="#distinct" aria-label="Permalink to &quot;distinct&quot;">​</a></h5><p>该操作将会排除掉重复的元素</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List&lt;Integer&gt; data = Stream.of(1, 7, 3, 8, 2, 4, 9, 7, 9)</span></span>
<span class="line"><span>        .filter(num -&gt; num &gt; 5)</span></span>
<span class="line"><span>        .distinct()</span></span>
<span class="line"><span>        .collect(toList());</span></span></code></pre></div><h5 id="limit" tabindex="-1">limit <a class="header-anchor" href="#limit" aria-label="Permalink to &quot;limit&quot;">​</a></h5><p>该方法限制流只返回指定个数的元素</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List&lt;Integer&gt; data = Stream.of(1, 7, 3, 8, 2, 4, 9, 7, 9)</span></span>
<span class="line"><span>        .filter(num -&gt; num &gt; 5)</span></span>
<span class="line"><span>        .limit(2)</span></span>
<span class="line"><span>        .collect(toList());</span></span></code></pre></div><h5 id="skip" tabindex="-1">skip <a class="header-anchor" href="#skip" aria-label="Permalink to &quot;skip&quot;">​</a></h5><p>扔掉前指定个数的元素；配合limit使用可以达到翻页的效果</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List&lt;Integer&gt; data = Stream.of(1, 7, 3, 8, 2, 4, 9, 7, 9)</span></span>
<span class="line"><span>        .filter(num -&gt; num &gt; 5)</span></span>
<span class="line"><span>        .skip(1)</span></span>
<span class="line"><span>        .limit(2)</span></span>
<span class="line"><span>        .collect(toList());</span></span></code></pre></div><h5 id="map" tabindex="-1">map <a class="header-anchor" href="#map" aria-label="Permalink to &quot;map&quot;">​</a></h5><p>该方法提供一个函数，流中的每个元素都会应用到这个函数上，返回的结果将形成新类型的流继续后续操作。 举例：假如我们100个客户，需要筛选出年龄大于20岁的客户，打印出他们的名字</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>allCustomers.stream()</span></span>
<span class="line"><span>            .filter(customer -&gt; customer.getAge() &gt; 20)</span></span>
<span class="line"><span>            .map(Customer::getName)</span></span>
<span class="line"><span>            .forEach(System.out::println);</span></span></code></pre></div><p>在调用map之前流的类型是<code>Stream&lt;Customer&gt;</code>，执行完map之后的类型是<code>Stream&lt;String&gt;</code></p><h5 id="flatmap" tabindex="-1">flatMap <a class="header-anchor" href="#flatmap" aria-label="Permalink to &quot;flatMap&quot;">​</a></h5><p>假如我们需要把客户的名字中的每个字符打印出来，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List&lt;Customer&gt; allCustomers = Arrays.asList(new Customer(&quot;silently9527&quot;, 30));</span></span>
<span class="line"><span>allCustomers.stream()</span></span>
<span class="line"><span>        .filter(customer -&gt; customer.getAge() &gt; 20)</span></span>
<span class="line"><span>        .map(customer -&gt; customer.getName().split(&quot;&quot;))</span></span>
<span class="line"><span>        .forEach(System.out::println);</span></span></code></pre></div><p>执行本次结果，你会发现没有达到期望的结果，打印的结果</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[Ljava.lang.String;@38cccef</span></span></code></pre></div><p>这是因为调用map之后返回的流类型是<code>Stream&lt;String[]&gt;</code>，所有forEach的输入就是<code>String[]</code>；这时候我们需要使用flatMap把<code>String[]</code>中的每个元素都转换成一个流，然后在把所有的流连接成一个流，修改后的代码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List&lt;Customer&gt; allCustomers = Arrays.asList(new Customer(&quot;silently9527&quot;, 30));</span></span>
<span class="line"><span>allCustomers.stream()</span></span>
<span class="line"><span>        .filter(customer -&gt; customer.getAge() &gt; 20)</span></span>
<span class="line"><span>        .map(customer -&gt; customer.getName().split(&quot;&quot;))</span></span>
<span class="line"><span>        .flatMap(Arrays::stream)</span></span>
<span class="line"><span>        .forEach(System.out::println);</span></span></code></pre></div><p>执行结果：</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/4db2aa4e3dcb4360975595e51d1097c4%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><h5 id="sorted" tabindex="-1">sorted <a class="header-anchor" href="#sorted" aria-label="Permalink to &quot;sorted&quot;">​</a></h5><p>对所有的元素进行排序</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List&lt;Integer&gt; numbers = Arrays.asList(1, 7, 3, 8, 2, 4, 9);</span></span>
<span class="line"><span>numbers.stream().sorted(Integer::compareTo).forEach(System.out::println);</span></span></code></pre></div><h4 id="终端操作" tabindex="-1">终端操作 <a class="header-anchor" href="#终端操作" aria-label="Permalink to &quot;终端操作&quot;">​</a></h4><p>终端操作会执行所有的中间操作生成执行的结果，执行的结果不在是一个流。</p><h5 id="anymatch" tabindex="-1">anyMatch <a class="header-anchor" href="#anymatch" aria-label="Permalink to &quot;anyMatch&quot;">​</a></h5><p>如果流中有一个元素满足条件将返回true</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (allCustomers.stream().anyMatch(customer -&gt; &quot;silently9527&quot;.equals(customer.getName()))) {</span></span>
<span class="line"><span>    System.out.println(&quot;存在用户silently9527&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="allmatch" tabindex="-1">allMatch <a class="header-anchor" href="#allmatch" aria-label="Permalink to &quot;allMatch&quot;">​</a></h5><p>确保流中所有的元素都能满足</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (allCustomers.stream().allMatch(customer -&gt; customer.getAge() &gt; 20)) {</span></span>
<span class="line"><span>    System.out.println(&quot;所有用户年龄都大于20&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="nonematch" tabindex="-1">noneMatch <a class="header-anchor" href="#nonematch" aria-label="Permalink to &quot;noneMatch&quot;">​</a></h5><p>与allMatch操作相反，确保流中所有的元素都不满足</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (allCustomers.stream().noneMatch(customer -&gt; customer.getAge() &lt; 20)) {</span></span>
<span class="line"><span>    System.out.println(&quot;所有用户年龄都大于20&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="findany" tabindex="-1">findAny <a class="header-anchor" href="#findany" aria-label="Permalink to &quot;findAny&quot;">​</a></h5><p>返回流中的任意一个元素，比如返回大于20岁的任意一个客户</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Optional&lt;Customer&gt; optional = allCustomers.stream()</span></span>
<span class="line"><span>        .filter(customer -&gt; customer.getAge() &gt; 20)</span></span>
<span class="line"><span>        .findAny();</span></span></code></pre></div><h5 id="findfirst" tabindex="-1">findFirst <a class="header-anchor" href="#findfirst" aria-label="Permalink to &quot;findFirst&quot;">​</a></h5><p>返回流中的第一个元素</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Optional&lt;Customer&gt; optional = allCustomers.stream()</span></span>
<span class="line"><span>        .filter(customer -&gt; customer.getAge() &gt; 20)</span></span>
<span class="line"><span>        .findFirst();</span></span></code></pre></div><h5 id="reduce" tabindex="-1">reduce <a class="header-anchor" href="#reduce" aria-label="Permalink to &quot;reduce&quot;">​</a></h5><p>接受两个参数：一个初始值，一个<code>BinaryOperator&lt;T&gt; accumulator</code>将两个元素合并成一个新的值 比如我们对一个数字list累加</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List&lt;Integer&gt; numbers = Arrays.asList(1, 7, 3, 8, 2, 4, 9);</span></span>
<span class="line"><span>Integer sum = numbers.stream().reduce(0, (a, b) -&gt; a + b);</span></span></code></pre></div><p>上面的代码，我们可以简写</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Integer reduce = numbers.stream().reduce(0, Integer::sum);</span></span></code></pre></div><p>找出流中的最大值、最小值 min、max</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>numbers.stream().reduce(Integer::max)</span></span>
<span class="line"><span>numbers.stream().reduce(Integer::min)</span></span></code></pre></div><h5 id="count" tabindex="-1">count <a class="header-anchor" href="#count" aria-label="Permalink to &quot;count&quot;">​</a></h5><p>统计流中元素的个数</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>numbers.stream().count()</span></span></code></pre></div><h3 id="数据收集器collect" tabindex="-1">数据收集器collect <a class="header-anchor" href="#数据收集器collect" aria-label="Permalink to &quot;数据收集器collect&quot;">​</a></h3><p>在Java8中已经预定义了很多收集器，我们可以直接使用，所有的收集器都定义在了<code>Collectors</code>中，基本上可以把这些方法分为三类：</p><ul><li>将元素归约和汇总成一个值</li><li>分组</li><li>分区</li></ul><h4 id="归约和汇总" tabindex="-1">归约和汇总 <a class="header-anchor" href="#归约和汇总" aria-label="Permalink to &quot;归约和汇总&quot;">​</a></h4><p>先看下我们之前求最大值和最小值采用收集器如何实现</p><ol><li>找出年龄最大和最小的客户</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Optional&lt;Customer&gt; minAgeCustomer = allCustomers.stream().collect(minBy(Comparator.comparing(Customer::getAge)));</span></span>
<span class="line"><span>Optional&lt;Customer&gt; maxAgeCustomer = allCustomers.stream().collect(maxBy(Comparator.comparing(Customer::getAge)));</span></span></code></pre></div><ol start="2"><li>求取年龄的平均值</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Double avgAge = allCustomers.stream().collect(averagingInt(Customer::getAge));</span></span></code></pre></div><ol start="3"><li>进行字符串的连接</li></ol><p>把客户所有人的名字连接成一个字符串用逗号分隔</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>allCustomers.stream().map(Customer::getName).collect(joining(&quot;,&quot;));</span></span></code></pre></div><h4 id="分组" tabindex="-1">分组 <a class="header-anchor" href="#分组" aria-label="Permalink to &quot;分组&quot;">​</a></h4><p>在数据库的操作中，我们可以轻松的实现通过一个属性或者多个属性进行数据分组，接下来我们看看Java8如何来实现这个功能。</p><ol><li>根据客户的年龄进行分组</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Map&lt;Integer, List&lt;Customer&gt;&gt; groupByAge = allCustomers.stream().collect(groupingBy(Customer::getAge));</span></span></code></pre></div><p>Map的key就是分组的值年龄，<code>List&lt;Customer&gt;</code>就是相同年龄的用户</p><ol start="2"><li>我们需要先按照用户的地区分组，在按年龄分组</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Map&lt;String, Map&lt;Integer, List&lt;Customer&gt;&gt;&gt; groups = allCustomers.stream()</span></span>
<span class="line"><span>                .collect(groupingBy(Customer::getArea, groupingBy(Customer::getAge)));</span></span></code></pre></div><p>在相对于普通的分组，这里多传了第二个参数又是一个<code>groupingBy</code>；理论上我们可以通过这个方式扩展到n层分组</p><ol start="3"><li>分组后再统计数量</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Map&lt;String, Long&gt; groupByCounting = allCustomers.stream()</span></span>
<span class="line"><span>            .collect(groupingBy(Customer::getArea, counting()));</span></span></code></pre></div><ol start="4"><li>以用户所在地区分组后找出年龄最大的用户</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Map&lt;String, Optional&lt;Customer&gt;&gt; optionalMap = allCustomers.stream()</span></span>
<span class="line"><span>                .collect(groupingBy(Customer::getArea, maxBy(Comparator.comparing(Customer::getAge))));</span></span></code></pre></div><p>这时候返回的Map中的value被Optional包裹，如果我们需要去掉Optional，可以使用<code>collectingAndThen</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Map&lt;String, Customer&gt; customerMap = allCustomers.stream()</span></span>
<span class="line"><span>        .collect(groupingBy(Customer::getArea,</span></span>
<span class="line"><span>                collectingAndThen(maxBy(Comparator.comparing(Customer::getAge)), Optional::get)</span></span>
<span class="line"><span>        ));</span></span></code></pre></div><hr><h3 id="写在最后-看完不点赞-你们想白嫖我吗" tabindex="-1">写在最后（看完不点赞，你们想白嫖我吗） <a class="header-anchor" href="#写在最后-看完不点赞-你们想白嫖我吗" aria-label="Permalink to &quot;写在最后（看完不点赞，你们想白嫖我吗）&quot;">​</a></h3><ul><li>首先感谢大家可以耐心地读到这里。<strong>点关注，不迷路</strong></li><li>当然，文中或许会存在或多或少的不足、错误之处，有建议或者意见也非常欢迎大家在评论交流。</li><li>最后，<strong>白嫖不好，创作不易</strong>，希望朋友们可以<strong>点赞评论关注</strong>三连，因为这些就是我分享的全部动力来源🙏</li></ul><p>参数资料《Java8实战》</p>`,111),p=[l];function i(o,c,r,d,u,h){return e(),s("div",null,p)}const b=a(n,[["render",i]]);export{m as __pageData,b as default};
