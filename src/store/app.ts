import type { RouteRecordRaw } from 'vue-router'
import { type RenderMenuInterface, getMenuItem, removeBy } from '@/utils'

export interface MenuTag {
  name: string
  label: string
  alive: boolean
  [x: string]: any
}

export const useAppStore = defineStore('app', () => {
  const isCollapse = ref(false)
  const tags = ref<MenuTag[]>([]) // 路由历史
  const permissions = ref<string[]>([
    'btn:export',
    'btn:delete',
  ])
  const toggleMenu = () => {
    isCollapse.value = !isCollapse.value
  }
  const getRenderMenu = (source: RenderMenuInterface[]) => {
    return source.reduce((prev: RenderMenuInterface[], menu: RenderMenuInterface) => {
      const { children = [], isHidden = false, ...conf } = menu
      const bubbleChildren = children.filter(e => e.bubble)
      if (menu.path === '/') {
        prev.push(...getRenderMenu(children))
      }
      else if (isHidden) {
        return prev
      }
      else if (bubbleChildren.length) {
        if (children.length !== bubbleChildren.length) {
          const keys = bubbleChildren.map(item => item.key)
          const filterChildren = children.filter(e => !keys.includes(e.key))
          prev.push({
            ...conf,
            children: filterChildren,
          })
        }
        prev.push(...getRenderMenu(bubbleChildren))
      }
      else {
        prev.push(menu)
      }
      return prev
    }, [])
  }
  /**
   * @description 获取侧边栏菜单
   */
  const getMenus = (routes?: RouteRecordRaw[]): Record<string, any>[] => {
    if (!routes) {
      return []
    }
    const source = routes.map(item => getMenuItem(item)).sort((a, b) => b.order - a.order)
    return getRenderMenu(source)
  }
  /**
   * @description 设置路由tag
   */
  const setTag = (tag: MenuTag, action: 'add' | 'remove'): MenuTag[] => {
    const filterList = ['Login', 'NotFound']
    if (action === 'add' && tag.name && !filterList.includes(tag.name)) {
      const status = tags.value.some(item => item.name === tag.name)
      if (!status) {
        tags.value.push(tag)
      }
    }
    else {
      removeBy(tags.value, item => item.name === tag.name)
    }
    return tags.value
  }
  /**
   * @description 手动移除tag标签
   */
  const closeTag = (tag: string | string[]) => {
    if (Array.isArray(tag)) {
      tag.forEach((name) => {
        removeBy(tags.value, item => item.name === name)
      })
    }
    else {
      removeBy(tags.value, item => item.name === tag)
    }
  }
  return {
    isCollapse,
    permissions,
    getMenus,
    toggleMenu,
    tags,
    setTag,
    closeTag,
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
