import DefaultTheme from "vitepress/theme";
import '@arco-design/web-vue/dist/arco.css'; // 导入 Arco Design 的样式
import "./tailwind.css";
import "./var.css";
import "./article.css";
import "./print.css";


export default {
    extends: DefaultTheme,
    enhanceApp(ctx) {
    },
};
