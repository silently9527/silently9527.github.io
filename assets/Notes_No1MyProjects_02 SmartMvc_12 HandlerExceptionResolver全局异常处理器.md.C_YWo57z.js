import{_ as n,c as s,o as a,aa as e}from"./chunks/framework.DtK4gh9F.js";const g=JSON.parse('{"title":"12 全局异常处理器","description":"","frontmatter":{"title":"12 全局异常处理器","author":"Herman","updateTime":"2021-08-14 13:41","desc":"深入解析SpringMVC核心原理：从手写简易版MVC框架开始(SmartMvc)","categories":"MyProjects","tags":"SpringMvc/MVC","outline":"deep"},"headers":[],"relativePath":"Notes/No1MyProjects/02 SmartMvc/12 HandlerExceptionResolver全局异常处理器.md","filePath":"Notes/No1MyProjects/02 SmartMvc/12 HandlerExceptionResolver全局异常处理器.md","lastUpdated":1724593073000}'),p={name:"Notes/No1MyProjects/02 SmartMvc/12 HandlerExceptionResolver全局异常处理器.md"},l=e(`<p>上一篇由于篇幅问题，在DispatcherServlet中还留了一个方法未实现，主要是处理出现异常情况该如何处理，本篇我们将来完成这个功能，本篇内容稍多，我们先来看看类图：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/0a8d9afddb9d498abb22f55cb123c4ed%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><p>本篇我们主要需要实现框架的全局异常处理器，通过注解<code>ControllerAdvice</code>标注的类表示支持处理异常，在这个类中通过注解<code>ExceptionHandler</code>标识出支持处理哪些异常。</p><h4 id="_14-1-开发步骤讲解" tabindex="-1">14.1 开发步骤讲解 <a class="header-anchor" href="#_14-1-开发步骤讲解" aria-label="Permalink to &quot;14.1 开发步骤讲解&quot;">​</a></h4><h5 id="controlleradvice、exceptionhandler" tabindex="-1">ControllerAdvice、ExceptionHandler <a class="header-anchor" href="#controlleradvice、exceptionhandler" aria-label="Permalink to &quot;ControllerAdvice、ExceptionHandler&quot;">​</a></h5><p>先定义出我们需要使用的注解：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target(ElementType.TYPE)</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>@Component</span></span>
<span class="line"><span>public @interface ControllerAdvice {</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target(ElementType.METHOD)</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>public @interface ExceptionHandler {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Class&lt;? extends Throwable&gt;[] value() default {};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>允许指定多个异常类，表示被标注的方法能处理指定的异常</p><h4 id="controlleradvicebean" tabindex="-1">ControllerAdviceBean <a class="header-anchor" href="#controlleradvicebean" aria-label="Permalink to &quot;ControllerAdviceBean&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ControllerAdviceBean {</span></span>
<span class="line"><span>    private String beanName;</span></span>
<span class="line"><span>    private Class&lt;?&gt; beanType;</span></span>
<span class="line"><span>    private Object bean;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ControllerAdviceBean(String beanName, Object bean) {</span></span>
<span class="line"><span>        Assert.notNull(bean, &quot;Bean must not be null&quot;);</span></span>
<span class="line"><span>        this.beanType = bean.getClass();</span></span>
<span class="line"><span>        this.beanName = beanName;</span></span>
<span class="line"><span>        this.bean = bean;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static List&lt;ControllerAdviceBean&gt; findAnnotatedBeans(ApplicationContext context) {</span></span>
<span class="line"><span>        Map&lt;String, Object&gt; beanMap = BeanFactoryUtils.beansOfTypeIncludingAncestors(context, Object.class);</span></span>
<span class="line"><span>        return beanMap.entrySet().stream()</span></span>
<span class="line"><span>                .filter(entry -&gt; hasControllerAdvice(entry.getValue()))</span></span>
<span class="line"><span>                .map(entry -&gt; new ControllerAdviceBean(entry.getKey(), entry.getValue()))</span></span>
<span class="line"><span>                .collect(toList());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static boolean hasControllerAdvice(Object bean) {</span></span>
<span class="line"><span>        Class&lt;?&gt; beanType = bean.getClass();</span></span>
<span class="line"><span>        return (AnnotatedElementUtils.hasAnnotation(beanType, ControllerAdvice.class));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //省略getter  setter</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li>该类用于表示被<code>ControllerAdvice</code>标注的类，比如<code>TestController</code>被标注了<code>ControllerAdvice</code>，那么就需要构建一个ControllerAdviceBean对象，beanType为<code>TestController</code>;bean就是<code>TestController</code>的实例对象</li><li>hasControllerAdvice: 判断类上是否有注解<code>ControllerAdvice</code>，在开发handlerMapping的初始化是也有类似的操作</li><li>findAnnotatedBeans: 从容器中找出被<code>ControllerAdvice</code>标注的所有类，构建一个<code>ControllerAdviceBean</code>集合返回</li></ol><ul><li>ExceptionHandlerMethodResolver 当找出了所有被<code>ControllerAdvice</code>标注的类之后，我们还需要解析出这些类中哪些方法被注解<code>ExceptionHandler</code>标注过，<code>ExceptionHandlerMethodResolver</code>就是来做这个事的。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ExceptionHandlerMethodResolver {</span></span>
<span class="line"><span>    public static final ReflectionUtils.MethodFilter EXCEPTION_HANDLER_METHODS = method -&gt;</span></span>
<span class="line"><span>            AnnotatedElementUtils.hasAnnotation(method, ExceptionHandler.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private final Map&lt;Class&lt;? extends Throwable&gt;, Method&gt; mappedMethods = new ConcurrentReferenceHashMap&lt;&gt;(16);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ExceptionHandlerMethodResolver(Class&lt;?&gt; handlerType) {</span></span>
<span class="line"><span>        for (Method method : MethodIntrospector.selectMethods(handlerType, EXCEPTION_HANDLER_METHODS)) {</span></span>
<span class="line"><span>            for (Class&lt;? extends Throwable&gt; exceptionType : detectExceptionMappings(method)) {</span></span>
<span class="line"><span>                this.mappedMethods.put(exceptionType, method);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private List&lt;Class&lt;? extends Throwable&gt;&gt; detectExceptionMappings(Method method) {</span></span>
<span class="line"><span>        ExceptionHandler ann = AnnotatedElementUtils.findMergedAnnotation(method, ExceptionHandler.class);</span></span>
<span class="line"><span>        Assert.state(ann != null, &quot;No ExceptionHandler annotation&quot;);</span></span>
<span class="line"><span>        return Arrays.asList(ann.value());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Map&lt;Class&lt;? extends Throwable&gt;, Method&gt; getMappedMethods() {</span></span>
<span class="line"><span>        return mappedMethods;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean hasExceptionMappings() {</span></span>
<span class="line"><span>        return !this.mappedMethods.isEmpty();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Method resolveMethod(Exception exception) {</span></span>
<span class="line"><span>        Method method = resolveMethodByExceptionType(exception.getClass());</span></span>
<span class="line"><span>        if (method == null) {</span></span>
<span class="line"><span>            Throwable cause = exception.getCause();</span></span>
<span class="line"><span>            if (cause != null) {</span></span>
<span class="line"><span>                method = resolveMethodByExceptionType(cause.getClass());</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return method;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private Method resolveMethodByExceptionType(Class&lt;? extends Throwable&gt; exceptionClass) {</span></span>
<span class="line"><span>        return mappedMethods.get(exceptionClass);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li>首先定义了<code>EXCEPTION_HANDLER_METHODS</code>静态变量，判断方法是否有注解<code>ExceptionHandler</code></li><li>detectExceptionMappings: 解析出方法上<code>ExceptionHandler</code>配置的所有异常</li><li>构造方法中传入了Bean的类型，使用<code>MethodIntrospector.selectMethods</code>过滤出所有被<code>ExceptionHandler</code>标注的类（在HanderMapping的初始化也使用过同样的方法），保存异常类型和方法的对应关系</li><li>resolveMethod: 通过异常类型找出对应的方法</li></ol><h4 id="exceptionhandlerexceptionresolver" tabindex="-1">ExceptionHandlerExceptionResolver <a class="header-anchor" href="#exceptionhandlerexceptionresolver" aria-label="Permalink to &quot;ExceptionHandlerExceptionResolver&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ExceptionHandlerExceptionResolver implements HandlerExceptionResolver, ApplicationContextAware, InitializingBean {</span></span>
<span class="line"><span>    private Logger logger = LoggerFactory.getLogger(getClass());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private ApplicationContext applicationContext;</span></span>
<span class="line"><span>    private Map&lt;ControllerAdviceBean, ExceptionHandlerMethodResolver&gt; exceptionHandlerAdviceCache =</span></span>
<span class="line"><span>            new LinkedHashMap&lt;&gt;();</span></span>
<span class="line"><span>    private ConversionService conversionService;</span></span>
<span class="line"><span>    private List&lt;HandlerMethodArgumentResolver&gt; customArgumentResolvers;</span></span>
<span class="line"><span>    private HandlerMethodArgumentResolverComposite argumentResolvers;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private List&lt;HandlerMethodReturnValueHandler&gt; customReturnValueHandlers;</span></span>
<span class="line"><span>    private HandlerMethodReturnValueHandlerComposite returnValueHandlers;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Exception ex) {</span></span>
<span class="line"><span>        InvocableHandlerMethod exceptionHandlerMethod = getExceptionHandlerMethod(ex);</span></span>
<span class="line"><span>        if (exceptionHandlerMethod == null) {</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ModelAndViewContainer mavContainer = new ModelAndViewContainer();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            Throwable cause = ex.getCause();</span></span>
<span class="line"><span>            if (Objects.nonNull(cause)) {</span></span>
<span class="line"><span>                exceptionHandlerMethod.invokeAndHandle(request, response, mavContainer, cause);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                exceptionHandlerMethod.invokeAndHandle(request, response, mavContainer, ex);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            logger.error(&quot;exceptionHandlerMethod.invokeAndHandle fail&quot;, e);</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (mavContainer.isRequestHandled()) {</span></span>
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
<span class="line"><span>    private InvocableHandlerMethod getExceptionHandlerMethod(Exception exception) {</span></span>
<span class="line"><span>        for (Map.Entry&lt;ControllerAdviceBean, ExceptionHandlerMethodResolver&gt; entry : this.exceptionHandlerAdviceCache.entrySet()) {</span></span>
<span class="line"><span>            ControllerAdviceBean advice = entry.getKey();</span></span>
<span class="line"><span>            ExceptionHandlerMethodResolver resolver = entry.getValue();</span></span>
<span class="line"><span>            Method method = resolver.resolveMethod(exception);</span></span>
<span class="line"><span>            if (method != null) {</span></span>
<span class="line"><span>                return new InvocableHandlerMethod(advice.getBean(),</span></span>
<span class="line"><span>                        method,</span></span>
<span class="line"><span>                        this.argumentResolvers,</span></span>
<span class="line"><span>                        this.returnValueHandlers,</span></span>
<span class="line"><span>                        this.conversionService);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void afterPropertiesSet() throws Exception {</span></span>
<span class="line"><span>        Assert.notNull(this.conversionService, &quot;conversionService can not null&quot;);</span></span>
<span class="line"><span>        initExceptionHandlerAdviceCache();</span></span>
<span class="line"><span>        if (this.argumentResolvers == null) {</span></span>
<span class="line"><span>            List&lt;HandlerMethodArgumentResolver&gt; resolvers = getDefaultArgumentResolvers();</span></span>
<span class="line"><span>            this.argumentResolvers = new HandlerMethodArgumentResolverComposite();</span></span>
<span class="line"><span>            this.argumentResolvers.addResolver(resolvers);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (this.returnValueHandlers == null) {</span></span>
<span class="line"><span>            List&lt;HandlerMethodReturnValueHandler&gt; handlers = getDefaultReturnValueHandlers();</span></span>
<span class="line"><span>            this.returnValueHandlers = new HandlerMethodReturnValueHandlerComposite();</span></span>
<span class="line"><span>            this.returnValueHandlers.addReturnValueHandler(handlers);</span></span>
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
<span class="line"><span>    private void initExceptionHandlerAdviceCache() {</span></span>
<span class="line"><span>        List&lt;ControllerAdviceBean&gt; adviceBeans = ControllerAdviceBean.findAnnotatedBeans(applicationContext);</span></span>
<span class="line"><span>        for (ControllerAdviceBean adviceBean : adviceBeans) {</span></span>
<span class="line"><span>            Class&lt;?&gt; beanType = adviceBean.getBeanType();</span></span>
<span class="line"><span>            if (beanType == null) {</span></span>
<span class="line"><span>                throw new IllegalStateException(&quot;Unresolvable type for ControllerAdviceBean: &quot; + adviceBean);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            ExceptionHandlerMethodResolver resolver = new ExceptionHandlerMethodResolver(beanType);</span></span>
<span class="line"><span>            if (resolver.hasExceptionMappings()) {</span></span>
<span class="line"><span>                this.exceptionHandlerAdviceCache.put(adviceBean, resolver);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //省略getter  setter</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该类是处理全局异常的核心类，主要分为两部分：</p><ol><li><p>初始化 由于需要通过反射调用被<code>ExceptionHandler</code>标注的方法处理异常，与HandlerAdapter类型需要参数解析器和返回值处理，所以在<code>afterPropertiesSet</code>需要对参数解析器和返回值处理进行初始化； 其次还需要调用<code>initExceptionHandlerAdviceCache</code>完成<code>exceptionHandlerAdviceCache</code>变量的初始化，建立起<code>ControllerAdviceBean</code>和<code>ExceptionHandlerMethodResolver</code>的关系</p></li><li><p>resolveException处理异常返回ModelAndView</p></li></ol><ul><li>先通过调用<code>getExceptionHandlerMethod</code>找到处理异常<code>ControllerAdviceBean</code>、<code>ExceptionHandlerMethodResolver</code>，构建出<code>InvocableHandlerMethod</code></li><li>执行方法的调用<code>exceptionHandlerMethod.invokeAndHandle</code>，这里你会发现编译出现异常，我们多写了最后一个参数，先不急，下一步我们来处理</li><li>通过<code>ModelAndViewContainer</code>构建ModelAndView对象</li></ul><hr><p>在之前我们创建的<code>InvocableHandlerMethod</code>未考虑到需要手动传入参数不需要通过参数解析器的情况，比如这里我们需要传入一个异常参数，所以我们需要修改一下<code>InvocableHandlerMethod</code>的invokeAndHandle方法</p><ol><li>添加一个参数providedArgs</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    public void invokeAndHandle(HttpServletRequest request,</span></span>
<span class="line"><span>                                HttpServletResponse response,</span></span>
<span class="line"><span>                                ModelAndViewContainer mavContainer,</span></span>
<span class="line"><span>                                Object... providedArgs) throws Exception {</span></span>
<span class="line"><span>        ....</span></span>
<span class="line"><span>    }</span></span></code></pre></div><ol start="2"><li>修改方法getMethodArgumentValues，在执行解析器之前判断是否传入的参数满足</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private List&lt;Object&gt; getMethodArgumentValues(HttpServletRequest request,</span></span>
<span class="line"><span>                                             HttpServletResponse response,</span></span>
<span class="line"><span>                                             ModelAndViewContainer mavContainer,</span></span>
<span class="line"><span>                                             Object... providedArgs) throws Exception {</span></span>
<span class="line"><span>    Assert.notNull(argumentResolver, &quot;HandlerMethodArgumentResolver can not null&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;MethodParameter&gt; parameters = this.getParameters();</span></span>
<span class="line"><span>    List&lt;Object&gt; args = new ArrayList&lt;&gt;(parameters.size());</span></span>
<span class="line"><span>    for (MethodParameter parameter : parameters) {</span></span>
<span class="line"><span>        parameter.initParameterNameDiscovery(this.parameterNameDiscoverer);</span></span>
<span class="line"><span>        //新增start</span></span>
<span class="line"><span>        Object arg = findProvidedArgument(parameter, providedArgs);</span></span>
<span class="line"><span>        if (Objects.nonNull(arg)) {</span></span>
<span class="line"><span>            args.add(arg);</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //新增end</span></span>
<span class="line"><span>        args.add(argumentResolver.resolveArgument(parameter, request, response, mavContainer, conversionService));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return args;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="3"><li>添加方法findProvidedArgument</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected static Object findProvidedArgument(MethodParameter parameter, Object... providedArgs) {</span></span>
<span class="line"><span>    if (!ObjectUtils.isEmpty(providedArgs)) {</span></span>
<span class="line"><span>        for (Object providedArg : providedArgs) {</span></span>
<span class="line"><span>            if (parameter.getParameterType().isInstance(providedArg)) {</span></span>
<span class="line"><span>                return providedArg;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="4"><li><code>InvocableHandlerMethod</code>新增构造方法</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public InvocableHandlerMethod(Object bean, Method method,</span></span>
<span class="line"><span>                              HandlerMethodArgumentResolverComposite argumentResolver,</span></span>
<span class="line"><span>                              HandlerMethodReturnValueHandlerComposite returnValueHandler,</span></span>
<span class="line"><span>                              ConversionService conversionService) {</span></span>
<span class="line"><span>    super(bean, method);</span></span>
<span class="line"><span>    this.argumentResolver = argumentResolver;</span></span>
<span class="line"><span>    this.returnValueHandler = returnValueHandler;</span></span>
<span class="line"><span>    this.conversionService = conversionService;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="完成dispatcherservlet中的异常处理方法" tabindex="-1">完成DispatcherServlet中的异常处理方法 <a class="header-anchor" href="#完成dispatcherservlet中的异常处理方法" aria-label="Permalink to &quot;完成DispatcherServlet中的异常处理方法&quot;">​</a></h5><ol><li>定义变量</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private Collection&lt;HandlerExceptionResolver&gt; handlerExceptionResolvers;</span></span></code></pre></div><ol start="2"><li>在init中完成初始化</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>this.handlerExceptionResolvers =</span></span>
<span class="line"><span>                this.applicationContext.getBeansOfType(HandlerExceptionResolver.class).values();</span></span></code></pre></div><ol start="3"><li>完成processHandlerException中的处理逻辑</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private ModelAndView processHandlerException(HttpServletRequest request, HttpServletResponse response,</span></span>
<span class="line"><span>                                             Exception ex) throws Exception {</span></span>
<span class="line"><span>    if (CollectionUtils.isEmpty(this.handlerExceptionResolvers)) {</span></span>
<span class="line"><span>        throw ex;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (HandlerExceptionResolver resolver : this.handlerExceptionResolvers) {</span></span>
<span class="line"><span>        ModelAndView exMv = resolver.resolveException(request, response, ex);</span></span>
<span class="line"><span>        if (exMv != null) {</span></span>
<span class="line"><span>            return exMv;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //未找到对应的异常处理器，就继续抛出异常</span></span>
<span class="line"><span>    throw ex;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="_14-2-单元测试" tabindex="-1">14.2 单元测试 <a class="header-anchor" href="#_14-2-单元测试" aria-label="Permalink to &quot;14.2 单元测试&quot;">​</a></h4><ol><li>在AppConfig.java中创建一个异常处理器</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Bean</span></span>
<span class="line"><span>public HandlerExceptionResolver handlerExceptionResolver(ConversionService conversionService) {</span></span>
<span class="line"><span>    ExceptionHandlerExceptionResolver resolver = new ExceptionHandlerExceptionResolver();</span></span>
<span class="line"><span>    resolver.setConversionService(conversionService);</span></span>
<span class="line"><span>    return resolver;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>自定义异常类<code>TestException</code></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class TestException extends RuntimeException {</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public TestException(String message, String name) {</span></span>
<span class="line"><span>        super(message);</span></span>
<span class="line"><span>        this.name = name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getName() {</span></span>
<span class="line"><span>        return name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="3"><li>定义接口通用返回对象<code>ApiResponse</code></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>public class ApiResponse {</span></span>
<span class="line"><span>    private int code;</span></span>
<span class="line"><span>    private String message;</span></span>
<span class="line"><span>    private String data;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ApiResponse(int code, String message, String data) {</span></span>
<span class="line"><span>        this.code = code;</span></span>
<span class="line"><span>        this.message = message;</span></span>
<span class="line"><span>        this.data = data;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //getter setter</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="4"><li>修改上篇中的<code>DispatcherController</code>，新增注解<code>@ControllerAdvice</code>，添加两个方法<code>dispatch2</code>，<code>exceptionHandler</code>，代码如下</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ControllerAdvice  //新增</span></span>
<span class="line"><span>@Controller</span></span>
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
<span class="line"><span>    @RequestMapping(path = &quot;/dispatch2&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>    public String dispatch2(@RequestParam(name = &quot;name&quot;) String name) {</span></span>
<span class="line"><span>        System.out.println(&quot;DispatcherController.dispatch2: name=&gt;&quot; + name);</span></span>
<span class="line"><span>        //处理请求的过程中抛异常</span></span>
<span class="line"><span>        throw new TestException(&quot;test exception&quot;, name);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //当出现TestException异常会执行此方法</span></span>
<span class="line"><span>    @ResponseBody</span></span>
<span class="line"><span>    @ExceptionHandler({TestException.class})</span></span>
<span class="line"><span>    public ApiResponse exceptionHandler(TestException ex) {</span></span>
<span class="line"><span>        System.out.println(&quot;exception message:&quot; + ex.getMessage());</span></span>
<span class="line"><span>        return new ApiResponse(200, &quot;exception handle complete&quot;, ex.getName());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="5"><li>在<code>DispatcherServletTest</code>创建单元测试，验证出现异常后是否会执行<code>exceptionHandler</code>方法</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void test2() throws ServletException, IOException {</span></span>
<span class="line"><span>    dispatcherServlet.init();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    MockHttpServletRequest request = new MockHttpServletRequest();</span></span>
<span class="line"><span>    request.setParameter(&quot;name&quot;, &quot;silently9527&quot;);</span></span>
<span class="line"><span>    request.setRequestURI(&quot;/test/dispatch2&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    MockHttpServletResponse response = new MockHttpServletResponse();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    dispatcherServlet.service(request, response);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    System.out.println(&quot;响应到客户端的数据：&quot;);</span></span>
<span class="line"><span>    System.out.println(response.getContentAsString());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行结果如下：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/e5c5e7536cb84053b715fbbe0c1a5384%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><h4 id="_14-3-总结" tabindex="-1">14.3 总结 <a class="header-anchor" href="#_14-3-总结" aria-label="Permalink to &quot;14.3 总结&quot;">​</a></h4><p>本篇我们开发完成了全局异常处理器<code>ExceptionHandlerExceptionResolver</code>，SmartMVC处理用户请求的整个流程我们已开发完成，这其实也是SpringMVC的处理流程，到这里基本已经把SpringMVC如何处理请求的过程都实现了。为了驱动我们的SmartMVC项目能够很方便的运行起来以及Springboot进行整合，我们下篇将开始开发SmartMVC的配置器。</p><h4 id="_14-4-延展" tabindex="-1">14.4 延展 <a class="header-anchor" href="#_14-4-延展" aria-label="Permalink to &quot;14.4 延展&quot;">​</a></h4><p>虽然本次我们通过<code>ControllerAdvice</code>实现了处理全局异常，但是springmvc中<code>ControllerAdvice</code>注解的作用不止是用来处理全局异常，比如：全局数据绑定、全局数据预处理；有兴趣的同学可去了解一下</p>`,54),t=[l];function i(o,c,r,d,u,h){return a(),s("div",null,t)}const m=n(p,[["render",i]]);export{g as __pageData,m as default};
