import{_ as n,c as s,o as a,aa as e}from"./chunks/framework.DlhgB44u.js";const H=JSON.parse('{"title":"04 HandlerMapping通过request获取Handler","description":"","frontmatter":{"title":"04 HandlerMapping通过request获取Handler","author":"Herman","updateTime":"2021-08-14 13:41","desc":"深入解析SpringMVC核心原理：从手写简易版MVC框架开始(SmartMvc)","categories":"MyProjects","tags":"SpringMvc/MVC","outline":"deep"},"headers":[],"relativePath":"Notes/No1MyProjects/02 SmartMvc/04 HandlerMapping - 通过request获取Handler.md","filePath":"Notes/No1MyProjects/02 SmartMvc/04 HandlerMapping - 通过request获取Handler.md","lastUpdated":1724595807000}'),p={name:"Notes/No1MyProjects/02 SmartMvc/04 HandlerMapping - 通过request获取Handler.md"},t=e(`<p>本节我们开始来开发<code>HandlerMapping</code>接口中主要的方法<code>getHandler</code>，通过请求request找到需要执行Handler，涉及到的新类不多 <img src="https://cdn.jsdelivr.net/gh/silently9527/images/3942105762-5fc3aaaa3277e_articlex" alt=""></p><h4 id="_6-1-开发步骤讲解" tabindex="-1">6.1 开发步骤讲解 <a class="header-anchor" href="#_6-1-开发步骤讲解" aria-label="Permalink to &quot;6.1 开发步骤讲解&quot;">​</a></h4><blockquote><p>本节源代码的分支：handlerMapping-getHandler</p></blockquote><h5 id="handlerexecutionchain" tabindex="-1">HandlerExecutionChain <a class="header-anchor" href="#handlerexecutionchain" aria-label="Permalink to &quot;HandlerExecutionChain&quot;">​</a></h5><p>该类的主要包含了两个对象</p><ol><li>HandlerMethod: 根据request中的path找到匹配的<code>HandlerMethod</code>，也就是控制器中的某个方法</li><li><code>List&lt;HandlerInterceptor&gt;</code> : 根据request中的path找到所有对本次请求生效的<code>HandlerInterceptor</code></li></ol><p>三个方法：</p><ol><li>applyPreHandle: 执行所有拦截器的preHandle方法，如果preHandle返回的是false，那么就执行triggerAfterCompletion</li><li>applyPostHandle: 执行所有拦截器的postHandle方法</li><li>triggerAfterCompletion: <code>HandlerExecutionChain</code>中还定义了一个变量<code>interceptorIndex</code>，当每执行一个<code>HandlerInterceptor</code>的preHandle方法后<code>interceptorIndex</code>的值就会被修改成当前执行拦截器的下标，<code>triggerAfterCompletion</code>中根据<code>interceptorIndex</code>记录的下标值反向执行拦截器的<code>afterCompletion</code>方法；</li></ol><p>举例说明：假如有三个拦截器，第一个拦截器正常执行完成preHandle方法，在执行第二个拦截器的preHandle返回了false，那么当调用<code>triggerAfterCompletion</code>只会执行第一个拦截器的afterCompletion</p><p>完整代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class HandlerExecutionChain {</span></span>
<span class="line"><span>    private HandlerMethod handler;</span></span>
<span class="line"><span>    private List&lt;HandlerInterceptor&gt; interceptors = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    private int interceptorIndex = -1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public HandlerExecutionChain(HandlerMethod handler, List&lt;HandlerInterceptor&gt; interceptors) {</span></span>
<span class="line"><span>        this.handler = handler;</span></span>
<span class="line"><span>        if (!CollectionUtils.isEmpty(interceptors)) {</span></span>
<span class="line"><span>            this.interceptors = interceptors;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean applyPreHandle(HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span>        if (CollectionUtils.isEmpty(interceptors)) {</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        for (int i = 0; i &lt; interceptors.size(); i++) {</span></span>
<span class="line"><span>            HandlerInterceptor interceptor = interceptors.get(i);</span></span>
<span class="line"><span>            if (!interceptor.preHandle(request, response, this.handler)) {</span></span>
<span class="line"><span>                triggerAfterCompletion(request, response, null);</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            this.interceptorIndex = i;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void applyPostHandle(HttpServletRequest request, HttpServletResponse response, ModelAndView mv) throws Exception {</span></span>
<span class="line"><span>        if (CollectionUtils.isEmpty(interceptors)) {</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        for (int i = interceptors.size() - 1; i &gt;= 0; i--) {</span></span>
<span class="line"><span>            HandlerInterceptor interceptor = interceptors.get(i);</span></span>
<span class="line"><span>            interceptor.postHandle(request, response, this.handler, mv);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void triggerAfterCompletion(HttpServletRequest request, HttpServletResponse response, Exception ex)</span></span>
<span class="line"><span>            throws Exception {</span></span>
<span class="line"><span>        if (CollectionUtils.isEmpty(interceptors)) {</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        for (int i = this.interceptorIndex; i &gt;= 0; i--) {</span></span>
<span class="line"><span>            HandlerInterceptor interceptor = interceptors.get(i);</span></span>
<span class="line"><span>            interceptor.afterCompletion(request, response, this.handler, ex);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public List&lt;HandlerInterceptor&gt; getInterceptors() {</span></span>
<span class="line"><span>        return interceptors;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public HandlerMethod getHandler() {</span></span>
<span class="line"><span>        return handler;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="nohandlerfoundexception" tabindex="-1">NoHandlerFoundException <a class="header-anchor" href="#nohandlerfoundexception" aria-label="Permalink to &quot;NoHandlerFoundException&quot;">​</a></h5><p>在通过HandlerMapping.getHandler获取对应request处理器的时候，可能会遇到写错了请求的路径导致找不到匹配的Handler情况，这个时候需要抛出指定的异常，方便我们后续处理，比如说跳转到错误页面</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class NoHandlerFoundException extends ServletException {</span></span>
<span class="line"><span>    private String httpMethod;</span></span>
<span class="line"><span>    private String requestURL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public NoHandlerFoundException(HttpServletRequest request) {</span></span>
<span class="line"><span>        this.httpMethod = request.getMethod();</span></span>
<span class="line"><span>        this.requestURL = request.getRequestURL().toString();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getHttpMethod() {</span></span>
<span class="line"><span>        return httpMethod;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getRequestURL() {</span></span>
<span class="line"><span>        return requestURL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="requestmappinghandlermapping-gethandler" tabindex="-1">RequestMappingHandlerMapping.getHandler <a class="header-anchor" href="#requestmappinghandlermapping-gethandler" aria-label="Permalink to &quot;RequestMappingHandlerMapping.getHandler&quot;">​</a></h5><ol><li>我们需要先在<code>RequestMappingHandlerMapping</code>中添加拦截器的代码，</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private List&lt;MappedInterceptor&gt; interceptors = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void setInterceptors(List&lt;MappedInterceptor&gt; interceptors) {</span></span>
<span class="line"><span>    this.interceptors = interceptors;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为什么我们还需要在<code>RequestMappingHandlerMapping</code>保存拦截器的集合呢？与<code>HandlerExecutionChain</code>中拦截器的集合有什么区别？</p><ol><li><p><code>RequestMappingHandlerMapping</code>中拦截器的集合包含了容器中所有的拦截器，而<code>HandlerExecutionChain</code>中拦截器集合只包含了匹配请求path的拦截器</p></li><li><p><code>RequestMappingHandlerMapping</code>是获取Handler的工具，构建<code>HandlerExecutionChain</code>的过程中需要从所有拦截器中找到与本次请求匹配的拦截器，所以把所有拦截器的集合放到<code>RequestMappingHandlerMapping</code>中是合理的</p></li><li><p>接下来我们看看<code>RequestMappingHandlerMapping.getHandler</code>的具体实现</p></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {</span></span>
<span class="line"><span>    String lookupPath = request.getRequestURI();</span></span>
<span class="line"><span>    HandlerMethod handler = mappingRegistry.getHandlerMethodByPath(lookupPath);</span></span>
<span class="line"><span>    if (Objects.isNull(handler)) {</span></span>
<span class="line"><span>        throw new NoHandlerFoundException(request);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return createHandlerExecutionChain(lookupPath, handler);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过调用<code>request.getRequestURI()</code>获取到本次请求的path，然后根据path从<code>MappingRegistry</code>找到对应的<code>HandlerMethod</code>，如果找不到就抛出之前我们定义的异常<code>NoHandlerFoundException</code>；</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private HandlerExecutionChain createHandlerExecutionChain(String lookupPath, HandlerMethod handler) {</span></span>
<span class="line"><span>    List&lt;HandlerInterceptor&gt; interceptors = this.interceptors.stream()</span></span>
<span class="line"><span>            .filter(mappedInterceptor -&gt; mappedInterceptor.matches(lookupPath))</span></span>
<span class="line"><span>            .collect(toList());</span></span>
<span class="line"><span>    return new HandlerExecutionChain(handler, interceptors);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从所有拦截器中过滤出匹配本次请求path的拦截器，然后创建<code>HandlerExecutionChain</code>对象。到此getHandler的功能开发完成</p><h4 id="_6-2-单元测试" tabindex="-1">6.2 单元测试 <a class="header-anchor" href="#_6-2-单元测试" aria-label="Permalink to &quot;6.2 单元测试&quot;">​</a></h4><p>我们开始写单元测试，本节的测试用例：</p><ol><li>测试getHandler返回的HandlerExecutionChain数据是否正确： a) HandlerMethod中的bean是正确的Controller实例； b) interceptors是否是匹配请求的path</li><li>测试getHandler找不到Handler是否会抛出异常<code>NoHandlerFoundException</code></li><li>同一个拦截器添加连个includePatterns，能正确匹配</li></ol><p>接下来我们根据测试用例来编写测试代码：</p><p>建立两个拦截器<code>TestHandlerInterceptor</code>、<code>Test2HandlerInterceptor</code>, 一个控制器<code>TestHandlerController</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Test2HandlerInterceptor implements HandlerInterceptor {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;Test2HandlerInterceptor =&gt; preHandle&quot;);</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;Test2HandlerInterceptor =&gt; postHandle&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;Test2HandlerInterceptor =&gt; afterCompletion&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class TestHandlerInterceptor implements HandlerInterceptor {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;TestHandlerInterceptor =&gt; preHandle&quot;);</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;TestHandlerInterceptor =&gt; postHandle&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;TestHandlerInterceptor =&gt; afterCompletion&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Controller</span></span>
<span class="line"><span>public class TestHandlerController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @RequestMapping(path = &quot;/ex_test&quot;, method = RequestMethod.POST)</span></span>
<span class="line"><span>    public void exTest() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @RequestMapping(path = &quot;/in_test&quot;, method = RequestMethod.POST)</span></span>
<span class="line"><span>    public void inTest() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @RequestMapping(path = &quot;/in_test2&quot;, method = RequestMethod.POST)</span></span>
<span class="line"><span>    public void inTest2() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @RequestMapping(path = &quot;/in_test3&quot;, method = RequestMethod.POST)</span></span>
<span class="line"><span>    public void inTest3() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在<code>AppConfig.java</code>中配置 RequestMappingHandlerMapping ，配置拦截器，把拦截器集合放入到RequestMappingHandlerMapping中</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Bean</span></span>
<span class="line"><span>public RequestMappingHandlerMapping handlerMapping() {</span></span>
<span class="line"><span>    InterceptorRegistry interceptorRegistry = new InterceptorRegistry();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    TestHandlerInterceptor interceptor = new TestHandlerInterceptor();</span></span>
<span class="line"><span>    interceptorRegistry.addInterceptor(interceptor)</span></span>
<span class="line"><span>            .addExcludePatterns(&quot;/ex_test&quot;)</span></span>
<span class="line"><span>            .addIncludePatterns(&quot;/in_test&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Test2HandlerInterceptor interceptor2 = new Test2HandlerInterceptor();</span></span>
<span class="line"><span>    interceptorRegistry.addInterceptor(interceptor2)</span></span>
<span class="line"><span>            .addIncludePatterns(&quot;/in_test2&quot;, &quot;/in_test3&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    RequestMappingHandlerMapping mapping = new RequestMappingHandlerMapping();</span></span>
<span class="line"><span>    mapping.setInterceptors(interceptorRegistry.getMappedInterceptors());</span></span>
<span class="line"><span>    return mapping;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>单元测试代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void testGetHandler() throws Exception {</span></span>
<span class="line"><span>    MockHttpServletRequest request = new MockHttpServletRequest();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //测试TestHandlerInterceptor拦截器生效</span></span>
<span class="line"><span>    request.setRequestURI(&quot;/in_test&quot;);</span></span>
<span class="line"><span>    HandlerExecutionChain executionChain = requestMappingHandlerMapping.getHandler(request);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    HandlerMethod handlerMethod = executionChain.getHandler();</span></span>
<span class="line"><span>    Assert.assertTrue(handlerMethod.getBean() instanceof TestHandlerController);</span></span>
<span class="line"><span>    Assert.assertTrue(((MappedInterceptor) executionChain.getInterceptors().get(0)).getInterceptor()</span></span>
<span class="line"><span>            instanceof TestHandlerInterceptor);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //测试TestHandlerInterceptor拦截器不生效</span></span>
<span class="line"><span>    request.setRequestURI(&quot;/ex_test&quot;);</span></span>
<span class="line"><span>    executionChain = requestMappingHandlerMapping.getHandler(request);</span></span>
<span class="line"><span>    Assert.assertEquals(executionChain.getInterceptors().size(), 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //测试找不到Handler,抛出异常</span></span>
<span class="line"><span>    request.setRequestURI(&quot;/in_test454545&quot;);</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        requestMappingHandlerMapping.getHandler(request);</span></span>
<span class="line"><span>    } catch (NoHandlerFoundException e) {</span></span>
<span class="line"><span>        System.out.println(&quot;异常URL:&quot; + e.getRequestURL());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //测试Test2HandlerInterceptor拦截器对in_test2、in_test3都生效</span></span>
<span class="line"><span>    request.setRequestURI(&quot;/in_test2&quot;);</span></span>
<span class="line"><span>    executionChain = requestMappingHandlerMapping.getHandler(request);</span></span>
<span class="line"><span>    Assert.assertEquals(executionChain.getInterceptors().size(), 1);</span></span>
<span class="line"><span>    Assert.assertTrue(((MappedInterceptor) executionChain.getInterceptors().get(0)).getInterceptor()</span></span>
<span class="line"><span>            instanceof Test2HandlerInterceptor);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    request.setRequestURI(&quot;/in_test3&quot;);</span></span>
<span class="line"><span>    executionChain = requestMappingHandlerMapping.getHandler(request);</span></span>
<span class="line"><span>    Assert.assertEquals(executionChain.getInterceptors().size(), 1);</span></span>
<span class="line"><span>    Assert.assertTrue(((MappedInterceptor) executionChain.getInterceptors().get(0)).getInterceptor()</span></span>
<span class="line"><span>            instanceof Test2HandlerInterceptor);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果如下：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/2812054056-5fc3a45a25449_articlex" alt=""></p><h4 id="_6-3-总结" tabindex="-1">6.3 总结 <a class="header-anchor" href="#_6-3-总结" aria-label="Permalink to &quot;6.3 总结&quot;">​</a></h4><p>本节完成了获取Handler的开发，其中主要的对象是<code>HandlerExecutionChain</code>，它包含了具体执行业务逻辑的<code>HandlerMethod</code>以及匹配的拦截器；到此<code>HandlerMapping</code>的大部分开发工作都已完成，下一节我开始研发<code>HandlerAdapter</code></p><h4 id="_6-4-延展" tabindex="-1">6.4 延展 <a class="header-anchor" href="#_6-4-延展" aria-label="Permalink to &quot;6.4 延展&quot;">​</a></h4><p>完成本节的开发后，大家可以对比着去看看SpringMVC中<code>RequestMappingHandlerMapping</code>的getHandler方法，提供的功能更加完善，比如：跨域配置CORS</p>`,39),l=[t];function i(r,c,o,d,u,h){return a(),s("div",null,l)}const q=n(p,[["render",i]]);export{H as __pageData,q as default};
