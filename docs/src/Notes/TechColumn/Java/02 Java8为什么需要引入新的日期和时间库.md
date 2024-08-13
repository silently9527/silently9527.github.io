---
title: 02 Java8为什么需要引入新的日期和时间库
author: Herman
updateTime: 2021-08-14 13:41
desc: Java8为什么需要引入新的日期和时间库
categories: Java
tags: Java8新特性
outline: deep
---

![image.png](https://image-static.segmentfault.com/397/008/3970086690-5fafd0c6e2df8_articlex)
---- 

#### Java8为什么需要引入新的日期和时间库

1. Date日期输出可读性较差
    ```
    Date date = new Date();
    System.out.println(date);
    ```
    打印输出的结果：
    ```
    Sat Nov 14 11:03:41 CST 2020
    ```
2. Date日期的解析、格式化通过JDK自带的api实现较为麻烦，通常会使用第三方的日期时间库，比如：`joda-time`, `commons-lang`

----

#### Java8中提供了哪些日期和时间类
在java.time包中提供了很多新的类，通常主要使用到的是`LocalDate`, `LocalTime`, `LocalDateTime`, `ZoneId`, `ZoneDateTime`; 关系图如下：
![image.png](https://image-static.segmentfault.com/199/902/1999023484-5faf611315cae_articlex)


- LocaDate这个类本身不包含时间和时区信息，只包含了日期信息；提供了很多方法来获取常用的值：星期几，几月 ...
   
   常用的静态构造`LocaDate`方法
    ```
    LocalDate.of(2020, 11, 14); //指定年月日
    LocalDate.of(2020, Month.NOVEMBER, 14); //指定年月日 使用Month枚举类
    LocalDate.ofYearDay(2020, 10); //2020年第10天 => 2020-01-10
    LocalDate.now(); //当前时间
    System.out.println(LocalDate.now()); // 比较好的可读性输出 => 2020-11-14
    ```
   
   `LocaDate`常用实例方法
    ```
    LocalDate now = LocalDate.of(2020, 11, 14);
    System.out.println(now.getMonth()); //月份的枚举 => NOVEMBER
    System.out.println(now.getMonthValue()); //月份的数字 => 11
    System.out.println(now.getDayOfMonth()); //几号 => 14
    System.out.println(now.getDayOfYear()); // 一年中的第几天 => 319
    System.out.println(now.getDayOfWeek()); // 周几枚举 => SATURDAY
    System.out.println(now.lengthOfMonth()); //本月多少天 => 30
    System.out.println(now.lengthOfYear()); //本年多少天 => 366
    ```

- LocalTime只包含时间信息
    ```
    LocalTime.of(12, 9, 10); //时、分、秒
    LocalTime.now();
    LocalTime time = LocalTime.of(12, 9, 10);
    System.out.println(time.getHour());
    System.out.println(time.getMinute());
    System.out.println(time.getSecond());
    ```
- LocalDateTime 从这个类的名字可以看出是合并了`LocalDate`, `LocalTime`，只包含日期和时间，不包含时区信息
    构造的方式，可以直接使用静态方法创建，也可以通过`LocalDate`，`LocalTime`合并
    ```
    LocalDateTime.of(LocalDate.now(), LocalTime.now());
    LocalDateTime.of(2020, 11, 14, 13, 10, 50);
    LocalDate.now().atTime(LocalTime.now());
    LocalTime.now().atDate(LocalDate.now());
    LocalDateTime.now();
    ```
    由于`LocalDateTime`是`LocalDate`, `LocalTime`的合并，所以`LocalDate`, `LocalTime`有的实例方法，基本在`LocalDateTime`中都可以找到
    
- ZoneId 用来替代老版本`TimeZone`, 每个`ZoneId`都有一个特定的地区标识;
    ```
      ZoneId.of("Asia/Shanghai");
      ZoneId.systemDefault()
    ```
    查看所有的地区标识可以进入到`ZoneId`源码

- ZoneDateTime带有日期、时间、时区信息，是`LocalDateTime`和`ZoneId`的组合
    ```
    ZonedDateTime zonedDateTime = ZonedDateTime.of(LocalDateTime.now(), ZoneId.systemDefault());
    ZonedDateTime.of(LocalDate.now(),LocalTime.now(),ZoneId.of("Asia/Shanghai"));
    ```

经常我们会遇到需要求两个时间之间相差的时间, 如何实现呢？
Java8也提供给了相应的API支持， `Duration`、`Period`
```
Duration between = Duration.between(LocalTime.of(13, 0), LocalTime.of(14, 0)); 
between.getSeconds(); //返回两个时间相差的秒数 => 3600
```
`Duration`是通过秒和毫秒来记录时间的长短，所以只能处理两个`LocalTime`, `DateLocalTime`, `ZonedDateTime`; 如果传入的是`LocalDate`，将会抛出异常
```
java.time.temporal.UnsupportedTemporalTypeException: Unsupported unit: Seconds

	at java.time.LocalDate.until(LocalDate.java:1614)
	at java.time.Duration.between(Duration.java:475)
	at com.haixue.crm.stock.service.LocalTest.testDate(LocalTest.java:121)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:50)
	at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)
	at org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:47)
	at org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)
	at org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:325)
	at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:78)
	at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:57)
	at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
	at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
	at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
	at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
	at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
	at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
	at org.junit.runner.JUnitCore.run(JUnitCore.java:137)
	at com.intellij.junit4.JUnit4IdeaTestRunner.startRunnerWithArgs(JUnit4IdeaTestRunner.java:68)
	at com.intellij.rt.execution.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:47)
	at com.intellij.rt.execution.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:242)
	at com.intellij.rt.execution.junit.JUnitStarter.main(JUnitStarter.java:70)
```

在这种情况下就可以使用`Period`
```
Period between1 = Period.between(LocalDate.of(2020, 11, 13), LocalDate.of(2020, 11, 13));
between1.getDays();  //返回相差的天数 => 1
```

---

#### 时间日期的更高级的操作
- 以为对时间日期的修改增加减少都是通过第三方依赖包操作，现在原生API已经支持

```
LocalDate now2 = LocalDate.of(2020, 11, 13);
System.out.println(now2.plusDays(2));       //加2天   => 2020-11-15
System.out.println(now2.plusMonths(1));     //加1月   => 2020-12-13
System.out.println(now2.plusWeeks(1));      //加一周   => 2020-11-20
System.out.println(now2.minusDays(1));      //减一天   => 2020-11-12
System.out.println(now2.minusMonths(1));    //减一月   => 2020-10-13
System.out.println(now2.minusYears(1));     //减一年   => 2019-11-13
System.out.println(now2.withYear(2021));    //修改年   => 2021-11-13
```

- 有时候我们会遇到需要取本月的最后一天、本月的第一天、调整日期到下一个周日... ;这些需求也能够通过使用`TemporalAdjuster`很好的实现，`TemporalAdjuster` 能够实现很多定制化的日期操作，Java8在`TemporalAdjusters`已经给提供了默认的很多实现。
```
LocalDate now3 = LocalDate.of(2020, 11, 13);
System.out.println(now3.with(TemporalAdjusters.firstDayOfYear())); // 本年的第一天 => 2020-01-01
System.out.println(now3.with(TemporalAdjusters.next(DayOfWeek.MONDAY))); //下一个周一 => 2020-11-16
System.out.println(now3.with(TemporalAdjusters.lastDayOfMonth())); // 本月的最后一天 => 2020-11-30
System.out.println(now3.with(TemporalAdjusters.lastDayOfYear())); // 本年的最后一天 => 2020-12-31
```

- 自定义`TemporalAdjuster`实现获取当天的开始时间和当天的最后时间

```
LocalDateTime localDateTime = LocalDateTime.of(2020, 11, 13, 10, 10, 10);
System.out.println(localDateTime);
System.out.println(localDateTime.with((temporal) -> 
    temporal.with(ChronoField.SECOND_OF_DAY, 0))); // 当天的凌晨 => 2020-11-13T00:00
System.out.println(localDateTime.with((temporal) ->
    temporal.with(ChronoField.SECOND_OF_DAY, temporal.range(ChronoField.SECOND_OF_DAY).getMaximum()))); // 当天的最后一刻时间 => 2020-11-13T23:59:59
```

#### 解析、格式化
对日期的字符串解析和格式化的操作是常用的，首先看下不用第三方包如何简单的实现日期解析
```
System.out.println(LocalDateTime.parse("2020-11-14T20:50:00")); // 输出：2020-11-14T20:50
System.out.println(LocalDateTime.parse("2020/11/14 20:50:00",
        DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"))); // 输出：2020-11-14T20:50
```

实现格式化同样也简单
```
LocalDate now4 = LocalDate.of(2020, 11, 13);
System.out.println(now4.format(DateTimeFormatter.ofPattern("yyyy/MM/dd"))); //输出：2020/11/13

LocalDateTime localDateTime2 = LocalDateTime.of(2020, 11, 13, 10, 10, 10);
System.out.println(localDateTime2.format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"))); //输出：2020/11/13 10:10:10
```
