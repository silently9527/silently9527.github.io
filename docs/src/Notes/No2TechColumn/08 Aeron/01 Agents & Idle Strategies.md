考虑实现一个简单的功能：一个线程每隔1s打印 `Hello Agrona Agent`, 使用Java Runnable实现代码如下：

```
public class Task implement Runnable{

    public void run(){
        while(true){
            System.out.println("Hello Agrona Agent");
            sleep(1000);
        }
    }

}
```

在Agrona中需要在应用程序中使用线程完成任务可以使用Agrona Agents（Agrona代理） 和 Idle Strategies（空闲策略）

#### Agent
Agent主要用来实现核心的任务逻辑，Agent可以调度在专门的线程上，也可以作为一组Agent放到一线线程中执行

首先来看看Agent的接口定义
```
public interface Agent {

    default void onStart(){}

    int doWork() throws Exception;

    default void onClose(){}

    String roleName();
}

```

* onStart: Agent启动的时候被调用，主要用来完成初始化工作
* doWork: 在这里实现任务的主要逻辑，对于开头的例子来说就是 `System.out.println("Hello Agrona Agent");`；如果想要停止任务不再轮询就抛出异常`AgentTerminationException`; 返回值表示当前任务workCount
* onClose: 释放和清理工作
* roleName: 定义这个Agent角色名字

> `CompositeAgent`支持将多个Agent放到同一个线程中执行；`DynamicCompositeAgent`支持在运行的过程中动态的添加Agent



#### IdleStrategy 空闲策略

```
public interface IdleStrategy {
    void idle(int workCount);
    ...
}
```
核心方法就是idle，根据workCount实现不同的闲置策略，Agrona 提供了一系列闲置策略，但是，如果需要，可以轻松实施自定义策略。

* SleepingIdleStrategy: 使用parkNanos在给定的时间段内停放线程
```
public void idle(int workCount) {
    if (workCount <= 0) {
        LockSupport.parkNanos(this.sleepPeriodNs);
    }
}
```
* SleepingMillisIdleStrategy: 使用 thread.sleep 使线程在给定的时间段内空闲。通常用在本地开发
```
public void idle(int workCount) {
    if (workCount <= 0) {
        try {
            Thread.sleep(this.sleepPeriodMs);
        } catch (InterruptedException var3) {
            Thread.currentThread().interrupt();
        }
    }
}
```
* YieldingIdleStrategy: 使用 thread.yield 让出cpu时间片
```
public void idle(int workCount) {
    if (workCount <= 0) {
        Thread.yield();
    }
}
```
* BackoffIdleStrategy: 这是一种激进的策略，它的机制为先是自旋，然后过渡到让步，然后再过渡到阻塞在可进行配置的纳秒时间内的一种复合策略。 这是 Aeron Cluster 的默认策略。可以看到它的idle()方法是随着运行不断升级空闲处理策略的（与synchronized锁膨胀类型）
```
public void idle(){
    switch (state){
        case NOT_IDLE: //先进入自旋
            state = SPINNING;
            spins++;
            break;

        case SPINNING: //自旋
            ThreadHints.onSpinWait();
            if (++spins > maxSpins){
                state = YIELDING;
                yields = 0;
            }
            break;

        case YIELDING: //让出Cpu
            if (++yields > maxYields){
                state = PARKING;
                parkPeriodNs = minParkPeriodNs;
            }
            else{
                Thread.yield();
            }
            break;

        case PARKING: //阻塞线程指定时间
            LockSupport.parkNanos(parkPeriodNs);
            parkPeriodNs = Math.min(parkPeriodNs << 1, maxParkPeriodNs);
            break;
    }
}
```
* NoOpIdleStrategy: 最激进的闲置策略，什么都不做，线程永远都不会闲着
```
public void idle(int workCount) {
}
```
* BusySpinIdleStrategy: java.lang.Thread.onSpinWait()如果正在运行的 JVM 上可用，即 JVM 正在运行 Java 9+ ，则将调用该函数。这向 CPU 提供了一个弱提示，即该线程处于紧密循环中但正忙于等待某些内容，然后 CPU 可以将额外的资源分配给另一个线程，而无需涉及操作系统调度程序。
```
public void idle(int workCount) {
    if (workCount <= 0) {
        ThreadHints.onSpinWait();
    }
}

```



#### Scheduling Agent 代理调度机制
当你已经决定了如何实现Agent和IdleStrategy，那么就可以使用AgentRunner启动线程来执行Agent或者使用AgentInvoker使用调用线程执行，示例代码：
```
final AgentRunner runner = new AgentRunner(idleStrategy, errorHandler,  errorCounter, agent);
AgentRunner.startOnThread(runner);
```
通过调用`AgentRunner.startOnThread`告诉Agrona将Agent调度在一个新线程上。

最后我们使用Agent来改造开头的功能

```
class PrintAgent implement Agent{
    public int doWork(){
        System.out.println("Hello Agrona Agent");
    }
}

main(){
    IdleStrategy idleStrategy = new SleepingMillisIdleStrategy(1000);
    final AgentRunner runner = new AgentRunner(idleStrategy, errorHandler,  errorCounter, new PrintAgent());
    AgentRunner.startOnThread(runner);
}

```

> 注意: 并不是所有的空闲策略都是线程安全的。因此通常我们建议为每个被调度的Agent制定不同的空闲策略。


原文链接: [http://herman7z.site](http://herman7z.site)
