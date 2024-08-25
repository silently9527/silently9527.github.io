---
title: 03 IDEA多线程文件下载插件
author: Herman
updateTime: 2021-08-14 13:41
desc: idea插件
categories: MyProjects
tags: idea插件
outline: deep
---


## 摘要
上周使用Java开发了大文件多线程下载工具类，自己平时的文件下载也在使用这个工具，下载速度确实提升不少，但是每次下载都要去打开项目运行代码，觉得实在不是很方便；考虑到每天我们都会使用到IDEA开发工具，所以就决定把这个下载工具做成IDEA的插件，文章末尾附上插件下载地址。

>
> Java实现大文件多线程下载 
> - Gitee地址：[https://gitee.com/silently9527/fast-download](https://gitee.com/silently9527/fast-download)
>
> IDEA多线程文件下载插件 
> - Github地址：[https://github.com/silently9527/FastDownloadIdeaPlugin](https://github.com/silently9527/FastDownloadIdeaPlugin)
> - Gitee地址：[https://gitee.com/silently9527/FastDownloadIdeaPlugin](https://gitee.com/silently9527/FastDownloadIdeaPlugin)
>
> 不要忘记star哟


## IDEA插件介绍
IntelliJ IDEA是目前最好用的JAVA开发IDE，它本身的功能已经非常强大了，但是可能我们会遇到一些定制的需求，比如说：自定义代码生成器；这时候就需要我们自己动手来写一个插件，如果只是想要开发简单的功能其实只要掌握了Java Swing，那么开发IDEA的插件是很容易的，如果想学习更多的原理和设计理念可以看[IntelliJ Platform SDK](https://www.jetbrains.org/intellij/sdk/docs/welcome.html)的官方文档。


## IDEA插件开发步骤

#### 1. 创建Gradle的插件工程

![](https://cdn.jsdelivr.net/gh/silently9527/images//b286f47138c04292b7540083f73f8f95%7Etplv-k3u1fbpfcp-watermark.image)

创建完成项目之后，我们可以看一下`resource/META-INF/plugin.xml`

```
<idea-plugin>
    <id>cn.silently9527.fast-download-idea-plugin</id>   <!-- 插件的ID -->
    <name>FastDownloadPlugin</name> <!-- 插件的名字，会在插件中心展示 -->
    <vendor email="380303318@qq.com" url="https://silently9527">Silently9527</vendor>
    <!--插件说明-->
    <description><![CDATA[
    多线程文件下载器
    ]]></description>

    <!-- please see http://www.jetbrains.org/intellij/sdk/docs/basics/getting_started/plugin_compatibility.html
         on how to target different products -->
    <!-- uncomment to enable plugin in all products
    <depends>com.intellij.modules.lang</depends>
    -->

    <extensions defaultExtensionNs="com.intellij">
        <!-- Add your extensions here -->
    </extensions>

    <actions>
        <!-- Add your actions here -->
    </actions>
</idea-plugin>
```


#### 2. 创建一个Action
在IDEA的插件开发中，基本都会使用到Action，Action其实就是事件的处理器，就好比JS中的onClick方法。在IDEA中创建一个Action十分简单，通过图形化界面就可以完成

![](https://cdn.jsdelivr.net/gh/silently9527/images//36437979ca7c4c16ab3de02271aef163%7Etplv-k3u1fbpfcp-watermark.image)

![](https://cdn.jsdelivr.net/gh/silently9527/images//08e2963bbd094c6a9783ec9a0297c68f%7Etplv-k3u1fbpfcp-watermark.image)

创建完成后就可以看到Action类

```
public class FastDownloadAction extends AnAction {
    @Override
    public void actionPerformed(AnActionEvent e) {

}
}
```

在`plugin.xml`中可以看到生成的Action信息

```
<action id="fast.download" class="cn.silently9527.FastDownloadAction" text="FastDownload" description="文件多线程下载">
    <add-to-group group-id="ToolsMenu" anchor="last"/>
    <keyboard-shortcut keymap="$default" first-keystroke="shift D"/>
</action>
```

#### 3. 创建输入下载信息的弹窗
IDEA插件的SDK已经对弹窗进行的封装，只需要继承`DialogWrapper`即可，界面上的绘制工作都在`createCenterPanel`方法中，组件的布局与JavaSwing类似

```
@Nullable
@Override
protected JComponent createCenterPanel() {
    Box verticalBox = Box.createVerticalBox();
    verticalBox.add(createUrlBox());
    verticalBox.add(Box.createVerticalStrut(10));
    verticalBox.add(createFileDirJPanel());
    verticalBox.add(Box.createVerticalStrut(10));
    verticalBox.add(createThreadNumJPanel());
    return verticalBox;
}

```

我们需要对输入的下载地址和存放的路径的参数进行校验，判断输入是否正确，可以实现方法`doValidate`，校验通过返回null，校验不通过返回`ValidationInfo`对象

```
@Nullable
@Override
protected ValidationInfo doValidate() {
    if (StringUtils.isBlank(downloadUrlField.getText())) {
        return new ValidationInfo("文件下载地址必填");
    }
    if (StringUtils.isBlank(fileDirField.getText())) {
        return new ValidationInfo("文件保存目录必填");
    }
    if (StringUtils.isBlank(threadNumField.getText())) {
        return new ValidationInfo("下载线程数必填");
    }
    return null;
}
```

最终界面完成后的效果

![](https://cdn.jsdelivr.net/gh/silently9527/images//e55674d0d57a4cf1b6eac653c9972fee%7Etplv-k3u1fbpfcp-watermark.image)

#### 4. 在FastDownloadAction中获取弹窗输入的下载信息

```
DownloadDialog downloadDialog = new DownloadDialog();
if (downloadDialog.showAndGet()) {
    // 用户点击OK之后进入到这里
}

```

当用户点击了OK，输入信息检验通过后我们就可以开始下载文件了，由于之前做的下载组件是同步调用，为了不阻塞界面操作，需要使用线程异步下载

```
CompletableFuture.runAsync(() -> {
    try {
        Downloader downloader = new MultiThreadFileDownloader(threadNum, downloadProgressPrinter);
        downloader.download(downloadURL, downloadDir);
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
})
```

在下载的过程中，需要给用户反馈，让用户知道当前下载的进度是多少，以及当前下载的速度是多少

```
//使用SDK开启一个后台任务线程
ProgressManager.getInstance().run(new Task.Backgroundable(project, "File Downloading") {
    private long tmpAlreadyDownloadLength; //当前已下载字节数
    private long speed; //每秒下载速度

    public void run(@NotNull ProgressIndicator progressIndicator) {
        // start your process
        while (true) {
            long alreadyDownloadLength = downloadProgressPrinter.getAlreadyDownloadLength();
            long contentLength = downloadProgressPrinter.getContentLength();
            if (alreadyDownloadLength != 0 && alreadyDownloadLength >= contentLength) {
                // 下载已完成，进度条显示100%
                progressIndicator.setFraction(1.0);
                progressIndicator.setText("finished");
                break;
            }
            setProgressIndicator(progressIndicator, contentLength, alreadyDownloadLength);
            sleep();
        }
    }

    private void setProgressIndicator(ProgressIndicator progressIndicator, long contentLength,
                                      long alreadyDownloadLength) {
        if (alreadyDownloadLength == 0 || contentLength == 0) {
            return;
        }
        speed = alreadyDownloadLength - tmpAlreadyDownloadLength;
        tmpAlreadyDownloadLength = alreadyDownloadLength;

        double value = (double) alreadyDownloadLength / (double) contentLength;

        double fraction = Double.parseDouble(String.format("%.2f", value));
        progressIndicator.setFraction(fraction);
        String text = "already download " + fraction * 100 + "% ,speed: " + (speed / 1000) + "KB";
        progressIndicator.setText(text); //进度条显示已下载百分比，下载速度
    }
});
```

![](https://cdn.jsdelivr.net/gh/silently9527/images//e91f510f11524ae7b31ada55c3556364%7Etplv-k3u1fbpfcp-watermark.image)


## 测试多线程下载文件

测试下载820M的idea ，地址：https://download.jetbrains.8686c.com/idea/ideaIU-2020.3.dmg

![](https://cdn.jsdelivr.net/gh/silently9527/images//e7fba4ca172443ce9b92a7e8c5d089d3%7Etplv-k3u1fbpfcp-watermark.image)


## 插件安装
下载插件之后，选择本地安装

![](https://cdn.jsdelivr.net/gh/silently9527/images//2a12851f10d146bfac988193c1b1c0a8%7Etplv-k3u1fbpfcp-watermark.image)


## 总结
- IDEA插件介绍
- IDEA插件开发的基本步骤
- 实现了多线程文件下载插件

> 目前测试过程中发现文件下载速度计算不太准确，个别线程的下载速度未能统计在内，后期继续优化。
>
> 插件下载链接: [https://pan.baidu.com/s/1cmzKgmu8JwUa-liWmNl5jw](https://pan.baidu.com/s/1cmzKgmu8JwUa-liWmNl5jw) 提取码: 3f4t 
