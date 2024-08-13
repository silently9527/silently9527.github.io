interface Project {
  banner: string; // 图片链接
  title: string; // 项目标题
  description: string; // 项目简介
  link: string; // 项目链接
  tag?: string; // 项目标签
}

/**
 * TODO: 缺项处理
 * 在此处填写你的项目介绍
 */
export const projectsInfo: Project[] = [
  {
    banner: "/project-img/coupons.png",
    title: "Coupons",
    description: "淘宝客项目，从前端到后端完全开源的淘宝客项目，目前项目已经支持打包成App、微信小程序、QQ小程序、Web站点",
    link: "https://github.com/silently9527/coupons",
    tag: "Java/vue/uniapp",
  },
  {
    banner: "/project-img/smartmvc.png",
    title: "SmartMvc",
    description: "理解SpringMVC的原理，在面试或工作中都十分的重要,从手写简易版的SpringMVC框架出发， 理出SpringMVC的主线并深入理解SpringMVC的原理",
    link: "https://github.com/silently9527/SmartMvc",
    tag: "Vue",
  },
  {
    banner: "/project-img/toolkit.png",
    title: "Programmer Toolkit",
    description: "在开发的过程中经常会使用一些在线的工具，比如：时间戳转日期，JSON格式化等等；考虑想把这些常用的功能都做成IDEA插件，在使用的时候就不用去网上寻找工具，在IDEA中就可以快速完成提升开发人员开发效率；",
    link: "https://github.com/silently9527/Toolkit",
    tag: "intellij IDEA plugin",
  },
];
