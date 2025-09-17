import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    name: 'Dashboard',
    path: 'dashboard',
    redirect: '/dashboard/workBench',
    component: () => import('~components/layout/index.vue'),
    children: [
      {
        name: 'WorkBench',
        path: 'workBench',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: {
          title: '工作台',
          authKey: 'menu:workBench',
          isHidden: true,
        },
      },
    ],
  },
]
export { routes }
export default routes
