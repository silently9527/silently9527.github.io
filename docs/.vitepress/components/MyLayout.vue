<template>
  <Layout>
    <template #doc-after>
      <Comment v-if="(theme.commentConfig?.showComment ?? true) && (frontmatter?.showComment ?? true)" :commentConfig="theme.commentConfig" :key="md5(page.relativePath)" />
    </template>
  </Layout>
</template>

<script setup>
import md5 from 'blueimp-md5';
import { useData } from 'vitepress';
import DefaultTheme from "vitepress/theme";
const { Layout } = DefaultTheme;
const { page, theme, frontmatter } = useData();
import Comment from './Comment.vue';

</script>
