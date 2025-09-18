import { useTable } from './useTable'
import { useSearch } from './useSearch'
import type { XTableColumn } from '@/components/types/table'
import type { XSearchInterface } from '@/components/types/search'

/**
 * 合并 useTable + useSearch
 */
export function useSearchTable(
  list: XSearchInterface['list'],
  columnData: XTableColumn[],
  fn: (args: Record<string, any>) => Promise<{ data: Record<string, any>[], total?: number }>,
  externalParams?: Record<string, any>,
) {
  const { pager, toQuery, ...rest } = useTable(columnData, fn, true)
  const { exposeFormData, ...ret } = useSearch(list, pager, toQuery)
  const toRequest = () => {
    toQuery({
      ...pager.value,
      ...exposeFormData(),
      ...externalParams,
    })
  }
  watch(() => pager.value, () => {
    toRequest()
  })
  onMounted(() => {
    nextTick(() => {
      toRequest()
    })
  })
  onActivated(() => {
    toRequest()
  })
  return {
    pager,
    ...rest,
    ...ret,
    toRequest,
  }
}
