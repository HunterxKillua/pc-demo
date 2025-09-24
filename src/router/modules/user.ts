import type { RouteRecordRaw } from 'vue-router'
import { Document, Menu, Setting } from '@element-plus/icons-vue'
import Layout from '~components/layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: 'user',
    name: 'User',
    redirect: '/user/list',
    component: Layout,
    meta: {
      icon: Menu,
      title: '用户管理',
    },
    children: [
      {
        name: 'UserList',
        path: 'list',
        component: () => import('@/views/User/UserList/index.vue'),
        meta: {
          icon: Setting,
          order: 1,
          title: '用户列表',
          keepAlive: true,
        },
      },
      {
        name: 'UserInfo',
        path: 'info',
        component: () => import('@/views/User/UserInfo/index.vue'),
        meta: {
          icon: Document,
          order: 2,
          title: '用户信息',
        },
      },
    ],
  },
]
export { routes }
export default routes
