import{_ as n,c as a,o as s,aa as p}from"./chunks/framework.d_Ke7vMG.js";const M=JSON.parse('{"title":"02 HandlerMapping初始化过程","description":"","frontmatter":{"title":"02 HandlerMapping初始化过程","author":"Herman","updateTime":"2021-08-14 13:41","desc":"深入解析SpringMVC核心原理：从手写简易版MVC框架开始(SmartMvc)","categories":"MyProjects","tags":"SpringMvc/MVC","outline":"deep"},"headers":[],"relativePath":"Notes/No1MyProjects/02 SmartMvc/02 HandlerMapping - 初始化过程-02handlermapping-初始化过程.md","filePath":"Notes/No1MyProjects/02 SmartMvc/02 HandlerMapping - 初始化过程-02handlermapping-初始化过程.md","lastUpdated":1723606122000}'),e={name:"Notes/No1MyProjects/02 SmartMvc/02 HandlerMapping - 初始化过程-02handlermapping-初始化过程.md"},t=p(`<p>不知道大家有没有好奇过，SpringMVC是如何通过request就可以找到我们写的Controller中的一个方法，它是怎么做到的，什时候做的呢？ 本节我们就来开发HandlerMapping的初始化过程，把Controller中的方法转换成我们定义的<code>HandlerMethod</code>对象（也就是架构图中画的Handler），根据注解<code>RequestMapping</code>来映射url和<code>HandlerMethod</code>的对应关系。首先我们先来看下本节中涉及到的类</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/2805161289-5fc25a04be986_articlex" alt=""></p><h4 id="_4-1-研发步骤讲解" tabindex="-1">4.1 研发步骤讲解 <a class="header-anchor" href="#_4-1-研发步骤讲解" aria-label="Permalink to &quot;4.1 研发步骤讲解&quot;">​</a></h4><blockquote><p>本节所有的代码都放在分支：handlerMapping-initial</p></blockquote><h5 id="handlermapping接口" tabindex="-1"><code>HandlerMapping</code>接口 <a class="header-anchor" href="#handlermapping接口" aria-label="Permalink to &quot;\`HandlerMapping\`接口&quot;">​</a></h5><p><code>HandlerMapping</code>接口中只有一个方法，通过request找个需要执行的handler，包装成<code>HandlerExecutionChain</code>，改方法本节中暂时不实现，下一节再来开发这部分代码，今天主要是实现<code>HandlerMapping</code>的初始化过程</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface HandlerMapping {</span></span>
<span class="line"><span>    HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="requestmapping注解" tabindex="-1"><code>RequestMapping</code>注解 <a class="header-anchor" href="#requestmapping注解" aria-label="Permalink to &quot;\`RequestMapping\`注解&quot;">​</a></h5><p><code>RequestMapping</code>注解，只提供了两个属性<code>path</code>，<code>method</code></p><ol><li><code>path</code> 表示url中的路径</li><li><code>method</code> 表示http请求的方式 <code> GET</code>，<code>POST</code></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target({ElementType.TYPE, ElementType.METHOD})</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>public @interface RequestMapping {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String path();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    RequestMethod method() default RequestMethod.GET;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="requestmappinginfo" tabindex="-1"><code>RequestMappingInfo</code> <a class="header-anchor" href="#requestmappinginfo" aria-label="Permalink to &quot;\`RequestMappingInfo\`&quot;">​</a></h5><p>主要是对应配置在控制器方法上的<code>RequestMapping</code>注解，把<code>RequestMapping</code>注解转换成<code>RequestMappingInfo</code>对象</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RequestMappingInfo {</span></span>
<span class="line"><span>    private String path;</span></span>
<span class="line"><span>    private RequestMethod httpMethod;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public RequestMappingInfo(String prefix, RequestMapping requestMapping) {</span></span>
<span class="line"><span>        this.path = prefix + requestMapping.path();</span></span>
<span class="line"><span>        this.httpMethod = requestMapping.method();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getPath() {</span></span>
<span class="line"><span>        return path;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public RequestMethod getHttpMethod() {</span></span>
<span class="line"><span>        return httpMethod;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="handlermethod" tabindex="-1"><code>HandlerMethod</code> <a class="header-anchor" href="#handlermethod" aria-label="Permalink to &quot;\`HandlerMethod\`&quot;">​</a></h5><p><code>HandlerMethod</code>是个很重要的对象，主要是对应控制器中的方法，也就是实际处理业务的handler；这里我们暂时定义了三个属性</p><ol><li>bean: 表示该方法的实例对象，也就是Controller的实例对象</li><li>beanType: 表示的是我们写的Controller的类型；比如我们常定义的：<code>IndexController</code>、<code>UserController</code>等等</li><li>method: 表示Controller中的方法</li><li>parameters: 表示方法中的所有参数的定义，这里引用了Spring中提供的<code>MethodParameter</code>工具类，里面封装了一些实用的方法，比如说后面会用到获取方法上的注解等等</li></ol><p>本节<code>HandlerMethod</code>只提供了一个构造方法，通bean和method构建一个<code>HandlerMethod</code>对象</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class HandlerMethod {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private Object bean;</span></span>
<span class="line"><span>    private Class&lt;?&gt; beanType;</span></span>
<span class="line"><span>    private Method method;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private List&lt;MethodParameter&gt; parameters;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public HandlerMethod(Object bean, Method method) {</span></span>
<span class="line"><span>        this.bean = bean;</span></span>
<span class="line"><span>        this.beanType = bean.getClass();</span></span>
<span class="line"><span>        this.method = method;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this.parameters = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>        int parameterCount = method.getParameterCount();</span></span>
<span class="line"><span>        for (int index = 0; index &lt; parameterCount; index++) {</span></span>
<span class="line"><span>            parameters.add(new MethodParameter(method, index));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="mappingregistry" tabindex="-1"><code>MappingRegistry</code> <a class="header-anchor" href="#mappingregistry" aria-label="Permalink to &quot;\`MappingRegistry\`&quot;">​</a></h5><p><code>MappingRegistry</code>是<code>RequestMappingInfo</code>、<code>HandlerMethod</code>的注册中心，当解析完一个控制器的method后就会向<code>MappingRegistry</code>中注册一个；最后当接收到用户请求后，根据请求的url在<code>MappingRegistry</code>找到对应的<code>HandlerMethod</code>；本节写了三个方法:</p><ol><li>register: 把解析完成的<code>RequestMappingInfo</code>注册到Map中；通过<code>method</code>，<code>handler</code>构建<code>HandlerMethod</code>对象，然后也加入到Map中</li><li>getMappingByPath: 通过path查找出<code>RequestMappingInfo</code></li><li>getHandlerMethodByPath: 通过path查找出<code>HandlerMethod</code></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 所有映射的注册中心</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class MappingRegistry {</span></span>
<span class="line"><span>    private Map&lt;String, RequestMappingInfo&gt; pathMappingInfo = new ConcurrentHashMap&lt;&gt;();</span></span>
<span class="line"><span>    private Map&lt;String, HandlerMethod&gt; pathHandlerMethod = new ConcurrentHashMap&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 注册url和Mapping/HandlerMethod的对应关系</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param mapping</span></span>
<span class="line"><span>     * @param handler</span></span>
<span class="line"><span>     * @param method</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void register(RequestMappingInfo mapping, Object handler, Method method) {</span></span>
<span class="line"><span>        pathMappingInfo.put(mapping.getPath(), mapping);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        HandlerMethod handlerMethod = new HandlerMethod(handler, method);</span></span>
<span class="line"><span>        pathHandlerMethod.put(mapping.getPath(), handlerMethod);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public RequestMappingInfo getMappingByPath(String path) {</span></span>
<span class="line"><span>        return this.pathMappingInfo.get(path);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public HandlerMethod getHandlerMethodByPath(String path) {</span></span>
<span class="line"><span>        return this.pathHandlerMethod.get(path);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="requestmappinghandlermapping" tabindex="-1"><code>RequestMappingHandlerMapping</code> <a class="header-anchor" href="#requestmappinghandlermapping" aria-label="Permalink to &quot;\`RequestMappingHandlerMapping\`&quot;">​</a></h5><p>本节需要使用的组件类都已经写完了，现在就开始开发主要类<code>RequestMappingHandlerMapping</code>的初始化过程，完整代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RequestMappingHandlerMapping extends ApplicationObjectSupport implements HandlerMapping, InitializingBean {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private MappingRegistry mappingRegistry = new MappingRegistry();</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public MappingRegistry getMappingRegistry() {</span></span>
<span class="line"><span>        return mappingRegistry;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void afterPropertiesSet() throws Exception {</span></span>
<span class="line"><span>        initialHandlerMethods();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void initialHandlerMethods() {</span></span>
<span class="line"><span>        Map&lt;String, Object&gt; beansOfMap = BeanFactoryUtils.beansOfTypeIncludingAncestors(obtainApplicationContext(), Object.class);</span></span>
<span class="line"><span>        beansOfMap.entrySet().stream()</span></span>
<span class="line"><span>                .filter(entry -&gt; this.isHandler(entry.getValue()))</span></span>
<span class="line"><span>                .forEach(entry -&gt; this.detectHandlerMethods(entry.getKey(), entry.getValue()));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 类上有标记Controller的注解就是我们需要找的handler</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param handler</span></span>
<span class="line"><span>     * @return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private boolean isHandler(Object handler) {</span></span>
<span class="line"><span>        Class&lt;?&gt; beanType = handler.getClass();</span></span>
<span class="line"><span>        return (AnnotatedElementUtils.hasAnnotation(beanType, Controller.class));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 解析出handler中 所有被RequestMapping注解的方法</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param beanName</span></span>
<span class="line"><span>     * @param handler</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void detectHandlerMethods(String beanName, Object handler) {</span></span>
<span class="line"><span>        Class&lt;?&gt; beanType = handler.getClass();</span></span>
<span class="line"><span>        Map&lt;Method, RequestMappingInfo&gt; methodsOfMap = MethodIntrospector.selectMethods(beanType,</span></span>
<span class="line"><span>                (MethodIntrospector.MetadataLookup&lt;RequestMappingInfo&gt;) method -&gt; getMappingForMethod(method, beanType));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        methodsOfMap.forEach((method, requestMappingInfo) -&gt; this.mappingRegistry.register(requestMappingInfo, handler, method));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 查找method上面是否有RequestMapping，有 =&gt; 构建RequestMappingInfo</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param method</span></span>
<span class="line"><span>     * @param beanType</span></span>
<span class="line"><span>     * @return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private RequestMappingInfo getMappingForMethod(Method method, Class&lt;?&gt; beanType) {</span></span>
<span class="line"><span>        RequestMapping requestMapping = AnnotatedElementUtils.findMergedAnnotation(method, RequestMapping.class);</span></span>
<span class="line"><span>        if (Objects.isNull(requestMapping)) {</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        String prefix = getPathPrefix(beanType);</span></span>
<span class="line"><span>        return new RequestMappingInfo(prefix, requestMapping);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String getPathPrefix(Class&lt;?&gt; beanType) {</span></span>
<span class="line"><span>        RequestMapping requestMapping = AnnotatedElementUtils.findMergedAnnotation(beanType, RequestMapping.class);</span></span>
<span class="line"><span>        if (Objects.isNull(requestMapping)) {</span></span>
<span class="line"><span>            return &quot;&quot;;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return requestMapping.path();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>因为在初始化的过程中，我们需要获取到容器中所有的Bean对象，所以<code>RequestMappingHandlerMapping</code>需要继承于<code>ApplicationObjectSupport</code>，<code>ApplicationObjectSupport</code>为我们提供了方便访问容器的方法；因为<code>RequestMappingHandlerMapping</code>需要在创建完对象后初始化<code>HandlerMethod</code>，所以实现了接口<code>InitializingBean</code>(提供了<code>afterPropertiesSet</code>方法，在对象创建完成后，spring容器会调用这个方法)，初始化代码的入口就在<code>afterPropertiesSet</code>中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void initialHandlerMethods() {</span></span>
<span class="line"><span>    Map&lt;String, Object&gt; beansOfMap = BeanFactoryUtils.beansOfTypeIncludingAncestors(obtainApplicationContext(), Object.class);</span></span>
<span class="line"><span>    beansOfMap.entrySet().stream()</span></span>
<span class="line"><span>            .filter(entry -&gt; this.isHandler(entry.getValue()))</span></span>
<span class="line"><span>            .forEach(entry -&gt; this.detectHandlerMethods(entry.getKey(), entry.getValue()));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>首先我们需要从容器中拿出所有的Bean，这里我们用的是Spring提供的工具类<code>BeanFactoryUtils.beansOfTypeIncludingAncestors(obtainApplicationContext(), Object.class);</code>，该方法将会返回beanName和bean实例对应的Map；</p><p>接着需要过滤出所有被标记<code>@Controller</code>的类，代码写在了<code>isHandler</code>方法中</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 类上有标记Controller的注解就是我们需要找的handler</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @param handler</span></span>
<span class="line"><span> * @return</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private boolean isHandler(Object handler) {</span></span>
<span class="line"><span>    Class&lt;?&gt; beanType = handler.getClass();</span></span>
<span class="line"><span>    return (AnnotatedElementUtils.hasAnnotation(beanType, Controller.class));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里也使用到了Spring中的工具类<code>AnnotatedElementUtils.hasAnnotation</code>判断类是否有添加注解<code>@Controller</code>； 找出所有的Controller之后，我们需要解析出Controller中的所有方法，构建我们需要的<code>HandlerMethod</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 解析出handler中 所有被RequestMapping注解的方法</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @param beanName</span></span>
<span class="line"><span> * @param handler</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private void detectHandlerMethods(String beanName, Object handler) {</span></span>
<span class="line"><span>    Class&lt;?&gt; beanType = handler.getClass();</span></span>
<span class="line"><span>    Map&lt;Method, RequestMappingInfo&gt; methodsOfMap = MethodIntrospector.selectMethods(beanType,</span></span>
<span class="line"><span>            (MethodIntrospector.MetadataLookup&lt;RequestMappingInfo&gt;) method -&gt; </span></span>
<span class="line"><span>            getMappingForMethod(method, beanType));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    methodsOfMap.forEach((method, requestMappingInfo) -&gt; this.mappingRegistry.register(requestMappingInfo, handler, method));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * 查找method上面是否有RequestMapping，有 =&gt; 构建RequestMappingInfo</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @param method</span></span>
<span class="line"><span> * @param beanType</span></span>
<span class="line"><span> * @return</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private RequestMappingInfo getMappingForMethod(Method method, Class&lt;?&gt; beanType) {</span></span>
<span class="line"><span>    RequestMapping requestMapping = AnnotatedElementUtils.findMergedAnnotation(method, RequestMapping.class);</span></span>
<span class="line"><span>    if (Objects.isNull(requestMapping)) {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    String prefix = getPathPrefix(beanType);</span></span>
<span class="line"><span>    return new RequestMappingInfo(prefix, requestMapping);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用工具类<code>MethodIntrospector.selectMethods</code>找出Controller类中所有的方法，遍历每个方法，判断方法是否有添加注解<code>@RequestMapping</code>，如果没有就返回空，如果有就通过<code>@RequestMapping</code>构建<code>RequestMappingInfo</code>对象返回；如果所Controller类上有添加注解<code>@RequestMapping</code>，那么配的path将作为前缀</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private String getPathPrefix(Class&lt;?&gt; beanType) {</span></span>
<span class="line"><span>    RequestMapping requestMapping = AnnotatedElementUtils.findMergedAnnotation(beanType, RequestMapping.class);</span></span>
<span class="line"><span>    if (Objects.isNull(requestMapping)) {</span></span>
<span class="line"><span>        return &quot;&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return requestMapping.path();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当所有的方法都解析完成之后，需要把所有配置有<code>@RequestMapping</code>注解的方法注册到<code>MappingRegistry</code>,代码如下： <code>methodsOfMap.forEach((method, requestMappingInfo) -&gt; this.mappingRegistry.register(requestMappingInfo, handler, method));</code></p><h4 id="_4-3-单元测试" tabindex="-1">4.3 单元测试 <a class="header-anchor" href="#_4-3-单元测试" aria-label="Permalink to &quot;4.3 单元测试&quot;">​</a></h4><p>到此为止，我们把Controller中方法的解析过程已经开发完成，接下来我们来写一点简单的单元测试。</p><p><code>AppConfig.java</code>中添加代码构建<code>RequestMappingHandlerMapping</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Configuration</span></span>
<span class="line"><span>@ComponentScan(basePackages = &quot;com.silently9527.smartmvc&quot;)</span></span>
<span class="line"><span>public class AppConfig {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public RequestMappingHandlerMapping handlerMapping() {</span></span>
<span class="line"><span>        return new RequestMappingHandlerMapping();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为了测试我们的Controller解析是否正确，我们需要的测试用例：</p><ul><li>在IndexController中我们在类上面配置path的前缀<code>/index</code>；解析完成后的path要拼接上<code>/index</code></li><li>在IndexController中添加三个方法，其中<code>test</code>、<code>test2</code>两个用<code>@RequestMapping</code>标注，<code>test3</code>不标注；解析完成后<code>test3</code>不再我们注册中心里面，<code>test</code>、<code>test2</code>两个在注册中里面，并且<code>@RequestMapping</code>中的属性正确解析成<code>RequestMappingInfo</code>对象</li><li>创建TestConroller类，添加一个方法<code>test4</code>，在类上面标注注解<code>@Service</code>，解析完成后<code>test4</code>不能在注册中心里面找到</li></ul><p><code>IndexController</code>，<code>TestController</code>代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Controller</span></span>
<span class="line"><span>@RequestMapping(path = &quot;/index&quot;)</span></span>
<span class="line"><span>public class IndexController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @RequestMapping(path = &quot;/test&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>    public void test(String name) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @RequestMapping(path = &quot;/test2&quot;, method = RequestMethod.POST)</span></span>
<span class="line"><span>    public void test2(String name2) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void test3(String name3) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Service</span></span>
<span class="line"><span>public class TestController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @RequestMapping(path = &quot;/test4&quot;, method = RequestMethod.POST)</span></span>
<span class="line"><span>    public void test4(String name2) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来建立我们的单元测试类<code>RequestMappingHandlerMappingTest</code>，继承于我们上一节写好的测试基类<code>BaseJunit4Test</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RequestMappingHandlerMappingTest extends BaseJunit4Test {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private RequestMappingHandlerMapping requestMappingHandlerMapping;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void test() {</span></span>
<span class="line"><span>        MappingRegistry mappingRegistry = requestMappingHandlerMapping.getMappingRegistry();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        String path = &quot;/index/test&quot;;</span></span>
<span class="line"><span>        String path1 = &quot;/index/test2&quot;;</span></span>
<span class="line"><span>        String path4 = &quot;/test4&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Assert.assertEquals(mappingRegistry.getPathHandlerMethod().size(), 2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        HandlerMethod handlerMethod = mappingRegistry.getHandlerMethodByPath(path);</span></span>
<span class="line"><span>        HandlerMethod handlerMethod2 = mappingRegistry.getHandlerMethodByPath(path1);</span></span>
<span class="line"><span>        HandlerMethod handlerMethod4 = mappingRegistry.getHandlerMethodByPath(path4);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Assert.assertNull(handlerMethod4);</span></span>
<span class="line"><span>        Assert.assertNotNull(handlerMethod);</span></span>
<span class="line"><span>        Assert.assertNotNull(handlerMethod2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        RequestMappingInfo mapping = mappingRegistry.getMappingByPath(path);</span></span>
<span class="line"><span>        RequestMappingInfo mapping2 = mappingRegistry.getMappingByPath(path1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Assert.assertNotNull(mapping);</span></span>
<span class="line"><span>        Assert.assertNotNull(mapping2);</span></span>
<span class="line"><span>        Assert.assertEquals(mapping.getHttpMethod(), RequestMethod.GET);</span></span>
<span class="line"><span>        Assert.assertEquals(mapping2.getHttpMethod(), RequestMethod.POST);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>单元测试运行结果正常通过：</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/2431648666-5fc340a9c54e1_articlex" alt=""></p><h4 id="_4-4-本节小结" tabindex="-1">4.4 本节小结 <a class="header-anchor" href="#_4-4-本节小结" aria-label="Permalink to &quot;4.4 本节小结&quot;">​</a></h4><p>本节我们实现了HandlerMapping的初始化,了解到了Controller中的方法是如何转换成<code>HandlerMethod</code>； 如果有面试官问SpringMVC的原理是什么，我想大家肯定能说出来；如果面试官继续追问<code>@RequsetMapping</code>标注的方法转换成Handler的过程是怎样的？学完了本节我想大家也能回答了</p><h4 id="_4-5-延展" tabindex="-1">4.5 延展 <a class="header-anchor" href="#_4-5-延展" aria-label="Permalink to &quot;4.5 延展&quot;">​</a></h4><p>本节我们实现的<code>RequestMappingHandlerMapping</code>，<code>HandlerMethod</code>相比SpringMVC都比较简单，大家可以对应着去看看SpringMVC中的实现；因为在SpringMVC中不仅仅有<code>@RequestMapping</code>，还有基于xml配置的<code>SimpleUrlHandlerMapping</code>以及<code>BeanNameUrlHandlerMapping</code>等等，所有<code>RequestMappingHandlerMapping</code>在SpringMVC中还有两层抽象类，有兴趣的小伙伴可以去看看每个实现。</p>`,53),l=[t];function i(c,o,d,r,g,h){return s(),a("div",null,l)}const m=n(e,[["render",i]]);export{M as __pageData,m as default};
