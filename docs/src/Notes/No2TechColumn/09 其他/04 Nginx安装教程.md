---
title: 04 Nginx安装教程
author: Herman
updateTime: 2024-08-11 21:34
desc: Nginx安装的详细教程
categories: 中间件
tags: Nginx
outline: deep
---

# Nginx是什么
它是一款高性能的http服务器/反向代理服务器。 并且cpu、内存等资源消耗却非常低，运行非常稳定。

# Nginx应用场景
1. http服务器：Nginx是一个http服务可以独立提供http服务。可以做网页静态服务器。
2. 虚拟主机：可以实现在一台服务器虚拟出多个网站。例如个人网站使用的虚拟主机。
3. 反向代理、负载均衡：当网站的访问量达到一定程度后，单台服务器不能满足用户的请求时， 需要用多台服务器集群可以使用nginx做反向代理。并且多台服务器可以平均分担负载， 不会因为某台服务器负载高宕机而某台服务器闲置的情况。

# Nginx 安装

Nginx的安装有两种方式：通过安装包来安装以及通过源码来安装

### 首先我使用Nginx安装包来安装，输入如下命令即可安装完成：
```
yum -y install nginx
```

安装完成之后nginx的配置文件在`/etc/nginx`目录、静态资源文件存放在`/usr/share/nginx`目录下；

这样就完成nginx的安装，是不是so easy！


---
### 使用源码来安装

1. 下载nginx源码

官方下载地址：[http://nginx.org/en/download.html](http://nginx.org/en/download.html)

![](https://cdn.jsdelivr.net/gh/silently9527/images/008i3skNgy1gty2hqgoxwj60lf07kwf002.jpg)

```
wget http://nginx.org/download/nginx-1.21.1.tar.gz
```

解压到当前目录
```
tar -zxvf nginx-1.21.1.tar.gz
```

2. 安装编译工具及库文件
```
yum -y install make zlib zlib-devel gcc-c++ libtool  openssl openssl-devel pcre
```

3. 编译安装
```
cd nginx-1.21.1
./configure --prefix=/data/nginx 
make
install
```

> 这里指定的安装目录是`/data/nginx`

4. 进入到安装目录`/data/nginx`,启动nginx
```
sbin/nginx
```

![](https://cdn.jsdelivr.net/gh/silently9527/images/008i3skNgy1gty2v8oyw1j60ez05174q02.jpg)


5. nginx的常用命令
```
sbin/nginx -s reload            # 重新载入配置文件
sbin/nginx -s reopen            # 重启 Nginx
sbin/nginx -s stop              # 停止 Nginx
```
