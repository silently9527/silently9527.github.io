import{_ as n,c as s,o as a,aa as p}from"./chunks/framework.d_Ke7vMG.js";const m=JSON.parse('{"title":"03 HandlerMapping拦截器","description":"","frontmatter":{"title":"03 HandlerMapping拦截器","author":"Herman","updateTime":"2021-08-14 13:41","desc":"深入解析SpringMVC核心原理：从手写简易版MVC框架开始(SmartMvc)","categories":"MyProjects","tags":"SpringMvc/MVC","outline":"deep"},"headers":[],"relativePath":"Notes/No1MyProjects/02 SmartMvc/03 HandlerMapping - 拦截器-03handlermapping-拦截器.md","filePath":"Notes/No1MyProjects/02 SmartMvc/03 HandlerMapping - 拦截器-03handlermapping-拦截器.md","lastUpdated":1724595807000}'),e={name:"Notes/No1MyProjects/02 SmartMvc/03 HandlerMapping - 拦截器-03handlermapping-拦截器.md"},t=p(`<p>上一节的内容稍多，所以本小节的内容设置相对简单，主要来实现SmartMVC中的拦截器部分，首先我还是来看下本小节涉及到的类图，以及这些类需要提供的方法</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/2056813523-5fc35eb3cd06c_articlex" alt=""></p><h4 id="_4-1-开发步骤讲解" tabindex="-1">4.1 开发步骤讲解 <a class="header-anchor" href="#_4-1-开发步骤讲解" aria-label="Permalink to &quot;4.1 开发步骤讲解&quot;">​</a></h4><blockquote><p>本节源码所在分支： handlerMapping-interceptor</p></blockquote><h5 id="handlerinterceptor" tabindex="-1">HandlerInterceptor <a class="header-anchor" href="#handlerinterceptor" aria-label="Permalink to &quot;HandlerInterceptor&quot;">​</a></h5><p>首先我们来定义<code>HandlerInterceptor</code>接口，提供了三个方法：</p><ol><li>preHandle: 在执行Handler之前被调用，如果返回的是false，那么Handler就不会在执行</li><li>postHandle: 在Handler执行完成之后被调用，可以获取Handler返回的结果<code>ModelAndView</code></li><li>afterCompletion: 该方法是无论什么情况下都会被调用，比如：<code>preHandle</code>返回false，Handler执行过程中抛出异常，Handler正常执行完成</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface HandlerInterceptor {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    default boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)</span></span>
<span class="line"><span>            throws Exception {</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    default void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,</span></span>
<span class="line"><span>                            @Nullable ModelAndView modelAndView) throws Exception {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    default void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,</span></span>
<span class="line"><span>                                 @Nullable Exception ex) throws Exception {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="mappedinterceptor" tabindex="-1">MappedInterceptor <a class="header-anchor" href="#mappedinterceptor" aria-label="Permalink to &quot;MappedInterceptor&quot;">​</a></h5><p>我们都知道通常拦截器是需要设置对哪些URL生效的，但是从上面的拦截器接口定义我们没看到类设置，为了达到配置与业务的分离，所以我们又建立<code>MappedInterceptor</code>。<code>MappedInterceptor</code>所需要完成的功能：</p><ol><li>作为真正<code>HandlerInterceptor</code>的代理类，所以需要继承于<code>HandlerInterceptor</code>，实现<code>HandlerInterceptor</code>的三个接口，并且内部需要包含真正<code>HandlerInterceptor</code>的实例</li><li>管理<code>interceptor</code>对哪些URL生效，排除哪些URL</li><li>提供match功能，调用方传入path，判断当前<code>HandlerInterceptor</code>是否支持本次请求。该功能简单实现，只支持path的完整匹配，需要了解更复杂的匹配请查看SpringMVC中的<code>MappedInterceptor</code></li></ol><p>完整代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MappedInterceptor implements HandlerInterceptor {</span></span>
<span class="line"><span>    private List&lt;String&gt; includePatterns = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    private List&lt;String&gt; excludePatterns = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private HandlerInterceptor interceptor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public MappedInterceptor(HandlerInterceptor interceptor) {</span></span>
<span class="line"><span>        this.interceptor = interceptor;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 添加支持的path</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param patterns</span></span>
<span class="line"><span>     * @return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public MappedInterceptor addIncludePatterns(String... patterns) {</span></span>
<span class="line"><span>        this.includePatterns.addAll(Arrays.asList(patterns));</span></span>
<span class="line"><span>        return this;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 添加排除的path</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param patterns</span></span>
<span class="line"><span>     * @return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public MappedInterceptor addExcludePatterns(String... patterns) {</span></span>
<span class="line"><span>        this.excludePatterns.addAll(Arrays.asList(patterns));</span></span>
<span class="line"><span>        return this;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 根据传入的path, 判断当前的interceptor是否支持</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param lookupPath</span></span>
<span class="line"><span>     * @return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public boolean matches(String lookupPath) {</span></span>
<span class="line"><span>        if (!CollectionUtils.isEmpty(this.excludePatterns)) {</span></span>
<span class="line"><span>            if (excludePatterns.contains(lookupPath)) {</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (ObjectUtils.isEmpty(this.includePatterns)) {</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (includePatterns.contains(lookupPath)) {</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)</span></span>
<span class="line"><span>            throws Exception {</span></span>
<span class="line"><span>        return this.interceptor.preHandle(request, response, handler);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,</span></span>
<span class="line"><span>                           @Nullable ModelAndView modelAndView) throws Exception {</span></span>
<span class="line"><span>        this.interceptor.postHandle(request, response, handler, modelAndView);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,</span></span>
<span class="line"><span>                                @Nullable Exception ex) throws Exception {</span></span>
<span class="line"><span>        this.interceptor.afterCompletion(request, response, handler, ex);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="interceptorregistry" tabindex="-1">InterceptorRegistry <a class="header-anchor" href="#interceptorregistry" aria-label="Permalink to &quot;InterceptorRegistry&quot;">​</a></h5><p>现在我们已经开发完了处理拦截业务逻辑的接口<code>HandlerInterceptor</code>，管理<code>HandlerInterceptor</code>与请求路径的映射关联类<code>MappedInterceptor</code>，我们还缺少一个拦截器的注册中心管理所有的拦截器，试想下如果没有这个，那么当需要获取项目中所有拦截器的时候就会很难受，所以我们还需要建了一个<code>InterceptorRegistry</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class InterceptorRegistry {</span></span>
<span class="line"><span>    private List&lt;MappedInterceptor&gt; mappedInterceptors = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 注册一个拦截器到Registry</span></span>
<span class="line"><span>     * @param interceptor</span></span>
<span class="line"><span>     * @return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public MappedInterceptor addInterceptor(HandlerInterceptor interceptor) {</span></span>
<span class="line"><span>        MappedInterceptor mappedInterceptor = new MappedInterceptor(interceptor);</span></span>
<span class="line"><span>        mappedInterceptors.add(mappedInterceptor);</span></span>
<span class="line"><span>        return mappedInterceptor;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public List&lt;MappedInterceptor&gt; getMappedInterceptors() {</span></span>
<span class="line"><span>        return mappedInterceptors;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="_4-2-单元测试" tabindex="-1">4.2 单元测试 <a class="header-anchor" href="#_4-2-单元测试" aria-label="Permalink to &quot;4.2 单元测试&quot;">​</a></h4><p>到此我们拦截器的功能都开发完，虽然简单，但是我们还是需要做一些单元测试，测试用例：</p><ol><li>创建一个拦截器的实现，能够正常的注册到<code>InterceptorRegistry</code></li><li>能够为注册的拦截器设置支持URL和排除的URL</li><li>测试拦截器的match方法是否正确</li></ol><p>拦截器的实现类<code>TestHandlerInterceptor</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class TestHandlerInterceptor implements HandlerInterceptor {</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>根据刚才写的单元测试用例编写单元测试：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class HandlerInterceptorTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private InterceptorRegistry interceptorRegistry = new InterceptorRegistry();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void test() throws Exception {</span></span>
<span class="line"><span>        TestHandlerInterceptor interceptor = new TestHandlerInterceptor();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        interceptorRegistry.addInterceptor(interceptor)</span></span>
<span class="line"><span>                .addExcludePatterns(&quot;/ex_test&quot;)</span></span>
<span class="line"><span>                .addIncludePatterns(&quot;/in_test&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        List&lt;MappedInterceptor&gt; interceptors = interceptorRegistry.getMappedInterceptors();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Assert.assertEquals(interceptors.size(), 1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        MappedInterceptor mappedInterceptor = interceptors.get(0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Assert.assertTrue(mappedInterceptor.matches(&quot;/in_test&quot;));</span></span>
<span class="line"><span>        Assert.assertFalse(mappedInterceptor.matches(&quot;/ex_test&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        mappedInterceptor.preHandle(null, null, null);</span></span>
<span class="line"><span>        mappedInterceptor.postHandle(null, null, null, null);</span></span>
<span class="line"><span>        mappedInterceptor.afterCompletion(null, null, null, null);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行的结果：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/2823792745-5fc36b8194b78_articlex" alt=""></p><h4 id="_4-3-本节小结" tabindex="-1">4.3 本节小结 <a class="header-anchor" href="#_4-3-本节小结" aria-label="Permalink to &quot;4.3 本节小结&quot;">​</a></h4><p>本节我们完成了拦截器相关逻辑的开发，如果有面试官问<code>HandlerInterceptor</code>中的<code>afterCompletion</code>方法在哪些情况下会执行，我们应该能回答了</p><h4 id="_4-4-延展" tabindex="-1">4.4 延展 <a class="header-anchor" href="#_4-4-延展" aria-label="Permalink to &quot;4.4 延展&quot;">​</a></h4><p>本节实现的拦截器和SpringMVC提供的拦截器有些许差别，功能也不如SpringMVC的强大，大家可以对比着看看，加深对SpringMVC拦截器的理解</p>`,29),l=[t];function r(i,c,o,d,u,h){return a(),s("div",null,l)}const b=n(e,[["render",r]]);export{m as __pageData,b as default};
