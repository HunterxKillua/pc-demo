import type { AttributifyAttributes } from '@unocss/preset-attributify'

import type { NativeElements, ReservedProps, VNode } from '@vue/runtime-dom'

declare module '@vue/runtime-dom' {
  interface HTMLAttributes extends AttributifyAttributes {}
}

declare global {
  namespace JSX {
    export interface Element extends VNode {}
    export interface ElementClass {
      $props: Record<string, any>
    }
    export interface ElementAttributesProperty {
      $props: Record<string, any>
    }
    export interface IntrinsicElements extends NativeElements {
      // allow arbitrary elements
      // @ts-expect-error suppress ts:2374 = Duplicate string index signature.
      [name: string]: any
    }
    export interface IntrinsicAttributes extends ReservedProps {}
  }

  // Element Plus 在ts文件中的类型声明
  const ElMessage: typeof import('element-plus')['ElMessage']
  const ElMessageBox: typeof import('element-plus')['ElMessageBox']
  const ElNotification: typeof import('element-plus')['ElNotification']
  const ElLoading: typeof import('element-plus')['ElLoading']
}

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    isHidden?: boolean
    order?: number
    icon?: Component | string
    authKey?: string
    keepAlive?: boolean
    [x: string]: any
  }
}

declare module 'vue-draggable-resizable' {
  import type { DefineComponent } from 'vue'

  const VueDraggableResizable: DefineComponent<{
    x?: number
    y?: number
    w?: number
    h?: number
    grid?: [number, number]
    axis?: 'x' | 'y' | 'both'
    parent?: boolean
    resizable?: boolean
    draggable?: boolean
    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
  }, unknown, any>

  export default VueDraggableResizable
}
