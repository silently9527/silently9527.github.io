---
title: 08 Explain
author: Herman
updateTime: 2024-08-11 21:34
desc: Mysql的Explain
categories: 中间件
tags: MySQL/InnoDB/B+树索引/Explain
outline: deep
---

### 执行计划输出的核心列

* table: 无论我们的查询语句由多么的复杂，最终都是对单个表进行访问，所以explain输出的每行都是对应着某个单表的访问
* type: 执行计划的一条记录代表着Mysql对某个表执行查询是的访问方法，而type就表示具体的访问方法，以下是完整的访问方法
    * system: 当表中只有一行数据的时候，type就是system
    * const: 当我们根据主键或者唯一二级索引与常数进行等值匹配时，对单表的访问方法就是const
    * eq_ref: 执行连接查询的时候，如果被驱动表是通过主键或者不允许存储null值的唯一二级索引等值匹配，则对该驱动表的访问方式就是eq_ref
    * ref: 当通过普通二级索引进行等值匹配时，对该表的访问方法就是ref
    * ref_or_null: 对普通二级索引进行等值配置且该索引列的值可以为null
    * index_merge: 一般情况下只会对单个索引生成扫描区间，但有些场景也会使用索引合并，这时候的type就是index_merge
    * unique_subquery: 针对的是一些包含了IN子查询的语句，执行引擎会把语句转换称exists子查询，转换之后就可以使用主键或者不允许为null的唯一二级索引，该子查询的type就是unique_subquery
    * index_subquery: 与unique_subquery类似，只不过使用的是普通索引
    * range: 使用索引获取单点扫描区间或者某个范围区间的记录
    * index: 使用的是覆盖索引，但需要扫描全部的索引记录
    * all: 全表扫描
* possible_keys: 表示在查询的过程是可能使用的索引有哪些
* key: 表示实际用到的索引有哪些
* ref: 当访问方法是const、 eq_ref、 ref、ref_or_null、unique_subquery、index_subquery中其中一个的时候，ref列展示就是与索引列进行等值匹配的东西是啥。比如可以是一个常量，可以是表的某列，也可以是个函数等。
* rows: 如果使用全表扫描，这就代表需要扫描记录的总行数，如果使用索引查询，就代表需要扫描索引记录行数。
* filtered: rows表示扫描的总行数，filtered表示通过其他的条件在这个总行数中过滤出满足所有添加的总行数
* extra: 说明额外的信息
  * no tables used: 查询语句没有From子句时将会提示该额外的信息
  * impossible where: 查询语句的where子句永远为false的时候会提示该额外的信息
  * no matching min/max row: 查询列表处有min或者max聚合函数，但是并没有记录符合where子句中的搜素条件
  * using index: 使用覆盖索引执行查询时提示该额外的信息
  * using index condition: 使用索引下推
  * using where 
  * using join buffer: 在连接查询的执行过程中，当被驱动表不能有效的利用索引加速访问速度时，mysql会为它分配一块连接缓冲区的内存块来加快查询速度。
  * using filesort: 使用文件排序
  * using temporary: 使用临时表来完成了 去重、排序之类的。





原文链接: [http://herman7z.site](http://herman7z.site)
