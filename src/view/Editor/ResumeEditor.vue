<template>
  <div class="editor-panel">
    <div class="panel-header">
      <span>Markdown 编辑</span>
      <button
        :key="idx"
        :data-command="toolBarItem.command"
        v-for="(toolBarItem, idx) in markdownModeToolbarConfig"
        @click="handleToolbarClick(toolBarItem.command)"
      >
        <!-- 使用 Element Plus 的提示组件显示按钮功能说明 -->
        <el-tooltip :content="toolBarItem.tip">
          <!-- 图标元素，根据配置动态生成 class -->
          <i :class="`iconfont icon-${toolBarItem.icon} font-20 mr-10 ml-10 pointer hover`"></i>
        </el-tooltip>
      </button>

      <!-- 照片上传组件 -->
      <!-- <PhotoUpload @photo-uploaded="handlePhotoUploaded" /> -->
    </div>
    <!-- 这个组件配置了一个 支持 Markdown、自动聚焦、Tab 缩进为 2 空格、高度自适应的代码/文本编辑器 -->
    <codemirror
      ref="cmRef"
      v-model="markdown"
      :style="{ height: 'calc(100% - 40px)' }"
      :extensions="extensions"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      class="codemirror-editor"
      @ready="handleReady"
    />
  </div>
</template>

<script setup lang="ts">
import { markdownModeToolbarConfig } from '@/view/constants'
import { markdown as markdownLang } from '@codemirror/lang-markdown'
import { Codemirror } from 'vue-codemirror'
import 'highlight.js/styles/github.css'
import { useEditorStore } from '@/store/editor'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import './resume-editor.scss'
import { useEditorToolbar } from '@/view/Editor/hook'
// import PhotoUpload from '@/components/PhotoUpload.vue'

const { cmRef, handleReady, handleToolbarClick, editorView } = useEditorToolbar()

const { markdownContent } = storeToRefs(useEditorStore())

// CodeMirror 扩展配置
const extensions = [markdownLang()]

const markdown = computed({
  get: () => markdownContent.value,
  set: (val) => { markdownContent.value = val }
})

// 处理照片上传
const handlePhotoUploaded = (base64: string) => {
  if (!editorView.value) return

  // 自动插入照片到光标位置
  const { from } = editorView.value.state.selection.main
  const imageText = `![\u7167\u7247](${base64})`

  editorView.value.dispatch({
    changes: { from, insert: imageText },
    selection: { anchor: from + imageText.length }
  })
  editorView.value.focus()
}
</script>

<style lang="scss" scoped></style>
