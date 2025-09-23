import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import 'virtual:uno.css'
import './var.css'
import './app.css'
import type { UserModule } from './types'
import { setupDirectives } from '@/directives'

const app = createApp(App)
app.config.performance = false // 关闭性能分析 如使用vue devtool的开发环境可自行开启

Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true })).forEach(
  i =>
    i.install?.({
      app,
      router,
    }),
)
setupDirectives(app)

app.mount('#app')
