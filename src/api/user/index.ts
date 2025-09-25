import { reqCatch } from '@/modules/http'

export function getSystemUser(params: Record<string, any> = {}) {
  return reqCatch({
    url: '/system/user/list',
    method: 'get',
    params: Object.assign({}, { pageSize: 10, pageNum: 1 }, params),
  })
}
