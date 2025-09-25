import type { RouteRecordRaw } from 'vue-router'
import { Document, Menu } from '@element-plus/icons-vue'
import Layout from '~components/layout/index.vue'
import { addNamePrefix } from '@/utils'

const routes: RouteRecordRaw[] = addNamePrefix([
  {
    path: 'meetingRoom',
    name: '',
    redirect: '/meetingRoom/info',
    component: Layout,
    meta: {
      icon: Menu,
      title: '会议室管理',
      order: 13,
    },
    children: [
      {
        name: 'Info',
        path: 'info',
        component: () => import('@/views/MeetingRoom/Info/index.vue'),
        meta: {
          icon: Document,
          order: 13,
          title: '会议室信息',
        },
      },
      {
        name: 'Rule',
        path: 'rule',
        component: () => import('@/views/MeetingRoom/Rule/index.vue'),
        meta: {
          icon: Document,
          order: 12,
          title: '计费规则',
        },
      },
      {
        name: 'Setting',
        path: 'setting',
        component: () => import('@/views/MeetingRoom/Setting/index.vue'),
        meta: {
          icon: Document,
          order: 11,
          title: '预定配置',
        },
      },
    ],
  },
], 'MeetingRoom')

export { routes }
export default routes
