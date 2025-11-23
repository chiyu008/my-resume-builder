import { createRouter, createWebHistory } from 'vue-router'
import EditorView from '@/view/EditorView.vue'
import TemplateGallery from '@/view/TemplateGallery.vue'

const routes = [
  {
    path: '/',
    name: 'TemplateGallery',
    component: TemplateGallery,
  },
  {
    path: '/editor',
    name: 'Editor',
    component: EditorView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
