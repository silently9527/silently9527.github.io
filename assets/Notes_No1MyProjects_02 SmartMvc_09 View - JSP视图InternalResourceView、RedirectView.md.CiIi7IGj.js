import{_ as s,c as n,o as a,aa as e}from"./chunks/framework.d_Ke7vMG.js";const q=JSON.parse('{"title":"09 视图","description":"","frontmatter":{"title":"09 视图","author":"Herman","updateTime":"2021-08-14 13:41","desc":"深入解析SpringMVC核心原理：从手写简易版MVC框架开始(SmartMvc)","categories":"MyProjects","tags":"SpringMvc/MVC","outline":"deep"},"headers":[],"relativePath":"Notes/No1MyProjects/02 SmartMvc/09 View - JSP视图InternalResourceView、RedirectView.md","filePath":"Notes/No1MyProjects/02 SmartMvc/09 View - JSP视图InternalResourceView、RedirectView.md","lastUpdated":1724593073000}'),p={name:"Notes/No1MyProjects/02 SmartMvc/09 View - JSP视图InternalResourceView、RedirectView.md"},t=e(`<p>上一篇我们结束了<code>HandlerAdapter</code>各个组件的开发任务，本篇我们将开始研发视图的渲染；先看看类图</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/71c3c04a7b9941e6970489ac1fa3c0ab%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><p>本篇我们先完成jsp视图的渲染以及重定向视图的渲染；在整个项目开发完成之后，我们再通过自定义视图的方式开发Excel视图和JSON视图。</p><h4 id="_11-1-开发步骤讲解" tabindex="-1">11.1 开发步骤讲解 <a class="header-anchor" href="#_11-1-开发步骤讲解" aria-label="Permalink to &quot;11.1 开发步骤讲解&quot;">​</a></h4><blockquote><p>本节源代码的分支：view</p></blockquote><h5 id="view" tabindex="-1">View <a class="header-anchor" href="#view" aria-label="Permalink to &quot;View&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface View {</span></span>
<span class="line"><span>    default String getContentType() {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    void render(Map&lt;String, Object&gt; model, HttpServletRequest request, HttpServletResponse response) throws Exception;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>首先我们开定义出视图的接口<code>View</code></p><ul><li>getContentType: 控制视图支持的ContentType是什么，默认是返回空</li><li>render: 通过response把model中的数据渲染成视图返回给用户</li></ul><h5 id="abstractview" tabindex="-1">AbstractView <a class="header-anchor" href="#abstractview" aria-label="Permalink to &quot;AbstractView&quot;">​</a></h5><p>因为视图可以有很多的实现类，比如：JSON、JSP、HTML、各类模板等等，所以我们定义一个抽象类<code>AbstractView</code>，通过模板方法定义出渲染的基本流程</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class AbstractView implements View {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void render(Map&lt;String, Object&gt; model, HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span>        this.prepareResponse(request, response);</span></span>
<span class="line"><span>        this.renderMergedOutputModel(model, request, response);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    protected void prepareResponse(HttpServletRequest request, HttpServletResponse response) {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    protected abstract void renderMergedOutputModel(</span></span>
<span class="line"><span>            Map&lt;String, Object&gt; model, HttpServletRequest request, HttpServletResponse response) throws Exception;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>prepareResponse: 在实施渲染之前需要做的一些工作放入到这个方法中，比如：设置响应的头信息</li><li>renderMergedOutputModel: 执行渲染的逻辑都将放入到这个方法中</li></ul><h5 id="redirectview" tabindex="-1">RedirectView <a class="header-anchor" href="#redirectview" aria-label="Permalink to &quot;RedirectView&quot;">​</a></h5><p>当在控制器中返回的视图名是以<code>redirect:</code>开头的都将视为重定向视图；</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RedirectView extends AbstractView {</span></span>
<span class="line"><span>    private String url;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public RedirectView(String url) {</span></span>
<span class="line"><span>        this.url = url;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void renderMergedOutputModel(Map&lt;String, Object&gt; model, HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span>        String targetUrl = createTargetUrl(model, request);</span></span>
<span class="line"><span>        response.sendRedirect(targetUrl);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * model中的数据添加到URL后面作为参数</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param model</span></span>
<span class="line"><span>     * @param request</span></span>
<span class="line"><span>     * @return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private String createTargetUrl(Map&lt;String, Object&gt; model, HttpServletRequest request) {</span></span>
<span class="line"><span>        Assert.notNull(this.url, &quot;url can not null&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        StringBuilder queryParams = new StringBuilder();</span></span>
<span class="line"><span>        model.forEach((key, value) -&gt; {</span></span>
<span class="line"><span>            queryParams.append(key).append(&quot;=&quot;).append(value).append(&quot;&amp;&quot;);</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>        if (queryParams.length() &gt; 0) {</span></span>
<span class="line"><span>            queryParams.deleteCharAt(queryParams.length() - 1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        StringBuilder targetUrl = new StringBuilder();</span></span>
<span class="line"><span>        if (this.url.startsWith(&quot;/&quot;)) {</span></span>
<span class="line"><span>            // Do not apply context path to relative URLs.</span></span>
<span class="line"><span>            targetUrl.append(getContextPath(request));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        targetUrl.append(url);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (queryParams.length() &gt; 0) {</span></span>
<span class="line"><span>            targetUrl.append(&quot;?&quot;).append(queryParams.toString());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return targetUrl.toString();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String getContextPath(HttpServletRequest request) {</span></span>
<span class="line"><span>        String contextPath = request.getContextPath();</span></span>
<span class="line"><span>        while (contextPath.startsWith(&quot;//&quot;)) {</span></span>
<span class="line"><span>            contextPath = contextPath.substring(1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return contextPath;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getUrl() {</span></span>
<span class="line"><span>        return url;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li>重定向视图需要继承于<code>AbstractView</code></li><li>定义url，表示重定向的地址，实际也就是控制器中返回的视图名截取<code>redirect:</code>之后的字符串</li><li>createTargetUrl: 根据url拼接出重定向的地址，如果有设置<code>contentPath</code>，需要把<code>contentPath</code>拼接到链接的前面；如果Model中有属性值，需要把model中的属性值拼接到链接后面</li></ol><h5 id="internalresourceview" tabindex="-1">InternalResourceView <a class="header-anchor" href="#internalresourceview" aria-label="Permalink to &quot;InternalResourceView&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class InternalResourceView extends AbstractView {</span></span>
<span class="line"><span>    private String url;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public InternalResourceView(String url) {</span></span>
<span class="line"><span>        this.url = url;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public String getContentType() {</span></span>
<span class="line"><span>        return &quot;text/html&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void renderMergedOutputModel(</span></span>
<span class="line"><span>            Map&lt;String, Object&gt; model, HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span>        exposeModelAsRequestAttributes(model, request);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        RequestDispatcher rd = request.getRequestDispatcher(this.url);</span></span>
<span class="line"><span>        rd.forward(request, response);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 把model中的数据放入到request</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param model</span></span>
<span class="line"><span>     * @param request</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void exposeModelAsRequestAttributes(Map&lt;String, Object&gt; model, HttpServletRequest request) {</span></span>
<span class="line"><span>        model.forEach((name, value) -&gt; {</span></span>
<span class="line"><span>            if (Objects.nonNull(value)) {</span></span>
<span class="line"><span>                request.setAttribute(name, value);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                request.removeAttribute(name);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getUrl() {</span></span>
<span class="line"><span>        return url;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li><code>InternalResourceView</code>需要支持JSP、HTML的渲染</li><li>url: 表示JSP文件的路径</li><li>exposeModelAsRequestAttributes: 该方法把Model中的数据全部设置到了request中，方便在JSP中通过el表达式取值</li></ol><h4 id="_11-2-单元测试" tabindex="-1">11.2 单元测试 <a class="header-anchor" href="#_11-2-单元测试" aria-label="Permalink to &quot;11.2 单元测试&quot;">​</a></h4><p>本次单元测试我们先只测试<code>RedirectView</code>，<code>InternalResourceView</code>放在后面整体测试；</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void test() throws Exception {</span></span>
<span class="line"><span>    MockHttpServletRequest request = new MockHttpServletRequest();</span></span>
<span class="line"><span>    request.setContextPath(&quot;/path&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    MockHttpServletResponse response = new MockHttpServletResponse();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Map&lt;String, Object&gt; model = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>    model.put(&quot;name&quot;, &quot;silently9527&quot;);</span></span>
<span class="line"><span>    model.put(&quot;url&quot;, &quot;http://silently9527.cn&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    RedirectView redirectView = new RedirectView(&quot;/redirect/login&quot;);</span></span>
<span class="line"><span>    redirectView.render(model, request, response);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    response.getHeaderNames().forEach(headerName -&gt;</span></span>
<span class="line"><span>            System.out.println(headerName + &quot;:&quot; + response.getHeader(headerName)));</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li>检查重定向地址是否有拼接上ContextPath</li><li>检查重定向地址是否有拼接上model中的数据</li></ol><p>输出结果：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/fc647a07ac884d6b9f990c1a1ffc900d%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><h4 id="_11-3-总结" tabindex="-1">11.3 总结 <a class="header-anchor" href="#_11-3-总结" aria-label="Permalink to &quot;11.3 总结&quot;">​</a></h4><p>本篇我们完成了<code>RedirectView</code>、<code>InternalResourceView</code>视图，后期通过自定义视图的方式实现excel视图；下一篇我们将开始开发视图的解析器<code>ViewResolver</code></p><h4 id="_11-4-延展" tabindex="-1">11.4 延展 <a class="header-anchor" href="#_11-4-延展" aria-label="Permalink to &quot;11.4 延展&quot;">​</a></h4><p>springMVC中的视图<code>MappingJackson2JsonView</code>、<code>FreeMarkerView</code>、<code>MustacheView</code>实现逻辑类似，可以对照着看看源码</p>`,30),l=[t];function i(r,c,o,d,u,h){return a(),n("div",null,l)}const m=s(p,[["render",i]]);export{q as __pageData,m as default};
