import { ElConfigProvider } from 'element-plus'
import { zhCn } from 'element-plus/es/locale/index'
import { type SetupContext, defineComponent } from 'vue'

export default defineComponent((_: any, { slots }: SetupContext) => {
  return () => (
    <ElConfigProvider locale={zhCn}>
      {
        slots?.default?.()
      }
    </ElConfigProvider>
  )
})
