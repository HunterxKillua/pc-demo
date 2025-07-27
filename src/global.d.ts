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
