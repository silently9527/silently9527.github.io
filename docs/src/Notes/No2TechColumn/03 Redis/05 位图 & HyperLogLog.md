---
title: 05 位图 & HyperLogLog
author: Herman
updateTime: 2024-08-11 21:34
desc: 位图 & HyperLogLog
categories: 中间件
tags: redis
outline: deep
---

### 位图
在我们平时开发过程中，会有一些 bool 型数据需要存取，比如用户一年的签到记录，签了是 1，没签是 0，要记录 365 天。如果使用普通的 key/value，每个用户要记录 365个，当用户上亿的时候，需要的存储空间是惊人的。
为了解决这个问题，Redis 提供了位图数据结构，这样每天的签到记录只占据一个位，365 天就是 365 个位，46 个字节 (一个稍长一点的字符串) 就可以完全容纳下，这就大大节约了存储空间。

* setbit: 设置某个位置的值. eg: `setbit bitmap_key 10 1`
* getbit: 后置位置上的值. eg: `getbit bitmap_key 1`
* bitcount: 用来统计指定位置范围内 1 的个数. eg: `bitcount bitmap_key 0 10`
* bitpos: 用来查找指定范围内出现的第一个 0 或 1, 可以用来查找用户从哪一天开始第一次签到. eg: `bitpos bitmap_key 1 0 20`
* getrange: 查询指定范围的数据，如果对应位的字节是不可打印字符，redis-cli 会显示该字符的 16 进制形式 eg: `getrange bitmap_key 0 50`
* bitfield: 有三个子指令，分别是get/set/incrby，它们都可以对指定位片段进行读写，但是最多只能处理 64 个连续的位, eg: `bitfield bitmap_key get u2 0 get i2 9` 
分别从0开始取两位，结果是无符号数 (u)，从9开始取两位，结果是有符号数 (i)

> 注意: bitcount 指定的范围[start, end]是是字节的索引，也就是说指定的位范围必须是 8 的倍数,而不能任意指定,因为这个设计，
> 我们无法直接计算某个月内用户签到了多少天，而必须要将这个月所覆盖的字节内容全部取出来 (getrange 可以取出字符串的子串) 然后在内存里进行统计 

### HyperLogLog
我们先思考一个常见的业务问题：统计网站每个网页每天的 UV 数据，你会如何实现？

如果统计 PV 那非常好办，给每个网页一个独立的 Redis 计数器就可以了，这个计数器的 key 后缀加上当天的日期。这样来一个请求，incrby 一次，最终就可以统计出所有的 PV 数据。但是 UV 不一样，它要去重，
同一个用户一天之内的多次访问请求只能计数一次。这就要求每一个网页请求都需要带上用户的 ID，无论是登陆用户还是未登陆用户都需要一个唯一ID 来标识。

解决这个问题可以使用redis的HyperLogLog，HyperLogLog 提供不精确的去重计数方案，虽然不精确但是也不是非常不精确，标准误差是 0.81%，这样的精确度已经可以满足上面的 UV 统计需求了

* pfadd: 添加元素. eg: `pfadd hyperloglog_t user1`
* pfcount: 统计有多少个不重复的元素. eg: `pfcount hyperloglog_t`

> 注意：HyperLogLog需要占用12k的存储空间，所以它不适合统计单个用户相关的数据，如果用户很多这将会占用很大的空间。对于统计UV来说，相比 set 存储来去重复，HyperLogLog可以节省很多空间

原文链接: [http://herman7z.site](http://herman7z.site)


