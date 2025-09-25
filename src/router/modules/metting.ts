import type { RouteRecordRaw } from 'vue-router'
import { Document, Menu } from '@element-plus/icons-vue'
import Layout from '~components/layout/index.vue'

const basicName = 'Meeting'
const routes: RouteRecordRaw[] = [
  {
    path: 'meeting',
    name: '',
    redirect: '/meeting/preview',
    component: Layout,
    meta: {
      icon: Menu,
      title: '会议管理',
      order: 16,
    },
    children: [
      {
        name: 'Preview',
        path: 'preview',
        component: () => import('@/views/Meeting/Stream/index.vue'),
        meta: {
          icon: Document,
          order: 16,
          title: '预定会议',
          bubble: true,
        },
      },
      {
        name: `Schedule`,
        path: 'schedule',
        component: () => import('@/views/Meeting/Schedule/index.vue'),
        meta: {
          icon: Document,
          order: 15,
          title: '会议室查询',
          bubble: true,
        },
      },
      {
        name: 'Record',
        path: 'record',
        component: () => import('@/views/Meeting/Record/index.vue'),
        meta: {
          icon: Document,
          order: 14,
          title: '我的会议',
          bubble: true,
        },
      },
      {
        name: 'Management',
        path: 'management',
        component: () => import('@/views/Meeting/Manage/index.vue'),
        meta: {
          icon: Document,
          order: 13,
          title: '会议管理',
          bubble: true,
        },
      },
      // {
      //   name: 'Statistics',
      //   path: 'statistics',
      //   component: () => import('@/views/Meeting/Statistics/index.vue'),
      //   meta: {
      //     icon: Document,
      //     order: 12,
      //     title: '数据统计',
      //     bubble: true,
      //   },
      // },
      {
        name: 'Book',
        path: 'book',
        component: () => import('@/views/Meeting/Book/index.vue'),
        meta: {
          icon: Document,
          order: 11,
          title: '预定会议',
          bubble: true,
          isHidden: true,
        },
      },
    ],
  },
].map((item) => {
  const { name, ...conf } = item
  return {
    ...conf,
    name: `${basicName}${name}`,
  }
})

export { routes }
export default routes
