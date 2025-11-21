<template>
  <div class="editor-panel">
    <div class="panel-header">
      <span>Markdown 编辑</span>
      <button :key="idx" :data-command="toolBarItem.command" v-for="(toolBarItem, idx) in markdownModeToolbarConfig">
        <!-- 使用 Element Plus 的提示组件显示按钮功能说明 -->
        <el-tooltip :content="toolBarItem.tip">
          <!-- 图标元素，根据配置动态生成 class -->
          <i :class="`iconfont icon-${toolBarItem.icon} font-20 mr-10 ml-10 pointer hover`"></i>
        </el-tooltip>
      </button>
    </div>
    <!-- 这个组件配置了一个 支持 Markdown、自动聚焦、Tab 缩进为 2 空格、高度自适应的代码/文本编辑器 -->
    <codemirror v-model="markdown" :style="{ height: 'calc(100% - 40px)' }" :extensions="extensions" :autofocus="true"
      :indent-with-tab="true" :tab-size="2" class="codemirror-editor" />
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

const { markdownContent } = storeToRefs(useEditorStore())

// CodeMirror 扩展配置
const extensions = [markdownLang()]

const markdown = computed({
  get: () => markdownContent.value,
  set: (val) => { markdownContent.value = val }
})
</script>

<style lang="scss" scoped></style>
