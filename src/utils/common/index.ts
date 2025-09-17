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
export function getMenuItem(route: RouteRecordRaw, basePath: string = '') {
  const { meta } = route
  const menuItem: RenderMenuInterface = {
    title: meta?.title,
    key: route.name,
    path: resolvePath(basePath, route.path),
    icon: getIcon(meta?.icon),
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
