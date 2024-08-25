import{_ as n,c as a,o as s,aa as e}from"./chunks/framework.DtK4gh9F.js";const h=JSON.parse('{"title":"01 SmartMVC整体规划","description":"","frontmatter":{"title":"01 SmartMVC整体规划","author":"Herman","updateTime":"2021-08-14 13:41","desc":"深入解析SpringMVC核心原理：从手写简易版MVC框架开始(SmartMvc)","categories":"MyProjects","tags":"SpringMvc/MVC","outline":"deep"},"headers":[],"relativePath":"Notes/No1MyProjects/02 SmartMvc/01 SmartMVC整体规划-smartmvc整体规划.md","filePath":"Notes/No1MyProjects/02 SmartMvc/01 SmartMVC整体规划-smartmvc整体规划.md","lastUpdated":1724593073000}'),p={name:"Notes/No1MyProjects/02 SmartMvc/01 SmartMVC整体规划-smartmvc整体规划.md"},t=e(`<h4 id="ide、源码、依赖版本" tabindex="-1">IDE、源码、依赖版本 <a class="header-anchor" href="#ide、源码、依赖版本" aria-label="Permalink to &quot;IDE、源码、依赖版本&quot;">​</a></h4><ul><li>整个开发过程中我使用的IDE都是IDEA，可以根据读者自己习惯选择。当然我推荐是用IDEA</li><li>开发SmartMVC我们需要使用到Spring，我使用的版本<code>5.2.9</code></li><li>开发完成后SmartMVC的源码会放在码云仓库： <a href="https://note.youdao.com/" target="_blank" rel="noreferrer">https://gitee.com/silently9527/smart-mvc.git</a></li><li>JDK的版本1.8</li></ul><h4 id="开发过程中的约定" tabindex="-1">开发过程中的约定 <a class="header-anchor" href="#开发过程中的约定" aria-label="Permalink to &quot;开发过程中的约定&quot;">​</a></h4><ul><li>为了便于用户后期理解和使用SpringMVC，所以在SmartMVC中所有组件的名称都和SpringMVC的保持一致</li><li>为了让SpringMVC的核心流程更加的清晰，减少读者的干扰，我拿出了自己18米的砍刀大胆的砍掉了SpringMVC中很多细节流程，达到去枝干立主脑，让读者能够更加顺畅的理解整个流转的过程</li></ul><h4 id="_3-1-smartmvc总体架构" tabindex="-1">3.1 SmartMVC总体架构 <a class="header-anchor" href="#_3-1-smartmvc总体架构" aria-label="Permalink to &quot;3.1 SmartMVC总体架构&quot;">​</a></h4><p>在开始撸代码之前我们需要先设计好整个框架架构，所有的设计都是先整体后局部的思想，如果上来就卷起袖子干，不经过仔细的设计是干不好框架的，所以我们先画出SmartMVC的设计图，熟悉SpringMVC的小伙伴可能看出来了，这个流程和SpringMVC的一致。 <img src="https://cdn.jsdelivr.net/gh/silently9527/images/2287721208-5fbfce05acfeb_articlex" alt=""></p><p>SpringMVC之所以如此的受欢迎，其中很重要的一个原因是轻耦合可插拔的组件设计，提供很好的扩展性和灵活性。虽然我们即将要做的SmartMVC是SpringMVC的浓缩版本，但是SpingMVC有的核心组件我们也必须的有，否则无法让小伙伴更好的理解整个过程。</p><h4 id="_3-2-项目搭建" tabindex="-1">3.2 项目搭建 <a class="header-anchor" href="#_3-2-项目搭建" aria-label="Permalink to &quot;3.2 项目搭建&quot;">​</a></h4><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/896506658-5fc097c6f34e4_articlex" alt=""></p><p>smart-mvc项目中的pom.xml依赖引入</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependencies&gt;</span></span>
<span class="line"><span>    &lt;dependency&gt;</span></span>
<span class="line"><span>        &lt;groupId&gt;org.springframework&lt;/groupId&gt;</span></span>
<span class="line"><span>        &lt;artifactId&gt;spring-beans&lt;/artifactId&gt;</span></span>
<span class="line"><span>        &lt;version&gt;5.2.9.RELEASE&lt;/version&gt;</span></span>
<span class="line"><span>    &lt;/dependency&gt;</span></span>
<span class="line"><span>    &lt;dependency&gt;</span></span>
<span class="line"><span>        &lt;groupId&gt;org.springframework&lt;/groupId&gt;</span></span>
<span class="line"><span>        &lt;artifactId&gt;spring-core&lt;/artifactId&gt;</span></span>
<span class="line"><span>        &lt;version&gt;5.2.9.RELEASE&lt;/version&gt;</span></span>
<span class="line"><span>    &lt;/dependency&gt;</span></span>
<span class="line"><span>    &lt;dependency&gt;</span></span>
<span class="line"><span>        &lt;groupId&gt;org.springframework&lt;/groupId&gt;</span></span>
<span class="line"><span>        &lt;artifactId&gt;spring-context&lt;/artifactId&gt;</span></span>
<span class="line"><span>        &lt;version&gt;5.2.9.RELEASE&lt;/version&gt;</span></span>
<span class="line"><span>    &lt;/dependency&gt;</span></span>
<span class="line"><span>    &lt;/dependencies&gt;</span></span></code></pre></div><p>smart-mvc-parent项目中pom.xml配置</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> &lt;dependencies&gt;</span></span>
<span class="line"><span>    &lt;dependency&gt;</span></span>
<span class="line"><span>        &lt;groupId&gt;junit&lt;/groupId&gt;</span></span>
<span class="line"><span>        &lt;artifactId&gt;junit&lt;/artifactId&gt;</span></span>
<span class="line"><span>        &lt;version&gt;4.13&lt;/version&gt;</span></span>
<span class="line"><span>        &lt;scope&gt;test&lt;/scope&gt;</span></span>
<span class="line"><span>    &lt;/dependency&gt;</span></span>
<span class="line"><span>    &lt;dependency&gt;</span></span>
<span class="line"><span>        &lt;groupId&gt;org.springframework&lt;/groupId&gt;</span></span>
<span class="line"><span>        &lt;artifactId&gt;spring-test&lt;/artifactId&gt;</span></span>
<span class="line"><span>        &lt;version&gt;5.2.9.RELEASE&lt;/version&gt;</span></span>
<span class="line"><span>    &lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;/dependencies&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;repositories&gt;</span></span>
<span class="line"><span>    &lt;repository&gt;</span></span>
<span class="line"><span>        &lt;id&gt;nexus-aliyun&lt;/id&gt;</span></span>
<span class="line"><span>        &lt;name&gt;Nexus aliyun&lt;/name&gt;</span></span>
<span class="line"><span>        &lt;layout&gt;default&lt;/layout&gt;</span></span>
<span class="line"><span>        &lt;url&gt;http://maven.aliyun.com/nexus/content/groups/public&lt;/url&gt;</span></span>
<span class="line"><span>        &lt;snapshots&gt;</span></span>
<span class="line"><span>            &lt;enabled&gt;false&lt;/enabled&gt;</span></span>
<span class="line"><span>        &lt;/snapshots&gt;</span></span>
<span class="line"><span>        &lt;releases&gt;</span></span>
<span class="line"><span>            &lt;enabled&gt;true&lt;/enabled&gt;</span></span>
<span class="line"><span>        &lt;/releases&gt;</span></span>
<span class="line"><span>    &lt;/repository&gt;</span></span>
<span class="line"><span>&lt;/repositories&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;build&gt;</span></span>
<span class="line"><span>    &lt;plugins&gt;</span></span>
<span class="line"><span>        &lt;plugin&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;maven-compiler-plugin&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;version&gt;3.8.1&lt;/version&gt;</span></span>
<span class="line"><span>            &lt;configuration&gt;</span></span>
<span class="line"><span>                &lt;source&gt;1.8&lt;/source&gt;</span></span>
<span class="line"><span>                &lt;target&gt;1.8&lt;/target&gt;</span></span>
<span class="line"><span>                &lt;encoding&gt;UTF-8&lt;/encoding&gt;</span></span>
<span class="line"><span>            &lt;/configuration&gt;</span></span>
<span class="line"><span>        &lt;/plugin&gt;</span></span>
<span class="line"><span>    &lt;/plugins&gt;</span></span>
<span class="line"><span>&lt;/build&gt;</span></span></code></pre></div><h4 id="_3-3-研发流程" tabindex="-1">3.3 研发流程 <a class="header-anchor" href="#_3-3-研发流程" aria-label="Permalink to &quot;3.3 研发流程&quot;">​</a></h4><p>首先我们需要先开发<code>HandlerMapping</code>，<code>HandlerMapping</code>的主要作用是根据请求的url查找<code>Handler</code>，其中涉及到的组件有</p><ol><li>HandlerMethod</li><li>MappingRegistry</li><li>HandlerInterceptor</li><li>RequestMappingHandlerMapping</li></ol><p>其实是开发<code>HandlerAdapter</code>，<code>HandlerAdapter</code>的主要作用是按照特定规则（HandlerAdapter要求的规则）去执行Handler，其中涉及到的组件有</p><ol><li>HandlerMethodArgumentResolver</li><li>HandlerMethodReturnValueHandler</li><li>ModelAndView</li><li>RequestMappingHandlerAdapter</li></ol><blockquote><p>可能大家对于<code>Handler</code>，<code>HandlerMethod</code>，<code>HandlerMapping</code>，<code>HandlerAdapter</code>有疑惑，到底有啥区别？ 可以这样理解：Handler是用来干活的工具；HandlerMapping用于根据URL找到相应的干活工具；HandlerAdapter是使用工具干活的人；在SpringMVC中Handler是一个抽象的统称，HandlerMethod只代表一种Handler</p></blockquote><p>然后是开发<code>ViewResolver</code>、<code>View</code>，<code>ViewResolver</code>负责根据返回的<code>ModeAndView</code>查到对应的<code>View</code>，<code>View</code>负责渲染出视图返回给客户端，其中涉及到的组件有</p><ol><li>InternalResourceViewResolver</li><li>InternalResourceView</li></ol><p>最后我来开发<code>DispatcherServlet</code>，负责把所有的组件都组装起来统一调度，它是整个流程控制的中心，控制其它组件执行</p><ol><li>FrameworkServlet</li></ol><p>整个SmartMVC框架开发完成后，我们也需要开发一个springboot的starter，方便和springboot的集成</p><h4 id="_3-4-搭建单元测试环境" tabindex="-1">3.4 搭建单元测试环境 <a class="header-anchor" href="#_3-4-搭建单元测试环境" aria-label="Permalink to &quot;3.4 搭建单元测试环境&quot;">​</a></h4><p>建立如下的目录结构</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/1057935185-5fc2523435782_articlex" alt=""></p><p>创建JavaConfig配置主类<code>AppConfig</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Configuration</span></span>
<span class="line"><span>@ComponentScan(basePackages = &quot;com.silently9527.smartmvc&quot;)</span></span>
<span class="line"><span>public class AppConfig {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>创建单元测试基类，主要是配置Spring的测试环境，方便后期开发单元测试</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@RunWith(SpringJUnit4ClassRunner.class)  // Junit提供的扩展接口，这里指定使用SpringJUnit4ClassRunner作为Junit测试环境</span></span>
<span class="line"><span>@ContextConfiguration(classes = AppConfig.class)  // 加载配置文件</span></span>
<span class="line"><span>public class BaseJunit4Test {</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,31),l=[t];function i(r,c,o,d,g,u){return s(),a("div",null,l)}const v=n(p,[["render",i]]);export{h as __pageData,v as default};
