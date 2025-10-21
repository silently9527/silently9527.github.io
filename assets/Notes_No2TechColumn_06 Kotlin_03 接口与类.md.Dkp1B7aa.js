import{_ as a,c as s,o as n,aa as p}from"./chunks/framework.DOnJscRE.js";const v=JSON.parse('{"title":"Chapter03 接口与类","description":"","frontmatter":{"title":"Chapter03 接口与类","author":"Herman","updateTime":"2024-09-18 12:34","desc":"Kotlin 基础入门","categories":"Kotlin","tags":"Kotlin","outline":"deep"},"headers":[],"relativePath":"Notes/No2TechColumn/06 Kotlin/03 接口与类.md","filePath":"Notes/No2TechColumn/06 Kotlin/03 接口与类.md","lastUpdated":1761049051000}'),e={name:"Notes/No2TechColumn/06 Kotlin/03 接口与类.md"},l=p(`<h4 id="接口" tabindex="-1">接口 <a class="header-anchor" href="#接口" aria-label="Permalink to &quot;接口&quot;">​</a></h4><p>Kotlin接口定义依旧使用<code>interface</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>interface Animal {</span></span>
<span class="line"><span>    fun say()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Dog : Animal {</span></span>
<span class="line"><span>    override fun say() {</span></span>
<span class="line"><span>        println(&quot;汪汪...&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><blockquote><ol><li>Kotlin使用冒号来替代Java中的extend,implements</li><li>Kotlin中override关键字是强制要求的,不能省略</li></ol></blockquote><p>Java中的接口允许拥有默认实现,Kotlin中也是同样支持的</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>interface Animal {</span></span>
<span class="line"><span>    fun say() = println(&quot;Animal say:^%&amp;**&amp;&amp;&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>现在让我们假设同样存在定义了一个<code>say</code>的实现Human,然后定义Man来实现这两个接口,默认Man会调用哪个say方法呢? 代码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>interface Human {</span></span>
<span class="line"><span>    fun say() = println(&quot;Human say:Hello&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Man : Human, Animal {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>测试后的接口过是任何一个都不会被调用,编译阶段就会报错,Man必须实现自己的say,</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Man : Human, Animal {</span></span>
<span class="line"><span>    override fun say() {</span></span>
<span class="line"><span>        super&lt;Animal&gt;.say();</span></span>
<span class="line"><span>        super&lt;Human&gt;.say();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="open-final-abstract" tabindex="-1">open,final,abstract <a class="header-anchor" href="#open-final-abstract" aria-label="Permalink to &quot;open,final,abstract&quot;">​</a></h4><p>Java中只有显示的指定了final,才能够控制类和方法不被重写,这就有可能导致脆弱基类的问题(对基类的方法重写导致行为不正常),所以Kotlin中方法默认都是final, 如果需要支持重写需要使用手动使用open修饰</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>open class Man : Human, Animal {</span></span>
<span class="line"><span>    override fun say() {</span></span>
<span class="line"><span>        super&lt;Animal&gt;.say();</span></span>
<span class="line"><span>        super&lt;Human&gt;.say();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    open fun walkSpeed() {</span></span>
<span class="line"><span>        println(&quot;walk quick&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class OldMan : Man() {</span></span>
<span class="line"><span>    override fun say() {</span></span>
<span class="line"><span>        println(&quot;OldMan say:Hello, girl&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    override fun walkSpeed() {</span></span>
<span class="line"><span>        println(&quot;walk slow&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中<code>Man</code>需要被继承所有需要使用<code>open</code>修饰, <code>walkSpeed</code>需要被重写也需要使用<code>open</code>修饰; 接口中的方法和抽象类中的抽象方法默认是open,无需在指定</p><h4 id="可见性修饰符" tabindex="-1">可见性修饰符 <a class="header-anchor" href="#可见性修饰符" aria-label="Permalink to &quot;可见性修饰符&quot;">​</a></h4><p>Kotlin与Java中的可见性修饰符一样,使用<code>public</code>, <code>private</code>, <code>protected</code>, 但是默认值不同, Kotlin中默认值是public</p><h4 id="内部类" tabindex="-1">内部类 <a class="header-anchor" href="#内部类" aria-label="Permalink to &quot;内部类&quot;">​</a></h4><p>与Java中的内部类区别在于Kotlin中的内部类默认情况下是不能够访问外部类的实例, 这和Java中的静态内部类很相似</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Woman : Human {</span></span>
<span class="line"><span>    override fun say() {</span></span>
<span class="line"><span>        val info = Info(&quot;Taomm&quot;, 21)</span></span>
<span class="line"><span>        println(&quot;Woman say: My name is \${info.name}, age is \${info.age}&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    class Info(val name: String, val age: Int)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里抽象出了个人信息的内部类Info, 但是在这个Info中是没有办法访问Woman中的成员,如果需要访问时需要使用关键字<code>inner</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Woman : Human {</span></span>
<span class="line"><span>    val address: String = &quot;Beijing&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    override fun say() {</span></span>
<span class="line"><span>        val info = Info(&quot;Taomm&quot;, 21)</span></span>
<span class="line"><span>        println(&quot;Woman say: My name is \${info.name}, age is \${info.age}, address is \${info.getAddress()}&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    inner class Info(val name: String, val age: Int) {</span></span>
<span class="line"><span>        fun getAddress(): String = this@Woman.address</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>访问外部类的时候需要通过<code>this@Woman</code>去操作</p><h4 id="密封类" tabindex="-1">密封类 <a class="header-anchor" href="#密封类" aria-label="Permalink to &quot;密封类&quot;">​</a></h4><p>有时候需要把子类限制在父类中, 作为父类的内部类, 方便管理,这时候就需要使用关键字<code>sealed</code>修饰父类, <code>sealed</code>关键字隐含了这个类是open, 所以无需在显式添加open关键字</p><h4 id="构造方法" tabindex="-1">构造方法 <a class="header-anchor" href="#构造方法" aria-label="Permalink to &quot;构造方法&quot;">​</a></h4><p>Kotlin中构造方法使用关键字<code>constructor</code>, 如果需要调用重载的构造方法可以使用<code>this()</code>, 如果需要调用父类的构造方法可以使用<code>supper()</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Person {</span></span>
<span class="line"><span>    var name: String</span></span>
<span class="line"><span>    var age: Int</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    constructor(_name: String) {</span></span>
<span class="line"><span>        this(_name, 20)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    constructor(_name: String, _age: Int) {</span></span>
<span class="line"><span>        name = _name</span></span>
<span class="line"><span>        age = _age</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在Java中经常会出现多个重载的构造方法, 与上面的两个构造方法类似, 在Kotlin中其实可以通过参数默认值以及参数命名替代掉,优化后的代码</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Person {</span></span>
<span class="line"><span>    var name: String</span></span>
<span class="line"><span>    var age: Int</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    constructor(_name: String, _age: Int = 20) {</span></span>
<span class="line"><span>        name = _name</span></span>
<span class="line"><span>        age = _age</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>fun main(args: Array&lt;String&gt;) {</span></span>
<span class="line"><span>    Person(_name = &quot;Herman&quot;) //根据参数名字设置值</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当我们的类只有一个构造函数的时候,可以继续简化,把成员属性和构造函数合并到一起</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Person (var name: String, var age: Int = 20)</span></span></code></pre></div><p>类的初始化工作除了在构造函数中进行,还可以使用初始化语句块 <code>init</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Person (var name: String, var age: Int = 20){</span></span>
<span class="line"><span>    init {</span></span>
<span class="line"><span>        //todo 初始化工作</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果你想要自己的类不能够被其他代码创建,需要把构造方法标记为private</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Person private constructor(var name: String, var age: Int = 20)</span></span></code></pre></div><blockquote><ol><li>Kotlin中创建对象的时候不需要使用new关键字,直接调用构造方法即可.</li><li>如果一个类没有任何构造方法,与Java一样Kotlin默认也会生成一个无参的构造方法</li></ol></blockquote><h4 id="接口中声明属性" tabindex="-1">接口中声明属性 <a class="header-anchor" href="#接口中声明属性" aria-label="Permalink to &quot;接口中声明属性&quot;">​</a></h4><p>Kotlin允许在接口中什么属性, 由于接口本身是不存储状态的,所以这个属性需要在子类来实现,具体是通过一个字段来存储,还是通过其他方式来获取就需要靠子类来实现</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>interface Human {</span></span>
<span class="line"><span>    val email:String</span></span>
<span class="line"><span>    val name:String</span></span>
<span class="line"><span>        get() = email.substringBefore(&quot;@&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个接口可以看到,接口中的属性依然可以拥有<code>getter/setter</code>, <code>name</code>给了默认的getter, 那子类应该如何实现email属性呢?</p><ol><li>直接通过一个变量来存储</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Man(override val email: String) : Human</span></span></code></pre></div><ol start="2"><li>提供getter</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Man : Human{</span></span>
<span class="line"><span>    override val email: String</span></span>
<span class="line"><span>        get() = getEmailFromDb()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private fun getEmailFromDb(): String {</span></span>
<span class="line"><span>        TODO(&quot;database query&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="属性访问器-getter-setter" tabindex="-1">属性访问器(getter/setter) <a class="header-anchor" href="#属性访问器-getter-setter" aria-label="Permalink to &quot;属性访问器(getter/setter)&quot;">​</a></h4><p>Kotlin中类的属性默认都提供了getter/setter, 然后在使用的时候可以直接访问属性,无需像Java一样去调用getter、setter方法;</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Counter{</span></span>
<span class="line"><span>    var count:Int=0</span></span>
<span class="line"><span>        private set</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fun inc(){</span></span>
<span class="line"><span>        count++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里定义了一个计数器,如果需要获取当前的计数可以直接访问属性<code>Counter().count</code>, 而count字段不能够被直接修改,只能调用<code>inc</code>方法,所以把这个setter设置成了<code>private</code></p><p>原文链接: <a href="http://herman7z.site" target="_blank" rel="noreferrer">http://herman7z.site</a></p>`,49),i=[l];function t(c,o,d,r,u,h){return n(),s("div",null,i)}const m=a(e,[["render",t]]);export{v as __pageData,m as default};
