---
title: 06 [Coupons]在Linux环境部署指南
author: Herman
updateTime: 2021-08-14 13:41
desc: 本篇文章主要是记录Coupons项目在Linux环境下的安装过程
categories: MyProjects
tags: 淘宝客/淘客开源
outline: deep
---

本篇文章主要是记录Coupons项目在Linux环境下的安装过程

Coupons是一个从前端到后端完全开源的淘宝客项目，当初学习完uniapp之后想做一个实战项目，所以才研发了这个项目。由于本人平时主要从事后端研发，界面样式非我所长，所以大家觉得界面效果不好的可以自己修改。目前项目已经支持打包成App、微信小程序、QQ小程序、Web站点；理论上其他小程序支持，可能需要微调

Github地址：
项目地址：[https://github.com/silently9527/coupons](https://github.com/silently9527/coupons)

## 在线体验地址
<table>
    <tbody>
        <tr>
            <td align="center">App下载地址</td>
            <td align="center">QQ小程序</td>
            <td align="center">微信小程序</td>
            <td align="center">Web站点</td>
        </tr>
        <tr style="background-color: white;">
            <td align="center"><img width="200" src="https://tva1.sinaimg.cn/large/008eGmZEgy1gn4esj3uutj30b40b4jsx.jpg"></td>
            <td align="center"><img width="200" src="https://tva1.sinaimg.cn/large/008eGmZEgy1gn4et70ft2j30g40g4gm6.jpg"></td>
            <td align="center"><img width="200" src="https://tva1.sinaimg.cn/large/008eGmZEgy1gn4etut7d1j3076076aa2.jpg"></td>
            <td align="center"><img width="200" src="https://tva1.sinaimg.cn/large/008eGmZEgy1gn4euhcqonj30b40b43yt.jpg"></td>
        </tr>
    </tbody>
</table>

App下载地址(用手机访问才能正确下载IOS和安卓版本): [http://static.szjx.top/download/index.html](http://static.szjx.top/download/index.html)

Web站点(用手机访问，PC端未适配)：[http://m.szjx.top](http://m.szjx.top)

## 效果预览
<table>
    <tbody>
        <tr style="background-color: white;">
            <td align="center"><img width="200" src="https://tva1.sinaimg.cn/large/008eGmZEly1gn4hfiqyqoj30ku11240m.jpg"></td>
            <td align="center"><img width="200" src="https://tva1.sinaimg.cn/large/008eGmZEly1gn4hggo8thj30ku112aba.jpg"></td>
            <td align="center"><img width="200" src="https://tva1.sinaimg.cn/large/008eGmZEly1gn4hge5bwuj30ku112my9.jpg"></td>
            <td align="center"><img width="200" src="https://tva1.sinaimg.cn/large/008eGmZEly1gn4hgbc1e2j30ku112dhz.jpg"></td>
        </tr>
        <tr style="background-color: white;">
            <td align="center"><img width="200" src="https://tva1.sinaimg.cn/large/008eGmZEly1gn4hg8p7uhj30ku112acg.jpg"></td>
            <td align="center"><img width="200" src="https://tva1.sinaimg.cn/large/008eGmZEly1gn4hg5kj8lj30ku112tc6.jpg"></td>
            <td align="center"><img width="200" src="https://tva1.sinaimg.cn/large/008eGmZEly1gn4hg10sibj30ku112acs.jpg"></td>
            <td align="center"><img width="200" src="https://tva1.sinaimg.cn/large/008eGmZEly1gn4hft8rzcj30ku1123yt.jpg"></td>
        </tr>
    </tbody>
</table>


----
# 一、运行环境

### Java
1. 使用yum来搜索安装包 `yum search openjdk`
   ![](https://raw.githubusercontent.com/silently9527/images/main/008i3skNgy1gty1ttcjeej61kq0hitgf02.jpg)

2. 这里我们选择安装Java8的开发环境,执行如下命令
```
yum -y install java-1.8.0-openjdk.x86_64
```
3. 验证是否安装成功
```
java -version
```

输入如下内容表示安装成功
```
openjdk version "1.8.0_302"
OpenJDK Runtime Environment (build 1.8.0_302-b08)
OpenJDK 64-Bit Server VM (build 25.302-b08, mixed mode)
```

### Maven
Maven的安装过程参考

### MySQL
[Mysql的详细安装教程参考](docs/src/Notes/Middleware/01 Mysql的安装教程以及开启远程访问.md)

### Redis
[Redis的详细安装教程参考链接](docs/src/Notes/Middleware/03 Redis的安装教程.md)

### Nginx
[Nginx的详细安装教程参考](docs/src/Notes/Middleware/04 Nginx安装的详细教程.md)

----

# 二、注册第三方账号
### 1. 注册大淘客账号
MallCoupons后端项目中使用的商品数据都是由大淘客API提供 ;

首先需要注册大淘客账号[https://www.dataoke.com/](https://www.dataoke.com/) 

进入到大淘客开放平台创建一个应用，为应用一键添加所有的API接口
![](https://raw.githubusercontent.com/silently9527/images/main/008i3skNgy1gtz7w4jxowj60u00fkmxm02.jpg)

### 2. 开通MobTech免费短信服务(非必须，需要打包app应用才是需要使用)
MallCoupons在App中是通过手机号和验证码的方式登录，MobTech提供了免费的短信验证码服务。

注册MobTech账号 [https://www.mob.com/](https://www.mob.com/)

进入到开发者平台，创建应用
![](https://raw.githubusercontent.com/silently9527/images/main/008i3skNgy1gtz7we5u64j60u00893yh02.jpg)

### 3. 注册QQ小程序(非必须，根据个人需要)
### 4. 注册微信小程序(非必须，根据个人需要)

---
# 三、下载源码并解压

```
wget https://codeload.github.com/silently9527/coupons/zip/refs/heads/master
unzip coupons-master.zip
```

---
# 四、创建数据库并初始化

1. 输入密码登陆MySQL数据库
```
mysql --port=3309 -uroot -p
```

2. 创建数据库mall-coupons

```
create database mall-coupons default character set utf8mb4 collate utf8mb4_unicode_ci;
```

3. 执行如下命令初始化数据库

```
use mall-coupons;
source /Users/xxx/Downloads/coupons-master/doc/scheme.sql
```

> source命令后面的文件路径替换成你自己的路径；

----
# 五、后端项目打包

1. 进入到解压项目的coupons-master/server/src/main/resources目录下
```
cd coupons-master/server/src/main/resources
```

2. vim编辑文件`application-prod.properties`，修改文件中的必要参数

```
#填写前面淘客注册应用的 AppKey、AppSecret
dataoke.appKey=
dataoke.appSecret=

#填写前面注册QQ小程序的appId、appSecret
spring.social.qq.app-id=
spring.social.qq.app-secret=

#填写前面注册微信小程序的appId、appSecret
spring.social.wechat.app-id=
spring.social.wechat.app-secret=

# 配置MySQL数据库的地址
spring.datasource.url=jdbc:mysql://localhost:3306/mall-coupons?autoReconnect=true&useUnicode=true&characterEncoding=utf-8&allowMultiQueries=true&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=xxx

# 配置Redis服务器地址
spring.redis.host=
spring.redis.password=
spring.redis.port=

# mob短信服务的appkey，需要打包收集app的才需要
mob.service.appkey=
```

3. 打包Java项目
```
mvn clean package -DskipTests
```

当出现了Build Success的时候就表示打包完成

![](https://raw.githubusercontent.com/silently9527/images/main/008i3skNgy1gtz6iv61w1j61fu0lan4702.jpg)

打包完成之后当前目录会生成`target`目录，`cd target`进入到目录，查看是否有生成文件`mall-coupons-server-0.0.1-SNAPSHOT.jar`

![](https://raw.githubusercontent.com/silently9527/images/main/008i3skNgy1gtz6i0q7n3j619e08umzr02.jpg)

4. 启动运行`mall-coupons-server-0.0.1-SNAPSHOT.jar`

```
java -Djava.security.egd=file:/dev/./urandom -jar mall-coupons-server-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod > ./mall-coupons-server.log  &
```

---
# 六、Nginx配置

1. 进入到目录`/etc/nginx/conf.d`,创建配置文件`coupon.conf`

```
cd /etc/nginx/conf.d
touch coupon.conf
```

2. 编辑配置文件`coupon.conf`，输入如下内容：

```
upstream coupons-services {
    server localhost:9090 weight=10;
}

server {
    listen       80;
    server_name  你的域名;
    include /etc/nginx/default.d/*.conf;

    location / {
	    add_header Access-Control-Allow-Origin *;
    	add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    	add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization,x-auth-token'; 
    	if ($request_method = 'OPTIONS') {
            return 204;
    	}
        proxy_pass http://coupons-services/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size    10000m;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;
    }

    error_page 404 /404.html;
        location = /40x.html {
    }

    error_page 500 502 503 504 /50x.html;
        location = /50x.html {
    }
}
```

3. 重启nginx

```
systemctl restart nginx
```

----
# 七、前端项目打包

1. 前端项目的源码目录`coupons-master/client`
   导入前端代码到HBuilder中，如何使用HBuilder导入项目、打包可以参考官方文档 [https://uniapp.dcloud.io/quickstart-hx](https://uniapp.dcloud.io/quickstart-hx)

2. 修改发送短信的模版id（只有需要打包app才需要），文件的路径`pages/public/login.vue`中92行配置短信模板的id，这里的模版id需要在短信平台mob上面申请

![](https://raw.githubusercontent.com/silently9527/images/main/008i3skNgy1gtz7l1dcw0j60pc0gbaao02.jpg)

3. 在uniapp的插件中心购买集成mob的插件；MobTech短信原生插件 [https://ext.dcloud.net.cn/plugin?id=2189](https://ext.dcloud.net.cn/plugin?id=2189)

4. 之后在HBuilder中配置appkey
![](https://raw.githubusercontent.com/silently9527/images/main/008i3skNgy1gtz7mq0h7tj60u00ktq3s02.jpg)

5. 配置后台api的请求地址，编辑`client/config.js`输入自己服务器的域名地址

```
module.exports = {
    // APIHOST: "http://localhost:9090"
}
```
