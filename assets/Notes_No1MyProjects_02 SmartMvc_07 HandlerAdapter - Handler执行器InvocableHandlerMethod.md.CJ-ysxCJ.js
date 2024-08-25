import{_ as n,c as s,o as e,aa as a}from"./chunks/framework.DlhgB44u.js";const m=JSON.parse('{"title":"07 Handler执行器","description":"","frontmatter":{"title":"07 Handler执行器","author":"Herman","updateTime":"2021-08-14 13:41","desc":"深入解析SpringMVC核心原理：从手写简易版MVC框架开始(SmartMvc)","categories":"MyProjects","tags":"SpringMvc/MVC","outline":"deep"},"headers":[],"relativePath":"Notes/No1MyProjects/02 SmartMvc/07 HandlerAdapter - Handler执行器InvocableHandlerMethod.md","filePath":"Notes/No1MyProjects/02 SmartMvc/07 HandlerAdapter - Handler执行器InvocableHandlerMethod.md","lastUpdated":1724595807000}'),p={name:"Notes/No1MyProjects/02 SmartMvc/07 HandlerAdapter - Handler执行器InvocableHandlerMethod.md"},l=a(`<p>前面两篇我们开发完成了参数的解析器和返回值的处理器，本篇我们将开始开发<code>InvocableHandlerMethod</code>，<code>InvocableHandlerMethod</code>是对<code>HandlerMethod</code>的扩展，基于一组<code>HandlerMethodArgumentResolver</code>从请求上下文中解析出控制器方法的参数值，然后调用控制器方法。</p><p><code>InvocableHandlerMethod</code> 与 <code>HandlerMethod</code> 有区别呢？</p><ul><li><code>HandlerMethod</code> 在容器在启动过程中搜集控制器的方法，用于定义每个控制器方法</li><li><code>InvocableHandlerMethod</code> 用于处理用户的请求调用控制器方法，包装处理所需的各种参数和执行处理逻辑</li></ul><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/454993797-5fce2d5be2fd8_articlex" alt=""></p><h4 id="_9-1-开发步骤讲解" tabindex="-1">9.1 开发步骤讲解 <a class="header-anchor" href="#_9-1-开发步骤讲解" aria-label="Permalink to &quot;9.1 开发步骤讲解&quot;">​</a></h4><blockquote><p>本节源代码的分支：handlerAdapter-invocableHandlerMethod</p></blockquote><h5 id="invocablehandlermethod" tabindex="-1">InvocableHandlerMethod <a class="header-anchor" href="#invocablehandlermethod" aria-label="Permalink to &quot;InvocableHandlerMethod&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class InvocableHandlerMethod extends HandlerMethod {</span></span>
<span class="line"><span>    private ParameterNameDiscoverer parameterNameDiscoverer = new DefaultParameterNameDiscoverer();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private HandlerMethodArgumentResolverComposite argumentResolver;</span></span>
<span class="line"><span>    private HandlerMethodReturnValueHandlerComposite returnValueHandler;</span></span>
<span class="line"><span>    private ConversionService conversionService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public InvocableHandlerMethod(HandlerMethod handlerMethod,</span></span>
<span class="line"><span>                                  HandlerMethodArgumentResolverComposite argumentResolver,</span></span>
<span class="line"><span>                                  HandlerMethodReturnValueHandlerComposite returnValueHandler,</span></span>
<span class="line"><span>                                  ConversionService conversionService) {</span></span>
<span class="line"><span>        super(handlerMethod);</span></span>
<span class="line"><span>        this.argumentResolver = argumentResolver;</span></span>
<span class="line"><span>        this.returnValueHandler = returnValueHandler;</span></span>
<span class="line"><span>        this.conversionService = conversionService;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 调用handler</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param request</span></span>
<span class="line"><span>     * @param mavContainer</span></span>
<span class="line"><span>     * @throws Exception</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void invokeAndHandle(HttpServletRequest request,</span></span>
<span class="line"><span>                                HttpServletResponse response,</span></span>
<span class="line"><span>                                ModelAndViewContainer mavContainer) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        List&lt;Object&gt; args = this.getMethodArgumentValues(request, response, mavContainer);</span></span>
<span class="line"><span>        Object resultValue = doInvoke(args);</span></span>
<span class="line"><span>        //返回为空</span></span>
<span class="line"><span>        if (Objects.isNull(resultValue)) {</span></span>
<span class="line"><span>            if (response.isCommitted()) {</span></span>
<span class="line"><span>                mavContainer.setRequestHandled(true);</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                throw new IllegalStateException(&quot;Controller handler return value is null&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        mavContainer.setRequestHandled(false);</span></span>
<span class="line"><span>        Assert.state(this.returnValueHandler != null, &quot;No return value handler&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        MethodParameter returnType = new MethodParameter(this.getMethod(), -1);  //-1表示方法的返回值</span></span>
<span class="line"><span>        this.returnValueHandler.handleReturnValue(resultValue, returnType, mavContainer, request, response);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private Object doInvoke(List&lt;Object&gt; args) throws InvocationTargetException, IllegalAccessException {</span></span>
<span class="line"><span>        return this.getMethod().invoke(this.getBean(), args.toArray());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private List&lt;Object&gt; getMethodArgumentValues(HttpServletRequest request,</span></span>
<span class="line"><span>                                                 HttpServletResponse response,</span></span>
<span class="line"><span>                                                 ModelAndViewContainer mavContainer) throws Exception {</span></span>
<span class="line"><span>        Assert.notNull(argumentResolver, &quot;HandlerMethodArgumentResolver can not null&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        List&lt;MethodParameter&gt; parameters = this.getParameters();</span></span>
<span class="line"><span>        List&lt;Object&gt; args = new ArrayList&lt;&gt;(parameters.size());</span></span>
<span class="line"><span>        for (MethodParameter parameter : parameters) {</span></span>
<span class="line"><span>            parameter.initParameterNameDiscovery(this.parameterNameDiscoverer);</span></span>
<span class="line"><span>            args.add(argumentResolver.resolveArgument(parameter, request, response, mavContainer, conversionService));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return args;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setParameterNameDiscoverer(ParameterNameDiscoverer parameterNameDiscoverer) {</span></span>
<span class="line"><span>        this.parameterNameDiscoverer = parameterNameDiscoverer;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li><code>InvocableHandlerMethod</code>需要继承<code>HandlerMethod</code>，因为调用控制器的方法需要知道实例以及调用那个方法，并且在开篇也讲到它是<code>HandlerMethod</code>的扩展。</li><li><code>ParameterNameDiscoverer</code>在前面的章节中我们已经见过了，主要是用来查找方法名的，这里我们直接初始化了一个默认的实现<code>DefaultParameterNameDiscoverer</code></li><li>由于本身<code>InvocableHandlerMethod</code>是实现调用控制器方法的，所以包含了两个对象参数的解析器<code>HandlerMethodArgumentResolverComposite</code>和返回值的处理器<code>HandlerMethodReturnValueHandlerComposite</code>；因为在参数解析器中会用到数据的转换，所以又定义了一个<code>ConversionService</code></li><li>在调用方法之前我们需要先获取到方法的参数</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private List&lt;Object&gt; getMethodArgumentValues(HttpServletRequest request,</span></span>
<span class="line"><span>                                             HttpServletResponse response,</span></span>
<span class="line"><span>                                             ModelAndViewContainer mavContainer) throws Exception {</span></span>
<span class="line"><span>    Assert.notNull(argumentResolver, &quot;HandlerMethodArgumentResolver can not null&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;MethodParameter&gt; parameters = this.getParameters();</span></span>
<span class="line"><span>    List&lt;Object&gt; args = new ArrayList&lt;&gt;(parameters.size());</span></span>
<span class="line"><span>    for (MethodParameter parameter : parameters) {</span></span>
<span class="line"><span>        parameter.initParameterNameDiscovery(this.parameterNameDiscoverer);</span></span>
<span class="line"><span>        args.add(argumentResolver.resolveArgument(parameter, request, response, mavContainer, conversionService));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return args;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>遍历方法所有的参数，处理每个参数之前需要先调用<code>initParameterNameDiscovery</code>，然后在通过参数解析器去找到想要的参数</p><ol start="5"><li>解析完所有的参数后，通过反射调用控制器中的方法</li><li>执行完成后判断返回值是否为空，如果为空需要判断当前的response是否已经提交（有可能用户直接在控制的方法中使用response输出内容到前端），已提交标记本次请求已经处理完成<code> mavContainer.setRequestHandled(true);</code></li><li>如果返回值不为空，条件返回值处理器</li></ol><h4 id="_9-2-单元测试" tabindex="-1">9.2 单元测试 <a class="header-anchor" href="#_9-2-单元测试" aria-label="Permalink to &quot;9.2 单元测试&quot;">​</a></h4><p>本节开发内容较为简单，到此已经开发完成，接下来单元测试一下是否能够正常的调用控制器的方法</p><p>创建控制器<code>TestInvocableHandlerMethodController</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class TestInvocableHandlerMethodController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void testRequestAndResponse(HttpServletRequest request, HttpServletResponse response) {</span></span>
<span class="line"><span>        Assert.notNull(request, &quot;request can not null&quot;);</span></span>
<span class="line"><span>        Assert.notNull(response, &quot;response can not null&quot;);</span></span>
<span class="line"><span>        try (PrintWriter writer = response.getWriter()) {</span></span>
<span class="line"><span>            String name = request.getParameter(&quot;name&quot;);</span></span>
<span class="line"><span>            writer.println(&quot;Hello InvocableHandlerMethod, params:&quot; + name);</span></span>
<span class="line"><span>        } catch (IOException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String testViewName(Model model) {</span></span>
<span class="line"><span>        model.addAttribute(&quot;blogURL&quot;, &quot;http://silently9527.cn&quot;);</span></span>
<span class="line"><span>        return &quot;/silently9527.jsp&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>testRequestAndResponse: 两个参数<code>HttpServletRequest</code>、<code>HttpServletResponse</code>能正常注入；通过<code>response</code>能正常输出内容给前端</li><li>testViewName: 能正常注入<code>Model</code>类型的参数；执行完成之后能够在<code>ModelAndViewContainer</code>中拿到视图名称和<code>Model</code>中的数据</li></ul><ol><li>创建单元测试，先测试testRequestAndResponse</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void test1() throws Exception {</span></span>
<span class="line"><span>    TestInvocableHandlerMethodController controller = new TestInvocableHandlerMethodController();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Method method = controller.getClass().getMethod(&quot;testRequestAndResponse&quot;,</span></span>
<span class="line"><span>            HttpServletRequest.class, HttpServletResponse.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //初始化handlerMethod、HandlerMethodArgumentResolverComposite</span></span>
<span class="line"><span>    HandlerMethod handlerMethod = new HandlerMethod(controller, method);</span></span>
<span class="line"><span>    HandlerMethodArgumentResolverComposite argumentResolver = new HandlerMethodArgumentResolverComposite();</span></span>
<span class="line"><span>    argumentResolver.addResolver(new ServletRequestMethodArgumentResolver());</span></span>
<span class="line"><span>    argumentResolver.addResolver(new ServletResponseMethodArgumentResolver());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //本测试用例中使用不到返回值处理器和转换器，所以传入null</span></span>
<span class="line"><span>    InvocableHandlerMethod inMethod = new InvocableHandlerMethod(handlerMethod, argumentResolver, null, null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ModelAndViewContainer mvContainer = new ModelAndViewContainer();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    MockHttpServletRequest request = new MockHttpServletRequest();</span></span>
<span class="line"><span>    request.setParameter(&quot;name&quot;, &quot;Silently9527&quot;); //设置参数name</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    MockHttpServletResponse response = new MockHttpServletResponse();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //开始调用控制器的方法testRequestAndResponse</span></span>
<span class="line"><span>    inMethod.invokeAndHandle(request, response, mvContainer);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    System.out.println(&quot;输出到前端的内容:&quot;);</span></span>
<span class="line"><span>    System.out.println(response.getContentAsString());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该单元测试的结果如下：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/250316949-5fce36f464910_articlex" alt=""></p><ol start="2"><li>测试控制器的方法testViewName</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void test2() throws Exception {</span></span>
<span class="line"><span>    TestInvocableHandlerMethodController controller = new TestInvocableHandlerMethodController();</span></span>
<span class="line"><span>    Method method = controller.getClass().getMethod(&quot;testViewName&quot;, Model.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //初始化handlerMethod、HandlerMethodArgumentResolverComposite</span></span>
<span class="line"><span>    HandlerMethod handlerMethod = new HandlerMethod(controller, method);</span></span>
<span class="line"><span>    HandlerMethodArgumentResolverComposite argumentResolver = new HandlerMethodArgumentResolverComposite();</span></span>
<span class="line"><span>    argumentResolver.addResolver(new ModelMethodArgumentResolver());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //由于testViewName的方法有返回值，所以需要设置返回值处理器</span></span>
<span class="line"><span>    HandlerMethodReturnValueHandlerComposite returnValueHandler = new HandlerMethodReturnValueHandlerComposite();</span></span>
<span class="line"><span>    returnValueHandler.addReturnValueHandler(new ViewNameMethodReturnValueHandler());</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    InvocableHandlerMethod inMethod = new InvocableHandlerMethod(handlerMethod, argumentResolver, returnValueHandler, null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ModelAndViewContainer mvContainer = new ModelAndViewContainer();</span></span>
<span class="line"><span>    MockHttpServletRequest request = new MockHttpServletRequest();</span></span>
<span class="line"><span>    MockHttpServletResponse response = new MockHttpServletResponse();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //执行调用</span></span>
<span class="line"><span>    inMethod.invokeAndHandle(request, response, mvContainer);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    System.out.println(&quot;ModelAndViewContainer:&quot;);</span></span>
<span class="line"><span>    System.out.println(JSON.toJSONString(mvContainer.getModel()));</span></span>
<span class="line"><span>    System.out.println(&quot;viewName: &quot; + mvContainer.getViewName());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>解析的结果如下：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/4219761408-5fce386947159_articlex" alt=""></p><h4 id="_9-3-总结" tabindex="-1">9.3 总结 <a class="header-anchor" href="#_9-3-总结" aria-label="Permalink to &quot;9.3 总结&quot;">​</a></h4><p>本篇的开发内容比较简单，主要是把前两篇开发的参数解析器和返回值处理器给串联起来完成方法的调用；下一篇我们将开始完成<code>HandlerAdapter</code>这个组件的最后研发</p><h4 id="_9-4-延展" tabindex="-1">9.4 延展 <a class="header-anchor" href="#_9-4-延展" aria-label="Permalink to &quot;9.4 延展&quot;">​</a></h4><p>开发完成本节的任务后，大家可以对照着去看看SpringMVC中的<code>ServletInvocableHandlerMethod</code>、<code>InvocableHandlerMethod</code>，比我们的实现多了哪些功能</p>`,29),t=[l];function r(o,i,c,d,u,h){return e(),s("div",null,t)}const g=n(p,[["render",r]]);export{m as __pageData,g as default};
