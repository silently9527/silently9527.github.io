---
title: 05 JVM性能调优实战：让你的IntelliJ Idea纵享丝滑
author: Herman
updateTime: 2021-08-14 13:41
desc: JVM性能调优实战：让你的IntelliJ Idea纵享丝滑
categories: Java
tags: 虚拟机调优/Java虚拟机
outline: deep
---

## 前言
在前面整理了一篇关于JVM故障诊断和处理工具，考虑到大部分的Java程序员都使用的时IntelliJ Idea，本篇就使用工具来实战演练对IntelliJ Idea运行速度调优

## 调优前的运行状态

#### 原始配置内容
要查询idea原始配置文件的路径可以在VisualVM中的概述中查看

![](https://cdn.jsdelivr.net/gh/silently9527/images//1501084898-5ffa9ba34629c_articlex)

原始配置内容：

```
-XX:ReservedCodeCacheSize=240m
-XX:+UseCompressedOops
-Dfile.encoding=UTF-8
-XX:SoftRefLRUPolicyMSPerMB=50
-ea
-Dsun.io.useCanonCaches=false
-Djava.net.preferIPv4Stack=true
-Djdk.http.auth.tunneling.disabledSchemes=""
-XX:+HeapDumpOnOutOfMemoryError
-XX:-OmitStackTraceInFastThrow

-XX:ErrorFile=$USER_HOME/java_error_in_idea_%p.log
-XX:HeapDumpPath=$USER_HOME/java_error_in_idea.hprof

-Xmx512m
```

#### 打印启动时间插件开发
需要直观的看到优化前和优化后启动时间的变化，所以需要简单做一个Idea的插件开发，关于Idea插件开发的流程建议参考我以前的文章《IDEA插件：多线程文件下载插件开发
》

JVM的启动时间到所有组件初始化完成后的时间就看做是IDEA的启动时间，代码如下

```
public class MyApplicationInitializedListener implements ApplicationInitializedListener {
    @Override
    public void componentsInitialized() {
        RuntimeMXBean bean = ManagementFactory.getRuntimeMXBean();
        long startTime = bean.getStartTime();
        long costTime = System.currentTimeMillis() - startTime;

        Messages.showMessageDialog("毫秒：" + costTime, "启动耗时", Messages.getInformationIcon());
    }
}
```

plugin.xml中添加如下代码：

```
<extensions defaultExtensionNs="com.intellij">
    <applicationInitializedListener id="MyApplicationInitializedListener"
                                    implementation="cn.silently9527.MyApplicationInitializedListener"/>
</extensions>
```


#### 优化前的启动信息与时间消耗
![](https://cdn.jsdelivr.net/gh/silently9527/images//1944701285-5ff963ad53209_articlex)

![](https://cdn.jsdelivr.net/gh/silently9527/images//3138964108-5ff963b712c68_articlex)

根据VisualGC和IDEA启动插件收集到的信息：
- IDEA启动耗时 15s
- 总共垃圾收集22次，耗时1.2s，其中新生代GC 17次，耗时324ms; 老年代GC 5次，耗时953ms
- 加载类27526个，耗时 21s

> 按照这个数据来看也算是正常，15s 其实也在接受范围内，由于本文主要演示性能调优，所以需要测试能否在快一些

## 开始尝试优化

#### 调整内存来控制垃圾回收频率
图上我们可以看出，启动参数指定的512m的内存被分配到新生代的只有169m，由于IDEA是我们开发常用的工具，平时的编译过程也需要足够的内存，所以我们需要先把总的内存扩大，这里我设置最大的内存`-Xmx1024m`，为了让JVM在GC期间不需要再浪费时间再动态计算扩容大小，同时也设置了`-Xms1024m`；

在启动的过程中Eden共发生了17次GC，为了减少新生代gc次数，我把新生代的内存大小设置成`-Xmn256m`;

重新启动之后查看VisualGC，新生代gc次数从 17次 降低到了 7次，耗时从 324ms 降低到了 152ms。

![](https://cdn.jsdelivr.net/gh/silently9527/images//2096888164-5ffaa67ed24a9_articlex)

在调整内存前发生了5次Full GC，调整内存后的依然还是有4次Full GC，但是从两张图我们可以看出，老年代的空间还有很多剩余，是不应该发生Full GC的；考虑是否是代码中有地方手动调用`System.gc()`出发了Full GC，所以添加了参数`-XX:+DisableExplicitGC`，再次重新启动IDEA，结果很失望，依然还有4次Full GC；

再次仔细观察优化前的图，注意看 Last Cause: Metadata GC Threshold , 最后一次gc是应该Metaspace区域内存不够发生的GC，为了验证我们的猜想，打印出GC日志来看看。在`idea.vmoptions`中添加打印日志相关的参数：


```
-XX:+PrintGCDetails
-XX:+PrintGCDateStamps
-Xloggc:../gc.log
```

> JVM的GC日志的主要参数包括如下几个：
> - -XX:+PrintGC 输出GC日志
> - -XX:+PrintGCDetails 输出GC的详细日志
> - -XX:+PrintGCTimeStamps 输出GC的时间戳（以基准时间的形式）
> - -XX:+PrintGCDateStamps 输出GC的时间戳（以日期的形式，如 2013-05-04T21:53:59.234+0800）
> - -XX:+PrintHeapAtGC 在进行GC的前后打印出堆的信息
> - -Xloggc:../logs/gc.log 日志文件的输出路径

重新启动idea，查看gc.log

![](https://cdn.jsdelivr.net/gh/silently9527/images//231035044-5ffaac2dd7591_articlex)

> 其中`PSYoungGen:`表示新生代使用的ParallelScavenge垃圾收集器，`31416K->0K(181248K)`表示 gc前已使用的内存大小 -> gc后已使用内存大小（该区域的总内存大小）

从日志中我们看出每次Full GC都是因为`Metadata GC Threshold`，而Metaspace每次gc回收的内存几乎没有，仅仅是扩大了该区域的容量；找到了原因那就好办了，添加如下的参数调整Metaspace的大小：

```
-XX:MetaspaceSize=256m
```

再次重启Idea之后，发现Full GC没有了，心情很爽

![](https://cdn.jsdelivr.net/gh/silently9527/images//153848056-5ffaaf7c61f9e_articlex)


测试打开大项目点击编译代码，发现自己的idea卡死了，查看VisualGC之后发现堆内存都还有空闲，只有Metaspace被全部占满了，所以是自己给的最大空间设置太小，所以直接去掉了`-XX:MaxMetaspaceSize=256m`

#### 选择垃圾收集器
从刚才的gc日志中，我们可以发现默认使用的是ParallelScavenge + Parallel Old垃圾收集器，这个组合注重的是吞吐量，这里我们尝试换一个注重低延时的垃圾收集器试一试

- ParNew + CMS
在`idea.vmoptions`中添加如下配置：

```
-XX:+UseConcMarkSweepGC
-XX:+UseParNewGC
```

重启IDEA之后查看VisualGC

![](https://cdn.jsdelivr.net/gh/silently9527/images//3999595044-5ffab5934d5c3_articlex)

很尴尬，同样发生了6次gc，`ParallelScavenge + Parallel Old`的组合耗时197ms，而`ParNew + CMS`的组合耗时379ms；虽然是这个结果，但是我们需要考虑当前只发生了MinorGC，如果发生FullGC了结果又会如何了，大家可以自己测试一下

- G1
我们在换一个最新的G1垃圾回收器试试，在`idea.vmoptions`中添加如下配置：

```
-XX:+UseG1GC
```

![](https://cdn.jsdelivr.net/gh/silently9527/images//2208506516-5ffab8d02829c_articlex)

这个结果好像也还是要慢一点点，自己多次测试过这两个垃圾回收器，虽然每次结果都不一样，相差不远，所以垃圾回收器可以自己选择，这里我们选择的是G1


#### 类加载时间优化
根据之前的分析，idea启动加载类27526个，耗时 21s，这个我们有办法能优化一下吗？因为idea是常用的开发工具，经常很多人的使用，我们可以认为它的代码是安全的，是否符合当前虚拟机的要求，不会危害虚拟机的安全，所以我们使用参数`-Xverify:none`来禁用字节码的验证过程

重启IDEA

![](https://cdn.jsdelivr.net/gh/silently9527/images//902843037-5ffabd81ecc38_articlex)

耗时下降到了11s，效果还是比较明显的


## 总结

做完了所有优化之后，经过多次重启测试，平均的启动时间下降到了11s，为了安慰我本次操作没有白辛苦，搞一张11s以下的图

![](https://cdn.jsdelivr.net/gh/silently9527/images//3483679517-5ff971f5860d8_articlex)



