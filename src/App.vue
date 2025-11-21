<template>
  <router-view />
</template>

<script setup lang="ts">
// import ResumeEditor from './components/ResumeEditor.vue'
// import mdEditer from './view/editor/components/editor/mdEditer.vue';
// import test from './view/editor/components/test.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /*  默认是 content-box（width/height 只包含内容区），
  而 border-box 表示 width = 内容 + padding + border，
  更符合直觉，避免因 padding/border 导致元素溢出或布局错乱。 */
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
}

#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
