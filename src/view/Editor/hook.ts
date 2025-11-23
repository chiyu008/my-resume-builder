import { ref, shallowRef } from 'vue'
import type { EditorView } from '@codemirror/view'
import type { EditorState } from '@codemirror/state'
import { Codemirror } from 'vue-codemirror'

//
export function useEditorToolbar() {

  // CodeMirror 组件引用
const cmRef = ref<InstanceType<typeof Codemirror>>()
// 保存 EditorView 实例
const editorView = shallowRef<EditorView>()


// 监听 editorView 创建
const handleReady = (payload: { view: EditorView; state: EditorState; container: HTMLElement }) => {
  editorView.value = payload.view
}

// 工具栏按钮点击处理
const handleToolbarClick = (command: string) => {
  const view = editorView.value
  if (!view) return

  switch (command) {
    case 'insertBold':
      insertBold(view)
      break
    case 'insertItalic':
      insertItalic(view)
      break
    case 'insertUnorderedlist':
      insertUnorderedList(view)
      break
    case 'insertOrderedlist':
      insertOrderedList(view)
      break
    case 'insertLink':
      insertLink(view)
      break
    case 'insertAvatar':
      insertImage(view)
      break
    case 'insertTable':
      insertTable(view)
      break
    case 'insertHeadLayout':
      insertHeadLayout(view)
      break
    case 'insertMainLayout':
      insertMainLayout(view)
      break
    default:
      console.log('未实现的命令:', command)
  }
}

// 插入加粗文本
const insertBold = (view: EditorView) => {
  const { from, to } = view.state.selection.main
  const selectedText = view.state.sliceDoc(from, to)

  if (selectedText) {
    // 如果有选中文本，在前后添加 **
    const boldText = `**${selectedText}**`
    view.dispatch({
      changes: { from, to, insert: boldText },
      selection: { anchor: from + boldText.length }
    })
  } else {
    // 如果没有选中文本，插入 **** 并将光标放在中间
    const boldText = '****'
    view.dispatch({
      changes: { from, insert: boldText },
      selection: { anchor: from + 2 }
    })
  }
  view.focus()
}

// 插入斜体文本
const insertItalic = (view: EditorView) => {
  const { from, to } = view.state.selection.main
  const selectedText = view.state.sliceDoc(from, to)

  if (selectedText) {
    const italicText = `*${selectedText}*`
    view.dispatch({
      changes: { from, to, insert: italicText },
      selection: { anchor: from + italicText.length }
    })
  } else {
    const italicText = '**'
    view.dispatch({
      changes: { from, insert: italicText },
      selection: { anchor: from + 1 }
    })
  }
  view.focus()
}

// 插入无序列表
const insertUnorderedList = (view: EditorView) => {
  const { from } = view.state.selection.main
  const line = view.state.doc.lineAt(from)
  const lineStart = line.from

  view.dispatch({
    changes: { from: lineStart, insert: '- ' },
    selection: { anchor: from + 2 }
  })
  view.focus()
}

// 插入有序列表
const index = ref(1)
const insertOrderedList = (view: EditorView) => {
  const { from } = view.state.selection.main
  const line = view.state.doc.lineAt(from)
  const lineStart = line.from

  view.dispatch({
    changes: { from: lineStart, insert: `${index.value++}. ` },
    selection: { anchor: from + 3 }
  })
  view.focus()
}

// 插入链接
const insertLink = (view: EditorView) => {
  const { from, to } = view.state.selection.main
  const selectedText = view.state.sliceDoc(from, to)

  if (selectedText) {
    const linkText = `[${selectedText}](url)`
    view.dispatch({
      changes: { from, to, insert: linkText },
      selection: { anchor: from + linkText.length - 4, head: from + linkText.length - 1 }
    })
  } else {
    const linkText = '[链接文本](url)'
    view.dispatch({
      changes: { from, insert: linkText },
      selection: { anchor: from + 1, head: from + 5 }
    })
  }
  view.focus()
}

// 插入图片
const insertImage = (view: EditorView) => {
  const { from } = view.state.selection.main
  const imageText = '![照片](https://via.placeholder.com/120x160)'
  view.dispatch({
    changes: { from, insert: imageText },
    selection: { anchor: from + imageText.length }
  })
  view.focus()
}

// 插入表格
const insertTable = (view: EditorView) => {
  const { from } = view.state.selection.main
  const line = view.state.doc.lineAt(from)
  const lineStart = line.from

  const tableText = `
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 内容 | 内容 | 内容 |
| 内容 | 内容 | 内容 |
`
  view.dispatch({
    changes: { from: lineStart, insert: tableText },
    selection: { anchor: from + tableText.length }
  })
  view.focus()
}

// 插入个人信息布局
const insertHeadLayout = (view: EditorView) => {
  const { from } = view.state.selection.main
  const line = view.state.doc.lineAt(from)
  const lineStart = line.from

  const template = `# 你的姓名

求职意向: 岗位名称 | 工作地点

年龄 | 性别

联系电话 | 邮箱

---

`
  view.dispatch({
    changes: { from: lineStart, insert: template },
    selection: { anchor: from + template.length }
  })
  view.focus()
}

// 插入主体内容布局
const insertMainLayout = (view: EditorView) => {
  const { from } = view.state.selection.main
  const line = view.state.doc.lineAt(from)
  const lineStart = line.from

  const template = `## 项目经验

### 项目名称 — 职位角色

**技术栈**: 技术1 + 技术2 + 技术3

**项目介绍**: 项目简介内容

**职责描述**:
- 负责XXX功能的设计与开发
- 实现XXX，提升性能XX%
- 优化XXX，降低成本XX%

**项目亮点**:
- 亮点1
- 亮点2

`
  view.dispatch({
    changes: { from: lineStart, insert: template },
    selection: { anchor: from + template.length }
  })
  view.focus()
}

  return {
    cmRef,
    handleReady,
    handleToolbarClick
  }
}
