<template>
  <div id="comment-container"></div>
</template>

<script lang="ts" setup>
  import { reactive, toRefs, onMounted } from 'vue';
  import { useData } from 'vitepress';
  import md5 from 'blueimp-md5';
  import $ from 'jquery';
  import { Message } from '@arco-design/web-vue';
  import '@arco-design/web-vue/dist/arco.css';
  import Gitalk from 'gitalk';
  import '../theme/gitalk.css';

  // 定义属性
  const props = defineProps({
    commentConfig: Object,
    updateCountCallback: null
  });

  const data = reactive({
    type: props.commentConfig?.type ?? 'gitalk',
  })
  const { type } = toRefs(data);

  // 初始化评论组件配置
  const { page } = useData();
  let gitalk;
  if (type.value && type.value == 'gitalk') {
    gitalk = new Gitalk({
      clientID: 'Ov23lilpsupVw8JsEPdh',
      clientSecret: '5d6d0161320c2eb1181009a58030210a9791d1a2',
      repo: 'silently9527.github.io',
      owner: 'silently9527',
      admin: ['silently9527'],
      id: md5(page.value.relativePath),
      language: 'zh-CN',
      distractionFreeMode: false,
      updateCountCallback: props.updateCountCallback
    });
  }

  // 渲染评论组件
  onMounted(() => {
    if (type.value && type.value == 'gitalk') {
      gitalk.render('comment-container')

      // 如果点赞，先判断有没有登录
      let $gc = $('#comment-container');
      $gc.on('click', '.gt-comment-like', function () {
        if (!window.localStorage.getItem('GT_ACCESS_TOKEN')) {
          console.log("33333")
          Message.warning({
            content: '点赞前，请您先进行登录',
            closable: true
          })
          return false
        }
        return true
      })
      // 提交评论后输入框高度没有重置bug
      $gc.on('click', '.gt-header-controls .gt-btn-public', function () {
        let $gt = $('.gt-header-textarea')
        $gt.css('height', '72px')
      })
      // 点击预览时，隐藏评论按钮
      $gc.on('click', '.gt-header-controls .gt-btn-preview', function () {
        let pl = $('.gt-header-controls .gt-btn-public');
        if (pl.hasClass('hide')) {
          pl.removeClass('hide')
        } else {
          // 隐藏
          pl.addClass('hide')
        }
      })

    }
  })
</script>

<style scoped></style>