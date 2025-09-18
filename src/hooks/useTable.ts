import type { XTableColumn, XTableExpose, XTablePager } from '~components/types/table'

/**
 *
 * @param params 请求参数 参考xSearch
 * @param fn 返回处理完的tableData方法
 */
export function useTable(columnData: XTableColumn[], params: Record<string, any>, fn: (args: Record<string, any>) => Promise<{ data: Record<string, any>[], total?: number }>) {
  const tableData: Ref<Record<string, any>[]> = ref([])
  const total = ref<number>(0)
  const columns = ref(columnData)
  const pager = ref<XTablePager>({
    pageNum: 1,
    pageSize: 10,
  })
  const tableInstance = ref<XTableExpose | null>(null)
  const loading = ref<boolean>(false)
  const showPagination = ref<boolean>(true)
  watchEffect(async () => {
    loading.value = true
    const res = await fn({
      ...params,
      pageSize: pager.value.pageSize,
      pageNum: pager.value.pageNum,
    })
    tableData.value = [...res.data]
    total.value = Number(res.total)
    loading.value = false
    nextTick(() => {
      tableInstance.value?.resetSelection()
    })
  })
  return {
    columns,
    tableData,
    pager,
    total,
    loading,
    showPagination,
    tableInstance,
  }
}
