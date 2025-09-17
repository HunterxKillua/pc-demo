import type { VNode } from 'vue'

export type SearchCompType = 'input' | 'select' | 'date' | 'checkbox' | 'radio' | 'datetimerange' | 'daterange' | 'cascader' | 'treeselect'

export interface SearchListInterface {
  type: SearchCompType
  key?: string
  label: string
  defaultValue?: boolean | string | number | unknown[]
  options?: Record<string, any>
  attrs?: Record<string, any>
  hidden?: boolean
  events?: Record<string, any>
  disableTrim?: boolean
  required?: boolean
  marginRight?: number
  labelWidth?: number
  slotName?: string
  render?: (modelValue: any, update: (val: any) => void) => JSX.Element | VNode
  linkProps?: {
    linkKey: string
    linkType: 'reset'
  }
}

export interface XSearchInterface {
  list: SearchListInterface[]
  col?: number
  labelWidth?: number
  showColon?: boolean
  hasSearch?: boolean
  hasReset?: boolean
  hasLabel?: boolean
  hasExpansion?: boolean
  defaultExpansion?: boolean
  disableTrim?: boolean
}
