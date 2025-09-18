import type { VNode } from 'vue'

export interface XTableColumn {
  prop?: string
  label: string
  type?: string
  rowKey?: string
  selectionType?: 'single' | 'multiple'
  formatter?: (row: Record<string, any>, value: unknown) => string
  attrs?: Record<string, any>
  renderHeader?: (scope: Record<string, any>) => VNode
  render?: (scope: Record<string, any>) => VNode
}

export interface XTablePager {
  pageSize: number
  pageNum: number
}

export interface XTableInterface {
  columns: XTableColumn[]
  tableData: Record<string, any>[]
  loading?: boolean
  showPagination?: boolean
  pager?: XTablePager
  total?: number
  excludeKey?: string
  align?: 'left' | 'center' | 'right'
  showTooltip?: boolean
  defaultSelectedRows?: Record<string, any>[]
  rowsKey?: string
  tableHeight?: number | string
}
