---
title: 01 Maven下载安装配置教程
author: Herman
updateTime: 2024-08-11 21:34
desc: Maven下载安装配置教程
categories: 工具
tags: Maven
outline: deep
---

## maven是什么
Maven是基于项目对象模型(POM project object model)，可以通过一小段描述信息（配置）来管理项目的构建，报告和文档的软件项目管理工具。
通俗的讲maven就是专门用于构建和管理项目的工具，他可以帮助我们去下载我们所需要jar包，帮助我们去管理项目结构，帮助我们去实现项目的维护、打包等等...

---
## maven的安装

官网下载地址：[https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)

![](https://cdn.jsdelivr.net/gh/silently9527/images/008i3skNgy1gty0yhdps3j6153091mzj02.jpg)

在这里我们下载的版本是3.8.2，输入以下命令下载

```
wget https://apache.website-solution.net/maven/maven-3/3.8.2/binaries/apache-maven-3.8.2-bin.tar.gz
```

下载完成之后就直接解压就可以完成安装；

```
tar -zxvf apache-maven-3.8.2-bin.tar.gz
```

进入到bin目录执行命令`mvn -v`,看到如下界面表示安装正确

![](https://cdn.jsdelivr.net/gh/silently9527/images/008i3skNgy1gty0uxgzg4j61ok04udhk02.jpg)

---

## maven的环境变量配置

输入以下命令进入到当前用户根目录
```
cd ~
```

vim编辑当前目录下的文件`.bash_profile`，然后向文件中输入以下内容

```
MAVEN_HOME=/Users/xxx/Documents/apache-maven-3.8.2  ## 这里是你的maven解压路径
PATH=$MAVEN_HOME/bin:$PATH:.
export PATH
```

编辑完成之后使用source命令使文件生效

```
source .bash_profile
```

验证环境变量是否配置成功可以进入到任意目录，然后输入`mvn -v`检查是否出现来刚才的版本号信息

---
## setting文件配置

settings文件主要是针对于maven的使用来配置的，主要包括本地仓库的配置、仓库服务器的配置

进入到maven解压目录下conf目录即可看到settings文件

```
drwxr-xr-x@ 3 herman  staff     96  8  4 18:57 logging
-rw-r--r--@ 1 herman  staff  10742  8  4 18:57 settings.xml
-rw-r--r--@ 1 herman  staff   3747  8  4 18:57 toolchains.xml
```

1. 首先来配置maven下载jar包存放到什么目录，如果没有配置的话默认是在`${user.home}/.m2/repository`

![](https://cdn.jsdelivr.net/gh/silently9527/images/008i3skNgy1gty1e6ttpwj61io0jyaer02.jpg)
这里我设置的目录是`/data/maven/repository`，你可以根据你自己的情况来设置

```
<localRepository>/data/maven/repository</localRepository>
```

2. 配置阿里镜像

国内用户直接连接maven中心仓库下载速度比较慢，这里我们使用阿里云的镜像仓库；同样打开conf文件夹中的setting.xml文件，找到`</mirrors>`，在`</>`上一行中加入下面这段代码即可

```
<mirror>
    <id>alimaven</id>
    <name>aliyun maven</name>
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    <mirrorOf>central</mirrorOf>
</mirror>
<mirror>
    <id>alimaven</id>
    <mirrorOf>central</mirrorOf>
    <name>aliyun maven</name>
    <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
</mirror>
```
