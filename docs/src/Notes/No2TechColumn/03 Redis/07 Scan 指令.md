---
title: 07 Scan 指令
author: Herman
updateTime: 2024-08-11 21:34
desc: Scan 指令
categories: 中间件
tags: redis
outline: deep
---

### Scan 指令

在工作中经常需要使用模糊查询某个Key，redis提供了 `keys` 指令，如果redis中存储几百万的key，这个指令就会严重影响redis性能；所以redis提供了 `scan` 指令, 特性：
1. 复杂度虽然也是 O(n)，但是它是通过游标分步进行的，不会阻塞线程;
2. 提供 limit 参数，可以控制每次返回结果的最大条数，limit 只是一个 hint，返回的结果可多可少;
3. 同 keys 一样，它也提供模式匹配功能;
4. 服务器不需要为游标保存状态，游标的唯一状态就是 scan 返回给客户端的游标整数;
5. 返回的结果可能会有重复，需要客户端去重复，这点非常重要;
6. 遍历的过程中如果有数据修改，改动后的数据能不能遍历到是不确定的;
7. 单次返回的结果是空的并不意味着遍历结束，而要看返回的游标值是否为零;






原文链接: [http://herman7z.site](http://herman7z.site)
