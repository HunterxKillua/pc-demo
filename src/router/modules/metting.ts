import type { RouteRecordRaw } from 'vue-router'
import { Document, Menu } from '@element-plus/icons-vue'

const basicName = 'Metting'
const routes: RouteRecordRaw[] = [
  {
    path: 'metting',
    name: '',
    redirect: '/metting/preview',
    component: () => import('~components/layout/index.vue'),
    meta: {
      icon: Menu,
      title: '会议管理',
    },
    children: [
      {
        name: 'Preview',
        path: 'preview',
        component: () => import('@/views/Metting/Stream/index.vue'),
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
        component: () => import('@/views/Metting/Schedule/index.vue'),
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
        component: () => import('@/views/Metting/Record/index.vue'),
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
        component: () => import('@/views/Metting/Manage/index.vue'),
        meta: {
          icon: Document,
          order: 13,
          title: '会议管理',
          bubble: true,
        },
      },
      {
        name: 'Statistics',
        path: 'statistics',
        component: () => import('@/views/Metting/Statistics/index.vue'),
        meta: {
          icon: Document,
          order: 12,
          title: '数据统计',
          bubble: true,
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
