import{_ as a,c as s,o as n,aa as e}from"./chunks/framework.DOnJscRE.js";const m=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Notes/No2TechColumn/06 Kotlin/05 对象声明 伴生对象 匿名内部类.md","filePath":"Notes/No2TechColumn/06 Kotlin/05 对象声明 伴生对象 匿名内部类.md","lastUpdated":1761049051000}'),p={name:"Notes/No2TechColumn/06 Kotlin/05 对象声明 伴生对象 匿名内部类.md"},t=e(`<h4 id="对象声明" tabindex="-1">对象声明 <a class="header-anchor" href="#对象声明" aria-label="Permalink to &quot;对象声明&quot;">​</a></h4><p>单例对象在面向对象编程中很常见, 在Java中通常都是使用单例模式来实现的, 在Kotlin中可以简单的使用一个 <code>object</code> 关键字来实现, <code>object</code> 表示定义一个类并且同时创建一个实例,所以使用<code>object</code>标记的类其实就是一个对象, 先来看个例子</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>data class User(val name: String)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>object UserFactory {</span></span>
<span class="line"><span>    fun createUser(name: String): User = User(name)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>fun main(args: Array&lt;String&gt;) {</span></span>
<span class="line"><span>    val user = UserFactory.createUser(&quot;Herman&quot;)</span></span>
<span class="line"><span>    println(user)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用场景：</p><ul><li>全局唯一实例：当需要一个全局唯一的对象时，可以使用对象声明。例如，用于管理全局状态、单例模式、工具类等。</li><li>无状态的工具类：可以把一组相关的函数放到一个对象声明中，这样可以避免创建类的实例，并且方便调用。</li></ul><h4 id="匿名内部类" tabindex="-1">匿名内部类 <a class="header-anchor" href="#匿名内部类" aria-label="Permalink to &quot;匿名内部类&quot;">​</a></h4><p><code>object</code>关键字不仅可以用来声明单例模式的对象,还可以用来声明匿名内部类. 来看看Button如何处理点击事件</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Button().addActionListener(object : ActionListener {</span></span>
<span class="line"><span>    override fun actionPerformed(e: ActionEvent?) {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>})</span></span></code></pre></div><blockquote><p>注意: 与对象声明不同的是匿名内部类不是单例的, 每次执行的时候都会创建一个新的对象实例子</p></blockquote><h4 id="伴生对象" tabindex="-1">伴生对象 <a class="header-anchor" href="#伴生对象" aria-label="Permalink to &quot;伴生对象&quot;">​</a></h4><p>Kotlin中类不能够拥有静态成员; 替代的方案:使用包级别的函数和对象声明, 但是顶层的函数不能够访问到类的private成员,这时候就需要使用到伴生对象, 关键字<code>companion</code></p><p>伴生对象是类内部的一个对象声明，它与外部类相关联，并且可以访问外部类的私有成员。Kotlin 中的伴生对象类似于 Java 中的静态成员，尽管它不是静态的，但可以像静态方法和属性一样使用。</p><p>使用场景：</p><ul><li>工厂方法：使用伴生对象创建类的实例，而不是直接调用构造函数。</li><li>Java静态成员替代：将需要静态访问的属性和方法放在伴生对象中，这样可以在不创建类实例的情况下访问它们。</li><li>与类紧密关联的功能：当某些功能与类本身相关而不是与实例相关时，可以放在伴生对象中</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class User private constructor(private val name: String) {</span></span>
<span class="line"><span>    companion object UserFactory {</span></span>
<span class="line"><span>        fun createUser(name: String): User {</span></span>
<span class="line"><span>            val user = User(name)</span></span>
<span class="line"><span>            println(user.name)</span></span>
<span class="line"><span>            return user</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>注意看上面的例子,如果不是使用伴生对象是没有办法访问到User的私有构造方法和私有变量; 伴生对象的名字可以省略,默认的名字将会是<code>Companion</code></p><p>原文链接: <a href="http://herman7z.site" target="_blank" rel="noreferrer">http://herman7z.site</a></p>`,17),l=[t];function i(o,c,r,d,h,u){return n(),s("div",null,l)}const b=a(p,[["render",i]]);export{m as __pageData,b as default};
