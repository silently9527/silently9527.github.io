---
title: 01 Http协议
author: Herman
updateTime: 2021-08-14 13:41
desc: Http协议
categories: 面经
tags: http
outline: deep
---


### 前言
我被Hr领进了一个小黑屋，让我在这里等面试官，过来一会，一位穿着拖鞋的中年男子走了进来，看着他绝顶聪明的发际线，知道这肯定是位大佬，我心里倍感到了压力；

![](https://cdn.jsdelivr.net/gh/silently9527/images/b5881831a4ac4d36bfa88ffe5f438afc%7Etplv-k3u1fbpfcp-watermark.image)

面试官果然不是盖的，刚坐下后就开始立即暴力输出了

---
### 面试官：我看你简历上写了熟悉Http协议，当我们使用浏览器访问网址: `https://silently9527.cn`会发生什么？
我：（这尼玛就是怕被搞事情所以没写精通，这也被搞。会发生什么，当然是展示出网页啊，大脑飞速旋转，脖子快断的时候，终于想到面试官可能想要问什么了）

我：英俊潇洒的面试官，你好！

首先浏览器会去访问DNS服务器，查询到域名对应的ip地址是多少，然后浏览器再去访问这个ip地址；如果还要往底层在说的话，就会涉及到tcp/ip的分层，我还是来画张图吧。

![](https://cdn.jsdelivr.net/gh/silently9527/images/49bb9105f7fe4ba3b2e4fb3f4e38a5c4%7Etplv-k3u1fbpfcp-watermark.image)

服务器返回资源的过程也是类似的方式

---
### 面试官：你刚才有谈到tcp/ip的分层，能详细说下吗?
我：（还好前前大学女友没把我当年上课的笔记给扔掉，刚好昨晚找回来温习了一下，温故而知新！只是笔记而已，大家别想歪了！）
插图


我：TCP/IP协议族分为4层：应用层、传输层、网络层、数据链路层
- 应用层：主要是与应用通信使用到的协议，比如：FTP、DNS、HTTP
- 传输层：为应用层提供在两台机器之间数据传输，有两种协议：TCP、UDP
- 网络层：两台机器之间在传输的过程中会经过多个路由器有多条路线，网络层主要是从中选择一条路线
- 数据链路层：用来处理连接网络的硬件部分，比如说网卡、设备驱动等

---
### 面试官：在tcp/ip的分层里面，当客户端发起http请求到达服务端的过程中，数据包的封装以及解包的过程是怎样的？

![](https://cdn.jsdelivr.net/gh/silently9527/images/bcfc91c5d7b3463dae8790339edba94c%7Etplv-k3u1fbpfcp-watermark.image)

我：在这个分层中，每次网络请求都会按照分层的顺序与对方进行通信，发送端从应用层往下走，接收端从数据链路层往上走；以Http来举例的话：
1. 客户端在应用层（Http协议）发起一个HTTP请求
2. 在传输层（TCP协议）把从应用层收到的Http请求数据包分隔成小的数据包，并打好序
3. 网络层（IP协议）收到数据包后选择发送路径
4. 服务器收到数据后按照顺序往上发送，直到应用层收到数据

![](https://cdn.jsdelivr.net/gh/silently9527/images/9dd5b5f4ad5644ef838e642e3bc8da80%7Etplv-k3u1fbpfcp-watermark.image)

在发送方每经过一层，就会被加上该层的首部信息，当接收方接受到数据后，在每一个层会去掉对应的首部信息

---
### 面试官：TCP如何保证数据可靠到达目的地？
我：TCP协议采用的三次握手策略
- 第一次握手：建立连接时，客户端发送 syn 包(syn=j)到服务器，并进入 SYN_SEND 状态，等待服务器确认； 
- 第二次握手：服务器收到 syn 包，必须确认客户的 SYN（ack=j+1），同时自己也发送一个 SYN 包（syn=k），即 SYN+ACK 包，此时服务器进入 SYN_RECV 状态； 
- 第三次握手：客户端收到服务器的 SYN＋ACK 包，向服务器发送确认包 ACK(ack=k+1)，此包发送完毕，客户端和服务器进入 ESTABLISHED 状态，完成三次握手。

![](https://cdn.jsdelivr.net/gh/silently9527/images/d3d89a2a1c5846d28febbe5468b070d5%7Etplv-k3u1fbpfcp-watermark.image)

![](https://cdn.jsdelivr.net/gh/silently9527/images/69633dc236984a92ac417217b2d45237%7Etplv-k3u1fbpfcp-watermark.image)


---
### 面试官：为什么是三次握手，而不是两次或者4次呢？
我：假如说是两次握手，如果客户端自己处理异常或者是服务器返回的ack消息丢失，那么客服端会认为连接建立失败，再次重新发送请求建立连接，但是服务端却无感知，以为连接以及正常建立，导致服务器建立无用的连接，浪费资源

假如四次握手，如果三次已经足够，那就不需要四次了。如果四次的话，最后一个ACK丢失，那么又会出现两次握手的问题。

---
### 面试官：竟然都到说了三次握手，那就说说四次挥手吧？

![](https://cdn.jsdelivr.net/gh/silently9527/images/0ab02387a9ab4252a0d2cb652c3c0c35%7Etplv-k3u1fbpfcp-watermark.image)

我：
- 客户端向服务器发送FIN希望断开连接请求。
- 服务器向客户端发送ACK，表示同意释放连接。
- 服务器向客户端发送一个FIN表示希望断开连接。
- 客户端向服务器返回一个ACK表示同意释放连接。

![](https://cdn.jsdelivr.net/gh/silently9527/images/1e0bd85658c14590a77083ba08abecf0%7Etplv-k3u1fbpfcp-watermark.image)

---
### 面试官：为什么断开连接需要四次而不是三次呢？
我：因为当服务器收到客户端断开连接的请求后，服务器不能立即断开连接，因为可能服务器端还有数据未发送完成，所以只能回复一个ACK表示我已收到消息；等服务器端数据发送完成之后再发送一个FIN希望端开连接的消息，客户端回复ACK之后，就可以安全断开了

---
### 面试官：为什么说Http协议无状态协议？怎么解决Http协议无状态？

![](https://cdn.jsdelivr.net/gh/silently9527/images/81e638e8e69a47c98178f91258d5217b~tplv-k3u1fbpfcp-watermark.image)

我：本身HTTP协议是不保存状态的，自身不对请求和响应直接的通信状态进行保存，所以是无状态的协议。因为在有些场景下我们需要保存用户的登录信息，所以引入了cookie来管理状态。客户端第一次请求服务器的时候，服务器会生成cookie添加在响应头里面，以后客户端的每次请求都会带上这个cookie信息。

![](https://cdn.jsdelivr.net/gh/silently9527/images/6e7dc580962148ca9936b300d238c916%7Etplv-k3u1fbpfcp-watermark.image)

---
### 面试官：Cookie与Session有什么区别？
我：
- Cookie是有服务器生成，写入到请求的响应头中，浏览器会保存；服务器通过`Set-Cookie`字段向客户端设置Cookie，属性：
1. Name=value 设置cookie的名字和值 
2. expires 设置Cookie的有效期 
3. domain=域名 表示只能在哪个域名下生效 
4. secure表示只能在Https的通信时才发送cookie 
5. HttpOnly 表示不能被javascript访问
- Session也是服务器生成的，表示服务器中的一片内存，每个客服端对应一个Session，客户端之间的Session相互独立；每次客户端发起请求，都会带上Cookie，Cookie里面一般都会有一个JSESSIONID，服务器就是通过这个JESSIONID来找到客户端对应Session，所以一般用户的登录信息都会存放在Session；这样也解决了Http协议无状态的问题

---
### 面试官：Http协议中有那些请求方式？如何选择使用什么方法？
我：
- GET : 获取资源; 所以查询操作一般用GET
- POST: 传输实体主体, 创建更新操作用POST
- PUT: 传输文件
- HEAD: 获取报文首部，如果想要查询某个请求的头信息可以用这个方法
- DELETE: 删除资源，所以删除操作用DELETE
- OPTIONS: 询问服务器支持哪些方法，响应头中返回  Allow: GET,POST,HEAD
- TRACE: 追踪路径;在请求头中在Max-Forwards字段设置数字，每经过一个服务器该数字就减一，当到0的时候就直接返回，一般通过该方法检查请求发送出去是否被篡改

---
### 面试官：Http如何实现持久连接的呢？
![](https://cdn.jsdelivr.net/gh/silently9527/images/619fc50e679e4194bc9f79442537b41a%7Etplv-k3u1fbpfcp-watermark.image)

我：（毛线啊，我只是个来面试Java的初级程序员，干嘛要反复拿Http来摩擦我呢？！不过没事，我皮的很，这道题我又会）
我：在HTTP协议的早期，每进行一次HTTP通信就要断开一次tcp连接，当时传输的内容少还能接受，现在每个网页一般的会包含大量的图片，每次请求都会造成TCP连接的连接和断开，增加通信的开销。

![](https://cdn.jsdelivr.net/gh/silently9527/images/9cd827ba85a64f67ab3ac0525ae5a03c%7Etplv-k3u1fbpfcp-watermark.image)

为了解决这个问题所以想出了持久连接的方法，也叫做keep-alive，只要一端没有提出断开连接就会一直保持TCP连接的状态。持久化连接使的客户端可以同时并发发送多个请求，不用一个接着一个的等待响应。

---
### 面试官：大文件的断点续传是如何实现的呢？

![](https://cdn.jsdelivr.net/gh/silently9527/images/4702e3f3bc5f4289b40382b743730724%7Etplv-k3u1fbpfcp-watermark.image)

我：HTTP请求头有个Range字段；我们下载文件的时候如果遇到网络中断，如果重头开始下载会浪费时间，所以我们可以从上一次中断处继续开始下载；具体的操作：

```
Range: bytes=5001-10000
```

或者指定5001以后的所有数据

```
Range: bytes=5001-
```
响应返回的状态码是206

---
### 面试官：刚才你有提到状态码，那常见Http协议状态码有哪些？
我：（面试官我简历上忘记写了，我曾经是学霸，记忆力好，背书没输过）

![](https://cdn.jsdelivr.net/gh/silently9527/images/9d69204b913447a4a8f674878814d6e3%7Etplv-k3u1fbpfcp-watermark.image)

我：HTTP的状态码主要分为了四类：
- 2xx: 成功状态码，表示请求正常处理完毕
- 3xx: 重定向状态码，表示需要附加操作才能完成成请求
- 4xx: 客户端错误状态码
- 5xx: 服务器错误状态码

常见的状态码有： 200（请求正常处理完成）、204（请求处理成功，但是没有资源返回）、206（表示客户端进行了范围请求，响应报文中包含了Content-Range）、301（永久性重定向，请求的资源以及被分配到了新的地址）、302（临时重定向，希望用户并且请求新地址）、400（客户端请求报文出现错误，通常是参数错误）、401（客户端未认证错误）、403（没有权限访问该资源）、404（未找到请求的资源）、405（不支持该请求方法，如果服务器支持GET，客户端用POST请求就会出现这个错误码）、500（服务器异常）、503（服务器不能提供服务）

我：（这我都能记住，是不是的给我点个赞）（已疯狂暗示兄弟们点赞，不要白嫖哦）


---
### 面试官：HTTP报文由哪些部分组成？

![](https://cdn.jsdelivr.net/gh/silently9527/images/314120a0c9aa44a8aad9564863c1bb63%7Etplv-k3u1fbpfcp-watermark.image)

我：报文的类型分为了请求报文和响应报文两种；
- 请求报文包含三部分：
1. 请求行：包含请求方法、URI、HTTP版本信息
2. 请求首部字段
3. 请求内容实体

- 响应报文包含三部分：
1. 状态行：包含HTTP版本、状态码、状态码的原因短语
2. 响应首部字段
3. 响应内容实体

---
### 面试官：Http有哪些问题，什么是https？
我：Http的问题
- 通信使用明文不加密，内容可能被窃听
- 不验证通信方身份，可能遭到伪装
- 无法验证报文完整性，可能被篡改
HTTPS就是HTTP加上SSL加密处理（一般是SSL安全通信线路）+认证+完整性保护

---
### 面试官：HTTPS是如何保证数据安全的？

![](https://cdn.jsdelivr.net/gh/silently9527/images/9dd5b5f4ad5644ef838e642e3bc8da80%7Etplv-k3u1fbpfcp-watermark.image)

我：首先需要说到两种加密机制
- 对称加密：客户端和服务器都使用了同一个密钥加密，效率较高
- 非对称加密：分为了公开密钥和私有密钥，公开密钥可以在网络上传输，使用公开密钥加密后的内容只有私有密钥才能解密，效率较低

由于这两个加密的特别，HTTPS采用的时候混合加密机制，在交换密钥的阶段使用的是非对称加密，在建立通信交换报文阶段采用的是对称加密

以访问 https://silently9527.cn 举例
1. 浏览器向服务器发起请求，服务器在接收到请求之后，返回证书和密钥
2. 浏览器向第三方证书机构验证证书是否合法，如果不合法浏览器将会弹出警告页面，让用户选择是否继续访问
3. 如果证书合法浏览器生成随机串，使用公钥加密发送给服务器，服务器使用私钥解密出随机串，服务器使用随机串加密内容返回给客户端
4. 之后客户端和服务器端都将通过随机串进行对称加密

![](https://cdn.jsdelivr.net/gh/silently9527/images/cbcfad028ba948fa87aad54cc9ec9c33%7Etplv-k3u1fbpfcp-watermark.image)

---
### 面试官：为什么需要证书认证机构，不要https就不安全了吗？
我：虽然https是可以加密的，但是因为请求还是可以被拦截，如何让客户端知道返回给自己的公钥是真实服务器给的而不是攻击者给的；这就需要验证证书的合法性，所以需要引入第三方认证机构。通常https的证书需要到第三方机构去申请购买，如果是我们自己生成的https证书浏览器验证不过会弹出警告。

---
### 面试官：那浏览器是如何保证证书验证的过程是安全的呢？

![](https://cdn.jsdelivr.net/gh/silently9527/images/3ff1a71ab5004320b0294db95d698a56%7Etplv-k3u1fbpfcp-watermark.image)

我：浏览器在向证书认证中心验证证书的过程使用的也是非对称加密，这里想要让公钥能够安全的转交给客户端，是非常困难的，所以浏览器的开发商通常会在浏览器内部植入常用认证机构的公开密钥

---
### 面试官：http相关的协议掌握的还可以，我们继续聊聊Java.....


能撑到现在，你自己都忍不住自己给自己点个赞了!（再次暗示点赞）

参考：《图解HTTP》
