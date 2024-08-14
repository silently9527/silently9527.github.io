---
title: 02 Coupons使用Docker镜像部署指南
author: Herman
updateTime: 2021-08-14 13:41
desc: 本篇文章主要是记录Coupons项目使用Docker的安装过程
categories: MyProjects
tags: 淘宝客/淘客开源
outline: deep
---


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
            <td align="center"><img width="200" src="https://raw.githubusercontent.com/silently9527/images/main/008eGmZEgy1gn4esj3uutj30b40b4jsx.jpg"></td>
            <td align="center"><img width="200" src="https://raw.githubusercontent.com/silently9527/images/main/008eGmZEgy1gn4et70ft2j30g40g4gm6.jpg"></td>
            <td align="center"><img width="200" src="https://raw.githubusercontent.com/silently9527/images/main/008eGmZEgy1gn4etut7d1j3076076aa2.jpg"></td>
            <td align="center"><img width="200" src="https://raw.githubusercontent.com/silently9527/images/main/008eGmZEgy1gn4euhcqonj30b40b43yt.jpg"></td>
        </tr>
    </tbody>
</table>

App下载地址(用手机访问才能正确下载IOS和安卓版本): [http://static.szjx.top/download/index.html](http://static.szjx.top/download/index.html)

Web站点(用手机访问，PC端未适配)：[http://m.szjx.top](http://m.szjx.top)

## 效果预览
<table>
    <tbody>
        <tr style="background-color: white;">
            <td align="center"><img width="200" src="https://raw.githubusercontent.com/silently9527/images/main/008eGmZEly1gn4hfiqyqoj30ku11240m.jpg"></td>
            <td align="center"><img width="200" src="https://raw.githubusercontent.com/silently9527/images/main/008eGmZEly1gn4hggo8thj30ku112aba.jpg"></td>
            <td align="center"><img width="200" src="https://raw.githubusercontent.com/silently9527/images/main/008eGmZEly1gn4hge5bwuj30ku112my9.jpg"></td>
            <td align="center"><img width="200" src="https://raw.githubusercontent.com/silently9527/images/main/008eGmZEly1gn4hgbc1e2j30ku112dhz.jpg"></td>
        </tr>
        <tr style="background-color: white;">
            <td align="center"><img width="200" src="https://raw.githubusercontent.com/silently9527/images/main/008eGmZEly1gn4hg8p7uhj30ku112acg.jpg"></td>
            <td align="center"><img width="200" src="https://raw.githubusercontent.com/silently9527/images/main/008eGmZEly1gn4hg5kj8lj30ku112tc6.jpg"></td>
            <td align="center"><img width="200" src="https://raw.githubusercontent.com/silently9527/images/main/008eGmZEly1gn4hg10sibj30ku112acs.jpg"></td>
            <td align="center"><img width="200" src="https://raw.githubusercontent.com/silently9527/images/main/008eGmZEly1gn4hft8rzcj30ku1123yt.jpg"></td>
        </tr>
    </tbody>
</table>

---

# 一、开始启动服务器

在 Docker Hub 上发布的镜像为 `silently9527/coupons-server`

1. 创建工作目录

```
mkdir -p ~/.coupons/conf && cd ~/.coupons/conf
```

2. 下载示例配置文件到工作目录

```
wget https://raw.githubusercontent.com/silently9527/coupons/master/doc/application.properties
```

3. 编辑配置文件，配置数据库或者端口等

```
vim application.properties 
```

> 如何注册第三方账号以及初始化数据库请参考 https://silently9527.cn/?p=67

4. 创建容器并运行

```
docker run -it -d --name coupons-server -p 9090:9090 -v ~/.coupons:/root/.coupons --restart=unless-stopped silently9527/coupons-server:v1.0.0
```

参数说明：
* -it： 开启输入功能并连接伪终端
* -d： 后台运行容器
* –name： 为容器指定一个名称
* -p： 端口映射，格式为 主机(宿主)端口:容器端口 ，可在 application.yaml 配置。
* -v： 工作目录映射。形式为：-v 宿主机路径:/root/.coupons，后者不能修改。
* –restart： 建议设置为 unless-stopped，在 Docker 启动的时候自动启动 coupons-server 容器。


5. 使用如下命令查看日志是否启动成功

```
docker ps
docker log -f xxx
```

![](https://raw.githubusercontent.com/silently9527/images/main/008i3skNgy1gu2or68as9j61vs07840102.jpg)

当看在日志中如下内容表示启动成功

![](https://raw.githubusercontent.com/silently9527/images/main/008i3skNgy1gu2ov30ps9j62ke0b0wmi02.jpg)


# 二、 Nginx安装
### Nginx的详细安装教程参考 [https://silently9527.cn/?p=66](https://silently9527.cn/?p=66)

### Nginx配置

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
# 三、前端项目打包

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
