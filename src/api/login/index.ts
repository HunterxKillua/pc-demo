import type { LoginReqParams } from '../types/reqParam'
import type { VerifyCodeReturn } from '../types/resReturn'
import { reqCatch } from '@/modules/http'
/**
 * @description 获取登录验证码
 */
export function getLoginCode() {
  return reqCatch<VerifyCodeReturn>({
    method: 'get',
    url: '/captchaImage',
  })
}
/**
 * @description 登录
 */
export function toLogin(data: LoginReqParams) {
  return reqCatch<{
    token: string
    [x: string]: any
  }>({
    method: 'post',
    url: '/login',
    data,
  })
}
