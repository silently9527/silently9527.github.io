import type { DefaultTheme } from 'vitepress';

export const nav: DefaultTheme.Config['nav'] = [
  {
    text: '我的专栏',
    items: [
      // { text: 'Java基础快速入门', link: '/courses/java/index', activeMatch: '/courses/java/' },
    ],
    activeMatch: '/courses/'
  },
  {
    text: 'PDF书籍',
    link: '/article/pdf/index',
    activeMatch: '/article/pdf'
  },
  {
    text: '标签',
    link: '/tags',
    activeMatch: '/tags'
  },
  {
    text: '归档',
    link: '/archives',
    activeMatch: '/archives'
  },
  {
    text: '关于',
    items: [
      { text: '关于知识库', link: '/about/index', activeMatch: '/about/index' },
      { text: '关于我', link: '/about/me', activeMatch: '/about/me' }
    ],
    activeMatch: '/about/' // // 当前页面处于匹配路径下时, 对应导航菜单将突出显示
  },
];