import { createRouter, createWebHistory } from 'vue-router'
import EditorView from '@/view/EditorView.vue'

const routes = [
  {
    path: '/',
    name: 'Editor',
    component: EditorView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
