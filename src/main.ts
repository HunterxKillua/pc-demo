import { createApp } from 'vue'
import type { UserModule } from './types'
import router from './router'
import App from './App.vue'
import 'virtual:uno.css'
import './var.css'

const app = createApp(App)
app.config.performance = false // 关闭性能分析 如使用vue devtool的开发环境可自行开启

Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true })).forEach(
  i =>
    i.install?.({
      app,
      router,
    }),
)

app.mount('#app')
