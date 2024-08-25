import{_ as s,c as a,o as n,aa as e}from"./chunks/framework.DlhgB44u.js";const b=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Notes/No2TechColumn/02 Spring/01 玩转Spring SPEL.md","filePath":"Notes/No2TechColumn/02 Spring/01 玩转Spring SPEL.md","lastUpdated":1724595807000}'),p={name:"Notes/No2TechColumn/02 Spring/01 玩转Spring SPEL.md"},t=e(`<hr><h2 id="title-01-玩转spring-spelauthor-hermanupdatetime-2021-08-14-13-41desc-玩转spring-spelcategories-springtags-speloutline-deep" tabindex="-1">title: 01 玩转Spring SPEL author: Herman updateTime: 2021-08-14 13:41 desc: 玩转Spring SPEL categories: spring tags: SpEL outline: deep <a class="header-anchor" href="#title-01-玩转spring-spelauthor-hermanupdatetime-2021-08-14-13-41desc-玩转spring-spelcategories-springtags-speloutline-deep" aria-label="Permalink to &quot;title: 01 玩转Spring SPEL
author: Herman
updateTime: 2021-08-14 13:41
desc: 玩转Spring SPEL
categories: spring
tags: SpEL
outline: deep&quot;">​</a></h2><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>最近工作中接到一个需求，需要对接第三方公司的API接口，由于每个公司提供的数据格式都不一样以及后期可能会对接更多的公司，我们给出的技术方式是设计一个数据解析模块，把数据结构各异的解析成我们内部定义的通用数据对象，如果后期再新增第三方公司的接口，我们只需要在后台配置好数据的解析规则即可完成对接</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/799523047-600a7f4b5492a" alt=""></p><p>我们调研过表达式语言OGNL、SpEL（表达式语言不止这两种），由于考虑到我们项目本身都是依赖于Spring的，所以选择了SpEL</p><h2 id="spel介绍以及功能概述" tabindex="-1">SpEL介绍以及功能概述 <a class="header-anchor" href="#spel介绍以及功能概述" aria-label="Permalink to &quot;SpEL介绍以及功能概述&quot;">​</a></h2><p>SpEL是spring提供的强大的表达式语言，本身也是作为了Spring的基石模块，在Spring的很多模块中都是使用到；虽然SpEL是Spring的基石，但是完全脱离Spring独立使用。SpEL提供的主要功能：</p><ul><li>文字表达式</li><li>布尔和关系运算符</li><li>正则表达式</li><li>类表达式</li><li>访问 properties, arrays, lists, maps</li><li>方法调用</li><li>关系运算符</li><li>参数</li><li>调用构造函数</li><li>Bean引用</li><li>构造Array</li><li>内嵌lists、内嵌maps</li><li>三元运算符</li><li>变量</li><li>用户定义的函数</li><li>集合投影</li><li>集合筛选</li><li>模板表达式</li></ul><h2 id="spel表达语言初级体验" tabindex="-1">SpEL表达语言初级体验 <a class="header-anchor" href="#spel表达语言初级体验" aria-label="Permalink to &quot;SpEL表达语言初级体验&quot;">​</a></h2><p>下面的代码使用SpEL API来解析文本字符串表达式 Hello World.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ExpressionParser parser = new SpelExpressionParser();</span></span>
<span class="line"><span>Expression exp = parser.parseExpression(&quot;&#39;Hello World&#39;&quot;);</span></span>
<span class="line"><span>String message = (String) exp.getValue();</span></span></code></pre></div><p>接口<code>ExpressionParser</code>负责解析表达式字符串，在表达式中表示字符串需要使用单引号</p><p>SpEL支持很多功能特性，如调用方法，访问属性，调用构造函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ExpressionParser parser = new SpelExpressionParser();</span></span>
<span class="line"><span>Expression exp = parser.parseExpression(&quot;&#39;Hello World&#39;.concat(&#39;!&#39;)&quot;);</span></span>
<span class="line"><span>String message = (String) exp.getValue();</span></span></code></pre></div><p>SpEL还支持使用标准的“.”符号，即嵌套属性prop1.prop2.prop3和属性值的设置</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ExpressionParser parser = new SpelExpressionParser();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// invokes getBytes().length</span></span>
<span class="line"><span>Expression exp = parser.parseExpression(&quot;&#39;Hello World&#39;.bytes.length&quot;);</span></span>
<span class="line"><span>int length = (Integer) exp.getValue();</span></span></code></pre></div><p>也可以使用<code>public &lt;T&gt; T getValue(Class&lt;T&gt; desiredResultType)</code>来获取返回指定类型的结果，不用强制类型转换，如果实际的结果不能转换成指定的类型就会抛出异常<code>EvaluationException</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ExpressionParser parser = new SpelExpressionParser();</span></span>
<span class="line"><span>Expression exp = parser.parseExpression(&quot;new String(&#39;hello world&#39;).toUpperCase()&quot;);</span></span>
<span class="line"><span>String message = exp.getValue(String.class);</span></span></code></pre></div><p>SpEL比较常见的用途是针对一个特定的对象实例（称为root object）提供被解析的表达式字符串. 这种方式也是我们项目中使用的方式，把不同渠道传入的json数据设置成root object，然后指定字符串表达式对每个标准字段进行解析</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GregorianCalendar c = new GregorianCalendar();</span></span>
<span class="line"><span>c.set(1856, 7, 9);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// The constructor arguments are name, birthday, and nationality.</span></span>
<span class="line"><span>Inventor tesla = new Inventor(&quot;Nikola Tesla&quot;, c.getTime(), &quot;Serbian&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ExpressionParser parser = new SpelExpressionParser();</span></span>
<span class="line"><span>Expression exp = parser.parseExpression(&quot;name&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>EvaluationContext context = new StandardEvaluationContext(tesla);</span></span>
<span class="line"><span>String name = (String) exp.getValue(context);</span></span></code></pre></div><h2 id="evaluationcontext-接口" tabindex="-1">EvaluationContext 接口 <a class="header-anchor" href="#evaluationcontext-接口" aria-label="Permalink to &quot;EvaluationContext 接口&quot;">​</a></h2><p>接口<code>EvaluationContext</code>有一个开箱即用的实现<code>StandardEvaluationContext</code>；当计算表达式解析属性,方法并帮助执行类型转换时，使用反射来操纵对象并且缓存java.lang.reflect的Method，Field，和Constructor实例提高性能</p><p><code>StandardEvaluationContext</code>可以通过<code>setRootObject()</code>或者传递root object到构造函数来设置root object，也可以使用<code>setVariable()</code>来设置变量，<code>registerFunction()</code>来注册方法；我们还可以通过自定义<code>ConstructorResolvers</code>, <code>MethodResolvers</code>, <code>PropertyAccessor</code>来扩展SpEL的功能。</p><h2 id="解析器配置" tabindex="-1">解析器配置 <a class="header-anchor" href="#解析器配置" aria-label="Permalink to &quot;解析器配置&quot;">​</a></h2><p>可以通过使用<code>org.springframework.expression.spel.SpelParserConfiguration</code>去精细化配置解析器功能，例如：如果在表达式中指定的数组或集合的索引位置值为null，就让它自动地创建的元素；如果索引超出数组的当前大小就去自动扩容</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Demo {</span></span>
<span class="line"><span>    public List&lt;String&gt; list;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Turn on:</span></span>
<span class="line"><span>// - auto null reference initialization</span></span>
<span class="line"><span>// - auto collection growing</span></span>
<span class="line"><span>SpelParserConfiguration config = new SpelParserConfiguration(true,true);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ExpressionParser parser = new SpelExpressionParser(config);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Expression expression = parser.parseExpression(&quot;list[3]&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Demo demo = new Demo();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Object o = expression.getValue(demo);</span></span></code></pre></div><h2 id="语言参考" tabindex="-1">语言参考 <a class="header-anchor" href="#语言参考" aria-label="Permalink to &quot;语言参考&quot;">​</a></h2><h4 id="文字表达式" tabindex="-1">文字表达式 <a class="header-anchor" href="#文字表达式" aria-label="Permalink to &quot;文字表达式&quot;">​</a></h4><p>支持文字表达的类型是字符串，日期，数值（int， real，十六进制），布尔和空。字符串使用单引号分隔。一个单引号本身在字符串中使用两个单引号字符表示。下面的列表 显示文字的简单用法。数字支持使用负号，指数符号和小数点</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ExpressionParser parser = new SpelExpressionParser();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// evals to &quot;Hello World&quot;</span></span>
<span class="line"><span>String helloWorld = (String) parser.parseExpression(&quot;&#39;Hello World&#39;&quot;).getValue();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>double avogadrosNumber = (Double) parser.parseExpression(&quot;6.0221415E+23&quot;).getValue();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// evals to 2147483647</span></span>
<span class="line"><span>int maxValue = (Integer) parser.parseExpression(&quot;0x7FFFFFFF&quot;).getValue();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>boolean trueValue = (Boolean) parser.parseExpression(&quot;true&quot;).getValue();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Object nullValue = parser.parseExpression(&quot;null&quot;).getValue();</span></span></code></pre></div><h4 id="properties-arrays-lists-maps" tabindex="-1">Properties, Arrays, Lists, Maps <a class="header-anchor" href="#properties-arrays-lists-maps" aria-label="Permalink to &quot;Properties, Arrays, Lists, Maps&quot;">​</a></h4><p>用属性引用很简单：只要用一个<code>.</code>表示嵌套属性值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// evals to 1856</span></span>
<span class="line"><span>int year = (Integer) parser.parseExpression(&quot;Birthdate.Year + 1900&quot;).getValue(context);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>String city = (String) parser.parseExpression(&quot;placeOfBirth.City&quot;).getValue(context);</span></span></code></pre></div><p>数组和列表使用方括号获得内容</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ExpressionParser parser = new SpelExpressionParser();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Inventions Array</span></span>
<span class="line"><span>StandardEvaluationContext teslaContext = new StandardEvaluationContext(tesla);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// evaluates to &quot;Induction motor&quot;</span></span>
<span class="line"><span>String invention = parser.parseExpression(&quot;inventions[3]&quot;).getValue(</span></span>
<span class="line"><span>        teslaContext, String.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Members List</span></span>
<span class="line"><span>StandardEvaluationContext societyContext = new StandardEvaluationContext(ieee);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// evaluates to &quot;Nikola Tesla&quot;</span></span>
<span class="line"><span>String name = parser.parseExpression(&quot;Members[0].Name&quot;).getValue(</span></span>
<span class="line"><span>        societyContext, String.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// List and Array navigation</span></span>
<span class="line"><span>// evaluates to &quot;Wireless communication&quot;</span></span>
<span class="line"><span>String invention = parser.parseExpression(&quot;Members[0].Inventions[6]&quot;).getValue(</span></span>
<span class="line"><span>        societyContext, String.class);</span></span></code></pre></div><p>maps的内容通过在方括号中指定key值获得.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Officer&#39;s Dictionary</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Inventor pupin = parser.parseExpression(&quot;Officers[&#39;president&#39;]&quot;).getValue(</span></span>
<span class="line"><span>        societyContext, Inventor.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// evaluates to &quot;Idvor&quot;</span></span>
<span class="line"><span>String city = parser.parseExpression(&quot;Officers[&#39;president&#39;].PlaceOfBirth.City&quot;).getValue(</span></span>
<span class="line"><span>        societyContext, String.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// setting values</span></span>
<span class="line"><span>parser.parseExpression(&quot;Officers[&#39;advisors&#39;][0].PlaceOfBirth.Country&quot;).setValue(</span></span>
<span class="line"><span>        societyContext, &quot;Croatia&quot;);</span></span></code></pre></div><h4 id="调用方法" tabindex="-1">调用方法 <a class="header-anchor" href="#调用方法" aria-label="Permalink to &quot;调用方法&quot;">​</a></h4><p>表达式中依然支持方法调用</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// string literal, evaluates to &quot;bc&quot;</span></span>
<span class="line"><span>String c = parser.parseExpression(&quot;&#39;abc&#39;.substring(2, 3)&quot;).getValue(String.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// evaluates to true</span></span>
<span class="line"><span>boolean isMember = parser.parseExpression(&quot;isMember(&#39;Mihajlo Pupin&#39;)&quot;).getValue(</span></span>
<span class="line"><span>        societyContext, Boolean.class);</span></span></code></pre></div><blockquote><p>这里使用到的方法<code>isMember</code>是root object中的方法，如果root object不存在这个方法会报错</p></blockquote><h4 id="运算符" tabindex="-1">运算符 <a class="header-anchor" href="#运算符" aria-label="Permalink to &quot;运算符&quot;">​</a></h4><p>关系运算符：等于，不等于，小于，小于或等于，大于， 和大于或等于的使用方式和正常Java中使用一致</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// evaluates to true</span></span>
<span class="line"><span>boolean trueValue = parser.parseExpression(&quot;2 == 2&quot;).getValue(Boolean.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// evaluates to false</span></span>
<span class="line"><span>boolean falseValue = parser.parseExpression(&quot;2 &lt; -5.0&quot;).getValue(Boolean.class);</span></span></code></pre></div><p>除了标准的关系运算符SpEL支持<code>instanceof</code>和正则表达式的<code>matches</code>操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>boolean falseValue = parser.parseExpression(</span></span>
<span class="line"><span>        &quot;&#39;xyz&#39; instanceof T(int)&quot;).getValue(Boolean.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// evaluates to true</span></span>
<span class="line"><span>boolean trueValue = parser.parseExpression(</span></span>
<span class="line"><span>        &quot;&#39;5.00&#39; matches &#39;^-?\\\\d+(\\\\.\\\\d{2})?$&#39;&quot;).getValue(Boolean.class);</span></span></code></pre></div><p>逻辑运算符：支持的逻辑运算符<code>and</code>, <code>or</code>, <code>not</code>.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/ -- AND --</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// evaluates to false</span></span>
<span class="line"><span>boolean falseValue = parser.parseExpression(&quot;true and false&quot;).getValue(Boolean.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// evaluates to true</span></span>
<span class="line"><span>String expression = &quot;isMember(&#39;Nikola Tesla&#39;) and isMember(&#39;Mihajlo Pupin&#39;)&quot;;</span></span>
<span class="line"><span>boolean trueValue = parser.parseExpression(expression).getValue(societyContext, Boolean.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// -- OR --</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// evaluates to true</span></span>
<span class="line"><span>boolean trueValue = parser.parseExpression(&quot;true or false&quot;).getValue(Boolean.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// evaluates to true</span></span>
<span class="line"><span>String expression = &quot;isMember(&#39;Nikola Tesla&#39;) or isMember(&#39;Albert Einstein&#39;)&quot;;</span></span>
<span class="line"><span>boolean trueValue = parser.parseExpression(expression).getValue(societyContext, Boolean.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// -- NOT --</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// evaluates to false</span></span>
<span class="line"><span>boolean falseValue = parser.parseExpression(&quot;!true&quot;).getValue(Boolean.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// -- AND and NOT --</span></span>
<span class="line"><span>String expression = &quot;isMember(&#39;Nikola Tesla&#39;) and !isMember(&#39;Mihajlo Pupin&#39;)&quot;;</span></span>
<span class="line"><span>boolean falseValue = parser.parseExpression(expression).getValue(societyContext, Boolean.class);</span></span></code></pre></div><h4 id="this-和-root变量" tabindex="-1">#this 和 #root变量 <a class="header-anchor" href="#this-和-root变量" aria-label="Permalink to &quot;#this 和 #root变量&quot;">​</a></h4><p>变量#this始终定义和指向的是当前的执行对象。变量#root指向root context object。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// create an array of integers</span></span>
<span class="line"><span>List&lt;Integer&gt; primes = new ArrayList&lt;Integer&gt;();</span></span>
<span class="line"><span>primes.addAll(Arrays.asList(2,3,5,7,11,13,17));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// create parser and set variable primes as the array of integers</span></span>
<span class="line"><span>ExpressionParser parser = new SpelExpressionParser();</span></span>
<span class="line"><span>StandardEvaluationContext context = new StandardEvaluationContext();</span></span>
<span class="line"><span>context.setVariable(&quot;primes&quot;,primes);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// all prime numbers &gt; 10 from the list (using selection ?{...})</span></span>
<span class="line"><span>// evaluates to [11, 13, 17]</span></span>
<span class="line"><span>List&lt;Integer&gt; primesGreaterThanTen = (List&lt;Integer&gt;) parser.parseExpression(</span></span>
<span class="line"><span>        &quot;#primes.?[#this&gt;10]&quot;).getValue(context);</span></span></code></pre></div><h4 id="函数" tabindex="-1">函数 <a class="header-anchor" href="#函数" aria-label="Permalink to &quot;函数&quot;">​</a></h4><p>有时候你可能需要自定义一些工具函数在表达式中使用，可以先使用<code>StandardEvaluationContext.registerFunction</code>方法注册函数，然后在表达式中调用函数</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ExpressionParser parser = new SpelExpressionParser();</span></span>
<span class="line"><span>StandardEvaluationContext context = new StandardEvaluationContext();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>context.registerFunction(&quot;reverseString&quot;,</span></span>
<span class="line"><span>    StringUtils.class.getDeclaredMethod(&quot;reverseString&quot;, new Class[] { String.class }));  //注册函数reverseString</span></span>
<span class="line"><span></span></span>
<span class="line"><span>String helloWorldReversed = parser.parseExpression(</span></span>
<span class="line"><span>    &quot;#reverseString(&#39;hello&#39;)&quot;).getValue(context, String.class);</span></span></code></pre></div><h4 id="bean引用" tabindex="-1">bean引用 <a class="header-anchor" href="#bean引用" aria-label="Permalink to &quot;bean引用&quot;">​</a></h4><p>如果解析上下文已经配置，那么bean解析器能够从表达式使用<code>@</code>符号查找bean类，使用<code>&amp;</code>查到FactoryBean对象</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ExpressionParser parser = new SpelExpressionParser();</span></span>
<span class="line"><span>StandardEvaluationContext context = new StandardEvaluationContext();</span></span>
<span class="line"><span>context.setBeanResolver(new MyBeanResolver());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// This will end up calling resolve(context,&quot;something&quot;) on MyBeanResolver during evaluation</span></span>
<span class="line"><span>Object bean = parser.parseExpression(&quot;@something&quot;).getValue(context);</span></span></code></pre></div><p>SpEL默认已经提供了<code>BeanFactoryResolver</code>，无需自己手动实现</p><h4 id="集合选择" tabindex="-1">集合选择 <a class="header-anchor" href="#集合选择" aria-label="Permalink to &quot;集合选择&quot;">​</a></h4><p>选择是一个强大的表达式语言功能，能够通过它设置过滤条件，返回满足条件的子集合，类似于Stream中的filter；选择使用语法<code>?[selectionExpression]</code>。</p><p>列表的过滤事例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ExpressionParser parser = new SpelExpressionParser();</span></span>
<span class="line"><span>StandardEvaluationContext context = new StandardEvaluationContext(Arrays.asList(1, 7, 0, 3, 4, 9));</span></span>
<span class="line"><span>Object subList = parser.parseExpression(&quot;#root.?[#this&gt;5]&quot;).getValue(context);  //[7, 9]</span></span></code></pre></div><p>map的过滤事例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ExpressionParser parser = new SpelExpressionParser();</span></span>
<span class="line"><span>Map&lt;String,Integer&gt; root = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>root.put(&quot;3&quot;,3);</span></span>
<span class="line"><span>root.put(&quot;6&quot;,6);</span></span>
<span class="line"><span>root.put(&quot;8&quot;,8);</span></span>
<span class="line"><span>StandardEvaluationContext context = new StandardEvaluationContext(root);</span></span>
<span class="line"><span>Object subMap = parser.parseExpression(&quot;#root.?[#this.value&gt;5]&quot;).getValue(context); //{6=6, 8=8}</span></span></code></pre></div><p>除了返回所有选定的元素以外，也可以用来获取第一或最后一个值。获得第一条目相匹配的选择的语法是 <code>^[...]</code>而获得最后一个匹配选择语法是<code>$[...]</code></p><h4 id="集合投影" tabindex="-1">集合投影 <a class="header-anchor" href="#集合投影" aria-label="Permalink to &quot;集合投影&quot;">​</a></h4><p>集合投影也是个强大的功能，可以把列表或map中对象的某个字段拿出来构成一个集合返回，类似于Stream中的map操作</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ExpressionParser parser = new SpelExpressionParser();</span></span>
<span class="line"><span>StandardEvaluationContext context = new StandardEvaluationContext(Arrays.asList(</span></span>
<span class="line"><span>        new User(&quot;Silently9521&quot;),</span></span>
<span class="line"><span>        new User(&quot;Silently9522&quot;), </span></span>
<span class="line"><span>        new User(&quot;Silently9527&quot;)));</span></span>
<span class="line"><span>Object nameList = parser.parseExpression(&quot;#root.![#this.name]&quot;).getValue(context);//[Silently9521, Silently9522, Silently9527]</span></span></code></pre></div><hr><p>参考官方文档：<a href="https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#expressions" target="_blank" rel="noreferrer">https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#expressions</a></p>`,71),l=[t];function i(o,r,c,u,d,g){return n(),a("div",null,l)}const x=s(p,[["render",i]]);export{b as __pageData,x as default};
