interface Friend {
  avatar: string; // 头像链接
  name: string; // 用户 id
  link: string; // 博客链接
  title?: string; // 用户头衔
  tag?: string; // 用户标签
  color?: string; // 标签颜色
}

/**
 * TODO: 缺项处理
 * 在此处填写你的友情链接
 */
export const friendsInfo: Friend[] = [
  {
    avatar: "https://avatars.githubusercontent.com/u/108183563?v=4",
    name: "ZzzRemake",
    title: "🚀 全能 🐳",
    link: "https://zzzremake.github.io/",
    tag: "Research Associate",
    color: "indigo",
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/29620619?v=4",
    name: "Yaossg",
    title: "强大的计算机科学家🧐",
    link: "https://Yaossg.com",
    tag: "DevOps",
    color: "pink",
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/106670529?v=4",
    name: "风唤长河",
    title: "懂不懂全栈开发の含金量",
    link: "https://ventusvocatflumen.cn/",
    tag: "FullStack",
    color: "sky",
  },
  {
    avatar: "https://q.qlogo.cn/g?b=qq&nk=1515903788&s=140",
    name: "Sary",
    title: "人工智能明日之星🌟",
    link: "http://wangcr.top/",
    tag: "AI / DeepLearning",
    color: "green",
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/25294996?v=4",
    name: "Timlzh",
    title: "🥳全体起立!!!",
    link: "https://www.cnblogs.com/timlzh",
    tag: "CTFer / FullStack",
    color: "pink",
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/102564564?v=4",
    name: "Annmy",
    title: "光电の神",
    link: "https://yhblogs.cn",
    tag: "UESTCer",
    color: "orange",
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/78269445?v=4",
    name: "mrcaidev",
    title: "为什么这么强好羡慕啊😭",
    link: "https://mrcai.dev/",
    tag: "FullStack",
    color: "indigo",
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/91458671?v=4",
    name: "Rui1",
    title: "Rui1可以浇浇我后端吗🌹",
    link: "https://blog.ruinique.site/",
    tag: "Backend",
    color: "sky",
  },
];
