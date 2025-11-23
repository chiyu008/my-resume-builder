<template>
  <div class="photo-upload">
    <el-tooltip content="上传证件照">
      <button @click="handleUploadClick" class="upload-btn">
        📷 上传照片
      </button>
    </el-tooltip>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/jpeg,image/jpg,image/png"
      @change="handleFileSelect"
      style="display: none"
    />

    <!-- 图片裁剪对话框 -->
    <el-dialog
      v-model="showCropDialog"
      title="裁剪证件照"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="crop-container">
        <div class="crop-preview">
          <img ref="cropImageRef" :src="selectedImageUrl" alt="待裁剪图片" />
        </div>
        <div class="crop-info">
          <p>📐 推荐比例：3:4（标准证件照）</p>
          <p>📏 建议尺寸：120x160px 或更高</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="showCropDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCropConfirm">确认裁剪</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits<{
  photoUploaded: [base64: string]
}>()

const fileInputRef = ref<HTMLInputElement>()
const cropImageRef = ref<HTMLImageElement>()
const showCropDialog = ref(false)
const selectedImageUrl = ref('')
const originalImage = ref<HTMLImageElement>()

// 点击上传按钮
const handleUploadClick = () => {
  fileInputRef.value?.click()
}

// 文件选择
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  // 验证文件大小（限制 5MB）
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 5MB')
    return
  }

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请上传图片文件')
    return
  }

  // 读取图片
  const reader = new FileReader()
  reader.onload = (e) => {
    selectedImageUrl.value = e.target?.result as string
    showCropDialog.value = true

    // 等待 DOM 更新后加载图片
    nextTick(() => {
      loadImage()
    })
  }
  reader.readAsDataURL(file)

  // 清空 input，允许重复选择同一文件
  input.value = ''
}

// 加载图片
const loadImage = () => {
  if (!cropImageRef.value) return
  originalImage.value = cropImageRef.value
}

// 确认裁剪（简化版：自动居中裁剪）
const handleCropConfirm = () => {
  if (!originalImage.value) return

  const img = originalImage.value
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) return

  // 目标尺寸（360x480，比例 3:4）
  const targetWidth = 360
  const targetHeight = 480
  const targetRatio = 3 / 4

  // 计算原图裁剪区域
  const imgRatio = img.naturalWidth / img.naturalHeight
  let cropWidth, cropHeight, cropX, cropY

  if (imgRatio > targetRatio) {
    // 原图更宽，按高度裁剪
    cropHeight = img.naturalHeight
    cropWidth = cropHeight * targetRatio
    cropX = (img.naturalWidth - cropWidth) / 2
    cropY = 0
  } else {
    // 原图更高，按宽度裁剪
    cropWidth = img.naturalWidth
    cropHeight = cropWidth / targetRatio
    cropX = 0
    cropY = (img.naturalHeight - cropHeight) / 2
  }

  // 设置 canvas 尺寸
  canvas.width = targetWidth
  canvas.height = targetHeight

  // 绘制裁剪后的图片
  ctx.drawImage(
    img,
    cropX, cropY, cropWidth, cropHeight,  // 源图区域
    0, 0, targetWidth, targetHeight        // 目标区域
  )

  // 转换为 Base64
  const base64 = canvas.toDataURL('image/jpeg', 0.85)

  // 存储到 localStorage
  localStorage.setItem('resume-photo', base64)

  // 通知父组件
  emit('photoUploaded', base64)

  // 关闭对话框
  showCropDialog.value = false

  ElMessage.success('照片上传成功！')
}
</script>

<style scoped lang="scss">
.photo-upload {
  display: inline-block;
}

.upload-btn {
  padding: 8px 16px;
  background: #67c23a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;

  &:hover {
    background: #85ce61;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.crop-container {
  .crop-preview {
    width: 100%;
    height: 400px;
    background: #f5f5f5;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 16px;

    img {
      max-width: 100%;
      display: block;
    }
  }

  .crop-info {
    text-align: center;
    color: #666;
    font-size: 14px;

    p {
      margin: 4px 0;
    }
  }
}
</style>
