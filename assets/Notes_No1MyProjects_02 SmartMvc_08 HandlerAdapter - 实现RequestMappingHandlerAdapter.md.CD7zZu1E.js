import{_ as n,c as a,o as s,aa as e}from"./chunks/framework.DlhgB44u.js";const m=JSON.parse('{"title":"08 HandlerAdapter","description":"","frontmatter":{"title":"08 HandlerAdapter","author":"Herman","updateTime":"2021-08-14 13:41","desc":"深入解析SpringMVC核心原理：从手写简易版MVC框架开始(SmartMvc)","categories":"MyProjects","tags":"SpringMvc/MVC","outline":"deep"},"headers":[],"relativePath":"Notes/No1MyProjects/02 SmartMvc/08 HandlerAdapter - 实现RequestMappingHandlerAdapter.md","filePath":"Notes/No1MyProjects/02 SmartMvc/08 HandlerAdapter - 实现RequestMappingHandlerAdapter.md","lastUpdated":1724595807000}'),p={name:"Notes/No1MyProjects/02 SmartMvc/08 HandlerAdapter - 实现RequestMappingHandlerAdapter.md"},l=e(`<p>本篇我们来完成<code>HandlerAdapter</code>的实现类<code>RequestMappingHandlerAdapter</code>，这也是<code>HandlerAdpater</code>的最后一节。先看看类图</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/1181981758-5fcf8588e5f60_articlex" alt=""></p><p><code>RequestMappingHandlerAdapter</code>本身在SpringMVC中占有重要的地位，虽然它只是<code>HandlerAdapter</code>的一种实现，但是它是使用最多的一个实现类，主要用于将某个请求适配给<code>@RequestMapping</code>类型的Handler处理</p><h4 id="_10-1-开发步骤讲解" tabindex="-1">10.1 开发步骤讲解 <a class="header-anchor" href="#_10-1-开发步骤讲解" aria-label="Permalink to &quot;10.1 开发步骤讲解&quot;">​</a></h4><blockquote><p>本节源代码的分支：handlerAdapter-requestMappingHandlerAdapter</p></blockquote><h5 id="handleradapter" tabindex="-1">HandlerAdapter <a class="header-anchor" href="#handleradapter" aria-label="Permalink to &quot;HandlerAdapter&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface HandlerAdapter {</span></span>
<span class="line"><span>    ModelAndView handle(HttpServletRequest request, HttpServletResponse response,</span></span>
<span class="line"><span>                        HandlerMethod handler) throws Exception;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该接口我们只定义了一个handle方法，但是在SpringMVC中还有一个<code>supports</code>方法，刚才我们也说过在SpringMVC中<code>HandlerAdapter</code>有多个实现，这也是一个策略模式，所以需要这一个<code>supports</code>方法；在我们开发的SmartMVC中只打算做一个实现，所以只要一个handle方法就足够了。</p><p>我们可以看到返回值是一个<code>ModelAndView</code>对象，表示执行handle方法之后需要把控制器中的方法返回值需要封装成<code>ModelAndView</code>对象；所以这里可以看出在HandlerAdapter中会使用到我们之前开发过的返回值处理。接下来我们看下<code>ModeAndView</code>的定义</p><h5 id="modelandview" tabindex="-1">ModelAndView <a class="header-anchor" href="#modelandview" aria-label="Permalink to &quot;ModelAndView&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ModelAndView {</span></span>
<span class="line"><span>    private Object view;</span></span>
<span class="line"><span>    private Model model;</span></span>
<span class="line"><span>    private HttpStatus status;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setViewName(String viewName) {</span></span>
<span class="line"><span>        this.view = viewName;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getViewName() {</span></span>
<span class="line"><span>        return (this.view instanceof String ? (String) this.view : null);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //省略getter setter</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="requestmappinghandleradapter" tabindex="-1">RequestMappingHandlerAdapter <a class="header-anchor" href="#requestmappinghandleradapter" aria-label="Permalink to &quot;RequestMappingHandlerAdapter&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RequestMappingHandlerAdapter implements HandlerAdapter, InitializingBean {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private List&lt;HandlerMethodArgumentResolver&gt; customArgumentResolvers;</span></span>
<span class="line"><span>    private HandlerMethodArgumentResolverComposite argumentResolverComposite;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private List&lt;HandlerMethodReturnValueHandler&gt; customReturnValueHandlers;</span></span>
<span class="line"><span>    private HandlerMethodReturnValueHandlerComposite returnValueHandlerComposite;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private ConversionService conversionService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public ModelAndView handle(HttpServletRequest request, HttpServletResponse response,</span></span>
<span class="line"><span>                               HandlerMethod handlerMethod) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        InvocableHandlerMethod invocableMethod = createInvocableHandlerMethod(handlerMethod);</span></span>
<span class="line"><span>        ModelAndViewContainer mavContainer = new ModelAndViewContainer();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        invocableMethod.invokeAndHandle(request, response, mavContainer);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return getModelAndView(mavContainer);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private ModelAndView getModelAndView(ModelAndViewContainer mavContainer) {</span></span>
<span class="line"><span>        if (mavContainer.isRequestHandled()) {</span></span>
<span class="line"><span>            //本次请求已经处理完成</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ModelAndView mav = new ModelAndView();</span></span>
<span class="line"><span>        mav.setStatus(mavContainer.getStatus());</span></span>
<span class="line"><span>        mav.setModel(mavContainer.getModel());</span></span>
<span class="line"><span>        mav.setView(mavContainer.getView());</span></span>
<span class="line"><span>        return mav;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private InvocableHandlerMethod createInvocableHandlerMethod(HandlerMethod handlerMethod) {</span></span>
<span class="line"><span>        return new InvocableHandlerMethod(handlerMethod,</span></span>
<span class="line"><span>                this.argumentResolverComposite,</span></span>
<span class="line"><span>                this.returnValueHandlerComposite,</span></span>
<span class="line"><span>                this.conversionService);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void afterPropertiesSet() throws Exception {</span></span>
<span class="line"><span>        Assert.notNull(conversionService, &quot;conversionService can not null&quot;);</span></span>
<span class="line"><span>        if (Objects.isNull(argumentResolverComposite)) {</span></span>
<span class="line"><span>            List&lt;HandlerMethodArgumentResolver&gt; resolvers = getDefaultArgumentResolvers();</span></span>
<span class="line"><span>            this.argumentResolverComposite = new HandlerMethodArgumentResolverComposite();</span></span>
<span class="line"><span>            this.argumentResolverComposite.addResolver(resolvers);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (Objects.isNull(returnValueHandlerComposite)) {</span></span>
<span class="line"><span>            List&lt;HandlerMethodReturnValueHandler&gt; handlers = getDefaultReturnValueHandlers();</span></span>
<span class="line"><span>            this.returnValueHandlerComposite = new HandlerMethodReturnValueHandlerComposite();</span></span>
<span class="line"><span>            this.returnValueHandlerComposite.addReturnValueHandler(handlers);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 初始化默认返回值处理器</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private List&lt;HandlerMethodReturnValueHandler&gt; getDefaultReturnValueHandlers() {</span></span>
<span class="line"><span>        List&lt;HandlerMethodReturnValueHandler&gt; handlers = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        handlers.add(new MapMethodReturnValueHandler());</span></span>
<span class="line"><span>        handlers.add(new ModelMethodReturnValueHandler());</span></span>
<span class="line"><span>        handlers.add(new ResponseBodyMethodReturnValueHandler());</span></span>
<span class="line"><span>        handlers.add(new ViewNameMethodReturnValueHandler());</span></span>
<span class="line"><span>        handlers.add(new ViewMethodReturnValueHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (!CollectionUtils.isEmpty(getCustomReturnValueHandlers())) {</span></span>
<span class="line"><span>            handlers.addAll(getDefaultReturnValueHandlers());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return handlers;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 初始化默认参数解析器</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private List&lt;HandlerMethodArgumentResolver&gt; getDefaultArgumentResolvers() {</span></span>
<span class="line"><span>        List&lt;HandlerMethodArgumentResolver&gt; resolvers = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        resolvers.add(new ModelMethodArgumentResolver());</span></span>
<span class="line"><span>        resolvers.add(new RequestParamMethodArgumentResolver());</span></span>
<span class="line"><span>        resolvers.add(new RequestBodyMethodArgumentResolver());</span></span>
<span class="line"><span>        resolvers.add(new ServletResponseMethodArgumentResolver());</span></span>
<span class="line"><span>        resolvers.add(new ServletRequestMethodArgumentResolver());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (!CollectionUtils.isEmpty(getCustomArgumentResolvers())) {</span></span>
<span class="line"><span>            resolvers.addAll(getCustomArgumentResolvers());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return resolvers;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //省略getter setter</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li>考虑到框架的扩展性，所以这里定义了<code>customArgumentResolvers</code>、<code>customReturnValueHandlers</code>两个变量，如果SmartMVC提供的参数解析器和返回值处理器不满足用户的需求，允许添加自定义的参数解析器和返回值处理器</li><li>在<code>RequestMappingHandlerAdapter</code>加入到spring容器之后需要做一些初始化的工作，所以实现了接口<code>InitializingBean</code>，在<code>afterPropertiesSet</code>方法中我们需要把系统默认支持的参数解析器和返回值处理器以及用户自定义的一起添加到系统中。</li><li>当<code>DispatcherServlet</code>处理用户请求的时候会调用<code>HandlerAdapter</code>的handle方法，这时候先通过传入<code>HandlerMethod</code>创建之前我们已经开发完成的组件<code>InvocableHandlerMethod</code>，然后调用<code>invokeAndHandle</code>执行控制器的方法</li><li>当执行完成控制器的方法，我们需要通过<code>ModelAndViewContainer</code>创建<code>ModelAndView</code>对象返回</li></ol><h4 id="_10-2-单元测试" tabindex="-1">10.2 单元测试 <a class="header-anchor" href="#_10-2-单元测试" aria-label="Permalink to &quot;10.2 单元测试&quot;">​</a></h4><p>本篇的单元测试目标就是能够通过<code>RequestMappingHandlerAdapter</code>能成功的调用到控制器中的方法并且正确返回；本次单元测试就使用上一篇的控制器类<code>TestInvocableHandlerMethodController</code>中的方法<code>testViewName</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public String testViewName(Model model) {</span></span>
<span class="line"><span>    model.addAttribute(&quot;blogURL&quot;, &quot;https://silently9527.github.io&quot;);</span></span>
<span class="line"><span>    return &quot;/silently9527.jsp&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>测试能够正则的调用到方法<code>testViewName</code>，并且返回的<code>ModelAndView</code>中包含model包含设置的属性<code>blogURL</code>，view的值是<code>/silently9527.jsp</code></p><p>单元测试如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void handle() throws Exception {</span></span>
<span class="line"><span>    TestInvocableHandlerMethodController controller = new TestInvocableHandlerMethodController();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Method method = controller.getClass().getMethod(&quot;testViewName&quot;, Model.class);</span></span>
<span class="line"><span>    HandlerMethod handlerMethod = new HandlerMethod(controller, method);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    MockHttpServletRequest request = new MockHttpServletRequest();</span></span>
<span class="line"><span>    MockHttpServletResponse response = new MockHttpServletResponse();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DefaultFormattingConversionService conversionService = new DefaultFormattingConversionService();</span></span>
<span class="line"><span>    DateFormatter dateFormatter = new DateFormatter();</span></span>
<span class="line"><span>    dateFormatter.setPattern(&quot;yyyy-MM-dd HH:mm:ss&quot;);</span></span>
<span class="line"><span>    conversionService.addFormatter(dateFormatter);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    RequestMappingHandlerAdapter handlerAdapter = new RequestMappingHandlerAdapter();</span></span>
<span class="line"><span>    handlerAdapter.setConversionService(conversionService);</span></span>
<span class="line"><span>    handlerAdapter.afterPropertiesSet();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ModelAndView modelAndView = handlerAdapter.handle(request, response, handlerMethod);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    System.out.println(&quot;modelAndView:&quot;);</span></span>
<span class="line"><span>    System.out.println(JSON.toJSONString(modelAndView));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>输出的结果如下：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/1016234010-5fcf8c48aea95_articlex" alt=""></p><h4 id="_10-3-总结" tabindex="-1">10.3 总结 <a class="header-anchor" href="#_10-3-总结" aria-label="Permalink to &quot;10.3 总结&quot;">​</a></h4><p>本节通过开发<code>RequestMappingHandlerAdapter</code>，把我们之前开发的多个组件都组合起来了，并且能够正确的工作。</p><h4 id="_10-4-延展" tabindex="-1">10.4 延展 <a class="header-anchor" href="#_10-4-延展" aria-label="Permalink to &quot;10.4 延展&quot;">​</a></h4><p>SpringMVC中<code>HandlerAdapter</code>有多个实现类，都有不同的使用方式，而<code>RequestMappingHandlerAdapter</code>是使用最多的一个，有兴趣的同学可以看看其他的实现类</p>`,26),t=[l];function r(i,d,o,c,u,h){return s(),a("div",null,t)}const g=n(p,[["render",r]]);export{m as __pageData,g as default};
