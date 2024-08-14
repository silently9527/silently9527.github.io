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
    color: "indigo",
  },
  {
    avatar: "https://www.anwei.wang/logo",
    name: "DUSH",
    title: "博主平时个人工作和生活。🌹",
    link: "https://www.anwei.wang/links",
    tag: "DevOps",
    color: "sky",
  },
];
