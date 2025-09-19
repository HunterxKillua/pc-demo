import type { App, Directive } from 'vue'

export function setupDirectives(app: App) {
  const modules = import.meta.glob('./**/*.ts', { eager: true }) as Record<
    string,
    { default: Directive }
  >

  Object.keys(modules).forEach((key) => {
    if (key.endsWith('index.ts'))
      return // 排除 index.ts

    // 提取文件名作为指令名（只取最后的文件名部分）
    const name = key.split('/').pop()!.replace(/\.ts$/, '')
    const directive = modules[key].default
    if (directive) {
      app.directive(name, directive)
    }
  })
}
