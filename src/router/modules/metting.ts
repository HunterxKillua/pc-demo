import type { RouteRecordRaw } from 'vue-router'
import { Document, Menu } from '@element-plus/icons-vue'

const routes: RouteRecordRaw[] = [
  {
    path: 'metting',
    name: 'Metting',
    redirect: '/metting/preview',
    component: () => import('~components/layout/index.vue'),
    meta: {
      icon: Menu,
      title: '会议预约',
    },
    children: [
      {
        name: 'MettingPreview',
        path: 'preview',
        component: () => import('@/views/Metting/Stream/index.vue'),
        meta: {
          icon: Document,
          order: 10,
          title: '会议预约',
        },
      },
    ],
  },
]

export { routes }
export default routes
