import{_ as s,c as n,o as a,aa as e}from"./chunks/framework.d_Ke7vMG.js";const b=JSON.parse('{"title":"13 WebMvcConfigurationSupport核心配置类","description":"","frontmatter":{"title":"13 WebMvcConfigurationSupport核心配置类","author":"Herman","updateTime":"2021-08-14 13:41","desc":"深入解析SpringMVC核心原理：从手写简易版MVC框架开始(SmartMvc)","categories":"MyProjects","tags":"SpringMvc/MVC","outline":"deep"},"headers":[],"relativePath":"Notes/No1MyProjects/SmartMvc/13 WebMvcConfigurationSupport - 核心配置类-13webmvcconfigurationsupport-核心配置类.md","filePath":"Notes/No1MyProjects/SmartMvc/13 WebMvcConfigurationSupport - 核心配置类-13webmvcconfigurationsupport-核心配置类.md","lastUpdated":1723563552000}'),p={name:"Notes/No1MyProjects/SmartMvc/13 WebMvcConfigurationSupport - 核心配置类-13webmvcconfigurationsupport-核心配置类.md"},l=e(`<p>从前面的单元测试我们已经发现，要想要使用SmartMVC框架，我们需要构建很多的对象，比如：<code>HandlerMapping</code>、<code>HandlerAdapter</code>、<code>HandlerInterceptor</code>等等；为了让我们的框架能够更加方便的使用，我们需要开发一个配置器<code>WebMvcConfigurationSupport</code>，能把大部分的配置都封装起来，把个别的扩展点暴露给框架的使用者，并且用户如果没有需求扩展，直接使用注解<code>@EnableWebMvc</code>就可以完成SmartMVC框架的配置工作，现在我们就开始来开发这个功能。</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/b5286fbb11cd4d919eba5b2d1b857df5%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><h4 id="_15-1-开发步骤讲解" tabindex="-1">15.1 开发步骤讲解 <a class="header-anchor" href="#_15-1-开发步骤讲解" aria-label="Permalink to &quot;15.1 开发步骤讲解&quot;">​</a></h4><h5 id="webmvcconfigurationsupport" tabindex="-1">WebMvcConfigurationSupport <a class="header-anchor" href="#webmvcconfigurationsupport" aria-label="Permalink to &quot;WebMvcConfigurationSupport&quot;">​</a></h5><p>在这个配置类中，我们需要初始化出DispatchServlet所有需要使用到的组件，并且预留一些可供用户扩展的接口。</p><ol><li>构建数据转换器<code>FormattingConversionService</code>,预留给用户可以自定义转换格式的接口供子类覆写</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Bean</span></span>
<span class="line"><span>public FormattingConversionService mvcConversionService() {</span></span>
<span class="line"><span>    FormattingConversionService conversionService = new DefaultFormattingConversionService();</span></span>
<span class="line"><span>    addFormatters(conversionService);</span></span>
<span class="line"><span>    return conversionService;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//数据转换格式化暴露对外的扩展点</span></span>
<span class="line"><span>protected void addFormatters(FormatterRegistry registry) {</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>提供给用户添加自定义拦截器的扩展点，默认系统不添加任何拦截器</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected List&lt;MappedInterceptor&gt; getInterceptors(FormattingConversionService mvcConversionService) {</span></span>
<span class="line"><span>    if (this.interceptors == null) {</span></span>
<span class="line"><span>        InterceptorRegistry registry = new InterceptorRegistry();</span></span>
<span class="line"><span>        addInterceptors(registry);</span></span>
<span class="line"><span>        this.interceptors = registry.getMappedInterceptors();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return this.interceptors;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//拦截器暴露对外的扩展点</span></span>
<span class="line"><span>protected void addInterceptors(InterceptorRegistry registry) {</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="3"><li>构建HandlerMapping</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Bean</span></span>
<span class="line"><span>public HandlerMapping handlerMapping(FormattingConversionService mvcConversionService) {</span></span>
<span class="line"><span>    RequestMappingHandlerMapping handlerMapping = new RequestMappingHandlerMapping();</span></span>
<span class="line"><span>    handlerMapping.setInterceptors(getInterceptors(mvcConversionService));</span></span>
<span class="line"><span>    return handlerMapping;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="4"><li>构建HandlerAdapter，预留用户自定义参数解析器和返回值处理器，如果用户设置了就添加到<code>RequestMappingHandlerAdapter</code></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Bean</span></span>
<span class="line"><span>public HandlerAdapter handlerAdapter(ConversionService conversionService) {</span></span>
<span class="line"><span>    RequestMappingHandlerAdapter handlerAdapter = new RequestMappingHandlerAdapter();</span></span>
<span class="line"><span>    handlerAdapter.setConversionService(conversionService);</span></span>
<span class="line"><span>    handlerAdapter.setCustomArgumentResolvers(getArgumentResolvers());</span></span>
<span class="line"><span>    handlerAdapter.setCustomReturnValueHandlers(getReturnValueHandlers());</span></span>
<span class="line"><span>    return handlerAdapter;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>protected List&lt;HandlerMethodReturnValueHandler&gt; getReturnValueHandlers() {</span></span>
<span class="line"><span>    if (this.returnValueHandlers == null) {</span></span>
<span class="line"><span>        this.returnValueHandlers = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>        addReturnValueHandlers(this.returnValueHandlers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return this.returnValueHandlers;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//返回值解析器</span></span>
<span class="line"><span>protected void addReturnValueHandlers(List&lt;HandlerMethodReturnValueHandler&gt; returnValueHandlers) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>protected List&lt;HandlerMethodArgumentResolver&gt; getArgumentResolvers() {</span></span>
<span class="line"><span>    if (this.argumentResolvers == null) {</span></span>
<span class="line"><span>        this.argumentResolvers = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>        addArgumentResolvers(this.argumentResolvers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return this.argumentResolvers;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//参数解析器的扩展点</span></span>
<span class="line"><span>protected void addArgumentResolvers(List&lt;HandlerMethodArgumentResolver&gt; argumentResolvers) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="5"><li>构建全局异常处理器，同样需要设置自定义参数解析器和返回值处理器</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Bean</span></span>
<span class="line"><span>public HandlerExceptionResolver handlerExceptionResolver(FormattingConversionService mvcConversionService) {</span></span>
<span class="line"><span>    ExceptionHandlerExceptionResolver exceptionResolver = new ExceptionHandlerExceptionResolver();</span></span>
<span class="line"><span>    exceptionResolver.setCustomArgumentResolvers(getArgumentResolvers());</span></span>
<span class="line"><span>    exceptionResolver.setCustomReturnValueHandlers(getReturnValueHandlers());</span></span>
<span class="line"><span>    exceptionResolver.setConversionService(mvcConversionService);</span></span>
<span class="line"><span>    return exceptionResolver;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="6"><li>构建内容协同器<code>ContentNegotiatingViewResolver</code>，默认添加的视图解析器是<code>InternalResourceViewResolver</code></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Bean</span></span>
<span class="line"><span>public ViewResolver viewResolver() {</span></span>
<span class="line"><span>    ContentNegotiatingViewResolver negotiatingViewResolver = new ContentNegotiatingViewResolver();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;ViewResolver&gt; viewResolvers = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    addViewResolvers(viewResolvers);</span></span>
<span class="line"><span>    if (CollectionUtils.isEmpty(viewResolvers)) {</span></span>
<span class="line"><span>        negotiatingViewResolver.setViewResolvers(Collections.singletonList(new InternalResourceViewResolver()));</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        negotiatingViewResolver.setViewResolvers(viewResolvers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;View&gt; views = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    addDefaultViews(views);</span></span>
<span class="line"><span>    if (!CollectionUtils.isEmpty(views)) {</span></span>
<span class="line"><span>        negotiatingViewResolver.setDefaultViews(views);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return negotiatingViewResolver;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//视图的扩展点</span></span>
<span class="line"><span>protected void addDefaultViews(List&lt;View&gt; views) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//视图解析器的扩展点</span></span>
<span class="line"><span>protected void addViewResolvers(List&lt;ViewResolver&gt; viewResolvers) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="webmvcconfigurer" tabindex="-1">WebMvcConfigurer <a class="header-anchor" href="#webmvcconfigurer" aria-label="Permalink to &quot;WebMvcConfigurer&quot;">​</a></h5><p>按理说用户通过继承上面的配置类<code>WebMvcConfigurationSupport</code>，其实已经简化了很多的配置操作，但是这样还不够；一个框架提供的SPI接口对于扩展这来说应该尽量保持透明才好；尽量能够透明到让用户连这个配置类的存在都不知道，用户需要添加拦截器，视图解析器都到指定的接口中去添加，而不需要关心添加的内容具体如何生效的，为了完成这个功能，我们需要定义一个接口<code>WebMvcConfigurer</code>，提供给用户添加所有的扩展点方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface WebMvcConfigurer {</span></span>
<span class="line"><span>    //参数解析器的扩展点</span></span>
<span class="line"><span>    default void addArgumentResolvers(List&lt;HandlerMethodArgumentResolver&gt; argumentResolvers) {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //返回值解析器</span></span>
<span class="line"><span>    default void addReturnValueHandlers(List&lt;HandlerMethodReturnValueHandler&gt; returnValueHandlers) {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //拦截器暴露对外的扩展点</span></span>
<span class="line"><span>    default void addInterceptors(InterceptorRegistry registry) {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //数据转换格式化暴露对外的扩展点</span></span>
<span class="line"><span>    default void addFormatters(FormatterRegistry registry) {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //视图的扩展点</span></span>
<span class="line"><span>    default void addDefaultViews(List&lt;View&gt; views) {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //视图解析器的扩展点</span></span>
<span class="line"><span>    default void addViewResolvers(List&lt;ViewResolver&gt; viewResolvers) {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为了能够允许用户配置多个<code>WebMvcConfigurer</code>，所有和之前的参数解析器一样我们实现了一个聚合实现<code>WebMvcConfigurerComposite</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class WebMvcConfigurerComposite implements WebMvcConfigurer {</span></span>
<span class="line"><span>    private List&lt;WebMvcConfigurer&gt; delegates = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void addArgumentResolvers(List&lt;HandlerMethodArgumentResolver&gt; argumentResolvers) {</span></span>
<span class="line"><span>        delegates.forEach(configurer -&gt; configurer.addArgumentResolvers(argumentResolvers));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void addReturnValueHandlers(List&lt;HandlerMethodReturnValueHandler&gt; returnValueHandlers) {</span></span>
<span class="line"><span>        delegates.forEach(configurer -&gt; configurer.addReturnValueHandlers(returnValueHandlers));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void addInterceptors(InterceptorRegistry registry) {</span></span>
<span class="line"><span>        delegates.forEach(configurer -&gt; configurer.addInterceptors(registry));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void addFormatters(FormatterRegistry registry) {</span></span>
<span class="line"><span>        delegates.forEach(configurer -&gt; configurer.addFormatters(registry));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void addDefaultViews(List&lt;View&gt; views) {</span></span>
<span class="line"><span>        delegates.forEach(configurer -&gt; configurer.addDefaultViews(views));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void addViewResolvers(List&lt;ViewResolver&gt; viewResolvers) {</span></span>
<span class="line"><span>        delegates.forEach(configurer -&gt; configurer.addViewResolvers(viewResolvers));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public WebMvcConfigurerComposite addWebMvcConfigurers(WebMvcConfigurer... webMvcConfigurers) {</span></span>
<span class="line"><span>        Collections.addAll(this.delegates, webMvcConfigurers);</span></span>
<span class="line"><span>        return this;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public WebMvcConfigurerComposite addWebMvcConfigurers(List&lt;WebMvcConfigurer&gt; configurers) {</span></span>
<span class="line"><span>        this.delegates.addAll(configurers);</span></span>
<span class="line"><span>        return this;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="delegatingwebmvcconfiguration" tabindex="-1">DelegatingWebMvcConfiguration <a class="header-anchor" href="#delegatingwebmvcconfiguration" aria-label="Permalink to &quot;DelegatingWebMvcConfiguration&quot;">​</a></h5><p>为了把<code>WebMvcConfigurer</code>与<code>WebMvcConfigurationSupport</code>联系起来屏蔽掉实现的细节，只暴露扩展点给用户，我们需要实现<code>DelegatingWebMvcConfiguration</code>， 它从容器中拿出所有的WebMvcConfigurer,添加到WebMvcConfigurerComposite里面，在DelegatingWebMvcConfiguration中调用<code>WebMvcConfigurerComposite</code>完成扩展点的载入</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Configuration</span></span>
<span class="line"><span>public class DelegatingWebMvcConfiguration extends WebMvcConfigurationSupport {</span></span>
<span class="line"><span>    private WebMvcConfigurerComposite configurers = new WebMvcConfigurerComposite();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   </span></span>
<span class="line"><span>    @Autowired(required = false)</span></span>
<span class="line"><span>    public void setConfigurers(List&lt;WebMvcConfigurer&gt; configurers) {</span></span>
<span class="line"><span>        if (!CollectionUtils.isEmpty(configurers)) {</span></span>
<span class="line"><span>            this.configurers.addWebMvcConfigurers(configurers);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void addFormatters(FormatterRegistry registry) {</span></span>
<span class="line"><span>        configurers.addFormatters(registry);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void addInterceptors(InterceptorRegistry registry) {</span></span>
<span class="line"><span>        configurers.addInterceptors(registry);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void addReturnValueHandlers(List&lt;HandlerMethodReturnValueHandler&gt; returnValueHandlers) {</span></span>
<span class="line"><span>        configurers.addReturnValueHandlers(returnValueHandlers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void addArgumentResolvers(List&lt;HandlerMethodArgumentResolver&gt; argumentResolvers) {</span></span>
<span class="line"><span>        configurers.addArgumentResolvers(argumentResolvers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void addDefaultViews(List&lt;View&gt; views) {</span></span>
<span class="line"><span>        configurers.addDefaultViews(views);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void addViewResolvers(List&lt;ViewResolver&gt; viewResolvers) {</span></span>
<span class="line"><span>        configurers.addViewResolvers(viewResolvers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="enablewebmvc" tabindex="-1">EnableWebMvc <a class="header-anchor" href="#enablewebmvc" aria-label="Permalink to &quot;EnableWebMvc&quot;">​</a></h5><p>所有的配置都已完成，现在我们还差一个注解<code>EnableWebMvc</code>来驱动整个配置生效，在注解上<code>@Import(DelegatingWebMvcConfiguration.class)</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Target(ElementType.TYPE)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>@Import(DelegatingWebMvcConfiguration.class)</span></span>
<span class="line"><span>public @interface EnableWebMvc {</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="_15-2-单元测试" tabindex="-1">15.2 单元测试 <a class="header-anchor" href="#_15-2-单元测试" aria-label="Permalink to &quot;15.2 单元测试&quot;">​</a></h4><p>为了测试我们的配置类是否正确，我们修改AppConfig.java的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Configuration</span></span>
<span class="line"><span>@EnableWebMvc    //添加注解</span></span>
<span class="line"><span>@ComponentScan(basePackages = &quot;com.silently9527.smartmvc&quot;)</span></span>
<span class="line"><span>public class AppConfig {</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public DispatcherServlet dispatcherServlet() {</span></span>
<span class="line"><span>        return new DispatcherServlet();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>直接运行之前我们开发好的<code>DispatcherServletTest</code>中的两个单元测试方法，执行结果如下：</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/bdaf2c983b874466a62166dd506346b9%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><h4 id="_15-3-总结" tabindex="-1">15.3 总结 <a class="header-anchor" href="#_15-3-总结" aria-label="Permalink to &quot;15.3 总结&quot;">​</a></h4><p>本篇实现了SmartMVC通过注解<code>@EnableWebMvc</code>驱动整个框架的配置，这个也是SpringMVC的实现方式，同时也展示了SPI的设计思路</p><h4 id="_15-4-延展" tabindex="-1">15.4 延展 <a class="header-anchor" href="#_15-4-延展" aria-label="Permalink to &quot;15.4 延展&quot;">​</a></h4><p>可以对比查看SpringMVC中提供的<code>WebMvcConfigurationSupport</code>，熟悉提供了哪些扩展点，工作中可以使用</p>`,37),i=[l];function t(r,c,o,d,u,g){return a(),n("div",null,i)}const h=s(p,[["render",t]]);export{b as __pageData,h as default};
