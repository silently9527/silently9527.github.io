<template>
  <VPTeamPage>
    <VPTeamPageTitle>
      <template #title>🎯 Projects ✨</template>
      <template #lead>My Open Source Projects</template>
    </VPTeamPageTitle>
    <div class="px-6 md:px-12 lg:px-16">
      <div class="ProjectsContent">
        <ProjectCard v-for="(item, index) in projectsInfo" :key="index" v-bind="item" />
      </div>
    </div>

    <br>
    <br>
    <br>
    <hr>
    <div class="px-6 md:px-12 lg:px-16" style="max-width: 1200px; margin: 0 auto;">
      <Comment :commentConfig="theme.commentConfig" :key="md5(page.relativePath)" />
    </div>
    <br>
  </VPTeamPage>
</template>

<script setup>
import { VPTeamPage, VPTeamPageTitle } from "vitepress/theme";
import ProjectCard from "./ProjectCard.vue";
import { projectsInfo } from "../userConfig/projectsInfo";
import { useData } from 'vitepress';
const { page, theme, frontmatter } = useData();
import md5 from 'blueimp-md5';
import Comment from '../components/Comment.vue';
</script>

<style scoped>
.VPTeamPage {
  margin: 0;
}
hr {
  border-top: 1px solid var(--c-border);
}
.ProjectsContent {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(288px, 1fr));
  max-width: 1152px;
  gap: 24px;
  margin: 0 auto;
}
</style>
