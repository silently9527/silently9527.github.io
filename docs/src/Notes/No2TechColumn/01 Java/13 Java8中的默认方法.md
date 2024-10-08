---
title: 13 Java8中的默认方法
author: Herman
updateTime: 2021-08-14 13:41
desc: Java8中的默认方法
categories: Java
tags: Java8新特性
outline: deep
---

![](https://cdn.jsdelivr.net/gh/silently9527/images/3217296966-5fbe6dfa8fb3d_articlex)

#### 背景
在Java8之前，定义在接口中的所有方法都需要在接口实现类中提供一个实现，如果接口的提供者需要升级接口，添加新的方法，那么所有的实现类都需要把这个新增的方法实现一遍，如果说所有的实现类能够自己控制的话，那么还能接受，但是现实情况是实现类可能不受自己控制。比如说Java中的集合框架中的List接口添加一个方法，那么Apache Commons这种框架就会很难受，必须修改所有实现了List的实现类

---

#### 现在的接口有哪些不便
1. 向已经发布的接口中添加新的方法是问题的根源，一旦接口发生变化，接口的实现者都需要更新代码，实现新增的接口
2. 接口中有些方法是可选的，不是所有的实现者都需要实现，这个时候实现类不得不实现一个空的方法，或者是提供一个`Adapter`对接口中所有的方法做空实现，在Spring中我们可看到很多这种例子，比如`WebMvcConfigurerAdapter`

```
@Deprecated
public abstract class WebMvcConfigurerAdapter implements WebMvcConfigurer {

	@Override
	public void configurePathMatch(PathMatchConfigurer configurer) {
	}


	@Override
	public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
	}

	@Override
	public void configureAsyncSupport(AsyncSupportConfigurer configurer) {
	}
	
	省略其他代码...
}
```
在Java8以后这些类都被标注成了过期`@Deprecated`

---

#### 默认方法的简介
为了解决上述问题，在Java8中允许指定接口做默认实现，未指定的接口由实现类去实现。如何标识出接口是默认实现呢？方法前面加上`default`关键字。比如Spring中的`WebMvcConfigurer`

```
public interface WebMvcConfigurer {

	default void configurePathMatch(PathMatchConfigurer configurer) {
	}

	default void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
	}

	default void configureAsyncSupport(AsyncSupportConfigurer configurer) {
	}
	
	省略其他代码...
}
```

> 从现在看来，可能大家都会有个疑问，默认方法和抽象类有什么区别呢？
> - 1. 默认方法不能有实例变量，抽象类可以有
> - 2. 一个类只能继承一个抽象类，当时可以实现多个接口

---

#### 默认方法的使用场景

- 可选方法
为接口提供可选的方法，给出默认实现，这样实现类就不用显示的去提供一个空的方法；这种场景刚才我们在上面已经说到了，spring中有大量的例子

- 实现多继承
继承是面向对象的特性之一，在Java中一直以来都是单继承的原则，Java8中默认方法为实现多继承提供了可能（由于接口中不能有实例对象，所以能够抽象的到接口中的行为一般都是比较小的模块）；从个人的经历来看，做游戏是训练自己面向对象思维的最好方式（以后有机会分享一下小游戏的制作），因为现在大部分学Java的同学学完Java基础后就直接进入JavaWeb的学习，整合各种框架，只能在通用的三层架构（Controller、Service、Dao）中写自己的逻辑。

相信很多人在都做个坦克大战的游戏，如果用Java8中的默认方法如何设计好多继承呢？
![](https://cdn.jsdelivr.net/gh/silently9527/images/4068385045-5fbe60ba6f485_articlex)

这里我们举个简单的例子，定义了三个接口：
1. `Moveable`：允许移动的物体，把移动的逻辑放入到这个接口中的默认方法
2. `Attackable`: 允许攻击的物体，把攻击的通用逻辑放入到默认方法，不通用的逻辑通过模板方法给实现类处理
3. `Location`: 获取物体的坐标

通过这些接口的组合方式，我们就可以为游戏创建不同的实现类，比如说坦克、草地、墙壁...

---

#### 解决默认方法冲突规则（面试者必看）
通过上面的例子，我们体验的默认方法给我们带来了多继承的便利，但是让我们思考下，如果出现了不同的类出现的相同签名的默认方法，实际在运行的时候应该如何选择呢？客官不慌，有办法的
- 1. 类中的方法优先级最高。如果类或者父类（抽象类也OK）中声明了相同签名的方法，那么优先级最高
- 2. 如果第一条无法确定，那么最具体的的实现的默认方法；很绕，举例子：B接口继承了A，B就更加具体，那么B中的方法优先级最高
- 3. 如果上面两个都无法判断，那么编译会报错，需要在实现接口，然后手动显式调用

```
public class C implements A, B  {
    void pint() {
        B.supper.print();  // 显式调用
    }
}
```

---

#### 菱形继承问题
为了说明上面的三个原则，我们直接来看看最复杂的菱形继承问题

![](https://cdn.jsdelivr.net/gh/silently9527/images/3184243228-5fbe63c6ed8f9_articlex)

```
public interface A {
    default void print(){
        System.out.println("Class A");
    }
}

public interface B extend A {}

public interface C extend A {}

public class D implement B, C {
    public static void main(String[] args) {
       new D().print()
    }
}
```
这种情况下B，C都没有自己的实现，实际上就只有A有实现，那么会打印`Class A`

如果说这个时候把接口B接口改一下

```
public interface B extends A {
    default void print(){
        System.out.println("Class B");
    }
}
```
根据原则（2），B继承于A，更加具体，所以打印结果应该是B

如果说把接口C修改一下
```
public interface C extends A {
    default void print(){
        System.out.println("Class C");
    }
}
```
这时候我们发现编译报错，需要我们自己手动指定，修改D中的代码

```
public class D implements B, C {

    @Override
    public void print() {
        C.super.print();
    }

    public static void main(String[] args) {
        new D().print();
    }
}
```

#### 总结
- Java8中的默认方法需要使用`default`来修饰
- 默认方法的使用场景可选方法和多继承
- 三个原则解决相同签名的默认方法冲突问题
