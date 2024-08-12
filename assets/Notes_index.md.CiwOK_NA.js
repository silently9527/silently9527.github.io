import{d as v,a5 as w,o as a,c as i,j as t,t as n,n as _,F as k,E as b,a6 as C,y as S,e as x,u as T,k as d,I as N,b as $}from"./chunks/framework.D1poPhlk.js";const I=JSON.parse('[{"url":"/Notes/Interviews/秋招投递记录.html","frontmatter":{"updateTime":"2024-07-24 23:49","desc":"2025 应届秋招/提前批投递记录, 我这一生如履薄冰, 我能走到对岸吗？","tags":"面经/秋招"},"date":{"time":1721864940000,"string":"July 24, 2024"}},{"url":"/Notes/Interviews/实习投递记录.html","frontmatter":{"updateTime":"2024-07-24 23:48","desc":"2023/24年寒假/暑期实习投递记录，跌跌撞撞一路打怪升级！🏃‍♂️","tags":"面经/实习"},"date":{"time":1721864880000,"string":"July 24, 2024"}},{"url":"/Notes/Interviews/HTML与CSS.html","frontmatter":{"updateTime":"2024-07-16 21:34","desc":"现代 CSS 的博大精深！好想成为 CSS 高手😭，切最酷的图！本文试图全面记录 CSS 在面试中的考点，探索那些微小但重要的细节。","tags":"八股/CSS","outline":"deep"},"date":{"time":1721165640000,"string":"July 16, 2024"}},{"url":"/Notes/Interviews/浏览器原理与计网.html","frontmatter":{"updateTime":"2024-03-13 01:38","desc":"面试官：浏览器从输入URL到页面展示的过程是怎样的？浏览器的缓存机制是怎样的？什么是同源策略又有哪些跨域解决方案？你还是支支吾吾一头雾水吗？看完这篇文章，下次面试直接开始吟唱！😎","tags":"八股/计算机基础","outline":2},"date":{"time":1710293880000,"string":"March 13, 2024"}},{"url":"/Notes/Interviews/Vue 相关.html","frontmatter":{"updateTime":"2024-03-10 11:24","desc":"Vue 八股文の个人理解，包括响应式原理、Pinia 原理与简单实现、router 简要原理","tags":"八股/Vue","outline":"deep"},"date":{"time":1710069840000,"string":"March 10, 2024"}},{"url":"/Notes/Interviews/手写与场景模拟题.html","frontmatter":{"updateTime":"2024-03-07 23:44","desc":"前端面试高频手写题与场景题, 目前收录并发请求控制...","tags":"八股","outline":2},"date":{"time":1709855040000,"string":"March 7, 2024"}},{"url":"/Notes/Interviews/JavaScript 相关.html","frontmatter":{"updateTime":"2023-11-27 10:55","desc":"教练，我想成为前端高手！JavaScript 是世界上最好的语言！(雾","tags":"八股/JavaScript","outline":"deep"},"date":{"time":1701082500000,"string":"November 27, 2023"}},{"url":"/Notes/Interviews/面经总结.html","frontmatter":{"updateTime":"2023-09-17 15:12","desc":"常考八股文收录,适合中国宝宝体质的八股速通","tags":"八股","outline":2},"date":{"time":1694963520000,"string":"September 17, 2023"}}]'),L={Interviews:"🏃 八股面经",Learning:"🎨 学习笔记",Thoughts:"🔮 随想杂文"},B={class:"w-full px-5"},J={class:"text-sm text-zinc-400"},j={class:"flex-1 mt-2 leading-relaxed transition-all duration-300 text-black/60 dark:text-slate-500 dark:group-hover:text-white/80 group-hover:text-black"},M={class:"flex justify-end w-full mt-3"},V=v({__name:"BlogArchivePostCard",props:["post","flow"],setup(c){const m=w(),u=l=>{var h;const e=(h=l.frontmatter)==null?void 0:h.title;if(e)return e;const{url:s}=l,o=s.match(/.*\/(.*.html)/);let r=o&&o[1].replace(".html","");return r?L[r]||r:"Error Title"},p=l=>{const e=l.frontmatter.tags;return e?e.split("/").slice(0,2):[]},g=l=>m.go(l);return(l,e)=>(a(),i("div",{onClick:e[0]||(e[0]=s=>g(c.post.url)),class:"relative py-4 mt-6 transition-all border rounded-lg cursor-pointer dark:border-transparent hover:border-indigo-800 break-inside-avoid-column bg-zinc-50/50 sm:pl-0 dark:bg-slate-800/80 first:mt-0 dark:hover:bg-sky-950/80 dark:hover:border-sky-300"},[t("div",B,[t("p",J,n(c.post.date.string),1),t("h1",{class:_([c.flow?"":"lg:text-2xl","my-2 text-xl font-bold leading-8 tracking-tight"])},n(u(c.post)),3),t("p",j,n(c.post.frontmatter.desc),1),t("div",M,[(a(!0),i(k,null,b(p(c.post),(s,o)=>(a(),i("p",{key:o,class:_([o>=1?"ml-2":"","px-2 text-sm border rounded-full border-sky-400/80 dark:border-zinc-200 text-sky-400 dark:text-zinc-200"])},n(s),3))),128))])])]))}}),z={class:"lg:sticky lg:top-20"},P={class:"px-2 pb-3 border-b-2 border-sky-400 dark:border-sky-700"},A=t("h1",{class:"pb-2 text-3xl font-bold transition-all duration-300 border-b-4 border-sky-500 dark:border-sky-700 w-fit hover:pr-6"}," 🏷️ 文章分类 ",-1),D={class:"mt-4"},E=["onClick"],H={class:"font-bold"},O={class:"text-sm line-clamp-1"},F={class:"absolute flex items-center justify-end -translate-y-1/2 right-2 top-1/2"},R=t("svg",{class:"",width:"15",height:"15",viewBox:"0 0 15 15",xmlns:"http://www.w3.org/2000/svg"},[t("path",{d:"M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z",fill:"currentColor","fill-rule":"evenodd","clip-rule":"evenodd"})],-1),U={key:0,class:"flex gap-2 py-2 mt-4 rounded-lg shadow-md bg-amber-100/80 dark:bg-amber-950/80"},q=t("span",{class:"self-start text-2xl"},"“",-1),Z={class:"flex-1 my-4 indent-4"},G={key:0,class:"text-right"},K=t("span",{class:"self-end text-2xl"},"”",-1),Q=v({__name:"BlogArchiveSidebar",props:["types","features"],setup(c){const m=w(),{types:u,features:p}=c,g=[...u],l=s=>s&&m.go(s),e=C({string:"",from:""});return S(async()=>{fetch("https://v1.hitokoto.cn?c=a&c=b&c=d&c=i&min_length=10").then(s=>s.json()).then(({hitokoto:s,from:o})=>{e.string=s,e.from=o}).catch(console.error)}),(s,o)=>(a(),i("div",z,[t("div",P,[A,t("div",D,[(a(),i(k,null,b(g,r=>t("div",{onClick:h=>l(r.link),class:"relative px-2 py-1 transition-all rounded-lg hover:cursor-pointer hover:bg-sky-200/80 dark:hover:bg-sky-900/80",key:r.name},[t("h1",H,n(r.name),1),t("p",O,n(r.desc),1),t("div",F,[t("p",null,n(r.icon||"🔗"),1),R])],8,E)),64))])]),e.string?(a(),i("div",U,[q,t("div",Z,[t("h1",null,n(e.string),1),e.from?(a(),i("p",G,"—— 《"+n(e.from)+"》",1)):x("",!0)]),K])):x("",!0)]))}}),W={class:"max-w-3xl px-4 pb-8 mx-auto my-20 sm:px-6 xl:max-w-5xl xl:px-0 dark:divide-slate-200/20"},X={class:"relative flex justify-center mt-2 0"},Y={class:"text-5xl font-bold"},tt={class:"absolute text-6xl tracking-wider text-transparent -translate-x-1/2 opacity-60 bottom-1/3 left-1/2 bg-gradient-to-b from-black/20 to-black/10 bg-clip-text dark:from-white/20 dark:to-white/10"},et={class:"mt-2 text-center text-black/50 dark:text-slate-500"},st={class:"grid grid-cols-1 pt-6 mt-6 lg:gap-8 lg:grid-cols-3"},rt=t("h1",{class:"pb-2 text-3xl font-bold transition-all duration-300 border-b-4 border-sky-500 dark:border-sky-700 w-fit hover:pr-6"}," ✨ 近期更新 ",-1),ot={key:0,class:"order-1 col-span-1 lg:order-2"},nt=v({__name:"BlogArchive",setup(c){var h;const{frontmatter:m,theme:u}=T(),{hero:p,types:g,features:l,flow:e}=m.value,s=window.location.pathname,o=(h=u.value.sidebar)==null?void 0:h[s],r=g||(o==null?void 0:o.items.map(f=>({name:f.text,link:f.link})));return(f,lt)=>(a(),i("div",W,[t("div",X,[t("h1",Y,n(d(p).title||"Blogs"),1),t("span",tt,n(d(p).title||"Blogs"),1)]),t("p",et,n(d(p).subTitle),1),t("ul",st,[t("div",{class:_([d(r)?"col-span-2":"col-span-3","order-2 pt-6 lg:pt-0 lg:order-1 lg:mt-0"])},[rt,t("div",{class:_(["mt-4",d(e)?"columns-1 lg:columns-2 gap-8":""])},[(a(!0),i(k,null,b(d(I),(y,it)=>(a(),$(V,{key:y.date.time,post:y,flow:d(e)},null,8,["post","flow"]))),128))],2)],2),d(r)||d(l)?(a(),i("div",ot,[N(Q,{types:d(r)},null,8,["types"])])):x("",!0)])]))}}),dt=JSON.parse('{"title":"","description":"","frontmatter":{"layout":"page","sidebar":false,"hero":{"title":"Notes","subTitle":"“笔记是记录思想的过程，是思维的延伸。” ——刘佳琦"},"types":[{"name":"面经分享","desc":"Interview experiences","link":"/Notes/Interviews/","icon":"📝"},{"name":"学习笔记","desc":"Learning Notes","link":"/Notes/Learning/","icon":"🏃"},{"name":"随想杂文","desc":"personal musings","link":"/Notes/Thoughts/"}]},"headers":[],"relativePath":"Notes/index.md","filePath":"Notes/index.md","lastUpdated":1723474336000}'),at={name:"Notes/index.md"},mt=Object.assign(at,{setup(c){return(m,u)=>(a(),i("div",null,[N(nt)]))}});export{dt as __pageData,mt as default};
