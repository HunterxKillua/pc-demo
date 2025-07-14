import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'store',
    name: 'Store',
    component: () => import('@/views/dashboard/index.vue'),
    children: [],
  },
]
export { routes }
export default routes
