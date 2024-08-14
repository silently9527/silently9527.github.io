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
    avatar: "https://raw.githubusercontent.com/silently9527/images/main/202408141137371.png",
    name: "mercyblitz",
    title: "🐎 小马哥 明星项目架构师",
    link: "https://mercyblitz.github.io/",
    tag: "SpringCloudAlibaba",
    color: "indigo",
  },
  {
    avatar: "https://raw.githubusercontent.com/silently9527/images/main/202408141142625.png",
    name: "zbwer",
    title: "🧐easy-vitepress-blog",
    link: "https://blog.zbwer.work/",
    tag: "Frontend Developer",
    color: "pink",
  },
  {
    avatar: "https://bbchin.com/logo",
    name: "M酷",
    title: "专注分享前端技术的博客",
    link: "https://bbchin.com",
    tag: "Frontend Developer",
    color: "green",
  },
  {
    avatar: "https://www.anwei.wang/logo",
    name: "DUSH",
    title: "博主平时个人工作和生活。🌹",
    link: "https://www.anwei.wang/links",
    tag: "DevOps",
    color: "sky",
  },
  {
    avatar: "https://songjian.cc/logo",
    name: "鲨鱼辣椒",
    title: "Java Developer",
    link: "https://songjian.cc",
    tag: "Java",
    color: "orange",
  },
  {
    avatar: "https://www.luoxx.top/logo",
    name: "luoxx的博客",
    title: "只要思想不滑坡，办法总比困难多",
    link: "https://www.luoxx.top",
    tag: "DevOps",
    color: "orange",
  },
  {
    avatar: "https://4xx.me/upload/logo.ico",
    name: "For XX",
    title: "专注于技术本身",
    link: "https://4xx.me/",
    tag: "Java Developer",
    color: "gold",
  },
  {
    avatar: "https://raw.githubusercontent.com/silently9527/images/main/202408141819468.png",
    name: "一只小松徐吖",
    title: "A Good Boy",
    link: "https://blog.xaoxu.cn/",
    tag: "Linux",
    color: "purple",
  },
];
