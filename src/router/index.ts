import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routeList = Object.values(
  import.meta.glob<{ default: RouteRecordRaw[] }>('./modules/*.ts', { eager: true }),
).map(i => i.default)

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'App',
      redirect: '/dashboard',
      children: routeList.flat(),
    },
    {
      path: '/404',
      name: 'NotFound',
      component: import('@/views/error/404.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: import('@/views/error/404.vue'),
    },
  ],
})

export { router }
export default router
