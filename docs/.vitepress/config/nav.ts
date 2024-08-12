import type { DefaultTheme } from 'vitepress';

export const nav: DefaultTheme.Config['nav'] = [
  {
    text: '我的专栏',
    items: [
      { text: '卧学算法', link: '/article/pamphlet/algorithms/index', activeMatch: '/article/pamphlet/algorithms/' },
    ],
    activeMatch: '/article/pamphlet/'
  },
  // {
  //   text: 'PDF书籍',
  //   link: '/article/pdf/index',
  //   activeMatch: '/article/pdf'
  // },
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
    text: '👫 友链',
    link: '/friends',
    activeMatch: '/friends'
  },
  {
    text: '关于我',
    link: '/about',
    activeMatch: '/about'
  },
];