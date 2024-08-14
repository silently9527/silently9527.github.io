import{V as v,_ as w,m as x,a as y}from"./chunks/theme.DkjyC8yp.js";import{_ as m,h as b,o as n,c as p,r as F,a as u,n as $,j as t,t as c,I as h,w as d,u as C,b as _,k as r,D,M as I,F as P,p as S,l as z}from"./chunks/framework.d_Ke7vMG.js";const V=[{avatar:"https://raw.githubusercontent.com/silently9527/images/main/202408141137371.png",name:"mercyblitz",title:"🐎 小马哥 明星项目架构师",link:"https://mercyblitz.github.io/",tag:"SpringCloudAlibaba",color:"indigo"},{avatar:"https://raw.githubusercontent.com/silently9527/images/main/202408141142625.png",name:"zbwer",title:"🧐easy-vitepress-blog",link:"https://blog.zbwer.work/",tag:"Frontend Developer",color:"pink"},{avatar:"https://bbchin.com/logo",name:"M酷",title:"专注分享前端技术的博客",link:"https://bbchin.com",tag:"Frontend Developer",color:"indigo"},{avatar:"https://www.anwei.wang/logo",name:"DUSH",title:"博主平时个人工作和生活。🌹",link:"https://www.anwei.wang/links",tag:"DevOps",color:"sky"}],B={__name:"Badge",props:["color"],setup(e){const{color:a}=e,s=b(()=>{switch(a){case"sky":return"bg-sky-500";case"pink":return"bg-pink-500";case"indigo":return"bg-indigo-500";case"orange":return"bg-orange-500";case"green":return"bg-green-500";default:return"bg-gray-500"}});return(l,i)=>(n(),p("span",{class:$(["badge text-slate-100",s.value])},[F(l.$slots,"default",{},()=>[u("UESTCer")],!0)],2))}},T=m(B,[["__scopeId","data-v-59c25ec4"]]),L={class:"w-16 h-16 overflow-hidden rounded-full VP-shadow"},N=["src","alt"],E={class:"w-full text-center"},O={class:"text-lg font-bold tracking-wider dark:text-zinc-200"},U={class:"w-full mt-1 break-words line-clamp-2 dark:text-zinc-400"},j={class:"inline-block mt-2 text-sm text-indigo-400 transition-all duration-300 border-b border-indigo-400 dark:text-sky-400 dark:border-sky-400 sm:opacity-0 group-hover:opacity-100"},A={__name:"FriendsCard",props:["avatar","name","title","link","tag","color"],setup(e){const a=e,s=b(()=>{let i=a.link;const g=/^(http|https):\/\/(.*)$/;return i.replace(g,"$2")});function l(){window.open(a.link,"_blank")}return(i,g)=>(n(),p("div",{onClick:l,class:"flex flex-col items-center w-full h-full p-6 transition-all duration-300 border cursor-pointer bg-stripe group hover:border-indigo-800 dark:hover:border-sky-300 dark:border-transparent bg-slate-50 dark:bg-slate-800 dark:text-slate-300 rounded-xl"},[t("div",L,[t("img",{src:e.avatar,alt:e.name},null,8,N)]),t("div",E,[t("h1",O,c(e.name),1),t("div",null,[h(T,{color:e.color||"sky"},{default:d(()=>[u(c(e.tag),1)]),_:1},8,["color"])]),t("p",U,c(e.title),1),t("p",j," 🔗"+c(s.value),1)])]))}},M=m(A,[["__scopeId","data-v-81eae1b8"]]),o=e=>(S("data-v-1d92f12e"),e=e(),z(),e),H={class:"px-6 md:px-12 lg:px-16"},J={class:"FriendsContent"},q=o(()=>t("br",null,null,-1)),G=o(()=>t("br",null,null,-1)),K=o(()=>t("br",null,null,-1)),Q=o(()=>t("hr",null,null,-1)),R={class:"px-6 md:px-12 lg:px-16",style:{"max-width":"1200px",margin:"0 auto"}},W=o(()=>t("br",null,null,-1)),X={__name:"Friends",setup(e){const{page:a,theme:s,frontmatter:l}=C();return(i,g)=>(n(),_(r(y),null,{default:d(()=>[h(r(v),null,{title:d(()=>[u("🎨 Friends 🙌")]),lead:d(()=>[u("Awesome Friends from Diverse Fields of Expertise")]),_:1}),t("div",H,[t("div",J,[(n(!0),p(P,null,D(r(V),(f,k)=>(n(),_(M,I({key:k,ref_for:!0},f),null,16))),128))])]),q,G,K,Q,t("div",R,[(n(),_(w,{commentConfig:r(s).commentConfig,key:r(x)(r(a).relativePath)},null,8,["commentConfig"]))]),W]),_:1}))}},Y=m(X,[["__scopeId","data-v-1d92f12e"]]),ae=JSON.parse('{"title":"","description":"","frontmatter":{"layout":"page"},"headers":[],"relativePath":"Friends.md","filePath":"Friends.md","lastUpdated":1723472907000}'),Z={name:"Friends.md"},ne=Object.assign(Z,{setup(e){return(a,s)=>(n(),p("div",null,[h(Y)]))}});export{ae as __pageData,ne as default};
