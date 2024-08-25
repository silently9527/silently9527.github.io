import{_ as s,c as n,o as a,aa as e}from"./chunks/framework.d_Ke7vMG.js";const V=JSON.parse('{"title":"10 ViewResolver视图解析器","description":"","frontmatter":{"title":"10 ViewResolver视图解析器","author":"Herman","updateTime":"2021-08-14 13:41","desc":"深入解析SpringMVC核心原理：从手写简易版MVC框架开始(SmartMvc)","categories":"MyProjects","tags":"SpringMvc/MVC","outline":"deep"},"headers":[],"relativePath":"Notes/No1MyProjects/02 SmartMvc/10 ViewResolver - 视图解析器-10viewresolver-视图解析器.md","filePath":"Notes/No1MyProjects/02 SmartMvc/10 ViewResolver - 视图解析器-10viewresolver-视图解析器.md","lastUpdated":1724595807000}'),p={name:"Notes/No1MyProjects/02 SmartMvc/10 ViewResolver - 视图解析器-10viewresolver-视图解析器.md"},i=e(`<p>在SpringMVC中ViewResolver组件会将viewName解析成View对象，View对象再调用render完成结果的渲染。在上一篇已经完成了View的开发，本篇来完成ViewResolver研发。</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/309bc21a52834936aaa26f27229b932e%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><p>我们主要开发两个视图的解析器<code>InternalResourceViewResolver</code>和<code>ContentNegotiatingViewResolver</code>；</p><h4 id="_12-1-开发步骤讲解" tabindex="-1">12.1 开发步骤讲解 <a class="header-anchor" href="#_12-1-开发步骤讲解" aria-label="Permalink to &quot;12.1 开发步骤讲解&quot;">​</a></h4><blockquote><p>本节源代码的分支：viewResolver</p></blockquote><h4 id="viewresolver" tabindex="-1">ViewResolver <a class="header-anchor" href="#viewresolver" aria-label="Permalink to &quot;ViewResolver&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface ViewResolver {</span></span>
<span class="line"><span>    View resolveViewName(String viewName) throws Exception;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>首先我们来定义视图解析器的接口<code>ViewResolver</code>，因为<code>ViewResolver</code>组件的作用是将viewName解析成View对象，所以参数是viewName，处理完成后返回的对象是View</p><h4 id="abstractcachingviewresolver" tabindex="-1">AbstractCachingViewResolver <a class="header-anchor" href="#abstractcachingviewresolver" aria-label="Permalink to &quot;AbstractCachingViewResolver&quot;">​</a></h4><p>因为启动一直一般会运行很长时间，很多用户都会请求同一个视图名称，为了避免每次都需要把viewName解析成View，所以我们需要做一层缓存，当有一次成功解析了viewName之后我们把返回的<code>View</code>缓存起来，下次直接先从缓存中取</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class AbstractCachingViewResolver implements ViewResolver {</span></span>
<span class="line"><span>    private final Object lock = new Object();</span></span>
<span class="line"><span>    private static final View UNRESOLVED_VIEW = (model, request, response) -&gt; {</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>    private Map&lt;String, View&gt; cachedViews = new HashMap&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public View resolveViewName(String viewName) throws Exception {</span></span>
<span class="line"><span>        View view = cachedViews.get(viewName);</span></span>
<span class="line"><span>        if (Objects.nonNull(view)) {</span></span>
<span class="line"><span>            return (view != UNRESOLVED_VIEW ? view : null);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        synchronized (lock) {</span></span>
<span class="line"><span>            view = cachedViews.get(viewName);</span></span>
<span class="line"><span>            if (Objects.nonNull(view)) {</span></span>
<span class="line"><span>                return (view != UNRESOLVED_VIEW ? view : null);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            view = createView(viewName);</span></span>
<span class="line"><span>            if (Objects.isNull(view)) {</span></span>
<span class="line"><span>                view = UNRESOLVED_VIEW;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            cachedViews.put(viewName, view);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return (view != UNRESOLVED_VIEW ? view : null);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    protected abstract View createView(String viewName);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li>定义一个默认的空视图<code>UNRESOLVED_VIEW</code>，当通过<code>viewName</code>解析不到视图返回null时，把默认的视图放入到缓存中</li><li>由于可能存在同一时刻多个用户请求到同一个视图，所以需要使用<code>synchronized</code>加锁</li><li>如果缓存中获取到的视图是<code>UNRESOLVED_VIEW</code>，那么就返回null</li></ol><h4 id="urlbasedviewresolver" tabindex="-1">UrlBasedViewResolver <a class="header-anchor" href="#urlbasedviewresolver" aria-label="Permalink to &quot;UrlBasedViewResolver&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class UrlBasedViewResolver extends AbstractCachingViewResolver {</span></span>
<span class="line"><span>    public static final String REDIRECT_URL_PREFIX = &quot;redirect:&quot;;</span></span>
<span class="line"><span>    public static final String FORWARD_URL_PREFIX = &quot;forward:&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String prefix = &quot;&quot;;</span></span>
<span class="line"><span>    private String suffix = &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected View createView(String viewName) {</span></span>
<span class="line"><span>        if (viewName.startsWith(REDIRECT_URL_PREFIX)) {</span></span>
<span class="line"><span>            String redirectUrl = viewName.substring(REDIRECT_URL_PREFIX.length());</span></span>
<span class="line"><span>            return new RedirectView(redirectUrl);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (viewName.startsWith(FORWARD_URL_PREFIX)) {</span></span>
<span class="line"><span>            String forwardUrl = viewName.substring(FORWARD_URL_PREFIX.length());</span></span>
<span class="line"><span>            return new InternalResourceView(forwardUrl);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return buildView(viewName);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    protected abstract View buildView(String viewName);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //getter setter省略</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li>当viewName以<code>redirect:</code>开头，那么返回<code>RedirectView</code>视图</li><li>当viewName以<code>forward:</code>开头，那么返回<code>InternalResourceView</code>视图</li><li>如果都不是，那么就执行模板方法<code>buildView</code></li></ol><h4 id="internalresourceviewresolver" tabindex="-1">InternalResourceViewResolver <a class="header-anchor" href="#internalresourceviewresolver" aria-label="Permalink to &quot;InternalResourceViewResolver&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class InternalResourceViewResolver extends UrlBasedViewResolver {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected View buildView(String viewName) {</span></span>
<span class="line"><span>        String url = getPrefix() + viewName + getSuffix();</span></span>
<span class="line"><span>        return new InternalResourceView(url);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>实现了<code>UrlBasedViewResolver</code>中的模板方法<code>buildView</code>，拼接了url的前缀和后缀，返回视图<code>InternalResourceView</code></p><h4 id="contentnegotiatingviewresolver" tabindex="-1">ContentNegotiatingViewResolver <a class="header-anchor" href="#contentnegotiatingviewresolver" aria-label="Permalink to &quot;ContentNegotiatingViewResolver&quot;">​</a></h4><p>视图协同器<code>ContentNegotiatingViewResolver</code>定义了所有<code>ViewResolver</code>以及默认支持的<code>View</code>，当接收到用户的请求后根据头信息中的<code>Accept</code>匹配出最优的视图</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ContentNegotiatingViewResolver implements ViewResolver, InitializingBean {</span></span>
<span class="line"><span>    private List&lt;ViewResolver&gt; viewResolvers;</span></span>
<span class="line"><span>    private List&lt;View&gt; defaultViews;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public View resolveViewName(String viewName) throws Exception {</span></span>
<span class="line"><span>        List&lt;View&gt; candidateViews = getCandidateViews(viewName);</span></span>
<span class="line"><span>        View bestView = getBestView(candidateViews);</span></span>
<span class="line"><span>        if(Objects.nonNull(bestView)){</span></span>
<span class="line"><span>            return bestView;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 根据请求找出最优视图</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param candidateViews</span></span>
<span class="line"><span>     * @return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private View getBestView(List&lt;View&gt; candidateViews) {</span></span>
<span class="line"><span>        Optional&lt;View&gt; viewOptional = candidateViews.stream()</span></span>
<span class="line"><span>                .filter(view -&gt; view instanceof RedirectView)</span></span>
<span class="line"><span>                .findAny();</span></span>
<span class="line"><span>        if (viewOptional.isPresent()) {</span></span>
<span class="line"><span>            return viewOptional.get();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        HttpServletRequest request = RequestContextHolder.getRequest();</span></span>
<span class="line"><span>        Enumeration&lt;String&gt; acceptHeaders = request.getHeaders(&quot;Accept&quot;);</span></span>
<span class="line"><span>        while (acceptHeaders.hasMoreElements()) {</span></span>
<span class="line"><span>            for (View view : candidateViews) {</span></span>
<span class="line"><span>                if (acceptHeaders.nextElement().equals(view.getContentType())) {</span></span>
<span class="line"><span>                    return view;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 先找出所有候选视图</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param viewName</span></span>
<span class="line"><span>     * @return</span></span>
<span class="line"><span>     * @throws Exception</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private List&lt;View&gt; getCandidateViews(String viewName) throws Exception {</span></span>
<span class="line"><span>        List&lt;View&gt; candidateViews = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>        for (ViewResolver viewResolver : viewResolvers) {</span></span>
<span class="line"><span>            View view = viewResolver.resolveViewName(viewName);</span></span>
<span class="line"><span>            if (Objects.nonNull(view)) {</span></span>
<span class="line"><span>                candidateViews.add(view);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (!CollectionUtils.isEmpty(defaultViews)) {</span></span>
<span class="line"><span>            candidateViews.addAll(defaultViews);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return candidateViews;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void afterPropertiesSet() throws Exception {</span></span>
<span class="line"><span>        Assert.notNull(viewResolvers, &quot;viewResolvers can not null&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //getter setter 省略</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li>getCandidateViews: 通过视图名字使用<code>ViewResolver</code>解析出所有不为null的视图，如果默认视图不为空，把所有视图返回作为候选视图</li><li>getBestView: 从request中拿出头信息<code>Accept</code>，根据视图的ContentType从候选视图中匹配出最优的视图返回</li></ol><p>在这里我们还使用到了一个工具类<code>RequestContextHolder</code>，在当前线程中存放了当前请求的<code>HttpServletRequest</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class RequestContextHolder {</span></span>
<span class="line"><span>    private static final ThreadLocal&lt;HttpServletRequest&gt; inheritableRequestHolder =</span></span>
<span class="line"><span>            new NamedInheritableThreadLocal&lt;&gt;(&quot;Request context&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Reset the HttpServletRequest for the current thread.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void resetRequest() {</span></span>
<span class="line"><span>        inheritableRequestHolder.remove();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void setRequest(HttpServletRequest request) {</span></span>
<span class="line"><span>        inheritableRequestHolder.set(request);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static HttpServletRequest getRequest() {</span></span>
<span class="line"><span>        return inheritableRequestHolder.get();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="_12-2-单元测试" tabindex="-1">12.2 单元测试 <a class="header-anchor" href="#_12-2-单元测试" aria-label="Permalink to &quot;12.2 单元测试&quot;">​</a></h4><p>到此本篇所有的视图解析器都已经完成，本篇的单元测试我们主要测试<code>ContentNegotiatingViewResolver</code>，检查能否正确的返回视图对象</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void resolveViewName() throws Exception {</span></span>
<span class="line"><span>    ContentNegotiatingViewResolver negotiatingViewResolver = new ContentNegotiatingViewResolver();</span></span>
<span class="line"><span>    negotiatingViewResolver.setViewResolvers(Collections.singletonList(new InternalResourceViewResolver()));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    MockHttpServletRequest request = new MockHttpServletRequest();</span></span>
<span class="line"><span>    request.addHeader(&quot;Accept&quot;, &quot;text/html&quot;);</span></span>
<span class="line"><span>    RequestContextHolder.setRequest(request);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    View redirectView = negotiatingViewResolver.resolveViewName(&quot;redirect:/silently9527.cn&quot;);</span></span>
<span class="line"><span>    Assert.assertTrue(redirectView instanceof RedirectView); //判断是否返回重定向视图</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    View forwardView = negotiatingViewResolver.resolveViewName(&quot;forward:/silently9527.cn&quot;);</span></span>
<span class="line"><span>    Assert.assertTrue(forwardView instanceof InternalResourceView); //</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    View view = negotiatingViewResolver.resolveViewName(&quot;/silently9527.cn&quot;);</span></span>
<span class="line"><span>    Assert.assertTrue(view instanceof InternalResourceView); //通过头信息\`Accept\`，判断是否返回的\`InternalResourceView\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行的结果如下：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/338a80ee712d4e589f3b5e4175c1dfd4%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><h4 id="_12-3-总结" tabindex="-1">12.3 总结 <a class="header-anchor" href="#_12-3-总结" aria-label="Permalink to &quot;12.3 总结&quot;">​</a></h4><p>本篇我们完成了<code>ViewResolver</code>，相信大家对springmvc的视图解析过程也有了一定的了解，下篇我们将开始研发<code>DispatcherServlet</code>，把我们之前开发完成的HandlerMapping、HandlerAdapter等组件串联起来使用。</p><h4 id="_12-4-延展" tabindex="-1">12.4 延展 <a class="header-anchor" href="#_12-4-延展" aria-label="Permalink to &quot;12.4 延展&quot;">​</a></h4><p>本篇完成后可以对照着去springmvc中的视图解析器，比如：<code>ContentNegotiatingViewResolver</code>、<code>BeanNameViewResolver</code>、<code>XmlViewResolver</code>等，特别是<code>ContentNegotiatingViewResolver</code>，我们自己实现的是简版，springmvc的支持头信息，url后缀等方法。</p>`,33),l=[i];function t(c,r,o,d,w,v){return a(),n("div",null,l)}const g=s(p,[["render",t]]);export{V as __pageData,g as default};
