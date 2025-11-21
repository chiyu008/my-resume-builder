<template>
  <div class="preview-panel">
    <div class="panel-header">
      <span>实时预览</span>
      <select v-model="previewValue" class="zoom-select">
        <option :value="0.8" @click="sendToZoom">80%</option>
        <option :value="0.9" @click="sendToZoom">90%</option>
        <option :value="1" @click="sendToZoom">100%</option>
        <option :value="1.1" @click="sendToZoom">110%</option>
        <option :value="1.2" @click="sendToZoom">120%</option>
      </select>
    </div>
    <div class="preview-container">
      <div id="resume-preview" class="preview-content"
        :style="{ transform: `scale(${previewValue})`, transformOrigin: 'top center' }">
        <div class="markdown-body" v-html="renderedHtml"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { useEditorStore } from '@/store/editor'
import { storeToRefs } from 'pinia'
import './render.scss'
const { markdownContent } = storeToRefs(useEditorStore())
const emit = defineEmits(['sendData'])
const previewValue = ref(1)
const sendToZoom = () => {
  emit('sendData', previewValue.value)
}
// 防抖渲染
let debounceTimer: number | null = null
const renderedHtml = ref('')

// Markdown 解析配置
const md: MarkdownIt = new MarkdownIt({
  // 允许在 Markdown 中直接写原生 HTML 标签
  html: true,
  // 自动将 URL 转换为链接
  linkify: true,
  // 启用_typographer模式，启用一些额外的语义化标签
  typographer: true,
  // 代码高亮
  highlight: (str: string, lang: string): string => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
      } catch {
        // 忽略错误
      }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})


watch(markdownContent, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    renderedHtml.value = md.render(newVal)
  }, 300)
  //   目的：避免用户每敲一个字就立即重新渲染 Markdown（性能差、闪烁）。
  // 工作原理：
  // 每次内容变化时，先清除上一次设置的定时器（clearTimeout）；
  // 然后重新设置一个新的 300ms 延迟任务；
  // 只有当用户停止输入超过 300 毫秒，才会真正执行 md.render(newVal) 并更新 renderedHtml
}, { immediate: true })
</script>

<style scoped></style>
