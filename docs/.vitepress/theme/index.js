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
  enhanceApp(ctx) {
    ctx.app.component("LinkCard", LinkCard);
    ctx.app.component("HText", HText);
  },
};
