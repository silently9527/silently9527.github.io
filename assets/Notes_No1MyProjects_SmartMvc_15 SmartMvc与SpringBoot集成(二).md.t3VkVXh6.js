import{_ as n,c as a,o as s,aa as e}from"./chunks/framework.d_Ke7vMG.js";const x=JSON.parse('{"title":"15 SmartMvc与SpringBoot集成(二)","description":"","frontmatter":{"title":"15 SmartMvc与SpringBoot集成(二)","author":"Herman","updateTime":"2021-08-14 13:41","desc":"深入解析SpringMVC核心原理：从手写简易版MVC框架开始(SmartMvc)","categories":"MyProjects","tags":"SpringMvc/MVC","outline":"deep"},"headers":[],"relativePath":"Notes/No1MyProjects/SmartMvc/15 SmartMvc与SpringBoot集成(二).md","filePath":"Notes/No1MyProjects/SmartMvc/15 SmartMvc与SpringBoot集成(二).md","lastUpdated":1723564511000}'),p={name:"Notes/No1MyProjects/SmartMvc/15 SmartMvc与SpringBoot集成(二).md"},t=e(`<p><img src="https://raw.githubusercontent.com/silently9527/images/main/17c04f0ceefb408d83840f858f9e1741%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><p>由于SpringBoot默认的web框架就是SpringMVC，如果我们需要完成与SpringBoot的集成，就需要在IOC容器的基础上定制开发Web容器， 其次，SpringBoot使用的是嵌入式Web服务器，所以我们还需要开发驱动嵌入式Web服务器的容器；本篇主要就来完成这两个功能</p><h4 id="开发步骤讲解" tabindex="-1">开发步骤讲解 <a class="header-anchor" href="#开发步骤讲解" aria-label="Permalink to &quot;开发步骤讲解&quot;">​</a></h4><h5 id="webapplicationcontext" tabindex="-1">WebApplicationContext <a class="header-anchor" href="#webapplicationcontext" aria-label="Permalink to &quot;WebApplicationContext&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface WebApplicationContext extends ApplicationContext {</span></span>
<span class="line"><span>    String ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE = WebApplicationContext.class.getName() + &quot;.ROOT&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ServletContext getServletContext();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>WebApplicationContext</code>是在IOC容器<code>ApplicationContext</code>的基础上来扩展，提供了获取<code>ServletContext</code>的方法；</p><h5 id="configurablewebapplicationcontext" tabindex="-1">ConfigurableWebApplicationContext <a class="header-anchor" href="#configurablewebapplicationcontext" aria-label="Permalink to &quot;ConfigurableWebApplicationContext&quot;">​</a></h5><p>为了让<code>WebApplicationContext</code>具有可配置化的能力，所以定义了<code>ConfigurableWebApplicationContext</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface ConfigurableWebApplicationContext extends WebApplicationContext, ConfigurableApplicationContext {</span></span>
<span class="line"><span>    void setServletContext(ServletContext servletContext);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由于继承了<code>ConfigurableApplicationContext</code>，所以具备了配置基础容器的的功能，所以<code>ConfigurableWebApplicationContext</code> 只需要提供一个配置<code>ServletContext</code>的方法</p><h5 id="web容器的实现类genericwebapplicationcontext" tabindex="-1">Web容器的实现类GenericWebApplicationContext <a class="header-anchor" href="#web容器的实现类genericwebapplicationcontext" aria-label="Permalink to &quot;Web容器的实现类GenericWebApplicationContext&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class GenericWebApplicationContext extends GenericApplicationContext</span></span>
<span class="line"><span>        implements ConfigurableWebApplicationContext {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private ServletContext servletContext;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public GenericWebApplicationContext(ServletContext servletContext) {</span></span>
<span class="line"><span>        this.servletContext = servletContext;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public GenericWebApplicationContext() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void setServletContext(ServletContext servletContext) {</span></span>
<span class="line"><span>        this.servletContext = servletContext;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public ServletContext getServletContext() {</span></span>
<span class="line"><span>        return this.servletContext;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>GenericApplicationContext</code>已经提供了基础容器所有功能的实现，所以我们继承它，只需要实现<code>ServletContext</code>可配置</p><h5 id="servletwebserverapplicationcontext" tabindex="-1">ServletWebServerApplicationContext <a class="header-anchor" href="#servletwebserverapplicationcontext" aria-label="Permalink to &quot;ServletWebServerApplicationContext&quot;">​</a></h5><p>因为我希望在SpringBoot启动的时候就启动一个嵌入式web服务器，所以我们还需要在<code>ConfigurableWebApplicationContext</code>提供创建Web服务器并启动的功能</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ServletWebServerApplicationContext extends GenericWebApplicationContext implements WebServerApplicationContext {</span></span>
<span class="line"><span>    //定义WebServer，这是SpringBoot中的类，有多个实现：Tomcat，jetty等等</span></span>
<span class="line"><span>    private WebServer webServer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ServletWebServerApplicationContext() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public WebServer getWebServer() {</span></span>
<span class="line"><span>        return this.webServer;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //try-catch整个容器的refresh过程，一旦出现任何异常，都需要关闭掉WebServer</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public final void refresh() throws BeansException, IllegalStateException {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            super.refresh();</span></span>
<span class="line"><span>        } catch (RuntimeException ex) {</span></span>
<span class="line"><span>            WebServer webServer = this.webServer;</span></span>
<span class="line"><span>            if (webServer != null) {</span></span>
<span class="line"><span>                webServer.stop();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            throw ex;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //onRefresh是IOC容器提供的方法，允许用户在容器启动过程中做一些事情，这里我们就来创建Web服务器以及启动Web服务器</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void onRefresh() {</span></span>
<span class="line"><span>        super.onRefresh();</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            this.webServer = createWebServer();</span></span>
<span class="line"><span>            this.webServer.start();</span></span>
<span class="line"><span>        } catch (Throwable ex) {</span></span>
<span class="line"><span>            throw new ApplicationContextException(&quot;Unable to start web server&quot;, ex);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //调用ServletWebServerFactory创建Web服务器</span></span>
<span class="line"><span>    private WebServer createWebServer() {</span></span>
<span class="line"><span>        ServletWebServerFactory factory = getBeanFactory().getBean(ServletWebServerFactory.class);</span></span>
<span class="line"><span>        return factory.getWebServer(this::selfInitialize);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //ServletContextInitializer 在Web容器启动完成后会回调此方法，比如：向ServletConext中添加DispatchServlet</span></span>
<span class="line"><span>    private void selfInitialize(ServletContext servletContext) throws ServletException {</span></span>
<span class="line"><span>        prepareWebApplicationContext(servletContext);</span></span>
<span class="line"><span>        Map&lt;String, ServletContextInitializer&gt; beanMaps = getBeanFactory().getBeansOfType(ServletContextInitializer.class);</span></span>
<span class="line"><span>        for (ServletContextInitializer bean : beanMaps.values()) {</span></span>
<span class="line"><span>            bean.onStartup(servletContext);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //在servletContext中保存ApplicationContext，容器中保存servletContext的引用</span></span>
<span class="line"><span>    private void prepareWebApplicationContext(ServletContext servletContext) {</span></span>
<span class="line"><span>        servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, this);</span></span>
<span class="line"><span>        setServletContext(servletContext);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="向servletcontext中注册dispatcherservlet" tabindex="-1">向ServletContext中注册DispatcherServlet <a class="header-anchor" href="#向servletcontext中注册dispatcherservlet" aria-label="Permalink to &quot;向ServletContext中注册DispatcherServlet&quot;">​</a></h5><p>SpringBoot已经提供了很方便的方式来注册Servlet，只需要继承<code>ServletRegistrationBean</code>，查看源码我们会发现这个类的父类是 <code>ServletContextInitializer</code>，在上面我们已经提到了在WebServer创建完成之后会调用<code>ServletContextInitializer</code>的<code>onStartup</code> 方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class SmartMvcDispatcherServletRegistrationBean extends ServletRegistrationBean&lt;DispatcherServlet&gt;</span></span>
<span class="line"><span>        implements DispatcherServletPath {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private final String path; //指定Servlet拦截的路径</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public SmartMvcDispatcherServletRegistrationBean(DispatcherServlet servlet, String path) {</span></span>
<span class="line"><span>        super(servlet);</span></span>
<span class="line"><span>        Assert.notNull(path, &quot;Path must not be null&quot;);</span></span>
<span class="line"><span>        this.path = path;</span></span>
<span class="line"><span>        super.addUrlMappings(getServletUrlMapping());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public String getPath() {</span></span>
<span class="line"><span>        return this.path;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div>`,19),l=[t];function i(c,r,o,v,b,d){return s(),a("div",null,l)}const S=n(p,[["render",i]]);export{x as __pageData,S as default};
