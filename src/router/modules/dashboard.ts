import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'Dashboard',
    name: '/dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    children: [],
  },
]
export { routes }
export default routes
