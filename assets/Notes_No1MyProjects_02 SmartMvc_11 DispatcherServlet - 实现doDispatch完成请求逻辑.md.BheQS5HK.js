import{_ as s,c as n,o as a,aa as e}from"./chunks/framework.DlhgB44u.js";const g=JSON.parse('{"title":"11 DispatcherServlet","description":"","frontmatter":{"title":"11 DispatcherServlet","author":"Herman","updateTime":"2021-08-14 13:41","desc":"深入解析SpringMVC核心原理：从手写简易版MVC框架开始(SmartMvc)","categories":"MyProjects","tags":"SpringMvc/MVC","outline":"deep"},"headers":[],"relativePath":"Notes/No1MyProjects/02 SmartMvc/11 DispatcherServlet - 实现doDispatch完成请求逻辑.md","filePath":"Notes/No1MyProjects/02 SmartMvc/11 DispatcherServlet - 实现doDispatch完成请求逻辑.md","lastUpdated":1724595807000}'),p={name:"Notes/No1MyProjects/02 SmartMvc/11 DispatcherServlet - 实现doDispatch完成请求逻辑.md"},l=e(`<p>本篇我们将开始研发SpringMVC中核心组件DispatcherServlet</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/5a0276884f1b4a63bdee4fb9f3096607%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><h4 id="_13-1-开发步骤讲解" tabindex="-1">13.1 开发步骤讲解 <a class="header-anchor" href="#_13-1-开发步骤讲解" aria-label="Permalink to &quot;13.1 开发步骤讲解&quot;">​</a></h4><blockquote><p>本节源代码的分支：dispatcherServlet</p></blockquote><h5 id="dispatcherservlet" tabindex="-1">DispatcherServlet <a class="header-anchor" href="#dispatcherservlet" aria-label="Permalink to &quot;DispatcherServlet&quot;">​</a></h5><p><code>DispatcherServlet</code> 继承自 <code>HttpServlet</code> ，通过使用 Servlet API 对 HTTP 请求进行响应。其工作大致分为两部分：</p><ol><li>初始化部分，当Servlet在第一次初始化的时候会调用 init方法，在该方法里对诸如 handlerMapping，ViewResolver 等进行初始化，代码如下：</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void init() {</span></span>
<span class="line"><span>    this.handlerMapping = this.applicationContext.getBean(HandlerMapping.class);</span></span>
<span class="line"><span>    this.handlerAdapter = this.applicationContext.getBean(HandlerAdapter.class);</span></span>
<span class="line"><span>    this.viewResolver = this.applicationContext.getBean(ViewResolver.class);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>对HTTP请求进行响应，作为一个Servlet，当请求到达时Web容器会调用其service方法; 通过<code>RequestContextHolder</code>在线程变量中设置request，然后调用<code>doDispatch</code>完成请求</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {</span></span>
<span class="line"><span>    logger.info(&quot;DispatcherServlet.service =&gt; uri:{}&quot;, request.getRequestURI());</span></span>
<span class="line"><span>    RequestContextHolder.setRequest(request);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        doDispatch(request, response);</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        logger.error(&quot;Handler the request fail&quot;, e);</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        RequestContextHolder.resetRequest();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><hr><p>在<code>doDispatch</code>方法中的执行逻辑</p><ul><li>首先通过handlerMapping获取到处理本次请求的<code>HandlerExecutionChain</code></li><li>执行拦截器的前置方法</li><li>通过<code>handlerAdapter</code>执行handler返回ModelAndView</li><li>执行拦截器的后置方法</li><li>处理返回的结果<code>processDispatchResult</code></li><li>在处理完成请求后调用<code>executionChain.triggerAfterCompletion(request, response, dispatchException);</code>，完成拦截器的<code>afterCompletion</code>方法调用</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span>    Exception dispatchException = null;</span></span>
<span class="line"><span>    HandlerExecutionChain executionChain = null;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        ModelAndView mv = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            executionChain = this.handlerMapping.getHandler(request);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (!executionChain.applyPreHandle(request, response)) {</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            // Actually invoke the handler.</span></span>
<span class="line"><span>            mv = handlerAdapter.handle(request, response, executionChain.getHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            executionChain.applyPostHandle(request, response, mv);</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            dispatchException = e;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        processDispatchResult(request, response, mv, dispatchException);</span></span>
<span class="line"><span>    } catch (Exception ex) {</span></span>
<span class="line"><span>        dispatchException = ex;</span></span>
<span class="line"><span>        throw ex;</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        if (Objects.nonNull(executionChain)) {</span></span>
<span class="line"><span>            executionChain.triggerAfterCompletion(request, response, dispatchException);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>processDispatchResult</code>方法中又分为两个逻辑，如果是正常的返回ModelAndView，那么就执行render方法，如果在执行的过程中抛出了任何异常，那么就会执行<code>processHandlerException</code>，方便做全局异常处理</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void processDispatchResult(HttpServletRequest request, HttpServletResponse response,</span></span>
<span class="line"><span>                                   ModelAndView mv, Exception ex) throws Exception {</span></span>
<span class="line"><span>    if (Objects.nonNull(ex)) {</span></span>
<span class="line"><span>        //error ModelAndView</span></span>
<span class="line"><span>        mv = processHandlerException(request, response, ex);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (Objects.nonNull(mv)) {</span></span>
<span class="line"><span>        render(mv, request, response);</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    logger.info(&quot;No view rendering, null ModelAndView returned.&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>processHandlerException</code>返回的是一个异常处理后返回的ModeAndView，处理异常的方法本篇暂时不实现，下篇在实现了全局异常后在实现这个方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//出现异常后的ModelAndView</span></span>
<span class="line"><span>private ModelAndView processHandlerException(HttpServletRequest request, HttpServletResponse response,</span></span>
<span class="line"><span>                                             Exception ex) {</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>render</code> 首先通过ViewResolver解析出视图，然后在调用View的render方法实施渲染逻辑</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void render(ModelAndView mv, HttpServletRequest request, HttpServletResponse response)</span></span>
<span class="line"><span>        throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    View view;</span></span>
<span class="line"><span>    String viewName = mv.getViewName();</span></span>
<span class="line"><span>    if (!StringUtils.isEmpty(viewName)) {</span></span>
<span class="line"><span>        view = this.viewResolver.resolveViewName(viewName);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        view = (View) mv.getView();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (mv.getStatus() != null) {</span></span>
<span class="line"><span>        response.setStatus(mv.getStatus().getValue());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    view.render(mv.getModel().asMap(), request, response);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>DispatcherServlet完整的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class DispatcherServlet extends HttpServlet implements ApplicationContextAware {</span></span>
<span class="line"><span>    private Logger logger = LoggerFactory.getLogger(getClass());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private ApplicationContext applicationContext;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private HandlerMapping handlerMapping;</span></span>
<span class="line"><span>    private HandlerAdapter handlerAdapter;</span></span>
<span class="line"><span>    private ViewResolver viewResolver;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {</span></span>
<span class="line"><span>        this.applicationContext = applicationContext;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void init() {</span></span>
<span class="line"><span>        this.handlerMapping = this.applicationContext.getBean(HandlerMapping.class);</span></span>
<span class="line"><span>        this.handlerAdapter = this.applicationContext.getBean(HandlerAdapter.class);</span></span>
<span class="line"><span>        this.viewResolver = this.applicationContext.getBean(ViewResolver.class);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {</span></span>
<span class="line"><span>        logger.info(&quot;DispatcherServlet.service =&gt; uri:{}&quot;, request.getRequestURI());</span></span>
<span class="line"><span>        RequestContextHolder.setRequest(request);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            doDispatch(request, response);</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            logger.error(&quot;Handler the request fail&quot;, e);</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            RequestContextHolder.resetRequest();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span>        Exception dispatchException = null;</span></span>
<span class="line"><span>        HandlerExecutionChain executionChain = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            ModelAndView mv = null;</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                executionChain = this.handlerMapping.getHandler(request);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                if (!executionChain.applyPreHandle(request, response)) {</span></span>
<span class="line"><span>                    return;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                // Actually invoke the handler.</span></span>
<span class="line"><span>                mv = handlerAdapter.handle(request, response, executionChain.getHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                executionChain.applyPostHandle(request, response, mv);</span></span>
<span class="line"><span>            } catch (Exception e) {</span></span>
<span class="line"><span>                dispatchException = e;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            processDispatchResult(request, response, mv, dispatchException);</span></span>
<span class="line"><span>        } catch (Exception ex) {</span></span>
<span class="line"><span>            dispatchException = ex;</span></span>
<span class="line"><span>            throw ex;</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            if (Objects.nonNull(executionChain)) {</span></span>
<span class="line"><span>                executionChain.triggerAfterCompletion(request, response, dispatchException);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void processDispatchResult(HttpServletRequest request, HttpServletResponse response,</span></span>
<span class="line"><span>                                       ModelAndView mv, Exception ex) throws Exception {</span></span>
<span class="line"><span>        if (Objects.nonNull(ex)) {</span></span>
<span class="line"><span>            //error ModelAndView</span></span>
<span class="line"><span>            mv = processHandlerException(request, response, ex);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (Objects.nonNull(mv)) {</span></span>
<span class="line"><span>            render(mv, request, response);</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        logger.info(&quot;No view rendering, null ModelAndView returned.&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void render(ModelAndView mv, HttpServletRequest request, HttpServletResponse response)</span></span>
<span class="line"><span>            throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        View view;</span></span>
<span class="line"><span>        String viewName = mv.getViewName();</span></span>
<span class="line"><span>        if (!StringUtils.isEmpty(viewName)) {</span></span>
<span class="line"><span>            view = this.viewResolver.resolveViewName(viewName);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            view = (View) mv.getView();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (mv.getStatus() != null) {</span></span>
<span class="line"><span>            response.setStatus(mv.getStatus().getValue());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        view.render(mv.getModel().asMap(), request, response);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //出现异常后的ModelAndView</span></span>
<span class="line"><span>    private ModelAndView processHandlerException(HttpServletRequest request, HttpServletResponse response,</span></span>
<span class="line"><span>                                                 Exception ex) {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="_13-2-单元测试" tabindex="-1">13.2 单元测试 <a class="header-anchor" href="#_13-2-单元测试" aria-label="Permalink to &quot;13.2 单元测试&quot;">​</a></h4><p>接下来我们来测试一下DispatcherServlet能否正确的处理请求</p><ol><li>在AppConfig.java中创建<code>HandlerMapping</code>、<code>HandlerAdapter</code>、<code>ConversionService</code>、<code>ViewResolver</code></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>@Configuration</span></span>
<span class="line"><span>@ComponentScan(basePackages = &quot;com.silently9527.smartmvc&quot;)</span></span>
<span class="line"><span>public class AppConfig {</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public HandlerMapping handlerMapping() {</span></span>
<span class="line"><span>        return new RequestMappingHandlerMapping();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public HandlerAdapter handlerAdapter(ConversionService conversionService) {</span></span>
<span class="line"><span>        RequestMappingHandlerAdapter handlerAdapter = new RequestMappingHandlerAdapter();</span></span>
<span class="line"><span>        handlerAdapter.setConversionService(conversionService);</span></span>
<span class="line"><span>        return handlerAdapter;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public ConversionService conversionService() {</span></span>
<span class="line"><span>        DefaultFormattingConversionService conversionService = new DefaultFormattingConversionService();</span></span>
<span class="line"><span>        DateFormatter dateFormatter = new DateFormatter();</span></span>
<span class="line"><span>        dateFormatter.setPattern(&quot;yyyy-MM-dd HH:mm:ss&quot;);</span></span>
<span class="line"><span>        conversionService.addFormatter(dateFormatter);</span></span>
<span class="line"><span>        return conversionService;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public ViewResolver viewResolver() {</span></span>
<span class="line"><span>        ContentNegotiatingViewResolver negotiatingViewResolver = new ContentNegotiatingViewResolver();</span></span>
<span class="line"><span>        negotiatingViewResolver.setViewResolvers(Collections.singletonList(new InternalResourceViewResolver()));</span></span>
<span class="line"><span>        return negotiatingViewResolver;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public DispatcherServlet dispatcherServlet() {</span></span>
<span class="line"><span>        return new DispatcherServlet();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>我们再创建一个<code>DispatcherController</code></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Controller</span></span>
<span class="line"><span>@RequestMapping(path = &quot;/test&quot;)</span></span>
<span class="line"><span>public class DispatcherController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @RequestMapping(path = &quot;/dispatch&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>    public String dispatch(@RequestParam(name = &quot;name&quot;) String name, Model model) {</span></span>
<span class="line"><span>        System.out.println(&quot;DispatcherController.dispatch: name=&gt;&quot; + name);</span></span>
<span class="line"><span>        model.addAttribute(&quot;name&quot;, name);</span></span>
<span class="line"><span>        return &quot;redirect:/silently9527.cn&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="3"><li>创建单元测试</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class DispatcherServletTest extends BaseJunit4Test {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private DispatcherServlet dispatcherServlet;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void service() throws ServletException, IOException {</span></span>
<span class="line"><span>        dispatcherServlet.init(); //初始化</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        MockHttpServletRequest request = new MockHttpServletRequest();</span></span>
<span class="line"><span>        request.setParameter(&quot;name&quot;, &quot;silently9527&quot;); //设置请求的参数name</span></span>
<span class="line"><span>        request.setRequestURI(&quot;/test/dispatch&quot;); //设置请求的URI</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        MockHttpServletResponse response = new MockHttpServletResponse();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        dispatcherServlet.service(request, response); </span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //打印出头信息，判断是否正常的rediect，并且带上了name参数</span></span>
<span class="line"><span>        response.getHeaderNames().forEach(headerName -&gt;</span></span>
<span class="line"><span>                System.out.println(headerName + &quot;:&quot; + response.getHeader(headerName)));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行结果如下：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/842675a13bbd4b23bafde501ad9dfe07%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><h4 id="_13-3-总结" tabindex="-1">13.3 总结 <a class="header-anchor" href="#_13-3-总结" aria-label="Permalink to &quot;13.3 总结&quot;">​</a></h4><p>我们完成了 DispatcherServlet 正常的处理请求的逻辑，如果在处理请求的过程中出现了异常，该怎么处理呢？下篇我们将会来解决这个问题</p><h4 id="_13-4-延展" tabindex="-1">13.4 延展 <a class="header-anchor" href="#_13-4-延展" aria-label="Permalink to &quot;13.4 延展&quot;">​</a></h4><p>在SpringMVC中DispatcherServlet的初始化过程比较复杂，由于我们后面打算和springboot进行整合，所以就简单实现了初始化的过程，有兴趣的小伙伴自己去了解下DispatcherServlet的初始化过程是怎么样的，在后面的章节：浅谈Spring中ApplicationContext和WebApplicationContext的区别，我们也会谈到这个过程</p>`,36),t=[l];function i(c,r,o,d,u,v){return a(),n("div",null,t)}const m=s(p,[["render",i]]);export{g as __pageData,m as default};
