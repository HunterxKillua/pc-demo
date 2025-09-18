import type { XTableColumn, XTableExpose, XTablePager } from '~components/types/table'

/**
 * @param linkSearch 如果关联XSearch使用 则不触发WatchEffect的effect函数
 * @param externalParams 单独使用时的额外参数
 * @param fn 返回处理完的tableData方法
 */
export function useTable(
  columnData: XTableColumn[],
  fn: (args: Record<string, any>) => Promise<{ data: Record<string, any>[], total?: number }>,
  linkSearch: boolean = false,
  externalParams?: Record<string, any>,
) {
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
  const toQuery = async (params: Record<string, any>) => {
    loading.value = true
    const res = await fn({
      ...params,
      ...externalParams,
    })
    tableData.value = [...res.data]
    total.value = Number(res.total)
    loading.value = false
    nextTick(() => {
      tableInstance.value?.resetSelection()
    })
  }
  watchEffect(async () => {
    if (!linkSearch) {
      toQuery({
        ...externalParams,
        ...unref(pager.value),
      })
    }
  })
  return {
    columns,
    tableData,
    pager,
    total,
    loading,
    showPagination,
    tableInstance,
    toQuery,
  }
}
