<template>
  <div class="editor-container">
    <ResumeEditor />
  </div>
</template>

<script setup lang="ts">
import ResumeEditor from '@/components/ResumeEditor.vue'
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.test {
  width: 100%;
  height: 100%;
  background: black;
}
</style>
