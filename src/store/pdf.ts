import { defineStore } from 'pinia'
import { ref } from 'vue'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export const usePdfStore = defineStore('pdf', () => {
  const previewZoom = ref(1)
  const isExporting = ref(false)

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
      await new Promise((resolve) => setTimeout(resolve, 100))

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(
        ((pdfWidth / imgWidth) * 72) / 25.4,
        ((pdfHeight / imgHeight) * 72) / 25.4,
      )
      const imgX = (pdfWidth - (imgWidth * ratio * 25.4) / 72) / 2
      const imgY = 0

      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        imgY,
        (imgWidth * ratio * 25.4) / 72,
        (imgHeight * ratio * 25.4) / 72,
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
  return {
    previewZoom,
    downloadPDF,
    isExporting,
  }
})
