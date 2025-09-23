import { reqCatch } from '@/modules/http'
/**
 * @description 获取登录验证码
 */
export function getLoginCode() {
  return reqCatch<{
    img: string
    uuid: string
    [x: string]: any
  }>({
    method: 'get',
    url: '/captchaImage',
  })
}
/**
 * @description 登录
 */
export function toLogin(data: {
  code: string
  password: string
  username: string
  uuid: string
}) {
  return reqCatch<Record<string, any>>({
    method: 'post',
    url: '/login',
    data,
  })
}
