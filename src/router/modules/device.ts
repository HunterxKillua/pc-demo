import type { RouteRecordRaw } from 'vue-router'
import { Document, Menu } from '@element-plus/icons-vue'
import Layout from '~components/layout/index.vue'
import { addNamePrefix } from '@/utils'

const routes: RouteRecordRaw[] = addNamePrefix([
  {
    path: 'device',
    name: '',
    redirect: '/device/manage',
    component: Layout,
    meta: {
      icon: Menu,
      title: '设备管理',
      order: 10,
    },
    children: [
      {
        name: 'Manage',
        path: 'manage',
        component: () => import('@/views/Device/Manage/index.vue'),
        meta: {
          icon: Document,
          order: 10,
          title: '设备管理',
        },
      },
      {
        name: 'Template',
        path: 'template',
        component: () => import('@/views/Device/Template/index.vue'),
        meta: {
          icon: Document,
          order: 9,
          title: '模板管理',
        },
      },
      {
        name: 'Dispatch',
        path: 'dispatch',
        component: () => import('@/views/Device/Dispatch/index.vue'),
        meta: {
          icon: Document,
          order: 8,
          title: '下发管理',
        },
      },
    ],
  },
], 'Device')

export { routes }
export default routes
