import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEditorStore = defineStore('editor', () => {
  // 默认简历内容
  const markdownContent = ref(`# 张三的简历

## 个人信息

- 姓名: 张三
- 电话: 138****8888
- 邮箱: zhangsan@example.com
- 学校: 某某大学

## 教育背景

### 某某大学 | 计算机科学与技术 | 本科

2020.09 - 2024.06

## 项目经验

### 个人博客系统

**技术栈**: Vue3 + Node.js + MongoDB

- 实现用户注册登录功能
- 支持文章发布和评论
- 集成 Markdown 编辑器

## 技能清单

- 熟练掌握 HTML/CSS/JavaScript
- 熟悉 Vue3 框架
- 了解 Git 版本控制
`)

  return {
    markdownContent,
  }
})
