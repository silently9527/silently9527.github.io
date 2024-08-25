import{_ as n,c as a,o as s,aa as p}from"./chunks/framework.d_Ke7vMG.js";const P=JSON.parse('{"title":"03 Java中NullPointerException的完美解决方案","description":"","frontmatter":{"title":"03 Java中NullPointerException的完美解决方案","author":"Herman","updateTime":"2021-08-14 13:41","desc":"Java中NullPointerException的完美解决方案","categories":"Java","tags":"Java8新特性","outline":"deep"},"headers":[],"relativePath":"Notes/No2TechColumn/01 Java/03 Java中NullPointerException的完美解决方案.md","filePath":"Notes/No2TechColumn/01 Java/03 Java中NullPointerException的完美解决方案.md","lastUpdated":1724595807000}'),e={name:"Notes/No2TechColumn/01 Java/03 Java中NullPointerException的完美解决方案.md"},l=p(`<p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/1566169983-5fb3c5b67966e_articlex" alt=""></p><h4 id="null在java中带来的麻烦" tabindex="-1">null在Java中带来的麻烦 <a class="header-anchor" href="#null在java中带来的麻烦" aria-label="Permalink to &quot;null在Java中带来的麻烦&quot;">​</a></h4><p>我相信所有的Java程序猿一定都遇到过<code>NullPointerException</code>，空指针在Java程序中是最常见的，也是最烦人的；它让我们很多程序猿产生了根深蒂固的感觉，所有可能产生空指针的地方都的加上<code>if-else</code>检查，但是这带给我们很多麻烦</p><ul><li>Java本身是强类型的，但是null破坏了这个规则，它可以被赋值给任何对象</li><li>Java的设计是让程序猿对指针无感知，但是null指针是个例外</li><li>它会是代码变得很臃肿，到处都充斥着<code>if-else</code>的空检查，甚至是多层嵌套，代码可读性下降</li><li>null本身毫无意义，表示不了<code>无</code></li></ul><p>前两点不需要特别的说明，后两点举个例子来说明一下： 假如一个人拥有一个手机，每个手机都有生成厂商，每个厂商都会有个名字，用类表示的话：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Person {</span></span>
<span class="line"><span>    private Phone phone;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Phone getPhone() {</span></span>
<span class="line"><span>        return phone;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Phone {</span></span>
<span class="line"><span>    private Producer producer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Producer getProducer() {</span></span>
<span class="line"><span>        return producer;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Producer {</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getName() {</span></span>
<span class="line"><span>        return name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个例子中，假如我们需要取到手机生成厂商的名字</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public String getPhoneProducerName(Person person) {</span></span>
<span class="line"><span>    return person.getPhone().getProducer().getName();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由于不一定每个人都会有一个手机，所有在调用<code>getProducer()</code>时可能会出现<code>NullPointerException</code>。</p><p>一门设计语言本来就是来描述世界的，在这个事例中有的人有手机，有的人也可能没有手机，所以在调用<code>person.getPhone()</code>返回的值就应该包含有和无这两种情况，现在通过返回<code>null</code>来表示无，但是在调用<code>getProducer()</code>却又会抛出异常，这样就不太符合现实逻辑；所以把<code>null</code>来用来表示<code>无</code>不合适</p><p>在遇到这种情况通常的做法是做null检查,甚至是每个地方可能发生null指针的做检查。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public String getPhoneProducerName(Person person) {</span></span>
<span class="line"><span>    if (person.getPhone() == null) {</span></span>
<span class="line"><span>        return &quot;无名字&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (person.getPhone().getProducer() == null) {</span></span>
<span class="line"><span>        return &quot;无名字&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return person.getPhone().getProducer().getName();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里我已经试图在减少代码的层级，如果使用的是<code>if-else</code>，代码的层级会更深，代码可读性下降。</p><hr><h4 id="optional的简单介绍" tabindex="-1">Optional的简单介绍 <a class="header-anchor" href="#optional的简单介绍" aria-label="Permalink to &quot;Optional的简单介绍&quot;">​</a></h4><p>吐槽了那么多现状的不好，现在可以祭出我们的解决方案了 <code>Optional</code>；千呼万唤始出来，犹抱琵琶半遮面；那<code>Optional</code>到底是个什么东西，我们一起来逐步解开它的面纱。</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/1883051154-5fb2773078853_articlex" alt=""></p><p><code>Optional</code>本身只是对对象的简单包装，如果对象为空，那么会构建一个空的<code>Optional</code>；这样一来<code>Optional</code>就包含了存在和不存在两个情况, 接下来可以看下上面的例子改过之后</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Person {</span></span>
<span class="line"><span>    private Optional&lt;Phone&gt; phone;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Optional&lt;Phone&gt; getPhone() {</span></span>
<span class="line"><span>        return phone;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Phone {</span></span>
<span class="line"><span>    private Producer producer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Producer getProducer() {</span></span>
<span class="line"><span>        return producer;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Producer {</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getName() {</span></span>
<span class="line"><span>        return name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由于有的人可能没有手机，有的人有，所以<code>Phone</code>需要用<code>Optional</code>包装起来；手机本身一定会有生产的厂商，厂商一定会有一个名字，所以这两个不需要用<code>Optional</code>包装起来。这里我们会发现使用了<code>Optional</code>会丰富代码的语义，让代码更加符合现实。</p><p>而当我们在调用<code>phone.getProducer().getName()</code>的时候不需要做null指针的检查，如果说在这里发生了<code>NullPointerException</code>，说明这里数据本身是有问题的，不符合现实，就应该让问题暴露出来，而不是像上面的代码一样把问题掩盖。</p><hr><h4 id="optional的常用方法使用" tabindex="-1">Optional的常用方法使用 <a class="header-anchor" href="#optional的常用方法使用" aria-label="Permalink to &quot;Optional的常用方法使用&quot;">​</a></h4><h5 id="_1-optional的创建方法" tabindex="-1">1. Optional的创建方法 <a class="header-anchor" href="#_1-optional的创建方法" aria-label="Permalink to &quot;1. Optional的创建方法&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Optional&lt;Person&gt; empty = Optional.empty();  //申明一个空的Optional</span></span>
<span class="line"><span>Optional&lt;Person&gt; person = Optional.of(new Person()); //包装Person</span></span>
<span class="line"><span>Optional&lt;Person&gt; person2 = Optional.of(null); //不允许的操作，传入null 会抛出空指针异常</span></span>
<span class="line"><span>Optional&lt;Person&gt; optionalPerson = Optional.ofNullable(null); //允许传null, 返回一个空的Optional</span></span></code></pre></div><h5 id="_2-optional值的获取方式" tabindex="-1">2. Optional值的获取方式 <a class="header-anchor" href="#_2-optional值的获取方式" aria-label="Permalink to &quot;2. Optional值的获取方式&quot;">​</a></h5><ul><li>map、flatMap 首先我们重新定义一下Phone类，除了有生产厂商之外，还有个型号；</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Phone {</span></span>
<span class="line"><span>    private String model;</span></span>
<span class="line"><span>    private Producer producer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Producer getProducer() {</span></span>
<span class="line"><span>        return producer;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public String getModel() {</span></span>
<span class="line"><span>        return model;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当我们需要获取到手机的型号的时候可以这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Optional&lt;Phone&gt; optionalPhone = Optional.of(new Phone());</span></span>
<span class="line"><span>Optional&lt;String&gt; model = optionalPhone.map(Phone::getModel);</span></span></code></pre></div><p>当我们需要通过Person对象获取到Phone的型号是，会想到这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Optional&lt;Person&gt; optionalPerson = Optional.of(new Person());</span></span>
<span class="line"><span>optionalPerson.map(Person::getPhone).map(Phone::getModel);</span></span></code></pre></div><p>当我们写出来的时候发现编译器不能通过。是因为<code>Person::getPhone</code>返回的是一个<code>Optional&lt;Phone&gt;</code>，调用<code>optionalPerson.map(Person::getPhone)</code>返回的就是<code>Optional&lt;Optional&lt;Phone&gt;&gt;</code>，所以再<code>.map</code>的就无法拿到手机型号，那如何能够让返回的结果不是<code>Optional&lt;Optional&lt;Phone&gt;&gt;</code>，而是<code>Optional&lt;Phone&gt;</code>呢？</p><p>这里需要用到另一个方法<code>flatMap</code>。<code>flatMap</code>和<code>map</code>的区别，我在刚开始学习的时候，看到了网上的各种解释都很绕，看的很晕，最后直接打开源码来看，发现实现很简单，很容易理解，来看下源码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public&lt;U&gt; Optional&lt;U&gt; map(Function&lt;? super T, ? extends U&gt; mapper) {</span></span>
<span class="line"><span>    Objects.requireNonNull(mapper);</span></span>
<span class="line"><span>    if (!isPresent())</span></span>
<span class="line"><span>        return empty();</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>        return Optional.ofNullable(mapper.apply(value));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public&lt;U&gt; Optional&lt;U&gt; flatMap(Function&lt;? super T, Optional&lt;U&gt;&gt; mapper) {</span></span>
<span class="line"><span>    Objects.requireNonNull(mapper);</span></span>
<span class="line"><span>    if (!isPresent())</span></span>
<span class="line"><span>        return empty();</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>        return Objects.requireNonNull(mapper.apply(value));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>map</code>方法在返回的时候会包装一层<code>Optional</code> ； <code>flatMap</code>在返回的时候直接把函数的返回值返回了，函数的结果必须是<code>Optional</code>；那么在前面的例子中我们直接调用<code>flatMap</code>返回的结果就是<code>Optional&lt;Phone&gt;</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Optional&lt;Person&gt; optionalPerson = Optional.of(new Person());</span></span>
<span class="line"><span>optionalPerson.flatMap(Person::getPhone).map(Phone::getModel);</span></span></code></pre></div><ul><li>取出<code>Optional</code>中的值对象：get、orElse、orElseGet、orElseThrow、ifPresent</li></ul><ol><li>get() : 当你明确知道Optional中有值的话可以直接调用该方法，当Optional中没有值是该方法会抛出异常<code>NoSuchElementException</code>;所以当如果存在空值的话建议就不要调用该方法，因为这样和做null检查就没有区别了</li><li>orElse(T other) : 提供一个默认值，当值不存在是返回这个默认值</li><li>orElseGet(Supplier&lt;? extends T&gt; other) : 当值不存在的时候会调用supper函数，如果说返回这个默认值的逻辑较多，那么调用这个方法比较合适；</li><li>orElseThrow(Supplier&lt;? extends X&gt; exceptionSupplier) : 当值为空时会抛出一个自定义的异常</li><li>ifPresent(Consumer&lt;? super T&gt; consumer) : 当值不为空是会调用<code>consumer</code>函数，如果值为空，那么这个方法什么都不做</li></ol><ul><li>filter 过滤出满足条件的对象 假如我们需要过滤出手机型号<code>IOS</code>的手机，并打印出型号，代码如下：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Person person = new Person(Optional.of(new Phone(&quot;IOS&quot;)));</span></span>
<span class="line"><span>        Optional&lt;Person&gt; optionalPerson = Optional.of(person);</span></span>
<span class="line"><span>        optionalPerson.flatMap(Person::getPhone)</span></span>
<span class="line"><span>                .filter(phone -&gt; &quot;IOS&quot;.equals(phone.getModel()))</span></span>
<span class="line"><span>                .map(Phone::getModel)</span></span>
<span class="line"><span>                .ifPresent(System.out::println);</span></span></code></pre></div><hr><h4 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h4><ol><li>我们讨论了null在Java程序的问题</li><li>介绍Java8中引入了<code>Optional</code>来表示有和无的情况以及初始化的方式</li><li>举例说明了<code>Optional</code>中经常使用到的方法</li></ol>`,44),o=[l];function t(i,c,r,d,u,h){return s(),a("div",null,o)}const b=n(e,[["render",t]]);export{P as __pageData,b as default};
