---
title: 01 Mysql的安装教程
author: Herman
updateTime: 2024-08-11 21:34
desc: 本篇文章主要记录两种MySQL的安装方式，以及如何重置用户登陆密码，如何开启远程访问
categories: 中间件
tags: mysql
outline: deep
---


本篇文章主要记录两种MySQL的安装方式，以及如何重置用户登陆密码，如何开启远程访问


## 通过Docker镜像安装MySql

官方安装文档：[https://hub.docker.com/_/mysql](https://hub.docker.com/_/mysql)

使用Docker安装MySql十分的简单，执行以下命令即可运行MySQL服务
```
docker run --name mysql-server -v /my/own/datadir:/var/lib/mysql -v /my/custom:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7.35
```
参数说明：
* `/my/custom`: 这个目录是主机上的目录，可以替换成自己的目录，该目录用于存放MySQL的配置文件my.cnf; (my.cnf的内容本文后面会有)
* `MYSQL_ROOT_PASSWORD`: 指定root的登陆密码，更多的环境变了可以参考上面给出的官方安装文档
* `mysql:5.7.35`: 表示运行5.7.35版本的mysql，如果需要使用其他版本号可以在文档中找 https://hub.docker.com/_/mysql?tab=tags&page=1&ordering=last_updated
* `/my/own/datadir`: 需要替换成自己的目录，该目录用户存放Mysql的数据库文件

## 通过官方安装包安装MySql

#### 1. 首先创建mysql用户和mysql组
```
groupadd mysql 
useradd -r -g mysql mysql
```

#### 2. 去MySQL的官网下载安装包
官方下载地址：[https://downloads.mysql.com/archives/community/](https://downloads.mysql.com/archives/community/);

这里可以选择不同的版本号，这里我们选择5.7.34
![](https://cdn.jsdelivr.net/gh/silently9527/images/008i3skNgy1gtxrzg7w7wj61630h076v02.jpg)

#### 3. 下载完成之后就进行解压，进入到安装目录，执行以下命令初始化数据文件
![](https://cdn.jsdelivr.net/gh/silently9527/images/008i3skNgy1gtxs38kkb3j6118038mxp02.jpg)

```
bin/mysqld --initialize --user=mysql --datadir=./data --basedir=.
```

**注意在初始化数据完成之后会输出数据库的初始化密码，记得先保存下来**
![](https://cdn.jsdelivr.net/gh/silently9527/images/008i3skNgy1gtxub3urkdj60qe02laar02.jpg)


> 如果在安装目录下没有`data`目录就手动创建一个

#### 4. 将`support-files`下的`my-default.cnf`改名为`my.cnf`,拷贝到`/etc`目录下,修改`my.cnf`的内容如下
```
[mysqld]
basedir=/storage/mysql5.7.34
datadir=/storage/mysql5.7.34/data
# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0
# Settings user and group are ignored when systemd is used.
# If you need to run mysqld under a different user or group,
# customize your systemd unit file for mariadb according to the
# instructions in http://fedoraproject.org/wiki/Systemd
port=3309
sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES 
lower_case_table_names=1

#
# include all files from the config directory
#
!includedir /etc/my.cnf.d
```

- 1). 如果`my-default.cnf`内容不存在，也可以自己手动创建一个`my.cnf`把上面的内容拷贝到里面去
- 2). 其中`basedir`就是MySQL的安装文件根目录，`datadir`就是在初始化数据文件时指定的目录

#### 5. 设置mysql以服务运行并且开机启动
将support-files/mysql.server 拷贝为/etc/init.d/mysql并设置运行权限

```
cp mysql.server /etc/init.d/mysql
chmod +x /etc/init.d/mysql
```

把mysql注册为开机启动的服务

```
chkconfig --add mysql
```

启动/停止mysql/重启/查看MySQL运行状态
```
systemctl start mysql
systemctl stop mysql
systemctl restart mysql
systemctl status mysql
```

至此MySQL就安装完成了，接下来还需要重新设置root的密码

#### 6. 重置root的密码
使用如下命令连接登陆到mysql

```
bin/mysql --port=3309 -uroot -p
```
在此时输入刚才保存好的初始化密码即可登陆成功

然后输入以下命令来修改密码
```
ALTER USER 'root'@'localhost' IDENTIFIED BY '输入你的新密码';
```

## 开启MySQL的远程访问

1. 首先还是需要先登陆到MySQL `bin/mysql --port=3309 -uroot -p`
2. 赋予任何主机远程访问数据的权限
```
GRANT ALL PRIVILEGES ON *.* TO 'myuser'@'%'IDENTIFIED BY 'mypassword' WITH GRANT OPTION;
```
这里的`myuser`是MySQL中的用户，`mypassword`设置的是该用户远程访问的密码，**请不要和之前设置的本地密码混淆**；

如果你只想要让指定的ip能够远程访问，可以把`%`修改成具体的ip，比如root账号只能通过`192.168.1.3`连接成功
```
GRANT ALL PRIVILEGES ON *.* TO 'root'@'192.168.1.3'IDENTIFIED BY '123456' WITH GRANT OPTION;
```

3. 刷新权限生效
```
FLUSH PRIVILEGES;
```

4. 退出MySQL服务器
```
EXIT;
```

这样就可以在其它任何的主机上以root身份登录
