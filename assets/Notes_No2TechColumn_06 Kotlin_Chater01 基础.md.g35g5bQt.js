import{_ as a,c as s,o as n,aa as p}from"./chunks/framework.DOnJscRE.js";const v=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Notes/No2TechColumn/06 Kotlin/Chater01 基础.md","filePath":"Notes/No2TechColumn/06 Kotlin/Chater01 基础.md","lastUpdated":1725591979000}'),e={name:"Notes/No2TechColumn/06 Kotlin/Chater01 基础.md"},t=p(`<h4 id="变量" tabindex="-1">变量 <a class="header-anchor" href="#变量" aria-label="Permalink to &quot;变量&quot;">​</a></h4><p>Kotlin声明变量的关键字有两个</p><ul><li>val: 不可变引用，相当于java中final修饰的变量</li><li>var: 可变引用</li></ul><p>举例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>val name:String = &quot;Herman&quot;;</span></span>
<span class="line"><span>val age = 20;</span></span></code></pre></div><p>在这个例子中，变量name明确指定了类型是String，变量age没有指定类型，这两种方式都正确，Kotlin的编译器可以根据初始化的值推断出age的类型，所以在定义变量的时候可以不用指定变量的类型</p><p>再看下面这个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>val age = 20</span></span>
<span class="line"><span>age = “Herman”</span></span></code></pre></div><p>这里存在两个问题导致编译不通过：第一，由于变量会被改变，需要改成var；第二，在第一次赋值的时候编译器推断出age的类型应该是Int，在修改的是时候就不能被赋值String</p><h4 id="枚举" tabindex="-1">枚举 <a class="header-anchor" href="#枚举" aria-label="Permalink to &quot;枚举&quot;">​</a></h4><p>枚举的定义需要使用关键字 <code>enum class</code>, Kotlin中的枚举和Java一样可以拥有属性和构造方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enum class Color(val r: Int = 0, val g: Int = 0, val b: Int = 0) {</span></span>
<span class="line"><span>    RED(255, 0, 0), GREEN(g = 255), BLUE(b = 255);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fun sum() = r + g + b</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fun sum2(): Int {</span></span>
<span class="line"><span>        return r + g + b</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的枚举Color的构造方法有三个参数<code>r,g,b</code>，如果参数没有传默认是0，然后再构建对象的时候可以指定变量的名字赋值（在后面类相关的部分会再次出现）；</p><p>定义了两个方法sum，两种写法都支持</p><h4 id="when" tabindex="-1">when <a class="header-anchor" href="#when" aria-label="Permalink to &quot;when&quot;">​</a></h4><p>when语句类似于Java中的switch语句，但用法会更多一些</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>fun getWarmth(color: Color) =</span></span>
<span class="line"><span>    when (color) {</span></span>
<span class="line"><span>        Color.RED, Color.GREEN -&gt; &quot;warm&quot;</span></span>
<span class="line"><span>        Color.BLUE -&gt; &quot;cold&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>println(getWarmth(Color.BLUE))</span></span></code></pre></div><blockquote><p>与java中的switch只能支持枚举，数字，字符串，而when支持任意类型</p></blockquote><p>上面的例子还可以改写成不带参数的写法，这种写法每个分支条件就是布尔表达式（类似于java中的if-elseif）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>fun getWarmth(color: Color) =</span></span>
<span class="line"><span>    when {</span></span>
<span class="line"><span>        color == Color.RED || color == Color.GREEN -&gt; &quot;warm&quot;</span></span>
<span class="line"><span>        color == Color.BLUE -&gt; &quot;cold&quot;</span></span>
<span class="line"><span>        else -&gt; throw IllegalArgumentException()</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h4 id="迭代" tabindex="-1">迭代 <a class="header-anchor" href="#迭代" aria-label="Permalink to &quot;迭代&quot;">​</a></h4><p>while的用法和Java相同</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>while(condition){</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>do{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}while(condition)</span></span></code></pre></div><hr><p>在Kotlin中引入了区间,<code>var oneToTen=1..10</code>这个表示1到10的区间,这个区间是闭合的,也就是说包含10</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>fun testFor() {</span></span>
<span class="line"><span>    for (i in 1..10) {</span></span>
<span class="line"><span>        print(&quot;$i,&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="https://raw.githubusercontent.com/silently9527/images/main/202408161913878.png" alt=""></p><p>由于区间是闭合的, 包含了10, 在实际情况下我们更常用是不包含, 可以使用<code>until</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>fun testForUtil() {</span></span>
<span class="line"><span>    for (i in &#39;A&#39; until &#39;F&#39;) {</span></span>
<span class="line"><span>        print(&quot;$i,&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>输出结果: <code>A,B,C,D,E,</code></p><p>上面的例子如果我们可以想要倒序输出,步长2,可以是使用 <code>downTo</code>, <code>step</code>实现</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>fun testForDownTo() {</span></span>
<span class="line"><span>    for (i in 10 downTo 1 step 2) {</span></span>
<span class="line"><span>        print(&quot;$i,&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="https://raw.githubusercontent.com/silently9527/images/main/202408161918697.png" alt=""></p><hr><p>下面我们想要迭代一个List, 同时还需要访问List的index, for循环改如何写</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>fun testForList() {</span></span>
<span class="line"><span>    val list = listOf(&quot;Herman&quot;, &quot;herman7z.site&quot;)</span></span>
<span class="line"><span>    for ((index, value) in list.withIndex()) {</span></span>
<span class="line"><span>        println(&quot;index:$index, value:$value&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="https://raw.githubusercontent.com/silently9527/images/main/202408161933380.png" alt=""></p><p>迭代map, 同时访问key,value</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>fun testForMap() {</span></span>
<span class="line"><span>    val map = TreeMap&lt;Char, Int&gt;();</span></span>
<span class="line"><span>    for (i in &#39;A&#39; until &#39;F&#39;) {</span></span>
<span class="line"><span>        map[i] = i.code;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for ((key, value) in map) {</span></span>
<span class="line"><span>        println(&quot;key:$key, value:$value&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><blockquote><p><code>in</code>还可以用来判断元素在集合和区间是否存在,<code>println(1 in 1..10)</code></p></blockquote><h4 id="异常处理" tabindex="-1">异常处理 <a class="header-anchor" href="#异常处理" aria-label="Permalink to &quot;异常处理&quot;">​</a></h4><p>在Java中需要区分受检异常和不受检异常, 比如IO操作的方法通过都会抛出IOException, 应用程序必须要处理,这导致了很多模式代码, 所以在Kotlin中不在区分受检异常和不受检异常,无需在方法后面trhow 异常.</p><p>另外try-catch语句依然可以像if-else语句一样作为一个表达式, 最后一行就是表达式的返回值</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>fun testTryCatch() {</span></span>
<span class="line"><span>    val result = try {</span></span>
<span class="line"><span>        val i = 5 / 0;</span></span>
<span class="line"><span>    } catch (e: Exception) {</span></span>
<span class="line"><span>        0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    println(result)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码运行时遇到了异常进入到了catch分支, 最后一行是0, 所以result的结果就是0</p><h4 id="字符串" tabindex="-1">字符串 <a class="header-anchor" href="#字符串" aria-label="Permalink to &quot;字符串&quot;">​</a></h4><p>在Java中我们想要使用字符串模版是通过String.format来实现，接下来看Kotlin如何的字符串模版</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>val name = &quot;Herman&quot;</span></span>
<span class="line"><span>println(&quot;Hello, $name&quot;)</span></span></code></pre></div><p>从上面的我们可以看出Kotlin的模版确实要更简洁，直接使用<code>$</code>来引用变量，如果想要在模版中输出$字符，需要使用转义：<code>\\$</code>; 不仅如此，在模版中来可以写入一下逻辑判断</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>val age = 10;</span></span>
<span class="line"><span>println(&quot;Hello, \${if(age&gt;20) &quot;Herman&quot; else &quot;Kotlin&quot;}&quot;)</span></span></code></pre></div><p>在Java中的<code>String.split</code>方法的参数是正则表达式,所以在执行特殊的分隔符时主要转义, Kotlin重载了这个方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>println(&quot;123.abc&quot;.split(&quot;.&quot;)) //这里的. 作为了普通字符串</span></span></code></pre></div><p>输出的结果</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[1231, 12312]</span></span></code></pre></div><p>当我们需要使用正则表达式来分割是可以通过一下方式调用</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>println(&quot;123.abc&quot;.split(&quot;\\\\.&quot;.toRegex()))</span></span></code></pre></div><p>这里使用了双斜杠转义操作, 也可以是三重引号来去掉转义,看起来会更加直接</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>println(&quot;123.abc&quot;.split(&quot;&quot;&quot;\\.&quot;&quot;&quot;.toRegex()))</span></span></code></pre></div>`,58),l=[t];function i(o,c,d,h,u,r){return n(),s("div",null,l)}const b=a(e,[["render",i]]);export{v as __pageData,b as default};
