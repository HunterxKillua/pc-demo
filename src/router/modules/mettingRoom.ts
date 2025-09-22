import type { RouteRecordRaw } from 'vue-router'
import { Document, Menu } from '@element-plus/icons-vue'

const basicName = 'MettingRoom'

const routes: RouteRecordRaw[] = [
  {
    path: 'mettingRoom',
    name: '',
    redirect: '/mettingRoom/info',
    component: () => import('~components/layout/index.vue'),
    meta: {
      icon: Menu,
      title: '会议室管理',
      order: 13,
    },
    children: [
      {
        name: 'Info',
        path: 'info',
        component: () => import('@/views/MettingRoom/Info/index.vue'),
        meta: {
          icon: Document,
          order: 13,
          title: '会议室信息',
        },
      },
      {
        name: 'Rule',
        path: 'rule',
        component: () => import('@/views/MettingRoom/Rule/index.vue'),
        meta: {
          icon: Document,
          order: 12,
          title: '计费规则',
        },
      },
      {
        name: 'Setting',
        path: 'setting',
        component: () => import('@/views/MettingRoom/Setting/index.vue'),
        meta: {
          icon: Document,
          order: 11,
          title: '预定配置',
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
