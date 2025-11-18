---
title: 04 Redisson 分布式锁
author: Herman
updateTime: 2024-08-11 21:34
desc: 分布式锁
categories: 中间件
tags: redis
outline: deep
---


### 一、Redisson 分布式锁的核心思想
Redisson 的分布式锁是基于 Redis 的 Lua 脚本和一系列封装良好的 Java 对象来实现的。它解决了原生 Redis 实现分布式锁时可能遇到的许多棘手问题，如原子性、锁续期、可重入等。

其核心依赖 Redis 的几个特性：
* 单线程执行：Redis 是单线程的，这意味着命令是顺序执行的，复杂的多命令操作需要保证原子性。
* Lua 脚本：Redisson 大量使用 Lua 脚本将多个 Redis 命令打包成一个原子操作来执行。
* Hash 数据结构：用于存储锁信息，实现可重入性。
* Pub/Sub 功能：用于实现高效的锁等待通知机制，避免无效的轮询。

### 二、加锁流程与解锁

#### 1. 加锁的 Lua 脚本
   核心的加锁逻辑是通过一段 Lua 脚本完成的，这保证了原子性。

```java
-- KEYS[1]: 锁的Key名称，比如 "myLock"
-- ARGV[1]: 锁的超时时间（毫秒）
-- ARGV[2]: 客户端唯一标识（UUID + 线程ID）

-- 情况1：锁不存在（第一次加锁）
if (redis.call('exists', KEYS[1]) == 0) then
    -- 创建Hash结构，field为客户端ID，value为1（重入次数）
    redis.call('hincrby', KEYS[1], ARGV[2], 1);
    -- 设置锁的过期时间
    redis.call('pexpire', KEYS[1], ARGV[1]);
    return nil; -- 加锁成功
end;

-- 情况2：锁已存在，且是当前客户端持有的（重入）
if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then
    -- 重入次数 +1
    redis.call('hincrby', KEYS[1], ARGV[2], 1);
    -- 重置过期时间
    redis.call('pexpire', KEYS[1], ARGV[1]);
    return nil; -- 重入成功
end;

-- 情况3：锁被其他客户端持有
-- 返回锁的剩余存活时间（毫秒）
return redis.call('pttl', KEYS[1]);
```

#### 2. 解锁的 lua 脚本

```java
-- KEYS[1]: 锁的Key名称，比如 "myLock"
-- KEYS[2]: 发布订阅的频道名称，用于通知其他等待的客户端
-- ARGV[1]: 发布的消息内容（通常是锁释放的通知）
-- ARGV[2]: 锁的超时时间（毫秒）
-- ARGV[3]: 客户端唯一标识（UUID + 线程ID）

-- 步骤1：验证锁的所有权
if (redis.call('hexists', KEYS[1], ARGV[3]) == 0) then
    return nil;  -- 当前客户端不持有该锁，返回nil表示操作无效
end;

-- 步骤2：减少重入计数
local counter = redis.call('hincrby', KEYS[1], ARGV[3], -1);

-- 步骤3：判断是否完全释放锁
if (counter > 0) then
    -- 情况1：还有重入次数，未完全释放
    redis.call('pexpire', KEYS[1], ARGV[2]);  -- 刷新锁的过期时间
    return 0;  -- 返回0表示重入计数减1，但锁仍被持有
else
    -- 情况2：重入次数为0，完全释放锁
    redis.call('del', KEYS[1]);  -- 删除锁键
#    redis.call('publish', KEYS[2], ARGV[1]);  -- 发布锁释放通知
    return 1;  -- 返回1表示锁已完全释放
end;

return nil;  -- 默认返回（理论上不会执行到这里）
```

### 三、可重入锁实现
可重入锁意味着同一个线程可以多次获取同一把锁而不会造成死锁。Redisson 通过 Redis 的 Hash 结构轻松实现了这一点。
数据结构：
* Key: 锁的名称，如 "myLock"。
* Field: 客户端的唯一标识（UUID + 线程ID），如 "8743c9c0-0795-4907-87fd-a6c966a22852:1"。
* Value: 一个整数值，代表该线程重入的次数。

工作流程：
* 第一次加锁：hset myLock <clientId> 1。value 被设置为 1。
* 同一线程再次加锁：在 Lua 脚本中，通过 hexists 发现 field 已存在，于是执行 hincrby myLock <clientId> 1。value 变为 2。
* 释放锁：释放锁时，并不是直接删除 Key，而是通过 hincrby 将 value 减 1。
* 只有当 value 减到 0 时，才会执行 del 命令真正删除这个锁 Key。
* 如果 value 减后大于 0，说明还有嵌套的锁没有释放，只会重置一下过期时间。

这样就完美地模拟了 JVM 内置锁（synchronized/ReentrantLock）的可重入行为。

#### 四、看门狗机制（Watchdog）—— 锁自动续期
你可能会问：如果我的业务逻辑执行时间超过了设置的锁超时时间怎么办？锁提前释放了，其他客户端就会拿到锁，造成数据混乱。
Redisson 提供了一个优雅的解决方案：看门狗机制。
* 触发条件：当你使用 lock() 方法不加参数，或者使用 lock(long leaseTime, TimeUnit unit) 但 leaseTime 为 -1 或 null 时，看门狗会生效。

工作原理：
* 默认的锁超时时间是 30秒。
* 加锁成功后，Redisson 会启动一个后台定时任务（看门狗），它每隔 10 秒（锁超时时间的 1/3）检查一次客户端是否还持有这个锁。
* 如果客户端仍然持有锁（即主线程业务还没执行完），看门狗就会通过 Lua 脚本重置锁的过期时间，将其再次延长为 30秒。
* 这个过程会一直重复，直到客户端主动释放锁（unlock()）或客户端宕机。

优点：只要 JVM 进程没有崩溃，即使业务执行时间很长，锁也不会因为超时而被意外释放，极大地增强了安全性。

```java
private RFuture<Boolean> tryAcquireOnceAsync(long waitTime, long leaseTime, TimeUnit unit, long threadId) {
    RFuture<Boolean> acquiredFuture;
    if (leaseTime > 0) {
        acquiredFuture = tryLockInnerAsync(waitTime, leaseTime, unit, threadId, RedisCommands.EVAL_NULL_BOOLEAN);
    } else {
        acquiredFuture = tryLockInnerAsync(waitTime, internalLockLeaseTime,
                TimeUnit.MILLISECONDS, threadId, RedisCommands.EVAL_NULL_BOOLEAN);
    }

    CompletionStage<Boolean> f = acquiredFuture.thenApply(acquired -> {
        // lock acquired
        if (acquired) {
            if (leaseTime > 0) {
                internalLockLeaseTime = unit.toMillis(leaseTime);
            } else {
                scheduleExpirationRenewal(threadId);   #未设置leaseTime的时候启用 watchdog
            }
        }
        return acquired;
    });
    return new CompletableFutureWrapper<>(f);
}
```


以下代码就是定时任务执行的逻辑：

```java
protected CompletionStage<Boolean> renewExpirationAsync(long threadId) {
    return evalWriteAsync(getRawName(), LongCodec.INSTANCE, RedisCommands.EVAL_BOOLEAN,
            "if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then " + # 判断当前的锁是否已经释放
                    "redis.call('pexpire', KEYS[1], ARGV[1]); " +  # 没有释放就重新设置锁的过期时间 internalLockLeaseTime=30s
                    "return 1; " +
                    "end; " +
                    "return 0;",
            Collections.singletonList(getRawName()),
            internalLockLeaseTime, getLockName(threadId));
}
```

### 五、等待锁的机制
当锁被其他客户端持有时，当前客户端如何等待？

1. 客户端首先会尝试加锁。
2. 如果失败，它会订阅一个与锁相关的 Channel。
3. 然后进入一个循环，在循环中： 
   * 等待 Channel 上的释放消息。 
   * 一旦收到消息，就再次尝试加锁。 
   * 这个过程中也有超时机制，如果等待时间超过 waitTime 参数，则会放弃加锁。

这种方式比简单的循环 tryLock（自旋）要高效得多，因为它利用了 Redis 的 Pub/Sub 功能，避免了无用的网络请求和 CPU 消耗。







> 注意：如果你在加锁时显式指定了超时时间（例如 lock.lock(10, TimeUnit.SECONDS)），看门狗机制将不会生效。锁会在 10 秒后自动释放，无论你的业务是否执行完毕。这适用于你能够准确预估业务执行时间的场景。


原文链接: [http://herman7z.site](http://herman7z.site)

