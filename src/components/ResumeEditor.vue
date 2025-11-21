<template>
  <div class="resume-builder">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <h1 class="title">📝 在线简历生成器</h1>
      </div>

      <div class="toolbar-right">
        <RouterLink to="/">简历模版</RouterLink>
        <select v-model="currentTemplate" class="template-select">
          <option value="default">简约模板</option>
          <option value="geek">极客模板</option>
        </select>
        <button @click="downloadPDF" class="btn-export" :disabled="isExporting">
          <span v-if="!isExporting">📄 导出 PDF</span>
          <span v-else>导出中...</span>
        </button>
      </div>
    </div>

    <!-- 双栏布局 -->
    <div class="editor-layout">
      <!-- 左侧编辑区 -->
      <div class="editor-panel">
        <div class="panel-header">
          <span>Markdown 编辑</span>
          <button :key="idx" :data-command="toolBarItem.command"
            v-for="(toolBarItem, idx) in markdownModeToolbarConfig">
            <!-- 使用 Element Plus 的提示组件显示按钮功能说明 -->
            <el-tooltip :content="toolBarItem.tip">
              <!-- 图标元素，根据配置动态生成 class -->
              <i :class="`iconfont icon-${toolBarItem.icon} font-20 mr-10 ml-10 pointer hover`"></i>
            </el-tooltip>
          </button>
        </div>
        <!-- 这个组件配置了一个 支持 Markdown、自动聚焦、Tab 缩进为 2 空格、高度自适应的代码/文本编辑器 -->
        <codemirror v-model="markdown" :style="{ height: 'calc(100% - 40px)' }" :extensions="extensions"
          :autofocus="true" :indent-with-tab="true" :tab-size="2" class="codemirror-editor" />
      </div>

      <!-- 右侧预览区 -->
      <div class="preview-panel">
        <div class="panel-header">
          <span>实时预览</span>
          <select v-model="previewZoom" class="zoom-select">
            <option :value="0.8">80%</option>
            <option :value="0.9">90%</option>
            <option :value="1">100%</option>
            <option :value="1.1">110%</option>
            <option :value="1.2">120%</option>
          </select>
        </div>
        <div class="preview-container">
          <div id="resume-preview" class="preview-content"
            :style="{ transform: `scale(${previewZoom})`, transformOrigin: 'top center' }">
            <div class="markdown-body" v-html="renderedHtml"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script ript setup lang="ts">
import { ref, computed, watch } from 'vue'
import { markdownModeToolbarConfig } from './constants'
import MarkdownIt from 'markdown-it'
import { Codemirror } from 'vue-codemirror'
import { markdown as markdownLang } from '@codemirror/lang-markdown'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { useEditorStore } from '@/store/editor'
import { storeToRefs } from 'pinia'
const { markdownContent } = storeToRefs(useEditorStore())

// CodeMirror 扩展配置
const extensions = [markdownLang()]

// 模板切换
const currentTemplate = ref('default')
const previewZoom = ref(1)
const isExporting = ref(false)

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



// 防抖渲染
let debounceTimer: number | null = null
const renderedHtml = ref('')


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

const markdown = computed({
  get: () => markdownContent.value,
  set: (val) => { markdownContent.value = val }
})

// PDF 导出优化
async function downloadPDF() {
  const element = document.getElementById('resume-preview')
  if (!element) {
    alert('预览区域未找到')
    return
  }

  try {
    // 在按钮上显示“导出中...”
    // 禁用其他操作防止重复点击
    isExporting.value = true

    // 临时重置缩放以获得正确尺寸
    const originalZoom = previewZoom.value
    previewZoom.value = 1

    // 等待 DOM 更新
    // previewZoom.value = 1 是响应式更新，Vue 会在下一个 tick 才真正修改 DOM 的 style.transform；
    // 如果立即调用 html2canvas，它可能还是按旧的缩放值截图。
    await new Promise(resolve => setTimeout(resolve, 100))

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth * 72 / 25.4, pdfHeight / imgHeight * 72 / 25.4)
    const imgX = (pdfWidth - imgWidth * ratio * 25.4 / 72) / 2
    const imgY = 0

    pdf.addImage(
      imgData,
      'PNG',
      imgX,
      imgY,
      imgWidth * ratio * 25.4 / 72,
      imgHeight * ratio * 25.4 / 72
    )

    pdf.save('我的简历.pdf')

    // 恢复缩放
    previewZoom.value = originalZoom
  } catch (error) {
    console.error('PDF 导出失败:', error)
    alert('PDF 导出失败，请重试')
  } finally {
    isExporting.value = false
  }
}
</script>


<style lang="scss" scoped>
@import './index.scss';
</style>
