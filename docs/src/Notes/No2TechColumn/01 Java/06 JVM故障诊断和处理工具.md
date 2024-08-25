---
title: 06 JVM故障诊断和处理工具
author: Herman
updateTime: 2021-08-14 13:41
desc: JVM故障诊断和处理工具
categories: Java
tags: 虚拟机调优/Java虚拟机
outline: deep
---



## 前言
前几天中午正在和同事最近聊股市较好，这几天每天都可以喝点肉汤，心里还是挺高兴的；正在这个时候收到了线上告警邮件和运维同学的消息，“你们有服务挂了！”，心里一紧，立马打开电脑看来下线上cat监控大盘，发现很多服务都在报错，根据cat上的监控日志很快发现了其中一个服务内存溢出导致其他调用服务也有问题，竟然已经定位到了出问题的服务，那就简单了，没有是重启解决不了的问题，重启之后很快服务都恢复正常了。几分钟之后又报错了，同样也是这个服务内存溢出，经过排查后发现该服务的堆内存被改小了，好家伙，运维同学不讲武德，搞偷袭，趁我没反应过来调了内存，内存调整回去之后服务就恢复了正常。

事后把线上的快照文件拖了下来分析，发现本身这个项目的代码也有些问题，本文就整理了一下JVM常用的分析工具。

## 命令行工具
在安装完JDK之后在JAVA_HOME/bin目录下JDK已经提供了很多命令行的工具

![](https://cdn.jsdelivr.net/gh/silently9527/images//1921805616-5ff98132e67e9_articlex)

可能我们最常用的就是`java`、`javac`这两个命令，除了这两个命令之外还有提供很多其他的实用工具，本文主要来一起学习对JVM监控诊断工具

#### 虚拟机进程状况工具（jps）
该工具的功能比较单一，与linux中的ps功能类似，用来列出正在运行的虚拟机进程，并显示出运行的主类和进程号

命令格式：`jps [option] [hostid]`

> 如果需要查看远程机器的jvm进程需要填写`hostid`，并且需要使用RMI，比如：`rmi://192.168.2.128:12345`

常用的选项：
- `-q` : 只显示出虚拟机的进程id（lvmid），省略主类名
- `-m` : 输出启动时传递给主类的参数
- `-l` : 显示出主类的全名，包括jar包路径
- `-v` : 输出虚拟机进程启动时的JVM参数

![](https://cdn.jsdelivr.net/gh/silently9527/images//2909510064-5ff983209a1d2_articlex)


#### 虚拟机统计信息监控工具（jstat）
用于监控虚拟机运行状态信息的命令行工具，可以提供内存，垃圾收集等云行时的数据

命令格式：`jstat [option vmid] [interval [s|ms] [count]]`

interval表示间隔多久时间查询一次，count表示查询多少次，比如：每个两秒查询一次进程52412的垃圾收集情况，共查询5次

```
jstat -gc 52412 2s 5
```

![](https://cdn.jsdelivr.net/gh/silently9527/images//3357602985-5ff988b3e88d9_articlex)

常用的选项：
- `-class`: 监控类装载，卸载次数和总空间以及加载类的耗时
- `-gc`: 监控java堆的情况
- `-gcutil`: 主要输出各个空间使用的百分比
- `-gcnew`: 主要是监控新生代的GC状况
- `-gcold`: 监控老年代的GC状况
- `-compiler`: 输出JIT编译器编译过的方法和耗时信息

查看堆空间的使用百分比: `jstat -gcutil 52412 2s 5`

![](https://cdn.jsdelivr.net/gh/silently9527/images//2486125884-5ff98c0ae7508_articlex)


#### java配置信息工具（jinfo）
可以通过`jinfo`实时的查看和调整虚拟机的各项参数；可以通过`jps -v`查看虚拟机启动时候指定的参数信息，如果需要查看未显示指定的参数默认值也可以通过`jinfo -flag`


```
jinfo -flag CMSInitiatingOccupancyFraction 52412
```

![](https://cdn.jsdelivr.net/gh/silently9527/images//3247812341-5ff98ecabf29b_articlex)

jinfo除了可以查看参数以外，还可以在运行时修改一些允许被修改的参数

#### Java内存映像工具（jmap）
jmap用于生成JVM堆的快照文件，除了使用jmap工具，我们通常也会在配置JVM的启动参数 `-XX:+HeapDumpOnOutOfMemoryError` 让JVM在发送内存溢出之后自动生成dump文件。

命令格式：`jmap [option] vmid`

比如生成java堆的快照文件

```
jmap -dump:live,format=b,file=/Users/huaan9527/Desktop/heap.hprof 59950
```

常用的选项：
- `-F`: 当虚拟机对-dump选项没有响应时可用选择使用这个参数强制生成快照
- `-histo`: 显示出堆中对象统计信息。

#### 堆栈跟踪工具（jstack）
用于生成JVM当前线程的快照信息。通常用于查询什么原因导致线程长时间的停顿，比如：线程死循环，死锁，等待网络/IO

命令格式：`jstack [option] vmid`

常用的选项：
- `-F`: 当请求不被响应时强制输出
- `-l`: 除了显示堆栈外，还需要显示锁的信息
- `-m`: 如果调用到本地方法，显示出C/C++的堆栈

## VisualVM 可视化工具
VisualVM是目前JDK自带的功能最强的运行监视和故障处理程序，在VisualVM之前，JDK也提供了一款可视化工具JConsole，由于JConsole的所有功能在VisualVM都有，所以可视化工具大家几乎都选择使用VisualVM。

VisualVM本身是基于Netbean开发的，所以具备了插件扩展功能，安装插件之后上面介绍的所有命令行的工具的功能都可以在VisualVM中使用。可以在在JAVA_HOME/bin目录下执行`jvisualvm`启动。

- 插件安装
默认情况VisualVM提供的功能很少，需要我们在菜单栏->工具->插件里面安装插件，我这是全部插件都安装了

![](https://cdn.jsdelivr.net/gh/silently9527/images//2457906903-5ff9b307c095d_articlex)


### 功能演示
- 应用程序、概述、监视

![](https://cdn.jsdelivr.net/gh/silently9527/images//3062129011-5ff9b5fbaaa2e_articlex)

显示出当前本机所有的JVM进程，这里显示的内容和前面说的命令行`jps`显示的内容一样

![](https://cdn.jsdelivr.net/gh/silently9527/images//189450313-5ff9b67e66599_articlex)

当前虚拟机启动信息的展示，比如：JVM启动参数、系统参数

![](https://cdn.jsdelivr.net/gh/silently9527/images//3196895080-5ff9b74a64a05_articlex)

这个页面相当于命令jstat的功能，显示出了CPU, 内存，线程，类装载当前处于什么情况

生成dump文件可以在应用程序窗口右键菜单中选择，也可以在这个页面点击右上角的`堆dump`


- Visual GC
此页主要展示了GC相关的信息，这是在性能调优时常用的页面之一

![](https://cdn.jsdelivr.net/gh/silently9527/images//19093410-5ff9bc393bfa4_articlex)

我们可以写个程序来观看下这个截图各个内存区域的变化情况，为了让图的效果明显需要修改JVM的启动参数

```
-Xmx100m -Xms100m -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/Users/huaan9527/Desktop
```


```
public static void main(String[] args) {
    List<DataTest> datas = new ArrayList<>();

    IntStream.range(0, 10000).forEach(index -> {
        datas.add(new DataTest());

        try {
            Thread.sleep(50);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    });

    System.gc();
}

static class DataTest {
    byte[] bytes = new byte[1024];
}
```

![](https://cdn.jsdelivr.net/gh/silently9527/images//2920321350-5ffa69dc242b1_articlex)


- 线程
本页的功能相当于命令行工具`jstack`，主要是用于检查什么原因导致线程长时间等待，我们写程序来演示下等待外部资源、锁等待、死循环这几种请求


**等待外部资源**

```
public static void main(String[] args) throws IOException {
    BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
    System.out.println(reader.readLine());
    try {
        Thread.sleep(1000000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}
```
选中main线程，右侧会看到当前线程运行到了readBytes，等待键盘输入

![](https://cdn.jsdelivr.net/gh/silently9527/images//1280102571-5ffa6c4037c12_articlex)

当我们在控制台输入之后再次查看main线程的状态，此时进入了TIME_WAIT状态

![](https://cdn.jsdelivr.net/gh/silently9527/images//3185550591-5ffa6d2baec4b_articlex)

**锁等待**


```
public static void main(String[] args) throws IOException, InterruptedException {
    Thread thread = createLockThread(new Object());
    thread.join();
}

public static Thread createLockThread(final Object lock) {
    Thread lockThread = new Thread(() -> {
        synchronized (lock) {
            try {
                lock.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }, "lockThread");
    lockThread.start();
    return lockThread;
}
```

![](https://cdn.jsdelivr.net/gh/silently9527/images//3433413024-5ffa71ef869c2_articlex)

lockThread线程在等待lock对象的notify方法被调用，此时处于WAITING状态，在被唤醒之前是不会再分配执行时间

**死循环**


```
public static void main(String[] args) throws IOException, InterruptedException {
    while (true) ;
}
```

![](https://cdn.jsdelivr.net/gh/silently9527/images//3596376279-5ffa742eb325a_articlex)

线程一直处于运行状态，从堆栈追踪里可以看出代码一直停留在了191行，在空循环上用尽分配的执行时间


## 总结
本篇介绍了命令行工具和可视化工具，下篇实战演示下如何通过这些工具对Idea运行速度调优


