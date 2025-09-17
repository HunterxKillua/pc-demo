import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: {
      isHidden: true,
      title: '登录',
    },
  },
]
export { routes }
export default routes
