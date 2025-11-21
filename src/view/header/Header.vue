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
      </select>
      <button @click="downloadPDF" class="btn-export" :disabled="isExporting">
        <span v-if="!isExporting">📄 导出 PDF</span>
        <span v-else>导出中...</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { watch } from 'vue'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import './header.scss'

const emit = defineEmits(['update:previewZoom'])

const { previewZoom } = defineProps({
  previewZoom: Number // 注意：v-model 默认 prop 名是 modelValue
})

const currentTemplate = ref('default')
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
    // previewZoom.value = 1
    emit('update:previewZoom', '1')
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
    emit('update:previewZoom', originalZoom)
  } catch (error) {
    console.error('PDF 导出失败:', error)
    alert('PDF 导出失败，请重试')
  } finally {
    isExporting.value = false
  }
}
</script>

<style scoped></style>
