import { createPinia } from 'pinia'
import type { UserModule } from '~types/index'

export const install: UserModule = ({ app }) => {
  const pinia = createPinia()
  return app.use(pinia)
}
