---
title: 09 Buffer Pool
author: Herman
updateTime: 2024-08-11 21:34
desc: Buffer Pool
categories: 中间件
tags: MySQL/InnoDB/B+树索引/Buffer Pool
outline: deep
---



### BufferPool 是什么
为了缓冲磁盘中的页，Mysql启动的时候就向操作系统申请了一片连续的内存，这片内存就是BufferPool(缓冲区)。可以在启动服务之前配置 启动参数 `buffer_pool_size`， 
注意这个参数的单位是字节，bufferPool最小值是5MB

BufferPool对应的内存被划分为了若干个页面，页面大小和表空间中的页面大小一样16KB，为了把这两个页区分开来，我们就把BufferPool中的页称为缓冲页。
为了更好的管理这些缓冲页，又设计了控制块，包含了缓冲页所属的表空间编号，页号，缓冲页在BufferPool中的地址等等。每个控制块与缓冲页一一对应，他们都存放在BufferPool中，
控制块放在了前面，缓冲页放在后面

![](https://cdn.jsdelivr.net/gh/silently9527/images//202510282007731.png)

### free链
在Mysql启动服务器的时候，BufferPool会申请一片空间划分为若干个控制块和缓冲页，但是并没有加载真实的磁盘页到内存中。

当mysql运行起来开始加载磁盘页到内存中时，如何知道哪些缓冲页时空闲的呢？
我们可以把空闲缓冲页的控制块作为一个节点放到一个链表中，这个链表可以称为 free链.

### 缓冲页的哈希处理

再来考虑个问题，如何判断磁盘中的页面是否已经被加载到BufferPool中呢？
Mysql在这里使用到了哈希表，把表空间号+页号作为Key，缓冲页的控制块就是对应的value

### flush链
当我们修改BufferPool中的缓冲页的数据时，它就和磁盘中的页不一致了，这被称为脏页。如果每次我们修改了数据就直接刷新到磁盘上去，这样太频繁了，耗性能，所以Mysql定义了flush链。
修改了缓冲页面后不着急去刷新到磁盘，而是把脏页用链表串联起来，等在某个时间点再去刷新。

### LRU 链
BufferPool的内存大小是有限，如果BufferPool中的空间已经使用完了，在加载新的页面到内存时就需要把旧的页面给移除，那么到底该移除哪些页面呢？

我们可以创建一条LRU链表，当我们需要访问一个页面的时候，可以按照下面的方法处理LRU链表：
* 如果该页面不在BufferPool中，就把页面加载BufferPool中，然后再把缓冲页面对应的控制块放到LRU链表的头部
* 如果该页面在BufferPool中，则直接把该缓冲页对应的控制块信息放入到链表的头部

所以当需要淘汰缓冲页面的时候，就直接淘汰掉链表的尾部。

以上只是简单理解LRU的机制，实际上Mysql使用的LRU 链更加复杂，采用了划分区域的LRU链表，主要是为了解决一下问题：
* Innodb提供了 预读 功能，这会让mysql提前读取一些磁盘页面到内存中，而是可能用不上
* 有可能会执行全表扫描的语句，短时间内访问了大量使用频率很低的页面，这会导致加载很多页面可能只会使用一次就不再使用而淘汰了一些热点数据

所以LRU链表被划分为了两段：一部分用来存储热点数据(young)，一部分用来存放冷数据(old)。 mysql是通过比例来划分的链表，查看当前系统设置的比例：
```sql
show variables like 'innodb_old_blocks_pct'
```
默认情况下，old区域占用的比例是37%，

有了这两个区域，那么针对上面的两个情况进行优化
* 预读：当磁盘页初次加载到内存的时候就放入到 old 区域的头部，这样如果用不到就会被逐渐淘汰
* 全表扫描：当磁盘页面初次加载到内存的时候放到 old 区域的头部，在第一次访问的时间在控制块记录一个时间， 如果后续的访问时间与第一次访问时间在某个时间间隔内，就不移动缓冲页面到young区域。


### 刷新脏页到磁盘
后台有专门的线程负责每隔一段时间就把脏页面刷新到磁盘，刷新的缓冲页来源：
* 从LRU链表的冷数据中刷新一部分页面到磁盘
* 从flush链表中刷新一部分页面到磁盘

### 多个BufferPool实例
BufferPool本质是系统的一片连续的内存区域，在多线程的环境下，访问BufferPool都是需要加锁处理，在并发访问比较高的时间，单个BufferPool可能会有性能瓶颈，
所以mysql允许配置多个BufferPool，修改启动参数：`innodb_buffer_instances`

计算每个BufferPool占用多少内存空间：`innodb_buffer_buffer_size / innodb_buffer_instances`, 所以 `innodb_buffer_buffer_size` 配置的值是所有BufferPool总共的内存空间

当 innodb_buffer_buffer_size 的值小于 1G 时，设置BufferPool的实例个数是无效的，都会被设置成 1

查询BufferPool的状态信息：

```sql
show engine innodb status
```

原文链接: [http://herman7z.site](http://herman7z.site)
