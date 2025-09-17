import type { RouteRecordRaw } from 'vue-router'
import { type RenderMenuInterface, getMenuItem } from '@/utils'

export const useAppStore = defineStore('app', () => {
  const isCollapse = ref(false)
  const permissions: Ref<RouteRecordRaw[]> = ref([])
  const toggleMenu = () => {
    isCollapse.value = !isCollapse.value
  }
  const getRenderMenu = (source: RenderMenuInterface[]) => {
    return source.reduce((prev: RenderMenuInterface[], menu: RenderMenuInterface) => {
      if (menu?.isHidden) {
        return prev
      }
      else if (menu.path === '/') {
        const { children = [] } = menu
        prev.push(...getRenderMenu(children))
      }
      else {
        prev.push(menu)
      }
      return prev
    }, [])
  }
  const getMenus = (routes?: RouteRecordRaw[]): Record<string, any>[] => {
    if (!routes) {
      return []
    }
    const source = routes.filter(item => !item.meta?.isHidden).map(item => getMenuItem(item)).sort((a, b) => b.order - a.order)
    return getRenderMenu(source)
  }
  return {
    isCollapse,
    permissions,
    getMenus,
    toggleMenu,
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
