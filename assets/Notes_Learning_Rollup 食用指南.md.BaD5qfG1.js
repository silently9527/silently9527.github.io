import{_ as l,D as n,c as p,I as a,a4 as s,o as t}from"./chunks/framework.D1poPhlk.js";const b=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep","updateTime":"2023-10-02 16:28","tags":"Rollup/手册","desc":"快速上手 JavaScript模块打包工具 Rollup。本文将带你了解 Rollup的基本概念以及如何优雅地食用 Rollup."},"headers":[],"relativePath":"Notes/Learning/Rollup 食用指南.md","filePath":"Notes/Learning/Rollup 食用指南.md","lastUpdated":1723472907000}'),e={name:"Notes/Learning/Rollup 食用指南.md"},h=s('<p><strong>🍰 Rollup 是什么？</strong></p><p>Rollup 是一个用于 JavaScript 的模块打包工具 ⚙️ ，它也可以将项目中散落的细小模块打包为整块代码，从而使得这些划分的模块可以更好的运行在浏览器环境或者 Node.js 环境。Rollup 通常用于框架与类库的开发，例如 Vue,React 这些知名的前端框架就是使用 Rollup 构建的。</p><p><strong>✨ 为什么需要 Rollup？</strong></p><ol><li><strong>代码组织</strong>: 在大型项目中，我们通常会将代码分解为多个模块，以便更好地组织和管理代码（例如 <code>index.js</code> 入口函数调用 <code>util.js</code> 中的模块）。然而，浏览器并不直接支持模块系统，因此我们需要使用打包工具将分散的代码打包成一个或几个文件。</li><li><strong>性能优化</strong>：Rollup 会静态分析导入的代码，排除其中并没有被使用的内容，从而减小最终的代码体积，这个过程被称为除屑优化（Tree-Shaking）。</li><li><strong>便于分发</strong>：假设我们正在创建一个库，使用 Rollup 打包能够帮助你的库更容易被其他开发者使用。例如有的开发人员想要在浏览器中使用你的库，有的开发人员想使用 CommonJS 的方式导入你的库，你不需要编写多个版本的代码，Rollup 可以帮你打包成各种各样的格式。</li></ol><p><strong>🎯 Rollup 与 Webpack 有什么区别？</strong></p><ol><li><p>Webpack 是一个通用的模块打包工具，它不仅可以处理 JavaScript，还可以处理 CSS、图片和其他类型的资源。Webpack 的设计哲学是“一切皆模块”，它有丰富的插件系统和 loader 系统，可以通过配置来满足各种复杂的需求，通常用于构建大型应用程序。</p></li><li><p>Rollup 的设计哲学是“尽可能地生成小的 bundle”。它专注于 JavaScript 的静态模块打包，并且使用了 tree shaking 技术来移除无用的代码，生成更小的文件。Rollup 更适合用于打包库和框架。</p></li></ol><blockquote><p>简而言之，如果你正在开发 JavaScript 框架或是类库，那你一定要尝试一下 Rollup.</p></blockquote><h2 id="🚀-快速上手" tabindex="-1">🚀 快速上手 <a class="header-anchor" href="#🚀-快速上手" aria-label="Permalink to &quot;🚀 快速上手&quot;">​</a></h2><p>该部分内容笔者建议阅读官方文档的 Tutorial（简直是保姆式教程！）</p>',9),k=s(`<p>需要<strong>注意</strong>的配置项： <code>output.name</code></p><p>对于输出格式为 <code>iifs</code>/<code>umd</code> 的代码来说，如果想要使用全局变量名来表示打包后的代码，该选项是必要的。例如此时相关代码如下:</p><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-w56GE" id="tab-GNF-8Wm" checked><label for="tab-GNF-8Wm">src/index.js</label><input type="radio" name="group-w56GE" id="tab-JQ0I-A9"><label for="tab-JQ0I-A9">rollup.config.js</label></div><div class="blocks"><div class="language-js vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> hi</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Hello Rollup&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  input: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;src/index.js&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  output: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    file: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;bundle.js&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    format: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;iife&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    name: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;MyBundle&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre></div></div></div><p>打包后结果如下：</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> MyBundle </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () {</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span></span></code></pre></div><p>在浏览器中你可以通过这样的代码来调用函数 <code>hi</code></p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;!</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">DOCTYPE</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> html</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">html</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;en&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">head</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">title</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;Document&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">title</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> src</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;bundle.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      MyBundle.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">hi</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">head</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">html</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><div class="danger custom-block"><p class="custom-block-title">注意</p><p>如果你使用了 terser 插件的 toplevel 会导致 output.name 失效.</p></div><h2 id="🔨-可能有用的插件" tabindex="-1">🔨 可能有用的插件 <a class="header-anchor" href="#🔨-可能有用的插件" aria-label="Permalink to &quot;🔨 可能有用的插件&quot;">​</a></h2><ul><li><code>@rollup/plugin-json</code></li></ul><p>通常来讲 Rollup 只允许你引入 ES Module, 这个插件能够帮助你从 JSON 文件中导入数据，还会剔除没有被使用过的字段（如果你阅读过 Rollup 的教程部分那你对这个插件一定不陌生）</p><ul><li><code>@rollup/plugin-commonjs</code></li></ul><p>这个插件让 Rollup 能够处理那些使用 CommonJS 模块系统（这是 Node.js 中使用的模块系统）编写的代码。即类似 <code>const fs = require(&#39;fs&#39;)</code> 的写法。</p><p>上述插件都是为了拓展 Rollup 的导入能力，还有许多其他类似的插件，用于导入图片，CSS 等等资源 。</p><ul><li><code>@rollup/plugin-node-resolve</code></li></ul><p>协助 Rollup 定位并打包第三方 Node.js 模块。例如，当你在代码中输入<code>import _ from &#39;lodash-es&#39;</code>，Rollup 默认只会在项目的本地文件中进行搜索，而不会去<code>node_modules</code> 目录中寻找。这时候就需要这个插件来帮助 Rollup 找到 <code>lodash-es</code>。</p><ul><li><code>@rollup/plugin-terser</code></li></ul><p>用于压缩和优化你的 JavaScript 代码，它能够删除未使用的代码，对代码进行压缩以及混淆。这个插件在构建生产环境的代码时非常有用。</p><ul><li><code>@rollup/plugin-replace</code></li></ul><p>这个插件的主要功能是在你的源代码中查找并替换特定的字符串或者模式。它在构建过程中非常有用，因为它可以帮助你动态地修改代码。比如，你可能想在开发环境和生产环境中使用不同的配置，或者你可能想在代码中插入当前的构建时间或者版本号。下面是一个简单的例子，<code>process.env.NODE_ENV</code>将会被替换为字符串 <code>&#39;production&#39;</code></p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> replace </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;@rollup/plugin-replace&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">rollup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  input: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;main.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  plugins: [</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    replace</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">      &quot;process.env.NODE_ENV&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">JSON</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">stringify</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;production&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">      __buildDate__</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Date</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      __buildVersion: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">15</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre></div><ul><li><code>rollup-plugin-typescript2</code></li></ul><p>让你能够在 Rollup 打包过程中使用 TypeScript。你可以自定义 TypeScript 编译选项，例如指定一个 <code>tsconfig.json</code> 文件，又或者动态覆盖<code>tsconfig.json</code>中的内容。</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> typescript </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;rollup-plugin-typescript2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">rollup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  plugins: [</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    typescript</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      tsconfig: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">resolve</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;tsconfig.json&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        tsconfigOverride: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          compilerOptions: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          target: isBrowserBuild </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;es5&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> :</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;es6&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre></div><h2 id="📚-浅析-vue-构建过程" tabindex="-1">📚 浅析 Vue 构建过程 <a class="header-anchor" href="#📚-浅析-vue-构建过程" aria-label="Permalink to &quot;📚 浅析 Vue 构建过程&quot;">​</a></h2><p>Vue3 源码仓库地址：</p>`,26),E=s("<p>与构建相关的代码： <code>rollup.config.js</code> 和 <code>scripts/build.js</code></p><ul><li><code>build.js</code>：首先解析命令行参数，随后使用 <code>execa</code> 调用 <code>rollup</code> 打包命令，并将动态构建的环境变量传递给 <code>rollup</code> 使用，最后还检查文件的大小并计算压缩后的大小。</li><li><code>rollup.config.js</code>：根据传入的环境变量配置插件，入口文件，导出信息等等。</li></ul><p>与常规的打包过程相比，Vue 还使用了一个额外的文件 <code>build.js</code> 去参与整个打包过程。它的作用其实可以用一句话来概括，就是向配置文件传递环境变量。</p><p>至于为什么不直接使用 Rollup 命令行的 <code>--environment</code> 参数，这是直接因为 Rollup 命令行不够灵活，在某些需求下，环境变量可能具有多个不同的取值，我们想要动态的构造环境变量，又或者说对传入的环境变量进行解析，验证以及类型的转换。我们需要一个专门的脚本文件去达成上述的个性化需求。</p>",4);function d(o,r,c,g,u,y){const i=n("LinkCard");return t(),p("div",null,[h,a(i,{link:"https://www.rollupjs.com/tutorial/",desc:"教程 | Rollup 中文文档"}),k,a(i,{link:"https://github.com/vuejs/core",desc:"Vue.js/core | Github"}),E])}const m=l(e,[["render",d]]);export{b as __pageData,m as default};
