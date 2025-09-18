import type { Ref } from 'vue'
import type { XSearchInstance, XSearchInterface } from '~components/types/search'
import type { XTablePager } from '~components/types/table'

/**
 * @description useSearch需要依赖于UseTable才能运行
 */
export function useSearch(list: XSearchInterface['list'], pager: Ref<XTablePager>, fn: (args: Record<string, any>) => Promise<void>) {
  const SearchInstance = ref<XSearchInstance | null>(null)
  const searchList = ref(list)
  const onSearch = (conf: Record<string, any>) => {
    pager.value.pageNum = 1
    fn({
      ...conf,
      ...pager.value,
    })
  }
  const exposeFormData = () => {
    return SearchInstance.value?.exposeData()
  }
  // const onChange = () => {}
  return {
    searchList,
    SearchInstance,
    onSearch,
    exposeFormData,
  }
}
