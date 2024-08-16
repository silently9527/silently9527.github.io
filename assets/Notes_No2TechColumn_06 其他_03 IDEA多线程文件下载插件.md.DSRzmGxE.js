import{_ as a,c as n,o as s,aa as e}from"./chunks/framework.d_Ke7vMG.js";const m=JSON.parse('{"title":"03 IDEA多线程文件下载插件","description":"","frontmatter":{"title":"03 IDEA多线程文件下载插件","author":"Herman","updateTime":"2021-08-14 13:41","desc":"idea插件","categories":"MyProjects","tags":"idea插件","outline":"deep"},"headers":[],"relativePath":"Notes/No2TechColumn/06 其他/03 IDEA多线程文件下载插件.md","filePath":"Notes/No2TechColumn/06 其他/03 IDEA多线程文件下载插件.md","lastUpdated":1723780272000}'),p={name:"Notes/No2TechColumn/06 其他/03 IDEA多线程文件下载插件.md"},t=e(`<h2 id="摘要" tabindex="-1">摘要 <a class="header-anchor" href="#摘要" aria-label="Permalink to &quot;摘要&quot;">​</a></h2><p>上周使用Java开发了大文件多线程下载工具类，自己平时的文件下载也在使用这个工具，下载速度确实提升不少，但是每次下载都要去打开项目运行代码，觉得实在不是很方便；考虑到每天我们都会使用到IDEA开发工具，所以就决定把这个下载工具做成IDEA的插件，文章末尾附上插件下载地址。</p><blockquote><p>Java实现大文件多线程下载</p><ul><li>Gitee地址：<a href="https://gitee.com/silently9527/fast-download" target="_blank" rel="noreferrer">https://gitee.com/silently9527/fast-download</a></li></ul><p>IDEA多线程文件下载插件</p><ul><li>Github地址：<a href="https://github.com/silently9527/FastDownloadIdeaPlugin" target="_blank" rel="noreferrer">https://github.com/silently9527/FastDownloadIdeaPlugin</a></li><li>Gitee地址：<a href="https://gitee.com/silently9527/FastDownloadIdeaPlugin" target="_blank" rel="noreferrer">https://gitee.com/silently9527/FastDownloadIdeaPlugin</a></li></ul><p>不要忘记star哟</p></blockquote><h2 id="idea插件介绍" tabindex="-1">IDEA插件介绍 <a class="header-anchor" href="#idea插件介绍" aria-label="Permalink to &quot;IDEA插件介绍&quot;">​</a></h2><p>IntelliJ IDEA是目前最好用的JAVA开发IDE，它本身的功能已经非常强大了，但是可能我们会遇到一些定制的需求，比如说：自定义代码生成器；这时候就需要我们自己动手来写一个插件，如果只是想要开发简单的功能其实只要掌握了Java Swing，那么开发IDEA的插件是很容易的，如果想学习更多的原理和设计理念可以看<a href="https://www.jetbrains.org/intellij/sdk/docs/welcome.html" target="_blank" rel="noreferrer">IntelliJ Platform SDK</a>的官方文档。</p><h2 id="idea插件开发步骤" tabindex="-1">IDEA插件开发步骤 <a class="header-anchor" href="#idea插件开发步骤" aria-label="Permalink to &quot;IDEA插件开发步骤&quot;">​</a></h2><h4 id="_1-创建gradle的插件工程" tabindex="-1">1. 创建Gradle的插件工程 <a class="header-anchor" href="#_1-创建gradle的插件工程" aria-label="Permalink to &quot;1. 创建Gradle的插件工程&quot;">​</a></h4><p><img src="https://raw.githubusercontent.com/silently9527/images/main/b286f47138c04292b7540083f73f8f95%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><p>创建完成项目之后，我们可以看一下<code>resource/META-INF/plugin.xml</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;idea-plugin&gt;</span></span>
<span class="line"><span>    &lt;id&gt;cn.silently9527.fast-download-idea-plugin&lt;/id&gt;   &lt;!-- 插件的ID --&gt;</span></span>
<span class="line"><span>    &lt;name&gt;FastDownloadPlugin&lt;/name&gt; &lt;!-- 插件的名字，会在插件中心展示 --&gt;</span></span>
<span class="line"><span>    &lt;vendor email=&quot;380303318@qq.com&quot; url=&quot;https://silently9527&quot;&gt;Silently9527&lt;/vendor&gt;</span></span>
<span class="line"><span>    &lt;!--插件说明--&gt;</span></span>
<span class="line"><span>    &lt;description&gt;&lt;![CDATA[</span></span>
<span class="line"><span>    多线程文件下载器</span></span>
<span class="line"><span>    ]]&gt;&lt;/description&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- please see http://www.jetbrains.org/intellij/sdk/docs/basics/getting_started/plugin_compatibility.html</span></span>
<span class="line"><span>         on how to target different products --&gt;</span></span>
<span class="line"><span>    &lt;!-- uncomment to enable plugin in all products</span></span>
<span class="line"><span>    &lt;depends&gt;com.intellij.modules.lang&lt;/depends&gt;</span></span>
<span class="line"><span>    --&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;extensions defaultExtensionNs=&quot;com.intellij&quot;&gt;</span></span>
<span class="line"><span>        &lt;!-- Add your extensions here --&gt;</span></span>
<span class="line"><span>    &lt;/extensions&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;actions&gt;</span></span>
<span class="line"><span>        &lt;!-- Add your actions here --&gt;</span></span>
<span class="line"><span>    &lt;/actions&gt;</span></span>
<span class="line"><span>&lt;/idea-plugin&gt;</span></span></code></pre></div><h4 id="_2-创建一个action" tabindex="-1">2. 创建一个Action <a class="header-anchor" href="#_2-创建一个action" aria-label="Permalink to &quot;2. 创建一个Action&quot;">​</a></h4><p>在IDEA的插件开发中，基本都会使用到Action，Action其实就是事件的处理器，就好比JS中的onClick方法。在IDEA中创建一个Action十分简单，通过图形化界面就可以完成</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/36437979ca7c4c16ab3de02271aef163%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/08e2963bbd094c6a9783ec9a0297c68f%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><p>创建完成后就可以看到Action类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class FastDownloadAction extends AnAction {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void actionPerformed(AnActionEvent e) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在<code>plugin.xml</code>中可以看到生成的Action信息</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;action id=&quot;fast.download&quot; class=&quot;cn.silently9527.FastDownloadAction&quot; text=&quot;FastDownload&quot; description=&quot;文件多线程下载&quot;&gt;</span></span>
<span class="line"><span>    &lt;add-to-group group-id=&quot;ToolsMenu&quot; anchor=&quot;last&quot;/&gt;</span></span>
<span class="line"><span>    &lt;keyboard-shortcut keymap=&quot;$default&quot; first-keystroke=&quot;shift D&quot;/&gt;</span></span>
<span class="line"><span>&lt;/action&gt;</span></span></code></pre></div><h4 id="_3-创建输入下载信息的弹窗" tabindex="-1">3. 创建输入下载信息的弹窗 <a class="header-anchor" href="#_3-创建输入下载信息的弹窗" aria-label="Permalink to &quot;3. 创建输入下载信息的弹窗&quot;">​</a></h4><p>IDEA插件的SDK已经对弹窗进行的封装，只需要继承<code>DialogWrapper</code>即可，界面上的绘制工作都在<code>createCenterPanel</code>方法中，组件的布局与JavaSwing类似</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Nullable</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected JComponent createCenterPanel() {</span></span>
<span class="line"><span>    Box verticalBox = Box.createVerticalBox();</span></span>
<span class="line"><span>    verticalBox.add(createUrlBox());</span></span>
<span class="line"><span>    verticalBox.add(Box.createVerticalStrut(10));</span></span>
<span class="line"><span>    verticalBox.add(createFileDirJPanel());</span></span>
<span class="line"><span>    verticalBox.add(Box.createVerticalStrut(10));</span></span>
<span class="line"><span>    verticalBox.add(createThreadNumJPanel());</span></span>
<span class="line"><span>    return verticalBox;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们需要对输入的下载地址和存放的路径的参数进行校验，判断输入是否正确，可以实现方法<code>doValidate</code>，校验通过返回null，校验不通过返回<code>ValidationInfo</code>对象</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Nullable</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected ValidationInfo doValidate() {</span></span>
<span class="line"><span>    if (StringUtils.isBlank(downloadUrlField.getText())) {</span></span>
<span class="line"><span>        return new ValidationInfo(&quot;文件下载地址必填&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (StringUtils.isBlank(fileDirField.getText())) {</span></span>
<span class="line"><span>        return new ValidationInfo(&quot;文件保存目录必填&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (StringUtils.isBlank(threadNumField.getText())) {</span></span>
<span class="line"><span>        return new ValidationInfo(&quot;下载线程数必填&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最终界面完成后的效果</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/e55674d0d57a4cf1b6eac653c9972fee%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><h4 id="_4-在fastdownloadaction中获取弹窗输入的下载信息" tabindex="-1">4. 在FastDownloadAction中获取弹窗输入的下载信息 <a class="header-anchor" href="#_4-在fastdownloadaction中获取弹窗输入的下载信息" aria-label="Permalink to &quot;4. 在FastDownloadAction中获取弹窗输入的下载信息&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DownloadDialog downloadDialog = new DownloadDialog();</span></span>
<span class="line"><span>if (downloadDialog.showAndGet()) {</span></span>
<span class="line"><span>    // 用户点击OK之后进入到这里</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当用户点击了OK，输入信息检验通过后我们就可以开始下载文件了，由于之前做的下载组件是同步调用，为了不阻塞界面操作，需要使用线程异步下载</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CompletableFuture.runAsync(() -&gt; {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        Downloader downloader = new MultiThreadFileDownloader(threadNum, downloadProgressPrinter);</span></span>
<span class="line"><span>        downloader.download(downloadURL, downloadDir);</span></span>
<span class="line"><span>    } catch (IOException e) {</span></span>
<span class="line"><span>        throw new RuntimeException(e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>})</span></span></code></pre></div><p>在下载的过程中，需要给用户反馈，让用户知道当前下载的进度是多少，以及当前下载的速度是多少</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//使用SDK开启一个后台任务线程</span></span>
<span class="line"><span>ProgressManager.getInstance().run(new Task.Backgroundable(project, &quot;File Downloading&quot;) {</span></span>
<span class="line"><span>    private long tmpAlreadyDownloadLength; //当前已下载字节数</span></span>
<span class="line"><span>    private long speed; //每秒下载速度</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void run(@NotNull ProgressIndicator progressIndicator) {</span></span>
<span class="line"><span>        // start your process</span></span>
<span class="line"><span>        while (true) {</span></span>
<span class="line"><span>            long alreadyDownloadLength = downloadProgressPrinter.getAlreadyDownloadLength();</span></span>
<span class="line"><span>            long contentLength = downloadProgressPrinter.getContentLength();</span></span>
<span class="line"><span>            if (alreadyDownloadLength != 0 &amp;&amp; alreadyDownloadLength &gt;= contentLength) {</span></span>
<span class="line"><span>                // 下载已完成，进度条显示100%</span></span>
<span class="line"><span>                progressIndicator.setFraction(1.0);</span></span>
<span class="line"><span>                progressIndicator.setText(&quot;finished&quot;);</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            setProgressIndicator(progressIndicator, contentLength, alreadyDownloadLength);</span></span>
<span class="line"><span>            sleep();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void setProgressIndicator(ProgressIndicator progressIndicator, long contentLength,</span></span>
<span class="line"><span>                                      long alreadyDownloadLength) {</span></span>
<span class="line"><span>        if (alreadyDownloadLength == 0 || contentLength == 0) {</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        speed = alreadyDownloadLength - tmpAlreadyDownloadLength;</span></span>
<span class="line"><span>        tmpAlreadyDownloadLength = alreadyDownloadLength;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        double value = (double) alreadyDownloadLength / (double) contentLength;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        double fraction = Double.parseDouble(String.format(&quot;%.2f&quot;, value));</span></span>
<span class="line"><span>        progressIndicator.setFraction(fraction);</span></span>
<span class="line"><span>        String text = &quot;already download &quot; + fraction * 100 + &quot;% ,speed: &quot; + (speed / 1000) + &quot;KB&quot;;</span></span>
<span class="line"><span>        progressIndicator.setText(text); //进度条显示已下载百分比，下载速度</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>});</span></span></code></pre></div><p><img src="https://raw.githubusercontent.com/silently9527/images/main/e91f510f11524ae7b31ada55c3556364%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><h2 id="测试多线程下载文件" tabindex="-1">测试多线程下载文件 <a class="header-anchor" href="#测试多线程下载文件" aria-label="Permalink to &quot;测试多线程下载文件&quot;">​</a></h2><p>测试下载820M的idea ，地址：<a href="https://download.jetbrains.8686c.com/idea/ideaIU-2020.3.dmg" target="_blank" rel="noreferrer">https://download.jetbrains.8686c.com/idea/ideaIU-2020.3.dmg</a></p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/e7fba4ca172443ce9b92a7e8c5d089d3%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><h2 id="插件安装" tabindex="-1">插件安装 <a class="header-anchor" href="#插件安装" aria-label="Permalink to &quot;插件安装&quot;">​</a></h2><p>下载插件之后，选择本地安装</p><p><img src="https://raw.githubusercontent.com/silently9527/images/main/2a12851f10d146bfac988193c1b1c0a8%7Etplv-k3u1fbpfcp-watermark.image" alt=""></p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><ul><li>IDEA插件介绍</li><li>IDEA插件开发的基本步骤</li><li>实现了多线程文件下载插件</li></ul><blockquote><p>目前测试过程中发现文件下载速度计算不太准确，个别线程的下载速度未能统计在内，后期继续优化。</p><p>插件下载链接: <a href="https://pan.baidu.com/s/1cmzKgmu8JwUa-liWmNl5jw" target="_blank" rel="noreferrer">https://pan.baidu.com/s/1cmzKgmu8JwUa-liWmNl5jw</a> 提取码: 3f4t</p></blockquote>`,41),l=[t];function i(o,c,r,d,u,g){return s(),n("div",null,l)}const b=a(p,[["render",i]]);export{m as __pageData,b as default};
