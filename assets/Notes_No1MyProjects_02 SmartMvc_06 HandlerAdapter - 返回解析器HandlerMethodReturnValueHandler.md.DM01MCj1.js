import{_ as n,c as a,o as s,aa as e}from"./chunks/framework.d_Ke7vMG.js";const M=JSON.parse('{"title":"06 返回解析器","description":"","frontmatter":{"title":"06 返回解析器","author":"Herman","updateTime":"2021-08-14 13:41","desc":"深入解析SpringMVC核心原理：从手写简易版MVC框架开始(SmartMvc)","categories":"MyProjects","tags":"SpringMvc/MVC","outline":"deep"},"headers":[],"relativePath":"Notes/No1MyProjects/02 SmartMvc/06 HandlerAdapter - 返回解析器HandlerMethodReturnValueHandler.md","filePath":"Notes/No1MyProjects/02 SmartMvc/06 HandlerAdapter - 返回解析器HandlerMethodReturnValueHandler.md","lastUpdated":1723606122000}'),p={name:"Notes/No1MyProjects/02 SmartMvc/06 HandlerAdapter - 返回解析器HandlerMethodReturnValueHandler.md"},l=e(`<p>前一篇我们开发完成了参数的解析器，接下来我们开始开发返回值的处理器，在SpringMVC中已经内部实现了很多的返回值处理器，我们这里不可能实现那么多，我挑选了5个常用的返回值处理器来作为本篇的开发内容，首先我们一起来看下类图</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/3463514123-5fcc422c47bf0_articlex" alt=""></p><p>本篇我们主要实现5个功能，这也是SpringMVC中常用的功能：</p><ul><li><code>Map</code>: 支持Handler返回Map值，放入到上下文中，用于页面渲染使用</li><li><code>Model</code>: 支持Handler返回Model值，放入到上下文中，用于页面渲染使用</li><li><code>View</code>: 支持Handler直接返回需要渲染的<code>View</code>对象</li><li><code>viewName</code>: 支持返回一个String对象，表示视图的路径</li><li><code>@ResponseBody</code>: 如果方法上被注解<code>@ResponseBody</code>标注，那么返回JSON字符串</li></ul><h4 id="_8-1-开发步骤讲解" tabindex="-1">8.1 开发步骤讲解 <a class="header-anchor" href="#_8-1-开发步骤讲解" aria-label="Permalink to &quot;8.1 开发步骤讲解&quot;">​</a></h4><blockquote><p>本节源代码的分支：handlerAdapter-returnValueHandler</p></blockquote><h5 id="handlermethodreturnvaluehandler" tabindex="-1">HandlerMethodReturnValueHandler <a class="header-anchor" href="#handlermethodreturnvaluehandler" aria-label="Permalink to &quot;HandlerMethodReturnValueHandler&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface HandlerMethodReturnValueHandler {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    boolean supportsReturnType(MethodParameter returnType);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,</span></span>
<span class="line"><span>                           ModelAndViewContainer mavContainer,</span></span>
<span class="line"><span>                           HttpServletRequest request, HttpServletResponse response) throws Exception;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>supportsReturnType: 同参数解析器一样，判断处理器是否支持该返回值的类型</li><li>handleReturnValue: returnValue(Handler执行之后的返回值)；该方法还需要传入<code>HttpServletResponse</code>对象，是因为可能会在处理其中直接处理完整个请求，比如<code>@ResponseBody</code></li></ul><h5 id="mapmethodreturnvaluehandler-、-modelmethodreturnvaluehandler" tabindex="-1">MapMethodReturnValueHandler 、 ModelMethodReturnValueHandler <a class="header-anchor" href="#mapmethodreturnvaluehandler-、-modelmethodreturnvaluehandler" aria-label="Permalink to &quot;MapMethodReturnValueHandler 、 ModelMethodReturnValueHandler&quot;">​</a></h5><p>先来看两个简单的实现，支持返回Map，Model</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ModelMethodReturnValueHandler implements HandlerMethodReturnValueHandler {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean supportsReturnType(MethodParameter returnType) {</span></span>
<span class="line"><span>        return Model.class.isAssignableFrom(returnType.getParameterType());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,</span></span>
<span class="line"><span>                                  ModelAndViewContainer mavContainer,</span></span>
<span class="line"><span>                                  HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (returnValue == null) {</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        } else if (returnValue instanceof Model) {</span></span>
<span class="line"><span>            mavContainer.getModel().addAllAttributes(((Model) returnValue).asMap());</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            // should not happen</span></span>
<span class="line"><span>            throw new UnsupportedOperationException(&quot;Unexpected return type: &quot; +</span></span>
<span class="line"><span>                    returnType.getParameterType().getName() + &quot; in method: &quot; + returnType.getMethod());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MapMethodReturnValueHandler implements HandlerMethodReturnValueHandler {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean supportsReturnType(MethodParameter returnType) {</span></span>
<span class="line"><span>        return Map.class.isAssignableFrom(returnType.getParameterType());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    @SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>    public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,</span></span>
<span class="line"><span>                                  ModelAndViewContainer mavContainer,</span></span>
<span class="line"><span>                                  HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (returnValue instanceof Map) {</span></span>
<span class="line"><span>            mavContainer.getModel().addAllAttributes((Map) returnValue);</span></span>
<span class="line"><span>        } else if (returnValue != null) {</span></span>
<span class="line"><span>            // should not happen</span></span>
<span class="line"><span>            throw new UnsupportedOperationException(&quot;Unexpected return type: &quot; +</span></span>
<span class="line"><span>                    returnType.getParameterType().getName() + &quot; in method: &quot; + returnType.getMethod());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上一篇我们已经说到<code>ModelAndViewContainer</code>，它是一个ModelAndView的容器，每个请求都会新建一个对象，它会贯穿整个Handler执行前的参数解析、执行以及返回值处理；这两个类的实现主要都是将Handler的返回值添加知道Model中，用于后面构建<code>ModeAndView</code>对象以及实现渲染</p><h5 id="viewnamemethodreturnvaluehandler、viewmethodreturnvaluehandler" tabindex="-1">ViewNameMethodReturnValueHandler、ViewMethodReturnValueHandler <a class="header-anchor" href="#viewnamemethodreturnvaluehandler、viewmethodreturnvaluehandler" aria-label="Permalink to &quot;ViewNameMethodReturnValueHandler、ViewMethodReturnValueHandler&quot;">​</a></h5><p>刚才上面两个处理器主要负责的是<code>ModelAndView</code>中的Model部分，接下来我们要实现的是负责View部分；由于本篇我们需要使用到View对象，所以我们需要先建了View的解析，只是不去实现，方便我们现在引用</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface View {</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来我们看看支持Handler返回ViewName和View的实现</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ViewNameMethodReturnValueHandler implements HandlerMethodReturnValueHandler {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean supportsReturnType(MethodParameter returnType) {</span></span>
<span class="line"><span>        Class&lt;?&gt; paramType = returnType.getParameterType();</span></span>
<span class="line"><span>        return CharSequence.class.isAssignableFrom(paramType);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,</span></span>
<span class="line"><span>                                  ModelAndViewContainer mavContainer,</span></span>
<span class="line"><span>                                  HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (returnValue instanceof CharSequence) {</span></span>
<span class="line"><span>            String viewName = returnValue.toString();</span></span>
<span class="line"><span>            mavContainer.setViewName(viewName);</span></span>
<span class="line"><span>        } else if (returnValue != null) {</span></span>
<span class="line"><span>            // should not happen</span></span>
<span class="line"><span>            throw new UnsupportedOperationException(&quot;Unexpected return type: &quot; +</span></span>
<span class="line"><span>                    returnType.getParameterType().getName() + &quot; in method: &quot; + returnType.getMethod());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ViewMethodReturnValueHandler implements HandlerMethodReturnValueHandler {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean supportsReturnType(MethodParameter returnType) {</span></span>
<span class="line"><span>        return View.class.isAssignableFrom(returnType.getParameterType());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,</span></span>
<span class="line"><span>                                  ModelAndViewContainer mavContainer,</span></span>
<span class="line"><span>                                  HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (returnValue instanceof View) {</span></span>
<span class="line"><span>            View view = (View) returnValue;</span></span>
<span class="line"><span>            mavContainer.setView(view);</span></span>
<span class="line"><span>        } else if (returnValue != null) {</span></span>
<span class="line"><span>            // should not happen</span></span>
<span class="line"><span>            throw new UnsupportedOperationException(&quot;Unexpected return type: &quot; +</span></span>
<span class="line"><span>                    returnType.getParameterType().getName() + &quot; in method: &quot; + returnType.getMethod());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>ViewNameMethodReturnValueHandler</code>：如果返回值是String，那么把这个返回值当做是视图的名字，放入到<code>ModelAndViewContainer</code>中 <code>ViewMethodReturnValueHandler</code>：如果返回值是View对象，那么直接把视图放入到<code>ModelAndViewContainer</code>中</p><h5 id="responsebodymethodreturnvaluehandler" tabindex="-1">ResponseBodyMethodReturnValueHandler <a class="header-anchor" href="#responsebodymethodreturnvaluehandler" aria-label="Permalink to &quot;ResponseBodyMethodReturnValueHandler&quot;">​</a></h5><p>当方法或者Controller被注解<code>@ResponseBody</code>标注时，返回值需要被转换成JSON字符串输出</p><p>定义注解<code>@ResponseBody</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target({ElementType.TYPE, ElementType.METHOD})</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>public @interface ResponseBody {</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ResponseBodyMethodReturnValueHandler implements HandlerMethodReturnValueHandler {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean supportsReturnType(MethodParameter returnType) {</span></span>
<span class="line"><span>        return (AnnotatedElementUtils.hasAnnotation(returnType.getContainingClass(), ResponseBody.class) ||</span></span>
<span class="line"><span>                returnType.hasMethodAnnotation(ResponseBody.class));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,</span></span>
<span class="line"><span>                                  ModelAndViewContainer mavContainer,</span></span>
<span class="line"><span>                                  HttpServletRequest request, HttpServletResponse response)</span></span>
<span class="line"><span>            throws IOException {</span></span>
<span class="line"><span>        //标记本次请求已经处理完成</span></span>
<span class="line"><span>        mavContainer.setRequestHandled(true);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        outPutMessage(response, JSON.toJSONString(returnValue));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void outPutMessage(HttpServletResponse response, String message) throws IOException {</span></span>
<span class="line"><span>        try (PrintWriter out = response.getWriter()) {</span></span>
<span class="line"><span>            out.write(message);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li><code>mavContainer.setRequestHandled(true);</code>标记出当前请求已经处理完成，后续的渲染无需在执行</li><li>使用fastJson把返回值转换成JSON字符串，在使用response输出给前端</li></ol><h5 id="handlermethodreturnvaluehandlercomposite" tabindex="-1">HandlerMethodReturnValueHandlerComposite <a class="header-anchor" href="#handlermethodreturnvaluehandlercomposite" aria-label="Permalink to &quot;HandlerMethodReturnValueHandlerComposite&quot;">​</a></h5><p>与参数解析器一样，这里也需要一个返回值处理器的聚合类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class HandlerMethodReturnValueHandlerComposite implements HandlerMethodReturnValueHandler {</span></span>
<span class="line"><span>    private List&lt;HandlerMethodReturnValueHandler&gt; returnValueHandlers = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean supportsReturnType(MethodParameter returnType) {</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void handleReturnValue(Object returnValue, MethodParameter returnType, ModelAndViewContainer mavContainer,</span></span>
<span class="line"><span>                                  HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span>        for (HandlerMethodReturnValueHandler handler : returnValueHandlers) {</span></span>
<span class="line"><span>            if (handler.supportsReturnType(returnType)) {</span></span>
<span class="line"><span>                handler.handleReturnValue(returnValue, returnType, mavContainer, request, response);</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        throw new IllegalArgumentException(&quot;Unsupported parameter type [&quot; +</span></span>
<span class="line"><span>                returnType.getParameterType().getName() + &quot;]. supportsParameter should be called first.&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void clear() {</span></span>
<span class="line"><span>        this.returnValueHandlers.clear();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void addReturnValueHandler(HandlerMethodReturnValueHandler... handlers) {</span></span>
<span class="line"><span>        Collections.addAll(this.returnValueHandlers, handlers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="_8-2-单元测试" tabindex="-1">8.2 单元测试 <a class="header-anchor" href="#_8-2-单元测试" aria-label="Permalink to &quot;8.2 单元测试&quot;">​</a></h4><p>到此所有的开发工作都已完成，接着继续我们的单元测试 要测试这5中处理器是否正常工作，我们需要建一个<code>TestReturnValueController</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class TestReturnValueController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @ResponseBody</span></span>
<span class="line"><span>    public UserVo testResponseBody() {</span></span>
<span class="line"><span>        UserVo userVo = new UserVo();</span></span>
<span class="line"><span>        userVo.setBirthday(new Date());</span></span>
<span class="line"><span>        userVo.setAge(20);</span></span>
<span class="line"><span>        userVo.setName(&quot;Silently9527&quot;);</span></span>
<span class="line"><span>        return userVo;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String testViewName() {</span></span>
<span class="line"><span>        return &quot;/jsp/index.jsp&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public View testView() {</span></span>
<span class="line"><span>        return new View() {</span></span>
<span class="line"><span>        };</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Model testModel(Model model) {</span></span>
<span class="line"><span>        model.addAttribute(&quot;testModel&quot;, &quot;Silently9527&quot;);</span></span>
<span class="line"><span>        return model;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Map&lt;String, Object&gt; testMap() {</span></span>
<span class="line"><span>        Map&lt;String, Object&gt; params = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>        params.put(&quot;testMap&quot;, &quot;Silently9527&quot;);</span></span>
<span class="line"><span>        return params;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在创建单元测试类之前，我们先看看<code>MethodParameter</code>中的一个构造方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Create a new {@code MethodParameter} for the given method, with nesting level 1.</span></span>
<span class="line"><span> * @param method the Method to specify a parameter for</span></span>
<span class="line"><span> * @param parameterIndex the index of the parameter: -1 for the method</span></span>
<span class="line"><span> * return type; 0 for the first method parameter; 1 for the second method</span></span>
<span class="line"><span> * parameter, etc.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public MethodParameter(Method method, int parameterIndex) {</span></span>
<span class="line"><span>	this(method, parameterIndex, 1);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从构造方法的注释我可以了解到，当<code>parameterIndex</code>等于-1的时候，表示构造方法返回值的<code>MethodParameter</code>；</p><p>单元测试类如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void test() throws Exception {</span></span>
<span class="line"><span>    HandlerMethodReturnValueHandlerComposite composite = new HandlerMethodReturnValueHandlerComposite();</span></span>
<span class="line"><span>    composite.addReturnValueHandler(new ModelMethodReturnValueHandler());</span></span>
<span class="line"><span>    composite.addReturnValueHandler(new MapMethodReturnValueHandler());</span></span>
<span class="line"><span>    composite.addReturnValueHandler(new ResponseBodyMethodReturnValueHandler());</span></span>
<span class="line"><span>    composite.addReturnValueHandler(new ViewMethodReturnValueHandler());</span></span>
<span class="line"><span>    composite.addReturnValueHandler(new ViewNameMethodReturnValueHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ModelAndViewContainer mvContainer = new ModelAndViewContainer();</span></span>
<span class="line"><span>    TestReturnValueController controller = new TestReturnValueController();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //测试方法testViewName</span></span>
<span class="line"><span>    Method viewNameMethod = controller.getClass().getMethod(&quot;testViewName&quot;);</span></span>
<span class="line"><span>    MethodParameter viewNameMethodParameter = new MethodParameter(viewNameMethod, -1); //取得返回值的MethodParameter</span></span>
<span class="line"><span>    composite.handleReturnValue(controller.testViewName(), viewNameMethodParameter, mvContainer, null, null);</span></span>
<span class="line"><span>    Assert.assertEquals(mvContainer.getViewName(), &quot;/jsp/index.jsp&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //测试方法testView</span></span>
<span class="line"><span>    Method viewMethod = controller.getClass().getMethod(&quot;testView&quot;);</span></span>
<span class="line"><span>    MethodParameter viewMethodParameter = new MethodParameter(viewMethod, -1);</span></span>
<span class="line"><span>    composite.handleReturnValue(controller.testView(), viewMethodParameter, mvContainer, null, null);</span></span>
<span class="line"><span>    Assert.assertTrue(mvContainer.getView() instanceof View);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //测试方法testResponseBody</span></span>
<span class="line"><span>    Method responseBodyMethod = controller.getClass().getMethod(&quot;testResponseBody&quot;);</span></span>
<span class="line"><span>    MethodParameter resBodyMethodParameter = new MethodParameter(responseBodyMethod, -1);</span></span>
<span class="line"><span>    MockHttpServletResponse response = new MockHttpServletResponse();</span></span>
<span class="line"><span>    composite.handleReturnValue(controller.testResponseBody(), resBodyMethodParameter, mvContainer, null, response);</span></span>
<span class="line"><span>    System.out.println(response.getContentAsString()); //打印出Controller中返回的JSON字符串</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //测试方法testModel</span></span>
<span class="line"><span>    Method modelMethod = controller.getClass().getMethod(&quot;testModel&quot;, Model.class);</span></span>
<span class="line"><span>    MethodParameter modelMethodParameter = new MethodParameter(modelMethod, -1);</span></span>
<span class="line"><span>    composite.handleReturnValue(controller.testModel(mvContainer.getModel()), modelMethodParameter, mvContainer, null, null);</span></span>
<span class="line"><span>    Assert.assertEquals(mvContainer.getModel().getAttribute(&quot;testModel&quot;), &quot;Silently9527&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //测试方法testMap</span></span>
<span class="line"><span>    Method mapMethod = controller.getClass().getMethod(&quot;testMap&quot;);</span></span>
<span class="line"><span>    MethodParameter mapMethodParameter = new MethodParameter(mapMethod, -1);</span></span>
<span class="line"><span>    composite.handleReturnValue(controller.testMap(), mapMethodParameter, mvContainer, null, null);</span></span>
<span class="line"><span>    Assert.assertEquals(mvContainer.getModel().getAttribute(&quot;testMap&quot;), &quot;Silently9527&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>单元测试输出的结果：</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/3815428556-5fcc56d51bf27_articlex" alt=""></p><h4 id="_8-3-总结" tabindex="-1">8.3 总结 <a class="header-anchor" href="#_8-3-总结" aria-label="Permalink to &quot;8.3 总结&quot;">​</a></h4><p>本篇我们完成了5个常用返回值的解析器，支持Handler返回<code>Map</code>、<code> Modle</code>、 <code>View</code>、 <code>ViewName</code>以及被<code>@ResponseBody</code>标注；下一节我们将会开发<code>HandlerAdapter</code>中使用到的最后一个组件，完成之后就可以把所有的组件组装起来完成Handler的调用过程</p><h4 id="_8-4-延展" tabindex="-1">8.4 延展 <a class="header-anchor" href="#_8-4-延展" aria-label="Permalink to &quot;8.4 延展&quot;">​</a></h4><p>大家可以对应的去看看SpringMVC中<code>HandlerMethodReturnValueHandler</code>的实现类，了解SpringMVC支持哪些返回值处理</p>`,44),t=[l];function r(o,i,d,c,u,h){return s(),a("div",null,t)}const v=n(p,[["render",r]]);export{M as __pageData,v as default};
