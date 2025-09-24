import type { RouteRecordRaw } from 'vue-router'
import { House } from '@element-plus/icons-vue'
import Layout from '~components/layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    name: 'Dashboard',
    path: 'dashboard',
    redirect: '/dashboard/home',
    component: Layout,
    children: [
      {
        name: 'Home',
        path: 'home',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: {
          title: '首页',
          authKey: 'menu:hone',
          icon: House,
          order: 99,
        },
      },
    ],
  },
]
export { routes }
export default routes
