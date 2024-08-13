---
title: 03 Java中NullPointerException的完美解决方案
author: Herman
updateTime: 2021-08-14 13:41
desc: Java中NullPointerException的完美解决方案
categories: Java
tags: Java8新特性
outline: deep
---

![](https://raw.githubusercontent.com/silently9527/images/main/1566169983-5fb3c5b67966e_articlex)

#### null在Java中带来的麻烦
我相信所有的Java程序猿一定都遇到过`NullPointerException`，空指针在Java程序中是最常见的，也是最烦人的；它让我们很多程序猿产生了根深蒂固的感觉，所有可能产生空指针的地方都的加上`if-else`检查，但是这带给我们很多麻烦

- Java本身是强类型的，但是null破坏了这个规则，它可以被赋值给任何对象
- Java的设计是让程序猿对指针无感知，但是null指针是个例外
- 它会是代码变得很臃肿，到处都充斥着`if-else`的空检查，甚至是多层嵌套，代码可读性下降
- null本身毫无意义，表示不了`无`

前两点不需要特别的说明，后两点举个例子来说明一下：
假如一个人拥有一个手机，每个手机都有生成厂商，每个厂商都会有个名字，用类表示的话：

```
public class Person {
    private Phone phone;

    public Phone getPhone() {
        return phone;
    }
}

public class Phone {
    private Producer producer;

    public Producer getProducer() {
        return producer;
    }
}

public class Producer {
    private String name;

    public String getName() {
        return name;
    }
}
```

在这个例子中，假如我们需要取到手机生成厂商的名字

```
public String getPhoneProducerName(Person person) {
    return person.getPhone().getProducer().getName();
}
```
由于不一定每个人都会有一个手机，所有在调用`getProducer()`时可能会出现`NullPointerException`。

一门设计语言本来就是来描述世界的，在这个事例中有的人有手机，有的人也可能没有手机，所以在调用`person.getPhone()`返回的值就应该包含有和无这两种情况，现在通过返回`null`来表示无，但是在调用`getProducer()`却又会抛出异常，这样就不太符合现实逻辑；所以把`null`来用来表示`无`不合适

在遇到这种情况通常的做法是做null检查,甚至是每个地方可能发生null指针的做检查。

```
public String getPhoneProducerName(Person person) {
    if (person.getPhone() == null) {
        return "无名字";
    }
    if (person.getPhone().getProducer() == null) {
        return "无名字";
    }
    return person.getPhone().getProducer().getName();
}
```
这里我已经试图在减少代码的层级，如果使用的是`if-else`，代码的层级会更深，代码可读性下降。

---
#### Optional的简单介绍
吐槽了那么多现状的不好，现在可以祭出我们的解决方案了 `Optional`；千呼万唤始出来，犹抱琵琶半遮面；那`Optional`到底是个什么东西，我们一起来逐步解开它的面纱。

![](https://raw.githubusercontent.com/silently9527/images/main/1883051154-5fb2773078853_articlex)

`Optional`本身只是对对象的简单包装，如果对象为空，那么会构建一个空的`Optional`；这样一来`Optional`就包含了存在和不存在两个情况, 接下来可以看下上面的例子改过之后


```
public class Person {
    private Optional<Phone> phone;

    public Optional<Phone> getPhone() {
        return phone;
    }
}

public class Phone {
    private Producer producer;

    public Producer getProducer() {
        return producer;
    }
}

public class Producer {
    private String name;

    public String getName() {
        return name;
    }
}
```

由于有的人可能没有手机，有的人有，所以`Phone`需要用`Optional`包装起来；手机本身一定会有生产的厂商，厂商一定会有一个名字，所以这两个不需要用`Optional`包装起来。这里我们会发现使用了`Optional`会丰富代码的语义，让代码更加符合现实。

而当我们在调用`phone.getProducer().getName()`的时候不需要做null指针的检查，如果说在这里发生了`NullPointerException`，说明这里数据本身是有问题的，不符合现实，就应该让问题暴露出来，而不是像上面的代码一样把问题掩盖。


---
#### Optional的常用方法使用
##### 1. Optional的创建方法

```
Optional<Person> empty = Optional.empty();  //申明一个空的Optional
Optional<Person> person = Optional.of(new Person()); //包装Person
Optional<Person> person2 = Optional.of(null); //不允许的操作，传入null 会抛出空指针异常
Optional<Person> optionalPerson = Optional.ofNullable(null); //允许传null, 返回一个空的Optional
```

##### 2. Optional值的获取方式
- map、flatMap
首先我们重新定义一下Phone类，除了有生产厂商之外，还有个型号；

```
public class Phone {
    private String model;
    private Producer producer;

    public Producer getProducer() {
        return producer;
    }
    public String getModel() {
        return model;
    }
}
```

当我们需要获取到手机的型号的时候可以这样：
```
Optional<Phone> optionalPhone = Optional.of(new Phone());
Optional<String> model = optionalPhone.map(Phone::getModel);
```
当我们需要通过Person对象获取到Phone的型号是，会想到这样：

```
Optional<Person> optionalPerson = Optional.of(new Person());
optionalPerson.map(Person::getPhone).map(Phone::getModel);
```
当我们写出来的时候发现编译器不能通过。是因为`Person::getPhone`返回的是一个`Optional<Phone>`，调用`optionalPerson.map(Person::getPhone)`返回的就是`Optional<Optional<Phone>>`，所以再`.map`的就无法拿到手机型号，那如何能够让返回的结果不是`Optional<Optional<Phone>>`，而是`Optional<Phone>`呢？

这里需要用到另一个方法`flatMap`。`flatMap`和`map`的区别，我在刚开始学习的时候，看到了网上的各种解释都很绕，看的很晕，最后直接打开源码来看，发现实现很简单，很容易理解，来看下源码：

```
public<U> Optional<U> map(Function<? super T, ? extends U> mapper) {
    Objects.requireNonNull(mapper);
    if (!isPresent())
        return empty();
    else {
        return Optional.ofNullable(mapper.apply(value));
    }
}
public<U> Optional<U> flatMap(Function<? super T, Optional<U>> mapper) {
    Objects.requireNonNull(mapper);
    if (!isPresent())
        return empty();
    else {
        return Objects.requireNonNull(mapper.apply(value));
    }
}
```
`map`方法在返回的时候会包装一层`Optional` ； `flatMap`在返回的时候直接把函数的返回值返回了，函数的结果必须是`Optional`；那么在前面的例子中我们直接调用`flatMap`返回的结果就是`Optional<Phone>`

```
Optional<Person> optionalPerson = Optional.of(new Person());
optionalPerson.flatMap(Person::getPhone).map(Phone::getModel);
```

- 取出`Optional`中的值对象：get、orElse、orElseGet、orElseThrow、ifPresent
1. get() : 当你明确知道Optional中有值的话可以直接调用该方法，当Optional中没有值是该方法会抛出异常`NoSuchElementException`;所以当如果存在空值的话建议就不要调用该方法，因为这样和做null检查就没有区别了
2. orElse(T other) : 提供一个默认值，当值不存在是返回这个默认值
3. orElseGet(Supplier<? extends T> other) : 当值不存在的时候会调用supper函数，如果说返回这个默认值的逻辑较多，那么调用这个方法比较合适；
4. orElseThrow(Supplier<? extends X> exceptionSupplier) : 当值为空时会抛出一个自定义的异常
5. ifPresent(Consumer<? super T> consumer) : 当值不为空是会调用`consumer`函数，如果值为空，那么这个方法什么都不做


- filter 过滤出满足条件的对象
假如我们需要过滤出手机型号`IOS`的手机，并打印出型号，代码如下：

```
Person person = new Person(Optional.of(new Phone("IOS")));
        Optional<Person> optionalPerson = Optional.of(person);
        optionalPerson.flatMap(Person::getPhone)
                .filter(phone -> "IOS".equals(phone.getModel()))
                .map(Phone::getModel)
                .ifPresent(System.out::println);
```

---
#### 总结
1. 我们讨论了null在Java程序的问题
2. 介绍Java8中引入了`Optional`来表示有和无的情况以及初始化的方式
3. 举例说明了`Optional`中经常使用到的方法
