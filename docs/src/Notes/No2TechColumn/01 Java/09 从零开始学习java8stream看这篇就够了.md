---
title: 09 从零开始学习java8stream看这篇就够了
author: Herman
updateTime: 2021-08-14 13:41
desc: 从零开始学习java8stream看这篇就够了
categories: Java
tags: Java8新特性/stream
outline: deep
---

---
### 为何需要引入流
在我们平常的开发中几乎每天都会有到List、Map等集合API，若是问Java什么API使用最多，我想也应该是集合了。举例：假如我有个集合List，里面元素有`1,7,3,8,2,4,9`，需要找出里面大于5的元素，具体实现代码：

```
public List<Integer> getGt5Data() {
    List<Integer> data = Arrays.asList(1, 7, 3, 8, 2, 4, 9);
    List<Integer> result = new ArrayList<>();
    for (Integer num : data) {
        if (num > 5) {
            result.add(num);
        }
    }
    return result;
}
```

这个实现让我们感觉到了集合的操作不是太完美，如果是数据库的话，我们只需要简单的在where后面加一个条件大于5就可以得到我们想要的结果，为什么Java的集合就没有这种API呢？
其次，如果我们遇到有大集合需要处理，为了提高性能，我们可能需要使用到多线程来处理，但是写并行程序的复杂度有提高了不少。

基于以上的问题，所有Java8推出了Stream

---

### Stream简介
Stream有哪些特点：
- 元素的序列：与集合一样可以访问里面的元素，集合讲的是数据，而流讲的是操作，比如：filter、map
- 源: 流也需要又一个提供数据的源，顺序和生成时的顺序一致
- 数据的操作：流支持类似于数据库的操作，支持顺序或者并行处理数据；上面的例子用流来实现会更加的简洁

```
public List<Integer> getGt5Data() {
    return Stream.of(1, 7, 3, 8, 2, 4, 9)
            .filter(num -> num > 5)
            .collect(toList());
}
```
- 流水线操作：很多流的方法本身也会返回一个流，这样可以把多个操作连接起来，形成流水线操作
- 内部迭代：与以往的迭代不同，流使用的内部迭代，用户只需要专注于数据处理
- 只能遍历一次： 遍历完成之后我们的流就已经消费完了，再次遍历的话会抛出异常

---
### 使用Stream
Java8中的Stream定义了很多方法，基本可以把他们分为两类：中间操作、终端操作；要使用一个流一般都需要三个操作：
1. 定义一个数据源
2. 定义中间操作形成流水线
3. 定义终端操作，执行流水线，生成计算结果


#### 构建流
1. 使用`Stream.of`方法构建一个流

```
Stream.of("silently","9527","silently9527.cn")
        .forEach(System.out::println);
```

2. 使用数组构建一个流

```
int[] nums = {3, 5, 2, 7, 8, 9};
Arrays.stream(nums).sorted().forEach(System.out::println);
```

3. 通过文件构建一个流
使用java.nio.file.Files.lines方法可以轻松构建一个流对象

```
Files.lines(Paths.get("/Users/huaan9527/Desktop/data.txt"))
                .forEach(System.out::println);
```


#### 中间操作
中间操作会返回另外一个流，这样可以让多个操作连接起来形成一个流水线的操作，只要不触发终端操作，那么这个中间操作都不会实际执行。

##### filter
该操作接受一个返回boolean的函数，当返回false的元素将会被排除掉

举例：假如我们100个客户，需要筛选出年龄大于20岁的客户

```
List<Customer> matchCustomers = allCustomers.stream()
                .filter(customer -> customer.getAge()>20)
                .collect(toList());
```

##### distinct
该操作将会排除掉重复的元素

```
List<Integer> data = Stream.of(1, 7, 3, 8, 2, 4, 9, 7, 9)
        .filter(num -> num > 5)
        .distinct()
        .collect(toList());
```


##### limit
该方法限制流只返回指定个数的元素

```
List<Integer> data = Stream.of(1, 7, 3, 8, 2, 4, 9, 7, 9)
        .filter(num -> num > 5)
        .limit(2)
        .collect(toList());
```

##### skip
扔掉前指定个数的元素；配合limit使用可以达到翻页的效果

```
List<Integer> data = Stream.of(1, 7, 3, 8, 2, 4, 9, 7, 9)
        .filter(num -> num > 5)
        .skip(1)
        .limit(2)
        .collect(toList());
```
##### map
该方法提供一个函数，流中的每个元素都会应用到这个函数上，返回的结果将形成新类型的流继续后续操作。
举例：假如我们100个客户，需要筛选出年龄大于20岁的客户，打印出他们的名字

```
allCustomers.stream()
            .filter(customer -> customer.getAge() > 20)
            .map(Customer::getName)
            .forEach(System.out::println);
```
在调用map之前流的类型是`Stream<Customer>`，执行完map之后的类型是`Stream<String>`

##### flatMap
假如我们需要把客户的名字中的每个字符打印出来，代码如下：

```
List<Customer> allCustomers = Arrays.asList(new Customer("silently9527", 30));
allCustomers.stream()
        .filter(customer -> customer.getAge() > 20)
        .map(customer -> customer.getName().split(""))
        .forEach(System.out::println);
```
执行本次结果，你会发现没有达到期望的结果，打印的结果

```
[Ljava.lang.String;@38cccef
```

这是因为调用map之后返回的流类型是`Stream<String[]>`，所有forEach的输入就是`String[]`；这时候我们需要使用flatMap把`String[]`中的每个元素都转换成一个流，然后在把所有的流连接成一个流，修改后的代码如下

```
List<Customer> allCustomers = Arrays.asList(new Customer("silently9527", 30));
allCustomers.stream()
        .filter(customer -> customer.getAge() > 20)
        .map(customer -> customer.getName().split(""))
        .flatMap(Arrays::stream)
        .forEach(System.out::println);
```
执行结果：

![](https://cdn.jsdelivr.net/gh/silently9527/images//4db2aa4e3dcb4360975595e51d1097c4%7Etplv-k3u1fbpfcp-watermark.image)

##### sorted
对所有的元素进行排序

```
List<Integer> numbers = Arrays.asList(1, 7, 3, 8, 2, 4, 9);
numbers.stream().sorted(Integer::compareTo).forEach(System.out::println);
```

#### 终端操作
终端操作会执行所有的中间操作生成执行的结果，执行的结果不在是一个流。

##### anyMatch
如果流中有一个元素满足条件将返回true

```
if (allCustomers.stream().anyMatch(customer -> "silently9527".equals(customer.getName()))) {
    System.out.println("存在用户silently9527");
}
```
##### allMatch
确保流中所有的元素都能满足

```
if (allCustomers.stream().allMatch(customer -> customer.getAge() > 20)) {
    System.out.println("所有用户年龄都大于20");
}
```
##### noneMatch
与allMatch操作相反，确保流中所有的元素都不满足

```
if (allCustomers.stream().noneMatch(customer -> customer.getAge() < 20)) {
    System.out.println("所有用户年龄都大于20");
}
```

##### findAny
返回流中的任意一个元素，比如返回大于20岁的任意一个客户

```
Optional<Customer> optional = allCustomers.stream()
        .filter(customer -> customer.getAge() > 20)
        .findAny();
```

##### findFirst
返回流中的第一个元素

```
Optional<Customer> optional = allCustomers.stream()
        .filter(customer -> customer.getAge() > 20)
        .findFirst();
```

##### reduce
接受两个参数：一个初始值，一个`BinaryOperator<T> accumulator`将两个元素合并成一个新的值
比如我们对一个数字list累加

```
List<Integer> numbers = Arrays.asList(1, 7, 3, 8, 2, 4, 9);
Integer sum = numbers.stream().reduce(0, (a, b) -> a + b);
```
上面的代码，我们可以简写

```
Integer reduce = numbers.stream().reduce(0, Integer::sum);
```

找出流中的最大值、最小值 min、max

```
numbers.stream().reduce(Integer::max)
numbers.stream().reduce(Integer::min)
```
##### count
统计流中元素的个数

```
numbers.stream().count()
```

### 数据收集器collect
在Java8中已经预定义了很多收集器，我们可以直接使用，所有的收集器都定义在了`Collectors`中，基本上可以把这些方法分为三类：
- 将元素归约和汇总成一个值
- 分组
- 分区

#### 归约和汇总
先看下我们之前求最大值和最小值采用收集器如何实现

1. 找出年龄最大和最小的客户
```
Optional<Customer> minAgeCustomer = allCustomers.stream().collect(minBy(Comparator.comparing(Customer::getAge)));
Optional<Customer> maxAgeCustomer = allCustomers.stream().collect(maxBy(Comparator.comparing(Customer::getAge)));
```

2. 求取年龄的平均值

```
Double avgAge = allCustomers.stream().collect(averagingInt(Customer::getAge));
```

3. 进行字符串的连接

把客户所有人的名字连接成一个字符串用逗号分隔
```
allCustomers.stream().map(Customer::getName).collect(joining(","));
```

#### 分组
在数据库的操作中，我们可以轻松的实现通过一个属性或者多个属性进行数据分组，接下来我们看看Java8如何来实现这个功能。

1. 根据客户的年龄进行分组

```
Map<Integer, List<Customer>> groupByAge = allCustomers.stream().collect(groupingBy(Customer::getAge));
```
Map的key就是分组的值年龄，`List<Customer>`就是相同年龄的用户

2. 我们需要先按照用户的地区分组，在按年龄分组

```
Map<String, Map<Integer, List<Customer>>> groups = allCustomers.stream()
                .collect(groupingBy(Customer::getArea, groupingBy(Customer::getAge)));
```
在相对于普通的分组，这里多传了第二个参数又是一个`groupingBy`；理论上我们可以通过这个方式扩展到n层分组

3. 分组后再统计数量

```
Map<String, Long> groupByCounting = allCustomers.stream()
            .collect(groupingBy(Customer::getArea, counting()));
```

4. 以用户所在地区分组后找出年龄最大的用户

```
Map<String, Optional<Customer>> optionalMap = allCustomers.stream()
                .collect(groupingBy(Customer::getArea, maxBy(Comparator.comparing(Customer::getAge))));

```

这时候返回的Map中的value被Optional包裹，如果我们需要去掉Optional，可以使用`collectingAndThen`

```
Map<String, Customer> customerMap = allCustomers.stream()
        .collect(groupingBy(Customer::getArea,
                collectingAndThen(maxBy(Comparator.comparing(Customer::getAge)), Optional::get)
        ));

```


---
### 写在最后（看完不点赞，你们想白嫖我吗）

- 首先感谢大家可以耐心地读到这里。**点关注，不迷路**
- 当然，文中或许会存在或多或少的不足、错误之处，有建议或者意见也非常欢迎大家在评论交流。
- 最后，**白嫖不好，创作不易**，希望朋友们可以**点赞评论关注**三连，因为这些就是我分享的全部动力来源🙏


参数资料《Java8实战》
