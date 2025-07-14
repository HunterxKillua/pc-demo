import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'user',
    name: 'User',
    component: () => import('@/views/dashboard/index.vue'),
    children: [],
  },
]
export { routes }
export default routes
