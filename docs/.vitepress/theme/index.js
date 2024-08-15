import DefaultTheme from "vitepress/theme";
import "./tailwind.css";
import "./var.css";
import "./article.css";
import "./print.css";
import MyLayout from '../components/MyLayout.vue';

import LinkCard from "../components/LinkCard.vue";
import HText from "../components/HText.vue";

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app, router }) {
    app.component("LinkCard", LinkCard);
    app.component("HText", HText);

    // 这里插入百度统计代码
    if (typeof window !== 'undefined') {
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?e8f29d251188c407b607df359432a40c";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();


      router.onAfterRouteChanged = (to, from) => {
        if (typeof _hmt !== "undefined") {
          if (to.path) {
            _hmt.push(["_trackPageview", to.fullPath]);
          }
        }
      }
    }

  },
};
