import{_ as a,c as s,o as n,aa as p}from"./chunks/framework.d_Ke7vMG.js";const b=JSON.parse('{"title":"10 修炼码德简化条件表达式","description":"","frontmatter":{"title":"10 修炼码德简化条件表达式","author":"Herman","updateTime":"2021-08-14 13:41","desc":"从零开始学习java8stream看这篇就够了","categories":"Java","tags":"代码整洁","outline":"deep"},"headers":[],"relativePath":"Notes/No2TechColumn/01 Java/10 修炼码德简化条件表达式.md","filePath":"Notes/No2TechColumn/01 Java/10 修炼码德简化条件表达式.md","lastUpdated":1724593073000}'),e={name:"Notes/No2TechColumn/01 Java/10 修炼码德简化条件表达式.md"},l=p(`<h4 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h4><p>与面向过程编程相比，面向对象编程的条件表达式相对来说已经比少了，因为很多的条件行为都可以被多态的机制处理掉；但是有时候我们还是会遇到一些小伙伴写出来的条件表达式和面向过程编程没什么差别，比如我遇到过这段代码：</p><p><img src="https://cdn.jsdelivr.net/gh/silently9527/images/3336481724-5fc647bf9ddd9_articlex" alt=""></p><p>整段代码有三层，每一层还有if-else，本身的这段代码的逻辑就够难以理解了，更加恶心的是这个方法的调用方以及调用的其他方法，同样也是这样的if-else嵌套几层； 加之这段代码还有一个很大的问题是传入的参数对象，在内部以及调用的其他方法中被修改多次修改，这样就更难懂了；靠普通人的单核CPU想看懂太难了，维护这段代码我感觉身体被掏空</p><p><img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3395578426,2267424960&amp;fm=26&amp;gp=0.jpg" alt="身体被掏空"></p><p>有时候我们可能会遇到比较复杂的条件逻辑，需要我们想办法把分成若干个小块，让分支逻辑和操作细节分离；看一个程序员的码德如何，先看他的条件表达式是否够简洁易懂；今天我们来分享一下简化条件表达式的常用方法，修炼自己的码德；本文中大部分的例子来源于《重构改善既有代码设计》</p><hr><h4 id="分解条件表达式" tabindex="-1">分解条件表达式 <a class="header-anchor" href="#分解条件表达式" aria-label="Permalink to &quot;分解条件表达式&quot;">​</a></h4><p>复杂的条件逻辑是最常导致复杂度上升的地方之一，另外如果分支内部逻辑也很多，最终我们会得到一个很大的函数，一个长的方法可读性本身就会下降，所以我们需要把大的方法才分的多个的方法，为每个方法取一个容易清楚表达实现内部逻辑的方法名，这样可读性就会上大大提高。</p><p>举例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (date.before (SUMMER_START) || date.after(SUMMER_END)) {</span></span>
<span class="line"><span>    charge = quantity * _winterRate + _winterServiceCharge;</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>    charge = quantity * _summerRate</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这种代码很多人可能都觉得没必要去提取方法，但是如果我们想要看懂这段代码，还是必须的去想想才知道在做什么；接下来我们修改一下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (notSummer(date)) {</span></span>
<span class="line"><span>    charge = winterCharge(quantity);</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>    charge = summerCharge(quantity);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private boolean notSummer(Date date){</span></span>
<span class="line"><span>    date.before (SUMMER_START) || date.after(SUMMER_END)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private double summerCharge(int quantity) {</span></span>
<span class="line"><span>    return quantity * _summerRate;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private double winterCharge(int quantity) {</span></span>
<span class="line"><span>    return quantity * _winterRate + _winterServiceCharge;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样修改之后是不是很清楚，好的代码本身不需要写注释（代码具有自说明性），更不需要在方法内部写任何注释，有时候我们会看到有同学会在方法内部隔几行就会写一点注释，这说明本身代码的自说明性不够好，可以通过刚才这个例子的方式提高代码的可读性</p><hr><h4 id="合并条件表达式" tabindex="-1">合并条件表达式 <a class="header-anchor" href="#合并条件表达式" aria-label="Permalink to &quot;合并条件表达式&quot;">​</a></h4><p>当遇到一段代码多个if条件判断，但是条件内部的逻辑缺类似，我们可以把条件合并在一起，然后抽取方法。</p><p>举例1：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>double disabilityAmount () {</span></span>
<span class="line"><span>    if(_seniortiy &lt;2 ) </span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    if(_monthsDisabled &gt; 12)</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    if(_isPartTime)</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    // 省略...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的条件返回的结果都是一样的，那么我们先把条件合并起来</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>double disabilityAmount () {</span></span>
<span class="line"><span>    if(_seniortiy &lt;2 || _monthsDisabled &gt; 12 || _isPartTime) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 省略...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来我们再来把判断条件判断条件抽取成方法提高可读性</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>double disabilityAmount () {</span></span>
<span class="line"><span>    if(isNotEligibleForDisableility()) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 省略...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>boolean isNotEligibleForDisableility() {</span></span>
<span class="line"><span>    return _seniortiy &lt;2 || _monthsDisabled &gt; 12 || _isPartTime;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>举例2：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if(onVacation()) {</span></span>
<span class="line"><span>    if(lengthOfService() &gt; 10) {</span></span>
<span class="line"><span>        return 2;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>return 1;</span></span></code></pre></div><p>合并之后的代码</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if(onVacation() &amp;&amp; lengthOfService() &gt; 10){</span></span>
<span class="line"><span>    return 2</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>return 1;</span></span></code></pre></div><p>接着我们可以使用三元操作符更加简化，修改后的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>return onVacation() &amp;&amp; lengthOfService() &gt; 10 ? 2 : 1;</span></span></code></pre></div><p>通过这两个例子我们可以看出，先把条件逻辑与分支逻辑抽离成不同的方法分离开，然后我们会发现提高代码的可读性是如此的简单，得心应手；所以抽离好的方法是关键；我觉得此处应该有掌声</p><p><img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3511544063,4112539952&amp;fm=26&amp;gp=0.jpg" alt="我膨胀了"></p><hr><h4 id="合并重复的条件片段" tabindex="-1">合并重复的条件片段 <a class="header-anchor" href="#合并重复的条件片段" aria-label="Permalink to &quot;合并重复的条件片段&quot;">​</a></h4><p>我们先来看一个例子，10岁以下的小朋友票价打5折</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if(ageLt10(age)) {</span></span>
<span class="line"><span>    price = price * 0.5;</span></span>
<span class="line"><span>    doSomething();</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>    price = price * 1;</span></span>
<span class="line"><span>    doSomething();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们发现不同的分支都执行了相同的末段代码逻辑，这时候我们可以把这段代码提取到条件判断之外，这里举得例子较为简单，通常工作中遇到的可能不是这样一个简单的方法，而是很多行复杂的逻辑条件，我们可以先把这个代码提取成一个方法，然后把这个方法的调用放在条件判断之前或之后</p><p>修改之后的代码</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if(ageLt10(age)) {</span></span>
<span class="line"><span>    price = price * 0.5;</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>    price = price * 1;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>doSomething();</span></span></code></pre></div><p>当我们遇到try-catch中有相同的逻辑代码，我们也可以使用这种方式处理</p><hr><h4 id="卫语句取代嵌套条件表达式" tabindex="-1">卫语句取代嵌套条件表达式 <a class="header-anchor" href="#卫语句取代嵌套条件表达式" aria-label="Permalink to &quot;卫语句取代嵌套条件表达式&quot;">​</a></h4><p>方法中一旦出现很深的嵌套逻辑让人很难看懂执行的主线。当使用了<code>if-else</code>表示两个分支都是同等的重要，都是主线流程；向下图表达的一样， <img src="https://cdn.jsdelivr.net/gh/silently9527/images/3655225837-5fc78ef31a47a_articlex" alt=""></p><p>但是大多数时候我们会遇到只有一条主线流程，其他的都是个别的异常情况，在这种情况下使用<code>if-else</code>就不太合适，应该用卫语句取代嵌套表达式。 <img src="https://cdn.jsdelivr.net/gh/silently9527/images/3797382814-5fc78eb17cd1b_articlex" alt=""></p><p>举例1：</p><p>在薪酬系统中，以特殊的规则处理死亡员工，驻外员工，退休员工的薪资，这些情况都是很少出现，不属于正常逻辑；</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>double getPayAmount() {</span></span>
<span class="line"><span>    double result;</span></span>
<span class="line"><span>    if(isDead){</span></span>
<span class="line"><span>        result = deadAmount();</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        if(isSeparated) {</span></span>
<span class="line"><span>            result = separatedAmount();</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            if(isRetired) {</span></span>
<span class="line"><span>                result = retiredAmount();</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                result = normalPayAmount();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这段代码中，我们完全看不出正常流程是什么，这些偶尔发生的情况把正常流程给掩盖了，一旦发生了偶然情况，就应该直接返回，引导代码的维护者去看一个没用意义的else只会妨碍理解；让我们用<code>return</code>来改造一下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>double getPayAmount() {</span></span>
<span class="line"><span>    if(isDead){</span></span>
<span class="line"><span>        return deadAmount();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if(isSeparated) {</span></span>
<span class="line"><span>        return separatedAmount():</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if(isRetired) {</span></span>
<span class="line"><span>        return retiredAmount();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return normalPayAmount();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="多态取代条件表达式" tabindex="-1">多态取代条件表达式 <a class="header-anchor" href="#多态取代条件表达式" aria-label="Permalink to &quot;多态取代条件表达式&quot;">​</a></h4><p>有时候我们会遇到<code>if-else-if</code>或者<code>switch-case</code>这种结构，这样的代码不仅不够整洁，遇到复杂逻辑也同样难以理解。这种情况我们可以利用面向对象的多态来改造。</p><p>举例： 假如你正在开发一款游戏，需要写一个获取箭塔(Bartizan)、弓箭手(Archer)、坦克(Tank)攻击力的方法；经过两个小时的努力终于完成了这个功能；开发完成后的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int attackPower(Attacker attacker) {</span></span>
<span class="line"><span>    switch (attacker.getType()) {</span></span>
<span class="line"><span>        case &quot;Bartizan&quot;:</span></span>
<span class="line"><span>            return 100;</span></span>
<span class="line"><span>        case &quot;Archer&quot;:</span></span>
<span class="line"><span>            return 50;</span></span>
<span class="line"><span>        case &quot;Tank&quot;:</span></span>
<span class="line"><span>            return 800;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    throw new RuntimeException(&quot;can not support the method&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>经过自测后没有任何问题，此时你的心情很爽</p><p><img src="https://timgsa.baidu.com/timg?image&amp;quality=80&amp;size=b9999_10000&amp;sec=1606926728487&amp;di=5599a3f28743815fcbf3217a37075406&amp;imgtype=0&amp;src=http%3A%2F%2Ffjmingfeng.com%2Fimg%2F0%2F0856656851%2F62%2F374577c3ab2b6bacdebd1fe1af4bc1da%2F0350250141%2F8535144583.jpg" alt="心情很爽"></p><p>当你提交代码交由领导review的时候，领导（心里想着这点东西搞两个小时，上班摸鱼太明显了吧）直接回复代码实现不够优雅，重写</p><h5 id="_1-枚举多态" tabindex="-1">1. 枚举多态 <a class="header-anchor" href="#_1-枚举多态" aria-label="Permalink to &quot;1. 枚举多态&quot;">​</a></h5><p>你看到这个回复虽然心里很不爽，但是你也没办法，毕竟还是要在这里混饭吃的；嘴上还是的回答OK</p><p>你思考了一会想到了使用枚举的多态来实现不就行了，说干就干，于是你写了下一个版本</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int attackPower(Attacker attacker) {</span></span>
<span class="line"><span>   return AttackerType.valueOf(attacker.getType()).getAttackPower();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>enum AttackerType {</span></span>
<span class="line"><span>    Bartizan(&quot;箭塔&quot;) {</span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        public int getAttackPower() {</span></span>
<span class="line"><span>            return 100;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    Archer(&quot;弓箭手&quot;) {</span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        public int getAttackPower() {</span></span>
<span class="line"><span>            return 50;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    Tank(&quot;坦克&quot;) {</span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        public int getAttackPower() {</span></span>
<span class="line"><span>            return 800;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String label;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Attacker(String label) {</span></span>
<span class="line"><span>        this.label = label;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getLabel() {</span></span>
<span class="line"><span>        return label;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int getAttackPower() {</span></span>
<span class="line"><span>        throw new RuntimeException(&quot;Can not support the method&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这次再提交领导review，顺利通过了，你心想总于get到了领导的点了</p><h5 id="_2-类多态" tabindex="-1">2. 类多态 <a class="header-anchor" href="#_2-类多态" aria-label="Permalink to &quot;2. 类多态&quot;">​</a></h5><p>没想到你没高兴几天，又接到个新的需求，这个获取攻击力的方法需要修改，根据攻击者的等级不同而攻击力也不同；你考虑到上次的版本攻击力是固定的值，使用枚举还比较合适，而这次的修改要根据攻击者的本身等级来计算攻击了，如果再使用枚举估计是不合适的；同时你也想着上次简单实现被领导怼了，这次如果还是在上次的枚举版本上来实现，估计也不会有好结果；最后你决定使用类的多态来完成</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int attackPower(Attacker attacker) {</span></span>
<span class="line"><span>    return attacker.getAttackPower();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>interface Attacker {</span></span>
<span class="line"><span>    default int getAttackPower() {</span></span>
<span class="line"><span>        throw new RuntimeException(&quot;Can not support the method&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Bartizan implements Attacker {</span></span>
<span class="line"><span>    public int getAttackPower() {</span></span>
<span class="line"><span>        return 100 * getLevel();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Archer implements Attacker {</span></span>
<span class="line"><span>    public int getAttackPower() {</span></span>
<span class="line"><span>        return 50 * getLevel();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Tank implements Attacker {</span></span>
<span class="line"><span>    public int getAttackPower() {</span></span>
<span class="line"><span>        return 800 * getLevel();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>完成之后提交给领导review，领导笑了笑通过了代码评审；</p><h5 id="_3-策略模式" tabindex="-1">3. 策略模式 <a class="header-anchor" href="#_3-策略模式" aria-label="Permalink to &quot;3. 策略模式&quot;">​</a></h5><p>你本以为这样就结束了，结果计划赶不上变化，游戏上线后，效果不是太好，你又接到了一个需求变更，攻击力的计算不能这么粗暴，我们需要后台配置规则，让部分参加活动玩家的攻击力根据规则提升。</p><p>你很生气，心里想着:没听说过杀死程序员不需要用枪吗，改三次需求就可以了，MD这是想我死吗。</p><p><img src="https://timgsa.baidu.com/timg?image&amp;quality=80&amp;size=b9999_10000&amp;sec=1606931940941&amp;di=e3cadda30e04df1281f329a8e27ff8da&amp;imgtype=0&amp;src=http%3A%2F%2Fimg04.sogoucdn.com%2Fapp%2Fa%2F200654%2F1561513987254718.jpeg" alt="改需求"></p><p>生气归生气，但是不敢表露出来，谁让你是领导呢，那就开搞吧</p><p>考虑到本次的逻辑加入了规则，规则本身可以设计的简单，也可以设计的很复杂，如果后期规则变得更加复杂，那么整个攻击对象类中会显得特别的臃肿，扩展性也不好，所以你这次不再使用类的多态来实现，考虑使用策略模式，完成后代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//定义计算类的接口</span></span>
<span class="line"><span>interface AttackPowerCalculator {</span></span>
<span class="line"><span>    boolean support(Attacker attacker);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int calculate(Attacker attacker);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//箭塔攻击力计算类</span></span>
<span class="line"><span>class BartizanAttackPowerCalculator implements AttackPowerCalculator {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean support(Attacker attacker) {</span></span>
<span class="line"><span>        return &quot;Bartizan&quot;.equals(attacker.getType());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int calculate(Attacker attacker) {</span></span>
<span class="line"><span>        //根据规则计算攻击力</span></span>
<span class="line"><span>        return doCalculate(getRule());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//弓箭手攻击力计算类</span></span>
<span class="line"><span>class ArcherAttackPowerCalculator implements AttackPowerCalculator {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean support(Attacker attacker) {</span></span>
<span class="line"><span>        return &quot;Archer&quot;.equals(attacker.getType());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int calculate(Attacker attacker) {</span></span>
<span class="line"><span>        //根据规则计算攻击力</span></span>
<span class="line"><span>        return doCalculate(getRule());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//坦克攻击力计算类</span></span>
<span class="line"><span>class TankAttackPowerCalculator implements AttackPowerCalculator {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean support(Attacker attacker) {</span></span>
<span class="line"><span>        return &quot;Tank&quot;.equals(attacker.getType());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int calculate(Attacker attacker) {</span></span>
<span class="line"><span>        //根据规则计算攻击力</span></span>
<span class="line"><span>        return doCalculate(getRule());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//聚合所有计算类</span></span>
<span class="line"><span>class AttackPowerCalculatorComposite implements AttackPowerCalculator {</span></span>
<span class="line"><span>    List&lt;AttackPowerCalculator&gt; calculators = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public AttackPowerCalculatorComposite() {</span></span>
<span class="line"><span>        this.calculators.add(new TankAttackPowerCalculator());</span></span>
<span class="line"><span>        this.calculators.add(new ArcherAttackPowerCalculator());</span></span>
<span class="line"><span>        this.calculators.add(new BartizanAttackPowerCalculator());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean support(Attacker attacker) {</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int calculate(Attacker attacker) {</span></span>
<span class="line"><span>        for (AttackPowerCalculator calculator : calculators) {</span></span>
<span class="line"><span>            if (calculator.support(attacker)) {</span></span>
<span class="line"><span>                calculator.calculate(attacker);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        throw new RuntimeException(&quot;Can not support the method&quot;); </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//入口处通过调用聚合类来完成计算</span></span>
<span class="line"><span>int attackPower(Attacker attacker) {</span></span>
<span class="line"><span>    AttackPowerCalculator calculator = new AttackPowerCalculatorComposite();</span></span>
<span class="line"><span>    return calculator.calculate(attacker);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你再次提交代码给领导review，领导看了很满意，表扬你说：小伙子，不错，进步很快嘛，给你点赞哦；你回答：感谢领导认可（心里想那是当然，毕竟我已经摸清了你的点在哪里了）</p><blockquote><p><strong>觉得本次你的这个功能完成的还比较满意的，请点赞关注评论走起哦</strong></p></blockquote><p><img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3842873604,2464232292&amp;fm=26&amp;gp=0.jpg" alt="骄傲"></p><h4 id="引入断言" tabindex="-1">引入断言 <a class="header-anchor" href="#引入断言" aria-label="Permalink to &quot;引入断言&quot;">​</a></h4><p>最后一个简化条件表达式的操作是引入断言，这部分比较简单，并且Spring框架本身也提供了断言的工具类，比如下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void getProjectLimit(String project){</span></span>
<span class="line"><span>    if(project == null){</span></span>
<span class="line"><span>        throw new RuntimeException(&quot;project can not null&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    doSomething();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>加入Spring的断言后的代码</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void getProjectLimit(String project){</span></span>
<span class="line"><span>    Assert.notNull(project,&quot;project can not null&quot;);</span></span>
<span class="line"><span>    doSomething();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="往期java8系列文章" tabindex="-1">往期Java8系列文章： <a class="header-anchor" href="#往期java8系列文章" aria-label="Permalink to &quot;往期Java8系列文章：&quot;">​</a></h3><ul><li><a href="https://juejin.cn/post/6897844374093496328" target="_blank" rel="noreferrer">CompletableFuture让你的代码免受阻塞之苦</a></li><li><a href="https://juejin.cn/post/6900711829404647431" target="_blank" rel="noreferrer">如何高效的使用并行流</a></li><li><a href="https://juejin.cn/post/6896301661975740423" target="_blank" rel="noreferrer">Java中NullPointerException的完美解决方案</a></li><li><a href="https://juejin.cn/post/6899189517673037832" target="_blank" rel="noreferrer">面试者必看：Java8中的默认方法</a></li><li><a href="https://juejin.cn/post/6894968780003377165" target="_blank" rel="noreferrer">Java8为什么需要引入新的日期和时间库</a></li></ul>`,81),t=[l];function i(c,r,o,u,d,h){return n(),s("div",null,t)}const m=a(e,[["render",i]]);export{b as __pageData,m as default};
