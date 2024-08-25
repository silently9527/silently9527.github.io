import { defineConfig } from "vitepress";
import { fileURLToPath, URL } from "node:url";
import { getSidebar } from "./utils/getSidebar";
export default defineConfig({
  title: "Herman's Notes",
  titleTemplate: "Herman",
  // md 文件根目录
  srcDir: "./src",
  lastUpdated: true,
  description:
    "Herman's Notes: 个人技术知识库，记录 & 分享个人碎片化、结构化、体系化的技术知识内容。",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  themeConfig: {
    logo: "/favicon.ico",
    // 顶部导航栏
    nav: [
      { text: "💭 Notes", link: "/Notes/No1MyProjects/index" },
      { text: "🦄 Projects", link: "Projects.md" },
      { text: "👫 Friends", link: "Friends.md" },
      { text: "👋 About", link: "AboutMe.md" },
    ],
    // 文章页面左侧导航
    sidebar: {
      "/Notes/": getSidebar("/docs/src", "/Notes/"),
    },
    // 是否启动搜索功能
    search: {
      provider: "local",
    },
    // 顶部导航栏左侧的社交平台跳转
    socialLinks: [{ icon: "github", link: "https://github.com/silently9527" }],
    // 首页底部版权声明
    footer: {
      copyright: "Copyright © 2023-present Herman",
    },
    // 文章内导航栏标题
    outlineTitle: "导航栏",
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPDocFooterLastUpdated\.vue$/,
          replacement: fileURLToPath(
            new URL("./components/UpdateTime.vue", import.meta.url)
          ),
        },
        {
          find: /^.*\/VPFooter\.vue$/,
          replacement: fileURLToPath(new URL("./components/Footer.vue", import.meta.url)),
        },
      ],
    },
  },
  markdown: {
    math: true,
  },
  // 自定义扩展: 评论配置
  commentConfig: {
    type: 'gitalk',
    showComment: true // 是否显示评论
  },
});
