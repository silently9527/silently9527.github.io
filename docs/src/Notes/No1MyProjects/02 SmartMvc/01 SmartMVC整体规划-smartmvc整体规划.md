---
title: 01 SmartMVC整体规划
author: Herman
updateTime: 2021-08-14 13:41
desc: 深入解析SpringMVC核心原理：从手写简易版MVC框架开始(SmartMvc)
categories: MyProjects
tags: SpringMvc/MVC
outline: deep
---


#### IDE、源码、依赖版本
- 整个开发过程中我使用的IDE都是IDEA，可以根据读者自己习惯选择。当然我推荐是用IDEA
- 开发SmartMVC我们需要使用到Spring，我使用的版本`5.2.9`
- 开发完成后SmartMVC的源码会放在码云仓库： [https://gitee.com/silently9527/smart-mvc.git](https://note.youdao.com/) 
- JDK的版本1.8

#### 开发过程中的约定
- 为了便于用户后期理解和使用SpringMVC，所以在SmartMVC中所有组件的名称都和SpringMVC的保持一致
- 为了让SpringMVC的核心流程更加的清晰，减少读者的干扰，我拿出了自己18米的砍刀大胆的砍掉了SpringMVC中很多细节流程，达到去枝干立主脑，让读者能够更加顺畅的理解整个流转的过程


#### 3.1 SmartMVC总体架构
在开始撸代码之前我们需要先设计好整个框架架构，所有的设计都是先整体后局部的思想，如果上来就卷起袖子干，不经过仔细的设计是干不好框架的，所以我们先画出SmartMVC的设计图，熟悉SpringMVC的小伙伴可能看出来了，这个流程和SpringMVC的一致。
![](https://cdn.jsdelivr.net/gh/silently9527/images/2287721208-5fbfce05acfeb_articlex)

SpringMVC之所以如此的受欢迎，其中很重要的一个原因是轻耦合可插拔的组件设计，提供很好的扩展性和灵活性。虽然我们即将要做的SmartMVC是SpringMVC的浓缩版本，但是SpingMVC有的核心组件我们也必须的有，否则无法让小伙伴更好的理解整个过程。


#### 3.2 项目搭建

![](https://cdn.jsdelivr.net/gh/silently9527/images/896506658-5fc097c6f34e4_articlex)

smart-mvc项目中的pom.xml依赖引入

```
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-beans</artifactId>
        <version>5.2.9.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-core</artifactId>
        <version>5.2.9.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.2.9.RELEASE</version>
    </dependency>
    </dependencies>
```

smart-mvc-parent项目中pom.xml配置

```
 <dependencies>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-test</artifactId>
        <version>5.2.9.RELEASE</version>
    </dependency>
</dependencies>

<repositories>
    <repository>
        <id>nexus-aliyun</id>
        <name>Nexus aliyun</name>
        <layout>default</layout>
        <url>http://maven.aliyun.com/nexus/content/groups/public</url>
        <snapshots>
            <enabled>false</enabled>
        </snapshots>
        <releases>
            <enabled>true</enabled>
        </releases>
    </repository>
</repositories>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.1</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
                <encoding>UTF-8</encoding>
            </configuration>
        </plugin>
    </plugins>
</build>
```



#### 3.3 研发流程
首先我们需要先开发`HandlerMapping`，`HandlerMapping`的主要作用是根据请求的url查找`Handler`，其中涉及到的组件有
1. HandlerMethod
2. MappingRegistry
3. HandlerInterceptor
4. RequestMappingHandlerMapping


其实是开发`HandlerAdapter`，`HandlerAdapter`的主要作用是按照特定规则（HandlerAdapter要求的规则）去执行Handler，其中涉及到的组件有
1. HandlerMethodArgumentResolver
2. HandlerMethodReturnValueHandler
3. ModelAndView
3. RequestMappingHandlerAdapter

> 可能大家对于`Handler`，`HandlerMethod`，`HandlerMapping`，`HandlerAdapter`有疑惑，到底有啥区别？
可以这样理解：Handler是用来干活的工具；HandlerMapping用于根据URL找到相应的干活工具；HandlerAdapter是使用工具干活的人；在SpringMVC中Handler是一个抽象的统称，HandlerMethod只代表一种Handler

然后是开发`ViewResolver`、`View`，`ViewResolver`负责根据返回的`ModeAndView`查到对应的`View`，`View`负责渲染出视图返回给客户端，其中涉及到的组件有
1. InternalResourceViewResolver
2. InternalResourceView

最后我来开发`DispatcherServlet`，负责把所有的组件都组装起来统一调度，它是整个流程控制的中心，控制其它组件执行
1. FrameworkServlet


整个SmartMVC框架开发完成后，我们也需要开发一个springboot的starter，方便和springboot的集成

#### 3.4 搭建单元测试环境
建立如下的目录结构

![](https://cdn.jsdelivr.net/gh/silently9527/images/1057935185-5fc2523435782_articlex)

创建JavaConfig配置主类`AppConfig`

```
@Configuration
@ComponentScan(basePackages = "com.silently9527.smartmvc")
public class AppConfig {

}
```

创建单元测试基类，主要是配置Spring的测试环境，方便后期开发单元测试

```
@RunWith(SpringJUnit4ClassRunner.class)  // Junit提供的扩展接口，这里指定使用SpringJUnit4ClassRunner作为Junit测试环境
@ContextConfiguration(classes = AppConfig.class)  // 加载配置文件
public class BaseJunit4Test {
}
```

