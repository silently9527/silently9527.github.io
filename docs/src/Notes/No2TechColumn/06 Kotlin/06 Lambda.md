---
title: 06 Lambda
author: Herman
updateTime: 2024-09-18 12:34
desc: Kotlin 基础入门
categories: Kotlin
tags: Kotlin
outline: deep
---



在前面的内容中我们曾用匿名内部类的形式实现了按钮button的点击事件监听,其实还有一种更加简单的方式,就是使用lambda表达式.
lambda就是允许把函数当作值来对待,可以直接传递函数,而不需要声明一个类再传递这个类的实例

#### Lambda表达式的语法

```
fun main(args: Array<String>) {
    val sum = { x: Int, y: Int -> x + y }
    println(sum(1, 2))
}
```
Lambda表达式使用花括号包围起来, 参数并没有使用括号包起来,使用 `->` 把参数和函数体隔开


继续来看个例子, 我们有个Person集合, 需要从集合中找出年龄最大的

```
data class Person(val name: String, val age: Int)

fun main(args: Array<String>) {
    val persons = listOf(Person("Herman", 20), Person("Pitt", 35), Person("Taomm", 20))
    println(persons.maxByOrNull( { person: Person -> person.age }))
}
```

maxByOrNull: Kotlin对集合的扩展函数, 接受lambda表达式;

Kotlin的语法约定:

* 当lambda表达式是函数的最后一个函数允许放到括号的外面
```
persons.maxByOrNull() { person: Person -> person.age }
```

* 当lambda表达式是函数的唯一参数时,可以去掉空括号
```
persons.maxByOrNull { person: Person -> person.age }
```

* 由于Kotlin的编译器能够根据集合元素类型推导出参数类型, 所以可以进一步简化

```
persons.maxByOrNull { person -> person.age }
```

* 如果当前的lambda只有一个参数并且参数的类型能够推到出来,kotlin就会默认生成一个参数名`it`, 所以进一步简化
```
persons.maxByOrNull { it.age }
```

* 上面的例子已经比较简洁了, 但其实还有另一种写法
```
persons.maxByOrNull(Person::age)
```


若你使用参数来存储lambda表达式,那么就必须要指定类型, 比如
```
val getAge = { p: Person -> p.age }
persons.maxByOrNull(getAge)
```

> Kotlin中lambda表达式限制访问final变量, 可以在lambda表达式中修改这些变量


#### 集合的函数式API
Koltin集合的函数式操作和Java的基本相同, 可以参考以前的文章 [从零开始学习java8stream看这篇就够了](https://herman7z.site/Notes/No2TechColumn/01%20Java/09%20%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E5%AD%A6%E4%B9%A0java8stream%E7%9C%8B%E8%BF%99%E7%AF%87%E5%B0%B1%E5%A4%9F%E4%BA%86.html)


#### 序列
在集合的函数式中,我们通常会使用链式调用, 比如map, filter, 每次在调用这函数的Koltin都会去创建中间集合来存储临时结果,为了提高效率可以把操作变成序列,而不直接使用集合; 比如获取所有Person的name

```
val names = persons.asSequence().map(Person::name).toList()
```

序列的操作分为中间操作和末端操作, 其中中间操作是惰性的, 把上面的例子修改下:

```
val names = persons.asSequence().map { p ->
    println(p.name)
    p.name
}
```
执行这段代码后我们会发现不会打印出任何内容,这是由于中间操作是惰性的,不会去执行; 如果我们把`asSequence`去掉就可以打印出来.



#### with、apply函数
在实际的项目中,经常会对同一个对象进行多次操作,这时候可以使用with函数,可以不用反复把对象名写出来.
```
val name = with(Person("Herman", 20)) {
    println(name)
    println(this.age)
    name
}
println(name)
```

在lambda表达式的作用域中,可以直接使用this指针引用Person对象;
with函数的返回结果就是lambda表达式的最后一行表达式; 有时候我们需要返回接收对象本身,上面的例子可以直接把`name`替换成`this` , 还可以使用apply函数

```
val person = Person("Herman", 20).apply {
    println(name)
    println(this.age)
}
println(person)
```



原文链接: [http://herman7z.site](http://herman7z.site)
