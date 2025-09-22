import { ElIcon } from 'element-plus'
import type { Component, VNode } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export type MenuIconType = Component | string
export interface RenderMenuInterface {
  title?: string
  key?: string | symbol
  path: string
  icon?: () => VNode
  order: number
  isHidden?: boolean
  bubble?: boolean
  children?: RenderMenuInterface[]
}

/**
 * 渲染菜单 icon
 * @param icon - 可能是 Vue 组件，也可能是字符串
 */
export function getIcon(icon?: MenuIconType) {
  if (!icon) {
    return () => h('span', '')
  }
  if (typeof icon === 'string') {
    return () => h('i', { class: icon })
  }
  else {
    // 组件类型，外层包一层 ElIcon iconify ｜ @element-plus/icons-vue
    return () => h(ElIcon, null, { default: () => h(icon) })
  }
}

export function isHttpLink(url: string): boolean {
  return /^https?:\/\/[^\s/$.?#].\S*$/i.test(url)
}

export function resolvePath(basePath: string, path: string) {
  if (isHttpLink(path)) {
    return path
  }
  const fullPath = [basePath, path]
    .filter(p => !!p && p !== '/')
    .map(p => p.replace(/(^\/)|(\/$)/g, ''))
    .join('/')

  return `/${fullPath}`
}
export function getMenuItem(route: RouteRecordRaw, basePath: string = ''): RenderMenuInterface {
  const { meta } = route
  const menuItem: RenderMenuInterface = {
    title: meta?.title,
    key: route.name,
    path: resolvePath(basePath, route.path),
    icon: getIcon(meta?.icon),
    isHidden: route.meta?.isHidden || false,
    bubble: meta?.bubble || false,
    order: meta?.order || 0,
    children: [],
  }
  const { children = [] } = route
  const visibleChildren = children.filter(ele => !ele?.meta?.isHidden)
  if (!visibleChildren.length) {
    if (children.length === 1) {
      return {
        ...menuItem,
        isHidden: true,
        title: children[0]?.meta?.title || '',
      }
    }
    return menuItem
  }
  if (visibleChildren.length === 1) {
    const singleRoute = visibleChildren[0]
    Object.assign(menuItem, {
      title: singleRoute?.meta?.title,
      key: singleRoute.name,
      path: resolvePath(menuItem.path, singleRoute.path),
      icon: getIcon(singleRoute?.meta?.icon),
      order: singleRoute?.meta?.order || 0,
      children: [],
    })
    const visibleItems = singleRoute.children ? singleRoute.children.filter(item => item.name && !item.meta?.isHidden) : []
    if (visibleItems.length === 1) {
      Object.assign(menuItem, getMenuItem(visibleChildren[0]), menuItem.path)
    }
    else if (visibleChildren.length > 1) {
      menuItem.children = visibleItems.map(item => getMenuItem(item, menuItem.path)).sort((a, b) => b.order - a.order)
    }
  }
  else {
    menuItem.children = visibleChildren.map(item => getMenuItem(item, menuItem.path)).sort((a, b) => b.order - a.order)
  }
  return menuItem
}

/**
 * 根据条件查找并删除数组中的第一个匹配元素
 * @param arr 需要被移除元素的数组
 * @param predicate - 判断函数，返回 true 表示匹配
 */
export function removeBy<T>(
  arr: T[],
  predicate: (item: T, index: number, array: T[]) => boolean,
): boolean {
  const index = arr.findIndex(predicate)
  if (index !== -1) {
    arr.splice(index, 1)
    return true
  }
  return false
}

/**
 * 注入懒加载路由组件的组件名
 */
export function injectRouteComponentName(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.map((route) => {
    // 如果有 component 并且是一个函数（动态 import）
    if (route.component && typeof route.component === 'function') {
      const comp = route.component as () => Promise<{ default: any }>
      const compName = route.name as string
      // 动态 import 是一个函数，给它挂 name
      const wrapped = () =>
        comp().then((mod) => {
          const raw = mod.default
          if (raw && !raw.name && compName) {
            raw.name = compName
          }
          return mod
        })
      route.component = wrapped
    }

    // 递归处理 children
    if (route.children && route.children.length > 0) {
      route.children = injectRouteComponentName(route.children)
    }
    return route
  })
}
