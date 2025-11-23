<template>
  <div class="preview-panel">
    <div class="panel-header">
      <span>实时预览</span>
      <div class="header-controls">
        <!-- 字数统计 -->
        <span class="word-count">📊 {{ wordCount }} 字</span>

        <!-- 页边距调整 -->
        <el-tooltip content="页边距">
          <select v-model.number="pdfStore.padding" class="padding-select">
            <option :value="24">24px</option>
            <option :value="32">32px</option>
            <option :value="48">48px</option>
            <option :value="64">64px</option>
          </select>
        </el-tooltip>

        <!-- 缩放选择 -->
        <select v-model.number="pdfStore.previewZoom" class="zoom-select">
          <option :value="0.6">60%</option>
          <option :value="0.7">70%</option>
          <option :value="0.8">80%</option>
          <option :value="0.9">90%</option>
          <option :value="1">100%</option>
        </select>
      </div>
    </div>
    <div class="preview-container">
      <!-- A4 纸张模拟 -->
      <div class="a4-page-wrapper">
        <div
          id="resume-preview"
          class="preview-content a4-page"
          :style="{
            transform: `scale(${pdfStore.previewZoom})`,
            transformOrigin: 'top center',
          }"
        >
          <div
            class="markdown-body"
            :style="{ padding: `${pdfStore.padding}px` }"
            v-html="renderedHtml"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { useEditorStore } from '@/store/editor'
import { storeToRefs } from 'pinia'
import './render.scss'
import { usePdfStore } from '@/store/pdf'
const { markdownContent } = storeToRefs(useEditorStore())
const pdfStore = usePdfStore()

// 字数统计
const wordCount = computed(() => {
  // 移除 Markdown 语法符号，计算纯文本字数
  const text = markdownContent.value
    .replace(/[#*`\[\]()_~>-]/g, '') // 移除 Markdown 符号
    .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
    .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
    .replace(/\s+/g, '') // 移除空白
  return text.length
})

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
