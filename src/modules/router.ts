import type { Router } from 'vue-router'
import NProgress from 'nprogress'
import type { UserModule } from '~types/index'

const RouterConfig: {
  router?: Router
} = {}

/** 集成路由守卫 */
export const install: UserModule = ({ app, router }) => {
  RouterConfig.router = router
  router.beforeEach((to) => {
    NProgress.start()
    if (localStorage.getItem('token')) {
      return true
    }
    else {
      if (to.name !== 'Login') {
        return {
          path: '/login',
        }
      }
      return true
    }
  })
  router.afterEach((to) => {
    document.title = to.meta.title
    NProgress.done()
  })
  return app.use(router)
}

export const getRouter = () => RouterConfig.router
