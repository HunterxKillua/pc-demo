import type { Router } from 'vue-router'
import NProgress from 'nprogress'
import type { UserModule } from '~types/index'

const RouterConfig: {
  router?: Router
} = {}

/** 集成路由守卫 */
export const install: UserModule = ({ app, router }) => {
  RouterConfig.router = router
  router.beforeEach(() => {
    NProgress.start()
  })
  router.afterEach(() => {
    NProgress.done()
  })
  return app.use(router)
}

export const getRouter = () => RouterConfig.router
