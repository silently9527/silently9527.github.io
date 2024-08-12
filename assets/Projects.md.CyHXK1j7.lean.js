import{V as _,a as m}from"./chunks/theme.Qixlz1wj.js";import{h,o as r,c as s,j as e,P as b,t as l,n as f,e as k,_ as x,b as p,w as i,I as g,k as c,a as u,F as v,E as y,M as P}from"./chunks/framework.D1poPhlk.js";const j={class:"w-full h-40"},w={class:"p-4 pb-6"},S={class:"flex items-center justify-between"},V={class:"text-lg font-bold"},C={class:"mt-2 text-sm transition-all duration-300 line-clamp-2 text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-100"},M={__name:"ProjectCard",props:["banner","title","description","link","tag"],setup(t){const a=t,n=h(()=>{switch(a.tag){case"JavaScript":return"bg-yellow-400 text-white";case"Python":return"bg-sky-700 text-white";case"Vue":return"bg-teal-400 text-white";case"TypeScript":return"bg-sky-400 text-white";case"C++":return"bg-red-400 text-white";default:return"border"}});function o(){window.open(a.link,"_blank")}return(d,$)=>(r(),s("div",{onClick:o,class:"overflow-hidden transition-all duration-300 border rounded-lg cursor-pointer hover:border-indigo-800 dark:hover:border-sky-300 bg-slate-50 dark:bg-slate-800 dark:border-transparent group"},[e("div",j,[e("div",{style:b({"background-image":`url(${a.banner})`}),class:"w-full h-full bg-center bg-no-repeat bg-cover"},null,4)]),e("div",w,[e("div",S,[e("h1",V,l(t.title),1),t.tag?(r(),s("p",{key:0,class:f(["text-[12px] px-2 rounded-full py-0.5",n.value])},l(t.tag),3)):k("",!0)]),e("p",C,l(t.description),1)])]))}},I=[{banner:"/project-img/analyze-tool.png",title:"coupons",description:"淘宝客项目，从前端到后端完全开源的淘宝客项目，目前项目已经支持打包成App、微信小程序、QQ小程序、Web站点",link:"https://github.com/silently9527/coupons",tag:"Java/vue/uniapp"},{banner:"/project-img/dora-bot.png",title:"SmartMvc",description:"理解SpringMVC的原理，在面试或工作中都十分的重要,从手写简易版的SpringMVC框架出发， 理出SpringMVC的主线并深入理解SpringMVC的原理",link:"https://github.com/silently9527/SmartMvc",tag:"Vue"},{banner:"/project-img/ruleMining.png",title:"Programmer Toolkit",description:"在开发的过程中经常会使用一些在线的工具，比如：时间戳转日期，JSON格式化等等；考虑想把这些常用的功能都做成IDEA插件，在使用的时候就不用去网上寻找工具，在IDEA中就可以快速完成提升开发人员开发效率；",link:"https://github.com/silently9527/Toolkit",tag:"intellij IDEA plugin"}],T={class:"px-6 md:px-12 lg:px-16"},N={class:"ProjectsContent"},B={__name:"Projects",setup(t){return(a,n)=>(r(),p(c(m),null,{default:i(()=>[g(c(_),null,{title:i(()=>[u("🎯 Projects ✨")]),lead:i(()=>[u("My Open Source Projects")]),_:1}),e("div",T,[e("div",N,[(r(!0),s(v,null,y(c(I),(o,d)=>(r(),p(M,P({key:d,ref_for:!0},o),null,16))),128))])])]),_:1}))}},D=x(B,[["__scopeId","data-v-f5b9d1ec"]]),O=JSON.parse('{"title":"","description":"","frontmatter":{"layout":"page"},"headers":[],"relativePath":"Projects.md","filePath":"Projects.md","lastUpdated":1723472907000}'),E={name:"Projects.md"},z=Object.assign(E,{setup(t){return(a,n)=>(r(),s("div",null,[g(D)]))}});export{O as __pageData,z as default};
