import type { XTableColumn, XTablePager } from '~components/types/table'

/**
 *
 * @param params 请求参数 参考xSearch
 * @param fn 返回处理完的tableData方法
 */
export function useTable(params: Record<string, any>, fn: (...args: any[]) => Promise<Record<string, any>[]>) {
  const tableData = ref<Record<string, any>>([])
  const total = ref<number>(0)
  const columns = ref<XTableColumn[]>([])
  const pager = ref<XTablePager>({
    pageNum: 1,
    pageSize: 10,
  })
  const loading = ref<boolean>(false)
  const showPagination = ref<boolean>(false)
  watchEffect(() => {
    tableData.value = fn({
      ...params,
      pageSize: pager.value.pageSize,
      pageNum: pager.value.pageNum,
    })
  })
  console.log(params, fn)
  return {
    columns,
    tableData,
    pager,
    total,
    loading,
    showPagination,
  }
}
