import{_ as s,c as a,o as n,aa as e}from"./chunks/framework.DOnJscRE.js";const v=JSON.parse('{"title":"04 数据类与委托类","description":"","frontmatter":{"title":"04 数据类与委托类","author":"Herman","updateTime":"2024-09-18 12:34","desc":"Kotlin 基础入门","categories":"Kotlin","tags":"Kotlin","outline":"deep"},"headers":[],"relativePath":"Notes/No2TechColumn/06 Kotlin/04 数据类与委托类.md","filePath":"Notes/No2TechColumn/06 Kotlin/04 数据类与委托类.md","lastUpdated":1761052119000}'),p={name:"Notes/No2TechColumn/06 Kotlin/04 数据类与委托类.md"},t=e(`<h4 id="数据类" tabindex="-1">数据类 <a class="header-anchor" href="#数据类" aria-label="Permalink to &quot;数据类&quot;">​</a></h4><p>在Java中我们判断对象是否相等需要使用到<code>equals</code>, 而在Kotlin中直接使用<code>==</code>来判断对象是否相等</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class User(val name:String)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>fun main(args: Array&lt;String&gt;) {</span></span>
<span class="line"><span>    val user1 = User(&quot;Herman&quot;)</span></span>
<span class="line"><span>    val user2 = User(&quot;Herman&quot;)</span></span>
<span class="line"><span>    println(user1==user2)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个例子输出的结果为 <code>false</code>, 熟悉Java的小伙伴都知道User对象缺少了 <code>equals</code>方法,</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class User(val name: String) {</span></span>
<span class="line"><span>    override fun equals(other: Any?): Boolean {</span></span>
<span class="line"><span>        if (Objects.isNull(other) || other !is User) {</span></span>
<span class="line"><span>            return false</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return other.name == name</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在我们重写 <code>equals</code>方法之后,输出的结果确实就是 <code>true</code></p><p>接着来看看另一种常见的例子,<code>Set</code>集合中存了一些<code>User</code>对象, 现在给定一个User对象判断是否存在在这个集合中</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>val set = hashSetOf(User(&quot;Herman&quot;), User(&quot;Taomm&quot;))</span></span>
<span class="line"><span>println(set.contains(user1))</span></span></code></pre></div><p>虽然User类我们已经实现了<code>equals</code>方法, 这个例子输出的结果却是 false, 这是由于User类还缺少hashCode方法, 这里违反了Hashcode的通用约定: 如果两个对象相等,那么它们的hashCode必须相同, 再给User添加HashCode方法后输出的结果就正确了</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>override fun hashCode(): Int {</span></span>
<span class="line"><span>    return name.hashCode() * 31</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在Java中以上的两个方法<code>equals</code> <code>hashCode</code>再需要判断对象是否相等的时候通常都需要重写, 而在Kotlin提供了数据类的来帮助我们自动生成这两种方法,让代码看起来更加的简洁. 数据类使用的关键字是 <code>data</code> ,接下来我们用数据类来改造上面的例子看看输出的结果</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>data class User(val name: String)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>fun main(args: Array&lt;String&gt;) {</span></span>
<span class="line"><span>    val user1 = User(&quot;Herman&quot;)</span></span>
<span class="line"><span>    val user2 = User(&quot;Herman&quot;)</span></span>
<span class="line"><span>    println(&quot;user1 == user2 =&gt; \${user1 == user2}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    val set = hashSetOf(User(&quot;Herman&quot;), User(&quot;Taomm&quot;))</span></span>
<span class="line"><span>    println(&quot;set.contains(user1) =&gt; \${set.contains(user1)}&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/202408272248030.png" alt=""></p><p>上面的输出结果满足我们的需求, 同时代码也会更加简洁</p><p>数据类同时还会多生成一个copy方法,方便对象的复制,新的对象有全新的生命周期,不会影响原有对象, 同时在复制的时候还可以重写设置某些属性的值</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>val copyUser = user1.copy(name = &quot;Herman2&quot;)</span></span>
<span class="line"><span>println(copyUser)</span></span></code></pre></div><blockquote><p>数据类的属性虽然没有要求一定是val,但是建议尽量使用val来保证数据类的不可变性, 如果需要修改对象可以使用copy</p></blockquote><h4 id="委托类" tabindex="-1">委托类 <a class="header-anchor" href="#委托类" aria-label="Permalink to &quot;委托类&quot;">​</a></h4><p>现在我们来看个例子,我需要实现接口<code>Collection</code>, 接口的方法代理给一个List实例来完成</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class DelegateCollection&lt;T&gt; : Collection&lt;T&gt; {</span></span>
<span class="line"><span>    private val list = arrayListOf&lt;T&gt;()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    override val size: Int</span></span>
<span class="line"><span>        get() = list.size</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    override fun contains(element: T): Boolean {</span></span>
<span class="line"><span>        return list.contains(element)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    override fun containsAll(elements: Collection&lt;T&gt;): Boolean {</span></span>
<span class="line"><span>        return list.containsAll(elements)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    override fun isEmpty(): Boolean {</span></span>
<span class="line"><span>        return list.isEmpty()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    override fun iterator(): Iterator&lt;T&gt; {</span></span>
<span class="line"><span>        return list.iterator()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>类似于这种的委托类在Java中十分的常见, 这里面有很多模版代码, Kotlin可以通过 <code>by</code> 关键字实现委托省略到这些模版代码,让代码更加简洁</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class DelegateCollection&lt;T&gt;(private val list: List&lt;T&gt; = arrayListOf()) : Collection&lt;T&gt; by list</span></span></code></pre></div><p>我们依然可以重写个别方法来实现自己的逻辑</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class DelegateCollection&lt;T&gt;(private val list: List&lt;T&gt; = arrayListOf()) : Collection&lt;T&gt; by list {</span></span>
<span class="line"><span>    override fun contains(element: T): Boolean {</span></span>
<span class="line"><span>        //todo: 写自己的逻辑</span></span>
<span class="line"><span>        return list.contains(element);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>原文链接: <a href="http://herman7z.site" target="_blank" rel="noreferrer">http://herman7z.site</a></p>`,25),l=[t];function i(o,c,r,d,u,h){return n(),a("div",null,l)}const m=s(p,[["render",i]]);export{v as __pageData,m as default};
