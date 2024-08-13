---
title: 04 JAVA实现大文件多线程下载断点续传
author: Herman
updateTime: 2021-08-14 13:41
desc: JAVA实现大文件多线程下载断点续传
categories: Java
tags: 断点续传/文件下载/http
outline: deep
---


### 前言
在上一篇文章 [《面试官不讲武德》对Java初级程序猿死命摩擦Http协议](https://juejin.cn/post/6908501668325769223) 中，我们有提到大文件下载和断点续传，本篇我们就来开发一个多线程文件下载器，最后我们用这个多线程下载器来突破百度云盘下载的限速。

兄弟们看到这个标题可能会觉得是个标题党，为了解决疑虑，我们先来看下最终的测试结果：

测试百度云下载的文件 46M，自己本地最大下载速度 2M
##### 1. 单线程下载，总耗时: 603s
![](https://gitee.com/silently9527/fast-download/raw/master/imgs/%E5%8D%95%E7%BA%BF%E7%A8%8B%E4%B8%8B%E8%BD%BD%E9%80%9F%E5%BA%A6.png)


##### 2. 多线程下载，50个线程，总耗时：13s
![](https://gitee.com/silently9527/fast-download/raw/master/imgs/%E5%A4%9A%E7%BA%BF%E7%A8%8B%E4%B8%8B%E8%BD%BD%E8%80%97%E6%97%B6.png)

测试结果，**提速46倍**，我还是太谦虚了，只说提速30倍，此处我们觉得应该有掌声（我听不到，还是点赞实在）

![](https://raw.githubusercontent.com/silently9527/images/main/493d14ff0c574b5fb5e047c480264a6e~tplv-k3u1fbpfcp-watermark.image)

> 源码地址： [https://gitee.com/silently9527/fast-download](https://gitee.com/silently9527/fast-download) 
>
>喜欢请记得star哦


---
### HTTP协议Range请求头
Range主要是针对只需要获取部分资源的范围请求，通过指定Range即可告知服务器资源的指定范围。格式: `Range: bytes=start-end`

比如：
获取字节范围 5001-10000

```
Range: bytes=5001-10000
```

也可以指定开始位置不指定结束位置，表示获取开始位置之后的全部数据

```
Range: bytes=5001-
```

服务器接收到带有`Range`的请求，会在处理请求之后返回状态码为`206 Partial Content`的响应。

基于Range的特性，我们就可以实现文件的多线程下载，文件的断点续传

### 准备工作
本文我们使用的SpringMVC中的`RestTemplate`；由于百度云的链接是Https，所以我们需要设置`RestTemplate`绕过证书验证
1. pom.xml

![](https://raw.githubusercontent.com/silently9527/images/main/d2f569f9b9824b6ea6932db430f63b3a~tplv-k3u1fbpfcp-watermark.image)

2. 编写`RestTemplate`的构造器，以及绕过https的证书验证

![](https://raw.githubusercontent.com/silently9527/images/main/61638a49bff74a7ba5584b1f88c4c44f~tplv-k3u1fbpfcp-watermark.image)

3. 在下载的过程中，我们需要知道当前下载的速度是多少，所以需要定义一个显示下载速度的接口

![](https://raw.githubusercontent.com/silently9527/images/main/3e1bbd2b1b53465bb4900db9398573dd~tplv-k3u1fbpfcp-watermark.image)

因为计算下载速度，我们需要知道每秒传输的字节数是多少，为了监控传输数据的过程，我们需要了解SpringMVC中的接口`ResponseExtractor`

![](https://raw.githubusercontent.com/silently9527/images/main/40f848e9486c4057968cc6e7b5388db5~tplv-k3u1fbpfcp-watermark.image)

该接口只有一个方法，当客户端和服务器端连接建立之后，会调用这个方法，我们可以在这个方法中监控下载的速度。

4. `DisplayDownloadSpeed`接口的抽象实现 `AbstractDisplayDownloadSpeedResponseExtractor`
 
![](https://raw.githubusercontent.com/silently9527/images/main/d8dbffd1c6424141b2b75b4058534812%7Etplv-k3u1fbpfcp-watermark.image)


5. 整个项目主要涉及到的类图

![](https://raw.githubusercontent.com/silently9527/images/main/5c7b104a394d45ab864ef3e0858a64c3%7Etplv-k3u1fbpfcp-watermark.image)


### 简单的文件下载器
这里使用的是restTemplate调用`execute`, 先文件获取到字节数组, 再将字节数组直接写到目标文件。

这里我们需要注意的点是: 这种方式会将文件的字节数组全部放入内存中, 及其消耗资源；我们来看看如何实现。

1. 创建`ByteArrayResponseExtractor`类继承`AbstractDisplayDownloadSpeedResponseExtractor`

![](https://raw.githubusercontent.com/silently9527/images/main/702e4e40f5b3447daab436a502b46fd3%7Etplv-k3u1fbpfcp-watermark.image)

2. 调用`restTemplate.execute`执行下载，保存字节数据到文件中

![](https://raw.githubusercontent.com/silently9527/images/main/5aacdab2c5b945c1b663e3d6fcd50b17%7Etplv-k3u1fbpfcp-watermark.image)

3. 测试下载819M的idea

![](https://raw.githubusercontent.com/silently9527/images/main/953f94ccd50042e5a33f9832ba61c25a%7Etplv-k3u1fbpfcp-watermark.image)

![](https://raw.githubusercontent.com/silently9527/images/main/0e2f810c53bf4fb195a5fede7cef899d%7Etplv-k3u1fbpfcp-watermark.image)

执行一段时间之后，我们可以看到内存已经使用了800M左右，所以这种方式只能使用于小文件的下载，如果我们下载几G的大文件，内存肯定是不够用的。至于下载时间，因为文件太大也没有等下载完成就结束了程序。

### 单线程大文件下载
上面的方式只能下载小的文件，那大文件的下载我们该用什么方式呢？我们可以把流输出到文件而不是内存中。接下来我们来实现我们大文件的下载。

1. 创建`FileResponseExtractor`类继承`AbstractDisplayDownloadSpeedResponseExtractor`，把流输出到文件中

![](https://raw.githubusercontent.com/silently9527/images/main/5a3d2615f4c14486b731bfa6d10851b1%7Etplv-k3u1fbpfcp-watermark.image)

2. 文件下载器，先把流输出到临时下载文件（xxxxx.download），下载完成后在重命名文件

![](https://raw.githubusercontent.com/silently9527/images/main/b9795bf6e87d422db15109296d4a17fb%7Etplv-k3u1fbpfcp-watermark.image)

3. 测试下载819M的idea

![](https://raw.githubusercontent.com/silently9527/images/main/d5d7afab8b984537b9b40a58b78a979d%7Etplv-k3u1fbpfcp-watermark.image)

执行一段时间之后，我们再看看下内存的使用情况，发现这种方式内存消耗较少，效果比较理想，下载时间：199s

![](https://raw.githubusercontent.com/silently9527/images/main/a251e16205ff42c48398d2ed23bae41d%7Etplv-k3u1fbpfcp-watermark.image)

![](https://raw.githubusercontent.com/silently9527/images/main/1f059cf322c34fdca989b6741aa6f185%7Etplv-k3u1fbpfcp-watermark.image)

### 多线程文件下载
如果服务器不限速的话，通常能够把自己本地的带宽给跑满，那么使用单线程下载就够了，但是如果遇到服务器限速，下载速度远小于自己本地的带宽，那么可以考虑使用多线程下载。多线程我们使用`CompletableFuture`（可以参考文章 [CompletableFuture让你的代码免受阻塞之苦](https://juejin.cn/post/6897844374093496328)）。

实现多线程文件下载的基本流程：
1. 首先我们通过Http协议的Head方法获取到文件的总大小
2. 然后根据设置的线程数均分文件的大小，计算每个线程的下载的字节数据开始位置和结束位置
3. 开启线程，设置HTTP请求头Range信息，开始下载数据到临时文件
4. 下载完成后把每个线程下载完成的临时文件合并成一个文件

完成代码如下：

![](https://raw.githubusercontent.com/silently9527/images/main/17adbd3981034f859dc3515b0df65720%7Etplv-k3u1fbpfcp-watermark.image)


3. 开启30个线程测试下载819M的idea

![](https://raw.githubusercontent.com/silently9527/images/main/e30c46ebb99848d9b457d83f78764e6a%7Etplv-k3u1fbpfcp-watermark.image)

![](https://raw.githubusercontent.com/silently9527/images/main/94bfdc0e3a3c4f87b365f42d2ff26501%7Etplv-k3u1fbpfcp-watermark.image)

![](https://raw.githubusercontent.com/silently9527/images/main/5926281c63cf49e69f90f0ffd6796c31%7Etplv-k3u1fbpfcp-watermark.image)

从执行的结果上来看，因为开启了30个线程同时在下载，内存的占用要比单线程消耗的多，但是也在接受范围内，下载时间：81s，速度提升2.5倍，这是因为idea的下载服务器没有限速，本次多线程速度的提升仅仅是在充分的压榨本地的带宽，所以提示的幅度不大。

### 单线程下载和对线程下载对比测试
因为百度云盘对单个线程的下载速度做了限制，大概是在100kb，所以我们使用百度云盘的下载链接，来测试多线程和单线程的下载速度。

1. 测试 百度云盘中 46M 的文件的下载速度，自己本地最大下载速度 2M 

2. 获取文件的下载地址

![](https://raw.githubusercontent.com/silently9527/images/main/b3f7cbfefcb04009ba3dea480ad4247c%7Etplv-k3u1fbpfcp-watermark.image)

> 注意：从浏览器中获取的链接需要先使用URLDecode解码，否则下载会失败，并且百度云盘文件的下载链接是有时效性的，过期后就不能在下载，需要重新生成下载链接

#### 测试单线程下载文件

![](https://gitee.com/silently9527/fast-download/raw/master/imgs/%E5%8D%95%E7%BA%BF%E7%A8%8B%E4%B8%8B%E8%BD%BD%E9%80%9F%E5%BA%A6.png)

执行的结果可以看出，百度云对单线程的下载限速真的是丧心病狂， 46M的文件下载需要耗时： 600s

#### 测试多线程下载文件

为了充分的压榨网速，找出最合适的线程数，所以测试了不同线程数的下载速度

线程数 | 下载总耗时 
---|---
 10 | 60s 
 20 | 30s 
 30 | 21s
 40 | 15s
 50 | 13s

从测试的结果上来看，对于自己的运行环境把线程数设置在30个左右比较合适

![](https://gitee.com/silently9527/fast-download/raw/master/imgs/%E5%A4%9A%E7%BA%BF%E7%A8%8B%E4%B8%8B%E8%BD%BD%E8%80%97%E6%97%B6.png)


---
文件断点续传如何实现，欢迎在大家评论区说出自己的思路。

