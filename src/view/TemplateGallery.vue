<template>
  <div class="resume-gallery">
    <!-- 顶部导航栏 -->
    <nav class="top-navbar">
      <div class="nav-content">
        <div class="brand">
          <div class="brand-icon">📋</div>
          <span class="brand-name">简历构建器</span>
        </div>
        <RouterLink to="/editor" class="create-btn">
          <span>开始创作</span>
          <span class="arrow">→</span>
        </RouterLink>
      </div>
    </nav>

    <!-- 主内容区 -->
    <div class="page-container">
      <!-- 左侧分类栏 -->
      <aside class="category-sidebar">
        <div class="sidebar-title">模板分类</div>
        <div class="category-list">
          <button
            v-for="cat in categories"
            :key="cat.id"
            :class="['category-item', { selected: activeCategory === cat.id }]"
            @click="activeCategory = cat.id"
          >
            <span class="cat-icon">{{ cat.icon }}</span>
            <span class="cat-label">{{ cat.name }}</span>
            <span v-if="activeCategory === cat.id" class="active-indicator"></span>
          </button>
        </div>

        <!-- 推荐栏 -->
        <div class="hot-section">
          <div class="hot-title">🔥 热门推荐</div>
          <div class="hot-list">
            <div
              v-for="(item, idx) in hotTemplates"
              :key="idx"
              class="hot-item"
              @click="selectTemplate(item)"
            >
              <span class="hot-rank">{{ idx + 1 }}</span>
              <span class="hot-name">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- 右侧内容区 -->
      <main class="content-area">
        <!-- 标题栏 -->
        <div class="content-header">
          <h2 class="section-title">
            {{ activeCategory === 'all' ? '全部模板' : categories.find(c => c.id === activeCategory)?.name }}
          </h2>
          <p class="section-subtitle">选择合适的模板，快速开始创作</p>
        </div>

        <!-- 模板列表 -->
        <div class="template-list">
          <div
            v-for="tpl in filteredTemplates"
            :key="tpl.id"
            class="template-box"
            @click="selectTemplate(tpl)"
          >
            <div class="box-cover" :style="{ background: tpl.gradient }">
              <div class="cover-badge">{{ tpl.type }}</div>
              <div class="cover-action">
                <button class="action-btn">使用此模板</button>
              </div>
            </div>
            <div class="box-info">
              <h4 class="info-title">{{ tpl.name }}</h4>
              <p class="info-desc">{{ tpl.description }}</p>
              <div class="info-meta">
                <span class="meta-tag">{{ tpl.suitable }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredTemplates.length === 0" class="empty-view">
          <div class="empty-graphic">📦</div>
          <p class="empty-message">该分类暂无可用模板</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Template {
  id: string
  name: string
  type: string
  category: string
  description: string
  gradient: string
  suitable: string
  templateId: string
}

const router = useRouter()

// 分类
const categories = [
  { id: 'all', name: '全部', icon: '📚' },
  { id: 'student', name: '校招', icon: '🎓' },
  { id: 'social', name: '社招', icon: '💼' },
  { id: 'tech', name: '技术', icon: '💻' },
  { id: 'design', name: '设计', icon: '🎨' },
  { id: 'business', name: '商务', icon: '📊' },
  { id: 'creative', name: '创意', icon: '✨' },
]

const activeCategory = ref('all')

// 模板数据
const templates = ref<Template[]>([
  {
    id: 't1',
    name: '学生简历',
    type: '应届生',
    category: 'student',
    description: '清新简洁，适合应届毕业生和实习生',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    suitable: '校园招聘',
    templateId: 'default'
  },
  {
    id: 't2',
    name: '专业简历',
    type: '社招',
    category: 'social',
    description: '成熟稳重，展现专业能力',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    suitable: '社会招聘',
    templateId: 'professional'
  },
  {
    id: 't3',
    name: '技术简历',
    type: '程序员',
    category: 'tech',
    description: '简洁高效，突出技术栈',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    suitable: '技术岗位',
    templateId: 'geek'
  },
  {
    id: 't4',
    name: '设计简历',
    type: '设计师',
    category: 'design',
    description: '创意美观，彰显设计感',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    suitable: '设计岗位',
    templateId: 'creative'
  },
  {
    id: 't5',
    name: '商务简历',
    type: '商务',
    category: 'business',
    description: '专业规范，适合商务场合',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    suitable: '商务岗位',
    templateId: 'simple'
  },
  {
    id: 't6',
    name: '简约简历',
    type: '通用',
    category: 'creative',
    description: '极简风格，百搭通用',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    suitable: '各类岗位',
    templateId: 'default'
  },
])

// 热门推荐
const hotTemplates = computed(() => templates.value.slice(0, 4))

// 过滤模板
const filteredTemplates = computed(() => {
  if (activeCategory.value === 'all') {
    return templates.value
  }
  return templates.value.filter(t => t.category === activeCategory.value)
})

// 选择模板
const selectTemplate = (template: Template) => {
  localStorage.setItem('selected-template', template.templateId)
  router.push('/editor')
}
</script>

<style scoped lang="scss">
.resume-gallery {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
}

// 顶部导航
.top-navbar {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

  .nav-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 32px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
    font-size: 18px;
    color: #1a1a1a;

    .brand-icon {
      font-size: 24px;
    }
  }

  .create-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
    }

    .arrow {
      font-size: 18px;
      transition: transform 0.3s;
    }

    &:hover .arrow {
      transform: translateX(4px);
    }
  }
}

// 页面容器
.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 32px;
}

// 左侧分类栏
.category-sidebar {
  background: white;
  border-radius: 16px;
  padding: 24px;
  height: fit-content;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 96px;

  .sidebar-title {
    font-size: 14px;
    font-weight: 600;
    color: #666;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .category-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 32px;
  }

  .category-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border: none;
    background: transparent;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    text-align: left;

    .cat-icon {
      font-size: 18px;
    }

    .cat-label {
      flex: 1;
      font-size: 15px;
      color: #555;
      font-weight: 500;
    }

    .active-indicator {
      width: 4px;
      height: 4px;
      background: #667eea;
      border-radius: 50%;
    }

    &:hover {
      background: #f5f5f5;
    }

    &.selected {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);

      .cat-label {
        color: #667eea;
        font-weight: 600;
      }
    }
  }

  .hot-section {
    border-top: 1px solid #f0f0f0;
    padding-top: 24px;

    .hot-title {
      font-size: 14px;
      font-weight: 600;
      color: #666;
      margin-bottom: 16px;
    }

    .hot-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .hot-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: #fafafa;
      }

      .hot-rank {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
      }

      .hot-name {
        flex: 1;
        font-size: 14px;
        color: #444;
      }
    }
  }
}

// 右侧内容区
.content-area {
  .content-header {
    margin-bottom: 32px;

    .section-title {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 8px 0;
    }

    .section-subtitle {
      font-size: 16px;
      color: #888;
      margin: 0;
    }
  }

  .template-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }

  .template-box {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);

      .cover-action {
        opacity: 1;
      }
    }

    .box-cover {
      position: relative;
      height: 380px;
      display: flex;
      align-items: center;
      justify-content: center;

      .cover-badge {
        padding: 8px 20px;
        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        color: white;
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .cover-action {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;

        .action-btn {
          padding: 14px 32px;
          background: white;
          color: #1a1a1a;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          }
        }
      }
    }

    .box-info {
      padding: 20px;

      .info-title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0 0 8px 0;
      }

      .info-desc {
        font-size: 14px;
        color: #888;
        margin: 0 0 12px 0;
        line-height: 1.5;
      }

      .info-meta {
        display: flex;
        gap: 8px;

        .meta-tag {
          padding: 4px 12px;
          background: #f5f5f5;
          border-radius: 6px;
          font-size: 12px;
          color: #666;
        }
      }
    }
  }

  .empty-view {
    text-align: center;
    padding: 80px 20px;

    .empty-graphic {
      font-size: 80px;
      margin-bottom: 20px;
      opacity: 0.5;
    }

    .empty-message {
      font-size: 16px;
      color: #999;
    }
  }
}

// 响应式
@media (max-width: 1024px) {
  .page-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .category-sidebar {
    position: relative;
    top: 0;

    .category-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 8px;
    }

    .hot-section {
      display: none;
    }
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .content-area .template-list {
    grid-template-columns: 1fr;
  }
}
</style>
