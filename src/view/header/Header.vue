<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <h1 class="title">📝 在线简历生成器</h1>
    </div>

    <div class="toolbar-right">
      <RouterLink to="/">简历模版</RouterLink>
      <select v-model="currentTemplate" class="template-select">
        <option value="default">简约模板</option>
        <option value="geek">极客模板</option>
        <option value="professional">专业模板</option>
      </select>
      <button @click="pdfStore.downloadPDF" class="btn-export" :disabled="pdfStore.isExporting">
        <span v-if="!pdfStore.isExporting">📄 导出 PDF</span>
        <span v-else>导出中...</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { watch } from 'vue'
import { usePdfStore } from '@/store/pdf'
import './header.scss'


const currentTemplate = ref('default')
const pdfStore = usePdfStore()

// 动态加载模板样式
watch(currentTemplate, (newVal) => {
  let link = document.getElementById('template-style') as HTMLLinkElement
  if (!link) {
    link = document.createElement('link')
    link.id = 'template-style'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
  link.href = `/src/assets/styles/${newVal}.css`
}, { immediate: true })

</script>

<style scoped></style>
