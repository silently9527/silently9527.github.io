---
title: 03 Redis的安装教程
author: Herman
updateTime: 2024-08-11 21:34
desc: Redis的安装教程
categories: 中间件
tags: Redis
outline: deep
---


## 使用Docker来安装Redis

#### 1. 使用Docker最为简单，只需要执行以下命令即可

```
docker run -p 7001:7001 --name redis -v /data/shell/redis/redis.conf:/etc/redis/redis.conf -d redis redis-server /etc/redis/redis.conf
```

参数说明：
* `-p 7001:7001`: 指定来redis的端口为7001，并且和主机的7001对应
* `/data/shell/redis/redis.conf`: 指定redis的启动配置文件，需要根据自己的情况修改实际的目录

#### 2. redis.conf的配置文件的下载地址 [redis.conf](http://cdn.silently9527.cn/redis_1630239144896.conf)

> 注意：redis.conf中的 `requirepass`是redis的连接密码; redis.conf文件中的`port 7001`不要修改，如果想要修改需要保存和前面的启动脚步中的端口保持一直


## 使用源码安装redis

#### 1. 先去官方网站下载最新版本的redis， [下载地址](https://redis.io/download), 拷贝下载地址后使用如下命令在服务器上下载文件

```
wget http://download.redis.io/releases/redis-6.0.8.tar.gz
```

#### 2. 下载完成后解压文件到当前目录

```
tar -zxvf redis-6.0.8.tar.gz
```

#### 3. 编译&安装redis

```
cd /Users/Silently9527/Documents/redis/redis-6.0.8
make
make install PREFIX=/Users/Silently9527/Documents/redis　# 指定redis的安装目录
```

如果在安装的过程中提示找不到 gcc；执行如下命令安装gcc++
```
yum install gcc-c++
yum -y install centos-release-scl
yum -y install devtoolset-9-gcc devtoolset-9-gcc-c++ devtoolset-9-binutils
```

最后编译安装完成后的目录结构如下：
```
drwxr-xr-x   8 herman  staff      256  8 29 20:27 bin
drwxr-xr-x@ 23 herman  staff      736  9 10  2020 redis-6.0.8
-rw-r--r--@  1 herman  staff  2247528  8 29 20:17 redis-6.0.8.tar.gz
```

#### 4. 拷贝redis.conf到bin目录中

```
cp redis-6.0.8/redis.conf bin
```

#### 5. 启动redis

```
cd bin
redis-server redis.conf
```

当看到如下界面就表示启动成功

![](https://cdn.jsdelivr.net/gh/silently9527/images/008i3skNgy1gtxxr1rmg0j61j00o4dk402.jpg)


## 使用客户端程序连接到redis服务器
我们需要再次进入到bin目录下，可以看到有个文件redis-cli，这就是我们编译出来的客户端程序，使用如下命令连接：

```
redis-cli -h localhost -p 6379
```

如果我们在redis.conf中有设置密码(默认是没有设置密码的)，虽然能够连接成功，但依然不会使用redis的命令，比如

![](https://cdn.jsdelivr.net/gh/silently9527/images/008i3skNgy1gtxxzoqyt2j60lq05idg802.jpg)

这时候需要我们通过如下命令认证：
```
AUTH 123456
```



## 后台启动redis服务器
上面我们虽然启动来redis，但是如果把当前窗口关闭，redis也会被关闭，如果才能让redis后台启动呢？

十分的简单，把redis.conf中的配置项 `daemonize` 改为 yes

![](https://cdn.jsdelivr.net/gh/silently9527/images/008i3skNgy1gtxy6kb07xj612i06odh002.jpg)

修改完成之后在重启redis


## 关闭redis
```
pkill redis
```

千万不要使用 `kill -9`，有可能使用数据丢失

也可以通过客户端连接工具，连接上之后使用shutdown命令

![](https://cdn.jsdelivr.net/gh/silently9527/images/008i3skNgy1gtxybnouqhj60hc09s0tf02.jpg)

