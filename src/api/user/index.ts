import { reqCatch } from '@/modules/http'
/**
 * @description 查询用户
 */
export function getMeetingUser(data: Record<string, any> = {}) {
  return reqCatch<{
    total: number
    rows: Record<string, any>[]
  }>({
    url: '/system/user/getMeetingUser',
    method: 'post',
    data: Object.assign({}, { pageSize: 10, pageNum: 1 }, data),
  })
}
