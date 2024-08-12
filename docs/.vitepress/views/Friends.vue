<template>
  <VPTeamPage>
    <VPTeamPageTitle>
      <template #title>🎨 Friends 🙌</template>
      <template #lead>Awesome Friends from Diverse Fields of Expertise</template>
    </VPTeamPageTitle>
    <div class="px-6 md:px-12 lg:px-16">
      <div class="FriendsContent">
        <FriendsCard
          v-for="(item, index) in friendsInfo"
          :key="index"
          v-bind="item"
        ></FriendsCard>
      </div>
    </div>

    <br>
    <br>
    <br>
    <hr>
    <Comment :commentConfig="theme.commentConfig" :key="md5(page.relativePath)" />

  </VPTeamPage>
</template>

<script setup>
import md5 from 'blueimp-md5';
import { useData } from 'vitepress';
import { VPTeamPage, VPTeamPageTitle } from "vitepress/theme";
import { friendsInfo } from "../userConfig/friendsInfo";
const { page, theme, frontmatter } = useData();
import FriendsCard from "./FriendsCard.vue";
import Comment from '../components/Comment.vue';
</script>

<style scoped>
.FriendsContent {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(224px, 1fr));
  max-width: 1152px;
  gap: 24px;
  margin: 0 auto;
}
</style>
