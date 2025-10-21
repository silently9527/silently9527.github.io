---
title: 03 Direct Buffer
author: Herman
updateTime: 2025-10-20 12:34
desc: Aeron
categories: Aeron
tags: Aeron
outline: deep
---

Agrona 使用sun.misc.Unsafe和 ，sun.nio.ch.SelectorImpl.selectedKeys这将导致 JVM 在启动时引发一些有关非法反射访问的警告日志条目。要删除警告，请添加以下 JVM 参数：--add-opens java.base/sun.nio.ch=ALL-UNNAMED --add-opens jdk.unsupported/sun.misc=ALL-UNNAMED

Agrona 默认情况下将使用系统字节顺序。如果您的组件以不同的字节序运行，则应指定在使用 DirectBuffer 进行读取或写入时使用的字节序。


![](https://cdn.jsdelivr.net/gh/silently9527/images//202510212058902.png)

Agrona提供了三种实现：
* UnsafeBuffer: 固定大小缓冲区。你首先分配给定大小的 ByteBuffer。提供尽可能最佳的性能，但如果所需容量超过可用容量，则不会调整自动大小，将抛出异常`IndexOutOfBoundsException`。
* ExpandableDirectByteBuffer: 可扩展并由直接 ByteBuffer 支持的直接缓冲区。默认大小为 128 字节，但可以使用构造函数轻松设置ExpandableDirectByteBuffer(int initialSize)。如果数组需要扩展超出其当前大小，则会分配一个新的 ByteBuffer 并复制内容
* ExpandableArrayBuffer: 由字节数组支持的缓冲区（即用 分配new byte[size]）。当需要调整大小时，byte[]会创建一个新的并复制内容


##### 字节顺序

Agrona 允许您设置特定的字节顺序，如果没有，它将默认为 提供的顺序ByteOrder.nativeOrder()。使用不同字节顺序读取和写入数据会损坏数据。当跨越平台或操作系统时，可能会发生这种情况。

原文链接: [http://herman7z.site](http://herman7z.site)
