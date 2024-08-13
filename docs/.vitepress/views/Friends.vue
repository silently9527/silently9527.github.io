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
    <div class="px-6 md:px-12 lg:px-16" style="max-width: 1200px; margin: 0 auto;">
      <Comment :commentConfig="theme.commentConfig" :key="md5(page.relativePath)" />
    </div>
    <br>

  </VPTeamPage>
</template>

<script setup>
import { VPTeamPage, VPTeamPageTitle } from "vitepress/theme";
import { friendsInfo } from "../userConfig/friendsInfo";
import FriendsCard from "./FriendsCard.vue";
import { useData } from 'vitepress';
const { page, theme, frontmatter } = useData();
import md5 from 'blueimp-md5';
import Comment from '../components/Comment.vue';
</script>

<style scoped>
.VPTeamPage{
  margin: 0;
}
.FriendsContent {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(224px, 1fr));
  max-width: 1152px;
  gap: 24px;
  margin: 0 auto;
}
</style>
