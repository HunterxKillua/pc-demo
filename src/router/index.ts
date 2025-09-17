import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { injectRouteComponentName } from '@/utils'

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
      children: injectRouteComponentName(routeList.flat()),
    },
    {
      path: '/404',
      name: 'NotFound',
      component: import('@/views/Error/404.vue'),
      meta: {
        isHidden: true,
        title: 'oops!',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: import('@/views/Error/404.vue'),
      meta: {
        isHidden: true,
        title: 'oops!',
      },
    },
  ],
})

export { router }
export default router
