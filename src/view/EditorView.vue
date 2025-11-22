<template>
  <div class="editor-container">
    <div class="resume-builder">
      <!-- 顶部工具栏 -->
      <Header />
      <!-- 双栏布局 -->
      <div class="editor-layout">
        <!-- 左侧编辑区 -->
        <ResumeEditor />
        <!-- 右侧预览区 -->
        <render />
      </div>
    </div>
  </div>
</template>

<script ript setup lang="ts">
import ResumeEditor from './Editor/ResumeEditor.vue'
import 'highlight.js/styles/github.css'
import Header from './header/header.vue'
import './editor-view.scss';
import render from './preview/render.vue'

</script>
<style scoped></style>
