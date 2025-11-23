import { defineStore } from 'pinia'
import { ref } from 'vue'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export const usePdfStore = defineStore('pdf', () => {
  const previewZoom = ref(1)
  const isExporting = ref(false)
  const exportProgress = ref(0) // 导出进度 0-100
  const padding = ref(30) // 页边距（px）- 默认使用更紧凑的值

  // PDF 导出优化
  async function downloadPDF() {
    const element = document.getElementById('resume-preview')
    if (!element) {
      alert('预览区域未找到')
      return
    }

    try {
      isExporting.value = true
      exportProgress.value = 0

      // 步骤 1: 准备导出 - 重置缩放为1
      exportProgress.value = 10
      const originalZoom = previewZoom.value
      previewZoom.value = 1

      await new Promise((resolve) => setTimeout(resolve, 200))
      exportProgress.value = 20

      // 获取元素的实际尺寸（210mm = 793.7px 左右）
      const elementWidth = element.offsetWidth
      const elementHeight = element.offsetHeight

      // 步骤 2: 生成画布 - 使用适当的 scale
      const canvas = await html2canvas(element, {
        scale: 2, // 使用 2 倍分辨率即可
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: elementWidth,
        height: elementHeight,
        windowWidth: elementWidth,
        windowHeight: elementHeight,
        onclone: () => {
          exportProgress.value = 50
        }
      })

      exportProgress.value = 70

      // 步骤 3: 生成 PDF - 多页分页
      const pdf = new jsPDF('p', 'mm', 'a4')

      // A4 纸张尺寸（mm）
      const pdfWidth = pdf.internal.pageSize.getWidth() // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight() // 297mm

      // 计算实际需要的高度，保持宽高比
      const canvasWidth = canvas.width
      const canvasHeight = canvas.height

      // 宽度始终固定为210mm，高度按比例计算
      const imgWidth = pdfWidth
      const imgHeight = (pdfWidth * canvasHeight) / canvasWidth

      // 计算需要多少页
      const totalPages = Math.ceil(imgHeight / pdfHeight)

      exportProgress.value = 75

      // 分页添加内容
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage()
        }

        // 计算当前页的截取位置
        const sourceY = page * pdfHeight * (canvasWidth / pdfWidth) // 转换回像素坐标
        const sourceHeight = pdfHeight * (canvasWidth / pdfWidth)

        // 计算当前页实际高度（最后一页可能不满）
        const remainingHeight = canvasHeight - sourceY
        const actualSourceHeight = Math.min(sourceHeight, remainingHeight)
        const actualPdfHeight = (actualSourceHeight / canvasWidth) * pdfWidth

        // 使用 canvas 截取当前页内容
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = canvasWidth
        pageCanvas.height = actualSourceHeight
        const pageCtx = pageCanvas.getContext('2d')

        if (pageCtx) {
          pageCtx.drawImage(
            canvas,
            0, sourceY,           // 源图位置
            canvasWidth, actualSourceHeight,  // 源图尺寸
            0, 0,                 // 目标位置
            canvasWidth, actualSourceHeight   // 目标尺寸
          )

          const pageImgData = pageCanvas.toDataURL('image/png', 1.0)

          // 添加到 PDF，左右对齐，无留白
          pdf.addImage(
            pageImgData,
            'PNG',
            0,
            0,
            imgWidth,
            actualPdfHeight,
            undefined,
            'FAST'
          )
        }

        exportProgress.value = 75 + (page + 1) / totalPages * 15
      }

      // 步骤 4: 保存文件
      pdf.save('我的简历.pdf')
      exportProgress.value = 100

      // 恢复缩放
      previewZoom.value = originalZoom

      // 显示成功提示
      setTimeout(() => {
        exportProgress.value = 0
      }, 1000)
    } catch (error) {
      console.error('PDF 导出失败:', error)
      alert('PDF 导出失败，请重试')
      exportProgress.value = 0
    } finally {
      isExporting.value = false
    }
  }
  return {
    previewZoom,
    downloadPDF,
    isExporting,
    exportProgress,
    padding,
  }
})
