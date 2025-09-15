import type { Component, DefineComponent, VNodeChild } from 'vue'
import { render } from 'vue'
import type { Fn, LazyImportOptions } from './useLazyImport'
import { useLazyImport } from './useLazyImport'

type AsyncLoader = () => Promise<{ default: Component | DefineComponent }>

export function usePopup(className?: string, rootElement?: HTMLElement) {
  const root = rootElement || document.getElementById('app') as HTMLElement
  let cacheClass = 'popup-container'
  if (className) {
    cacheClass = className
  };
  function mount<U>(component: Component | AsyncLoader, options: U = {} as U, slots: Record<string, () => VNodeChild> = {}, lazy: boolean | LazyImportOptions = false) {
    const el = document.createElement('div')
    el.className = cacheClass
    root.appendChild(el)
    let Comp: Component
    if (typeof component === 'function') {
      // 如果是 loader（`() => import()`）运行时加载
      if (lazy && typeof lazy === 'object') {
        Comp = useLazyImport(component as Fn, lazy)
      }
      else {
        Comp = useLazyImport(component as Fn)
      }
    }
    else {
      // 如果是同步组件
      Comp = component
    }
		// 注意这里无法获取到组件的实例, onVnodeMounted钩子拿到了也会无法访问
		// 如果做外层的壳需要实例方法，则应该使用template模板语法
    const vnode = h(Comp, Object.assign({
      onClose: () => {
        unMount()
      },
    }, options), slots)
    render(vnode, el)
  }
  function unMount() {
    let firstClassName = ''
    if (cacheClass.split(' ').length) {
      firstClassName = cacheClass.split(' ')[0]
    }
    const el = root.querySelector(`.${firstClassName}`)
    if (el) { root.removeChild(el) };
  }
  function isMounted() {
    let firstClassName = ''
    if (cacheClass.split(' ').length) {
      firstClassName = cacheClass.split(' ')[0]
    }
    const el = root.querySelector(`.${firstClassName}`)
    return Boolean(el)
  }
  return {
    mount,
    isMounted,
    unMount,
  }
}
