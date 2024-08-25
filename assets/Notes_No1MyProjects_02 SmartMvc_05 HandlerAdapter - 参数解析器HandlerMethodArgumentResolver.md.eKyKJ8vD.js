import{_ as s,c as n,o as a,aa as e}from"./chunks/framework.DlhgB44u.js";const h=JSON.parse('{"title":"05 参数解析器","description":"","frontmatter":{"title":"05 参数解析器","author":"Herman","updateTime":"2021-08-14 13:41","desc":"深入解析SpringMVC核心原理：从手写简易版MVC框架开始(SmartMvc)","categories":"MyProjects","tags":"SpringMvc/MVC","outline":"deep"},"headers":[],"relativePath":"Notes/No1MyProjects/02 SmartMvc/05 HandlerAdapter - 参数解析器HandlerMethodArgumentResolver.md","filePath":"Notes/No1MyProjects/02 SmartMvc/05 HandlerAdapter - 参数解析器HandlerMethodArgumentResolver.md","lastUpdated":1724595807000}'),p={name:"Notes/No1MyProjects/02 SmartMvc/05 HandlerAdapter - 参数解析器HandlerMethodArgumentResolver.md"},t=e(`<p>本节我们将开始开发在HandlerAdapter中需要使用到的组件<code>HandlerMethodArgumentResolver</code>，原本计划是在本节之前先聊聊SpringMVC中的数据绑定，毕竟数据绑定在SpringMVC，甚至是Spring框架中都有重要的地位，后来发现想要深入源码讲清楚数据绑定有些费劲，对于理解SpringMVC的核心原理无太多作用，所以决定在最后做大概三节番外篇来聊聊数据绑定。</p><p>在我们享受SpringMVC给我带来的便利的时候，不知道大家有没有想过，Controller中方法的参数是如何完成自动注入的，在添加上注解<code>@PathVariable</code>、<code>@RequestParam</code>、<code>@RequestBody</code>就能够把请求中的参数主动注入，甚至在方法参数任意位置写<code>HttpServletRequest</code>、<code>HttpSession</code>等类型的参数，它自动就有值了便可直接使用；现在我们就开始来逐步实现这个功能，本节主要实现参数的解析。首先还是需要先看看类图</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/819027688-5fcba2e425b21_articlex" alt=""></p><p>本节我们简单实现解析<code>HttpServletRequest</code>、<code>HttpServletResponse</code>、<code>Model</code>以及注解<code>@RequestParam</code>、<code>@RequestBody</code>的功能，SpringMVC提供其他参数解析器实现类似，可以自行查看SpringMVC源码</p><h4 id="_7-1-开发步骤讲解" tabindex="-1">7.1 开发步骤讲解 <a class="header-anchor" href="#_7-1-开发步骤讲解" aria-label="Permalink to &quot;7.1 开发步骤讲解&quot;">​</a></h4><blockquote><p>本节源代码的分支：handlerAdpater-argumentResolver</p></blockquote><h5 id="modelandviewcontainer" tabindex="-1">ModelAndViewContainer <a class="header-anchor" href="#modelandviewcontainer" aria-label="Permalink to &quot;ModelAndViewContainer&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ModelAndViewContainer {</span></span>
<span class="line"><span>    private Object view;</span></span>
<span class="line"><span>    private Model model;</span></span>
<span class="line"><span>    private HttpStatus status;</span></span>
<span class="line"><span>    private boolean requestHandled = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setView(Object view) {</span></span>
<span class="line"><span>        this.view = view;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getViewName() {</span></span>
<span class="line"><span>        return (this.view instanceof String ? (String) this.view : null);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public void setViewName(String viewName) {</span></span>
<span class="line"><span>        this.view = viewName;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public Object getView() {</span></span>
<span class="line"><span>        return this.view;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean isViewReference() {</span></span>
<span class="line"><span>        return (this.view instanceof String);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Model getModel() {</span></span>
<span class="line"><span>        if (Objects.isNull(this.model)) {</span></span>
<span class="line"><span>            this.model = new ExtendedModelMap();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return this.model;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setStatus(HttpStatus status) {</span></span>
<span class="line"><span>        this.status = status;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public HttpStatus getStatus() {</span></span>
<span class="line"><span>        return this.status;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public boolean isRequestHandled() {</span></span>
<span class="line"><span>        return requestHandled;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setRequestHandled(boolean requestHandled) {</span></span>
<span class="line"><span>        this.requestHandled = requestHandled;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该类的使用场景是每个请求进来都会新建一个对象，主要用于保存Handler处理过程中Model以及返回的View对象；该类将会用于参数解析器<code>HandlerMethodArgumentResolver</code>和Handler返回值解析器<code>HandlerMethodReturnValueHandler</code>；</p><ul><li>view: 定义的类型是Object，是因为Handler既可以返回一个String表示视图的名字，也可以直接返回一个视图对象View</li><li>Model、ExtendedModelMap: 都是Spring中定义的类，可以直接看做是Map</li><li>requestHandled: 标记本次请求是否已经处理完成，后期在处理注解<code>@ResponseBody</code>将会使用到</li></ul><h5 id="handlermethodargumentresolver" tabindex="-1">HandlerMethodArgumentResolver <a class="header-anchor" href="#handlermethodargumentresolver" aria-label="Permalink to &quot;HandlerMethodArgumentResolver&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface HandlerMethodArgumentResolver {</span></span>
<span class="line"><span>    boolean supportsParameter(MethodParameter parameter);</span></span>
<span class="line"><span>    Object resolveArgument(MethodParameter parameter, HttpServletRequest request, </span></span>
<span class="line"><span>                    HttpServletResponse response, ModelAndViewContainer container,</span></span>
<span class="line"><span>                           ConversionService conversionService) throws Exception;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该接口是一个策略接口，作用是把请求中的数据解析为Controller中方法的参数值。有了它才能会让Spring MVC处理入参显得那么高级、那么自动化。定义了两个方法</p><ul><li>supportsParameter: 此方法判断当前的参数解析器是否支持传入的参数，返回true表示支持</li><li>resolveArgument: 从request对象中解析出parameter需要的值，除了<code>MethodParameter</code>和<code>HttpServletRequest</code>参数外，还传入了<code>ConversionService</code>，用于在把request中取出的值需要转换成<code>MethodParameter</code>参数的类型。这个方法的参数定义和SpringMVC中的方法稍有不同，主要是为了简化数据转换的过程</li></ul><h5 id="servletrequestmethodargumentresolver、servletresponsemethodargumentresolver" tabindex="-1">ServletRequestMethodArgumentResolver、ServletResponseMethodArgumentResolver <a class="header-anchor" href="#servletrequestmethodargumentresolver、servletresponsemethodargumentresolver" aria-label="Permalink to &quot;ServletRequestMethodArgumentResolver、ServletResponseMethodArgumentResolver&quot;">​</a></h5><p>首先我们来实现两个简单的参数解析器，当我们Handler参数类型是<code> HttpServletRequest</code>、<code>HttpServletResponse</code>，需要自动注入。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ServletRequestMethodArgumentResolver implements HandlerMethodArgumentResolver {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean supportsParameter(MethodParameter parameter) {</span></span>
<span class="line"><span>        Class&lt;?&gt; parameterType = parameter.getParameterType();</span></span>
<span class="line"><span>        return ServletRequest.class.isAssignableFrom(parameterType);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object resolveArgument(MethodParameter parameter, HttpServletRequest request,</span></span>
<span class="line"><span>                                  HttpServletResponse response, ModelAndViewContainer container,</span></span>
<span class="line"><span>                                  ConversionService conversionService) throws Exception {</span></span>
<span class="line"><span>        return request;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li>在<code>supportsParameter</code>先取出Handler参数的类型，判断该类型是不是<code>ServletRequest</code>的子类，如果是返回true</li><li>当<code>supportsParameter</code>返回true的时候执行<code>resolveArgument</code>方法，在该方法中直接返回request对象</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ServletResponseMethodArgumentResolver implements HandlerMethodArgumentResolver {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean supportsParameter(MethodParameter parameter) {</span></span>
<span class="line"><span>        Class&lt;?&gt; parameterType = parameter.getParameterType();</span></span>
<span class="line"><span>        return ServletResponse.class.isAssignableFrom(parameterType);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object resolveArgument(MethodParameter parameter, HttpServletRequest request, HttpServletResponse response,</span></span>
<span class="line"><span>                                  ModelAndViewContainer container,</span></span>
<span class="line"><span>                                  ConversionService conversionService) throws Exception {</span></span>
<span class="line"><span>        return response;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="modelmethodargumentresolver" tabindex="-1">ModelMethodArgumentResolver <a class="header-anchor" href="#modelmethodargumentresolver" aria-label="Permalink to &quot;ModelMethodArgumentResolver&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ModelMethodArgumentResolver implements HandlerMethodArgumentResolver {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean supportsParameter(MethodParameter parameter) {</span></span>
<span class="line"><span>        return Model.class.isAssignableFrom(parameter.getParameterType());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object resolveArgument(MethodParameter parameter, HttpServletRequest request,</span></span>
<span class="line"><span>                                  HttpServletResponse response, ModelAndViewContainer container,</span></span>
<span class="line"><span>                                  ConversionService conversionService) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Assert.state(container != null, &quot;ModelAndViewContainer is required for model exposure&quot;);</span></span>
<span class="line"><span>        return container.getModel();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该解析器主要是从解析出Model对象，方便后期对Handler中的Model参数进行注入</p><h5 id="requestparammethodargumentresolver" tabindex="-1">RequestParamMethodArgumentResolver <a class="header-anchor" href="#requestparammethodargumentresolver" aria-label="Permalink to &quot;RequestParamMethodArgumentResolver&quot;">​</a></h5><p>接下来再来实现注解<code>@RequestParam</code>的功能，当Handler中的参数被<code>@RequestParam</code>标注，需要从request中取出对应的参数，然后调用<code>ConversionService</code>转换成正确的类型。</p><ol><li>定义注解<code>@RequestParam</code></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target(ElementType.PARAMETER)</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>public @interface RequestParam {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String name();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    boolean required() default true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String defaultValue() default &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>name: 从request取参数的名字，该参数必填</li><li>required: 说明该参数是否必填，默认是true</li><li>defaultValue: 如果request中找不到对应的参数，那么就用默认值</li></ul><ol start="2"><li>实现解析器<code>RequestParamMethodArgumentResolver</code></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RequestParamMethodArgumentResolver implements HandlerMethodArgumentResolver {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean supportsParameter(MethodParameter parameter) {</span></span>
<span class="line"><span>        return parameter.hasParameterAnnotation(RequestParam.class);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object resolveArgument(MethodParameter parameter, HttpServletRequest request,</span></span>
<span class="line"><span>                                  HttpServletResponse response, ModelAndViewContainer container,</span></span>
<span class="line"><span>                                  ConversionService conversionService) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        RequestParam param = parameter.getParameterAnnotation(RequestParam.class);</span></span>
<span class="line"><span>        if (Objects.isNull(param)) {</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        String value = request.getParameter(param.name());</span></span>
<span class="line"><span>        if (StringUtils.isEmpty(value)) {</span></span>
<span class="line"><span>            value = param.defaultValue();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (!StringUtils.isEmpty(value)) {</span></span>
<span class="line"><span>            return conversionService.convert(value, parameter.getParameterType());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        if (param.required()) {</span></span>
<span class="line"><span>            throw new MissingServletRequestParameterException(parameter.getParameterName(),</span></span>
<span class="line"><span>                    parameter.getParameterType().getName());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>supportsParameter: 判断Handler的参数是否有添加注解<code>@RequestParam</code></li><li>resolveArgument: 从request中找指定name的参数，如果找不到用默认值赋值，如果默认值也没有，当required=true时抛出异常，否知返回null; 如果从request中找到了参数值，那么调用<code>conversionService.convert</code>方法转换成正确的类型</li></ul><h5 id="requestbodymethodargumentresolver" tabindex="-1">RequestBodyMethodArgumentResolver <a class="header-anchor" href="#requestbodymethodargumentresolver" aria-label="Permalink to &quot;RequestBodyMethodArgumentResolver&quot;">​</a></h5><p>我们继续实现最后一个注解<code>@RequestBody</code>，当被这个注解的参数，需要把request流中的数据转换成对象</p><ol><li>定义注解</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target(ElementType.PARAMETER)</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>public @interface RequestBody {</span></span>
<span class="line"><span>    boolean required() default true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>实现解析器<code>RequestBodyMethodArgumentResolver</code></li></ol><p>由于我们需要使用到JSON的转换，所以我们引入fastjson</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.alibaba&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;fastjson&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;1.2.60&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><p>完整代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RequestBodyMethodArgumentResolver implements HandlerMethodArgumentResolver {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean supportsParameter(MethodParameter parameter) {</span></span>
<span class="line"><span>        return parameter.hasParameterAnnotation(RequestBody.class);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object resolveArgument(MethodParameter parameter, HttpServletRequest request,</span></span>
<span class="line"><span>                                  HttpServletResponse response, ModelAndViewContainer container,</span></span>
<span class="line"><span>                                  ConversionService conversionService) throws Exception {</span></span>
<span class="line"><span>        String httpMessageBody = this.getHttpMessageBody(request);</span></span>
<span class="line"><span>        if (!StringUtils.isEmpty(httpMessageBody)) {</span></span>
<span class="line"><span>            return JSON.parseObject(httpMessageBody, parameter.getParameterType());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        RequestBody requestBody = parameter.getParameterAnnotation(RequestBody.class);</span></span>
<span class="line"><span>        if (Objects.isNull(requestBody)) {</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (requestBody.required()) {</span></span>
<span class="line"><span>            throw new MissingServletRequestParameterException(parameter.getParameterName(),</span></span>
<span class="line"><span>                    parameter.getParameterType().getName());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String getHttpMessageBody(HttpServletRequest request) throws IOException {</span></span>
<span class="line"><span>        StringBuilder sb = new StringBuilder();</span></span>
<span class="line"><span>        BufferedReader reader = request.getReader();</span></span>
<span class="line"><span>        char[] buff = new char[1024];</span></span>
<span class="line"><span>        int len;</span></span>
<span class="line"><span>        while ((len = reader.read(buff)) != -1) {</span></span>
<span class="line"><span>            sb.append(buff, 0, len);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return sb.toString();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>getHttpMessageBody: 从request对象流中读取出数据转换成字符串</li><li>resolveArgument: 把取出来的字符串通过fastjson转换成参数类型的对象</li></ul><h5 id="handlermethodargumentresolvercomposite" tabindex="-1">HandlerMethodArgumentResolverComposite <a class="header-anchor" href="#handlermethodargumentresolvercomposite" aria-label="Permalink to &quot;HandlerMethodArgumentResolverComposite&quot;">​</a></h5><p>接下来我们创建参数解析器的组合类<code>HandlerMethodArgumentResolverComposite</code>，这也是策略模式的常用方式</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class HandlerMethodArgumentResolverComposite implements HandlerMethodArgumentResolver {</span></span>
<span class="line"><span>    private List&lt;HandlerMethodArgumentResolver&gt; argumentResolvers = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean supportsParameter(MethodParameter parameter) {</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object resolveArgument(MethodParameter parameter, HttpServletRequest request,</span></span>
<span class="line"><span>                                  HttpServletResponse response, ModelAndViewContainer container,</span></span>
<span class="line"><span>                                  ConversionService conversionService) throws Exception {</span></span>
<span class="line"><span>        for (HandlerMethodArgumentResolver resolver : argumentResolvers) {</span></span>
<span class="line"><span>            if (resolver.supportsParameter(parameter)) {</span></span>
<span class="line"><span>                return resolver.resolveArgument(parameter, request, conversionService);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        throw new IllegalArgumentException(&quot;Unsupported parameter type [&quot; +</span></span>
<span class="line"><span>                parameter.getParameterType().getName() + &quot;]. supportsParameter should be called first.&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void addResolver(HandlerMethodArgumentResolver resolver) {</span></span>
<span class="line"><span>        this.argumentResolvers.add(resolver);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void addResolver(HandlerMethodArgumentResolver... resolvers) {</span></span>
<span class="line"><span>        Collections.addAll(this.argumentResolvers, resolvers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void clear() {</span></span>
<span class="line"><span>        this.argumentResolvers.clear();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>同样也实现接口<code>HandlerMethodArgumentResolver</code>，内部定义List，在<code>resolveArgument</code>中循环所有的解析器，找到支持参数的解析器就开始解析，找不到就抛出异常</p><h4 id="_7-2-单元测试" tabindex="-1">7.2 单元测试 <a class="header-anchor" href="#_7-2-单元测试" aria-label="Permalink to &quot;7.2 单元测试&quot;">​</a></h4><p>到此，三个解析器都已经开发完成，我们来做一些单元测试，先定义测试用例：</p><ul><li>验证<code>@RequestParam</code>: 创建TestController，方法test4的参数name, age, birthday, request，验证解析器是否能够正常处理类型为String、Integer、Date、HttpServletRequest的解析</li><li>验证<code>@RequestBody</code>:创建TestController，方法user的参数UserVo, 验证解析器能够正确的把JSON字符串解析成UserVo对象</li></ul><p>创建TestController，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Service</span></span>
<span class="line"><span>public class TestController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @RequestMapping(path = &quot;/test4&quot;, method = RequestMethod.POST)</span></span>
<span class="line"><span>    public void test4(@RequestParam(name = &quot;name&quot;) String name,</span></span>
<span class="line"><span>                      @RequestParam(name = &quot;age&quot;) Integer age,</span></span>
<span class="line"><span>                      @RequestParam(name = &quot;birthday&quot;) Date birthday,</span></span>
<span class="line"><span>                      HttpServletRequest request) {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @RequestMapping(path = &quot;/user&quot;, method = RequestMethod.POST)</span></span>
<span class="line"><span>    public void user(@RequestBody UserVo userVo) {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>创建UserVo对象</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class UserVo {</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span>    private Integer age;</span></span>
<span class="line"><span>    private Date birthday;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //省略getter setter toString</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li>编写单元测试1，验证第一个测试用例</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void test1() throws NoSuchMethodException {</span></span>
<span class="line"><span>    TestController testController = new TestController();</span></span>
<span class="line"><span>    Method method = testController.getClass().getMethod(&quot;test4&quot;,</span></span>
<span class="line"><span>            String.class, Integer.class, Date.class, HttpServletRequest.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //构建HandlerMethod对象</span></span>
<span class="line"><span>    HandlerMethod handlerMethod = new HandlerMethod(testController, method);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //构建模拟请求的request</span></span>
<span class="line"><span>    MockHttpServletRequest request = new MockHttpServletRequest();</span></span>
<span class="line"><span>    request.setParameter(&quot;name&quot;, &quot;Silently9527&quot;);</span></span>
<span class="line"><span>    request.setParameter(&quot;age&quot;, &quot;25&quot;);</span></span>
<span class="line"><span>    request.setParameter(&quot;birthday&quot;, &quot;2020-11-12 13:00:00&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //添加支持的解析器</span></span>
<span class="line"><span>    HandlerMethodArgumentResolverComposite resolverComposite = new HandlerMethodArgumentResolverComposite();</span></span>
<span class="line"><span>    resolverComposite.addResolver(new RequestParamMethodArgumentResolver());</span></span>
<span class="line"><span>    resolverComposite.addResolver(new ServletRequestMethodArgumentResolver());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //定义转换器</span></span>
<span class="line"><span>    DefaultFormattingConversionService conversionService = new DefaultFormattingConversionService();</span></span>
<span class="line"><span>    DateFormatter dateFormatter = new DateFormatter();</span></span>
<span class="line"><span>    dateFormatter.setPattern(&quot;yyyy-MM-dd HH:mm:ss&quot;); </span></span>
<span class="line"><span>    conversionService.addFormatter(dateFormatter);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    MockHttpServletResponse response = new MockHttpServletResponse();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //用于查找方法参数名</span></span>
<span class="line"><span>    DefaultParameterNameDiscoverer parameterNameDiscoverer = new DefaultParameterNameDiscoverer();</span></span>
<span class="line"><span>    handlerMethod.getParameters().forEach(methodParameter -&gt; {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            methodParameter.initParameterNameDiscovery(parameterNameDiscoverer);</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            Object value = resolverComposite.resolveArgument(methodParameter, request,response, null, conversionService);</span></span>
<span class="line"><span>            System.out.println(methodParameter.getParameterName() + &quot; : &quot; + value + &quot;   type: &quot; + value.getClass());</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该单元测试中有两点说明一下：</p><ol><li><code>DefaultFormattingConversionService</code>: 该类是Spring中的一个数据转换器服务，默认已经添加了很多转换器，这里我们还设置了日期转换的格式<code>yyyy-MM-dd HH:mm:ss</code></li><li><code>DefaultParameterNameDiscoverer</code>: 该类是用于查找参数名的类，因为一般来说，通过反射是很难获得参数名的，只能取到参数类型，因为在编译时，参数名有可能是会改变的，所以需要这样一个类，Spring已经实现了多种解析，我们这里直接引用就行</li></ol><p>最后打印出解析出来的参数名字、值、类型</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/276501005-5fcb7c433e81d_articlex" alt=""></p><ol start="2"><li>编写单元测试验证用例2</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void test2() throws NoSuchMethodException {</span></span>
<span class="line"><span>    TestController testController = new TestController();</span></span>
<span class="line"><span>    Method method = testController.getClass().getMethod(&quot;user&quot;, UserVo.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    HandlerMethod handlerMethod = new HandlerMethod(testController, method);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    MockHttpServletRequest request = new MockHttpServletRequest();</span></span>
<span class="line"><span>    UserVo userVo = new UserVo();</span></span>
<span class="line"><span>    userVo.setName(&quot;Silently9527&quot;);</span></span>
<span class="line"><span>    userVo.setAge(25);</span></span>
<span class="line"><span>    userVo.setBirthday(new Date());</span></span>
<span class="line"><span>    request.setContent(JSON.toJSONString(userVo).getBytes()); //模拟JSON参数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    HandlerMethodArgumentResolverComposite resolverComposite = new HandlerMethodArgumentResolverComposite();</span></span>
<span class="line"><span>    resolverComposite.addResolver(new RequestBodyMethodArgumentResolver());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    MockHttpServletResponse response = new MockHttpServletResponse();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DefaultParameterNameDiscoverer parameterNameDiscoverer = new DefaultParameterNameDiscoverer();</span></span>
<span class="line"><span>    handlerMethod.getParameters().forEach(methodParameter -&gt; {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            methodParameter.initParameterNameDiscovery(parameterNameDiscoverer);</span></span>
<span class="line"><span>            Object value = resolverComposite.resolveArgument(methodParameter, request, response, null, null);</span></span>
<span class="line"><span>            System.out.println(methodParameter.getParameterName() + &quot; : &quot; + value + &quot;   type: &quot; + value.getClass());</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行的结果如下：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/2140052655-5fcb7cf7bba5b_articlex" alt=""></p><h4 id="_7-3-总结" tabindex="-1">7.3 总结 <a class="header-anchor" href="#_7-3-总结" aria-label="Permalink to &quot;7.3 总结&quot;">​</a></h4><p>本小节我们完成了三个参数解析器，了解到SpringMVC中Handler参数的解析过程。下一节我们将开始研发返回值解析器<code>HandlerMethodReturnValueHandler</code></p><h4 id="_7-4-延展" tabindex="-1">7.4 延展 <a class="header-anchor" href="#_7-4-延展" aria-label="Permalink to &quot;7.4 延展&quot;">​</a></h4><p>本节我们开发的解析器只实现了参数的自动封装；而SpringMVC的参数解析器还包含了参数的校验等，并且SpringMVC已经提供了很丰富的解析器，比如：<code>PathVariableMethodArgumentResolver</code>、<code>SessionAttributeMethodArgumentResolver</code>、<code>ServletCookieValueMethodArgumentResolver</code>等等，建议都了解一下</p>`,65),l=[t];function r(i,o,c,d,u,m){return a(),n("div",null,l)}const g=s(p,[["render",r]]);export{h as __pageData,g as default};
