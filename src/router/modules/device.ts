import type { RouteRecordRaw } from 'vue-router'
import { Document, Menu } from '@element-plus/icons-vue'

const basicName = 'Device'

const routes: RouteRecordRaw[] = [
  {
    path: 'device',
    name: '',
    redirect: '/device/management',
    component: () => import('~components/layout/index.vue'),
    meta: {
      icon: Menu,
      title: '设备管理',
      order: 10,
    },
    children: [
      {
        name: 'Management',
        path: 'management',
        component: () => import('@/views/Device/Management/index.vue'),
        meta: {
          icon: Document,
          order: 10,
          title: '设备管理',
        },
      },
      {
        name: 'Template',
        path: 'tempalte',
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
].map((item) => {
  const { name, ...conf } = item
  return {
    ...conf,
    name: `${basicName}${name}`,
  }
})

export { routes }
export default routes
