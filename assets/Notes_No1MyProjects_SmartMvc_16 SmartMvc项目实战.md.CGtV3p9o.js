import{_ as s,c as a,o as n,aa as e}from"./chunks/framework.d_Ke7vMG.js";const h=JSON.parse('{"title":"16 SmartMvc项目实战","description":"","frontmatter":{"title":"16 SmartMvc项目实战","author":"Herman","updateTime":"2021-08-14 13:41","desc":"深入解析SpringMVC核心原理：从手写简易版MVC框架开始(SmartMvc)","categories":"MyProjects","tags":"SpringMvc/MVC","outline":"deep"},"headers":[],"relativePath":"Notes/No1MyProjects/SmartMvc/16 SmartMvc项目实战.md","filePath":"Notes/No1MyProjects/SmartMvc/16 SmartMvc项目实战.md","lastUpdated":1723564511000}'),p={name:"Notes/No1MyProjects/SmartMvc/16 SmartMvc项目实战.md"},t=e(`<p>SmartMVC基本都功能都已完成，接下来我们就来做一个SmartMVC的项目实战，测试下SmartMVC是否能正常的工作。</p><h3 id="springboot项目中引入smartmvc的步骤" tabindex="-1">SpringBoot项目中引入SmartMVC的步骤 <a class="header-anchor" href="#springboot项目中引入smartmvc的步骤" aria-label="Permalink to &quot;SpringBoot项目中引入SmartMVC的步骤&quot;">​</a></h3><h4 id="_1-新建一个springboot项目-在pom-xml中加入smartmvc的starter" tabindex="-1">1. 新建一个SpringBoot项目，在pom.xml中加入SmartMVC的starter <a class="header-anchor" href="#_1-新建一个springboot项目-在pom-xml中加入smartmvc的starter" aria-label="Permalink to &quot;1. 新建一个SpringBoot项目，在pom.xml中加入SmartMVC的starter&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.silently9527&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;smartmvc-springboot-starter&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;1.0.0-SNAPSHOT&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h4 id="_2-修改springboot生成的启动类-指定smartmvc的applicationcontextclass" tabindex="-1">2. 修改SpringBoot生成的启动类，指定SmartMVC的<code>ApplicationContextClass</code> <a class="header-anchor" href="#_2-修改springboot生成的启动类-指定smartmvc的applicationcontextclass" aria-label="Permalink to &quot;2. 修改SpringBoot生成的启动类，指定SmartMVC的\`ApplicationContextClass\`&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@SpringBootApplication</span></span>
<span class="line"><span>public class SmartmvcSpringbootDemoApplication {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        SpringApplication application = new SpringApplication(SmartmvcSpringbootDemoApplication.class);</span></span>
<span class="line"><span>        application.setApplicationContextClass(ServletWebServerApplicationContext.class);</span></span>
<span class="line"><span>        application.run(args);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="功能验证" tabindex="-1">功能验证 <a class="header-anchor" href="#功能验证" aria-label="Permalink to &quot;功能验证&quot;">​</a></h3><ol><li>验证重定向</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//http://localhost:7979/user/redirect</span></span>
<span class="line"><span>@RequestMapping(path = &quot;/redirect&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>public String redirect() {</span></span>
<span class="line"><span>    return &quot;redirect:http://silently9527.cn&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>自定义参数解析器</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Configuration</span></span>
<span class="line"><span>public class MyWebMvcConfigurer implements WebMvcConfigurer {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void addArgumentResolvers(List&lt;HandlerMethodArgumentResolver&gt; argumentResolvers) {</span></span>
<span class="line"><span>        argumentResolvers.add(new MyHandlerMethodArgumentResolver());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target(ElementType.PARAMETER)</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>public @interface MyUserParam {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String name();</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MyHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean supportsParameter(MethodParameter parameter) {</span></span>
<span class="line"><span>        return parameter.hasParameterAnnotation(MyUserParam.class);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object resolveArgument(MethodParameter parameter, HttpServletRequest request,</span></span>
<span class="line"><span>                                  HttpServletResponse response, ModelAndViewContainer container,</span></span>
<span class="line"><span>                                  ConversionService conversionService) throws Exception {</span></span>
<span class="line"><span>        MyUserParam annotation = parameter.getParameterAnnotation(MyUserParam.class);</span></span>
<span class="line"><span>        String param = request.getParameter(annotation.name());</span></span>
<span class="line"><span>        String[] split = param.split(&quot;,&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        UserVo userVo = new UserVo();</span></span>
<span class="line"><span>        userVo.setName(split[0]);</span></span>
<span class="line"><span>        userVo.setAge(Integer.valueOf(split[1]));</span></span>
<span class="line"><span>        return userVo;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在控制器中的使用自定义参数解析器</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>    //http://localhost:7979/user/build?user=silently9527,123</span></span>
<span class="line"><span>    @ResponseBody</span></span>
<span class="line"><span>    @RequestMapping(path = &quot;/build&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>    public UserVo build(@MyUserParam(name = &quot;user&quot;) UserVo vo) {</span></span>
<span class="line"><span>        return vo;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><ol start="3"><li>验证RequestParam</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//http://localhost:7979/user/get?userId=123</span></span>
<span class="line"><span>@ResponseBody</span></span>
<span class="line"><span>@RequestMapping(path = &quot;/get&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>public UserVo get(@RequestParam(name = &quot;userId&quot;) Long userId) {</span></span>
<span class="line"><span>    UserVo userVo = new UserVo();</span></span>
<span class="line"><span>    userVo.setName(userId + &quot;_silently9527&quot;);</span></span>
<span class="line"><span>    userVo.setAge(25);</span></span>
<span class="line"><span>    userVo.setBirthday(new Date());</span></span>
<span class="line"><span>    return userVo;</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,17),l=[t];function i(o,r,c,d,u,m){return n(),a("div",null,l)}const v=s(p,[["render",i]]);export{h as __pageData,v as default};
