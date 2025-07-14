import type { CreateTokenReqParams } from './types/reqParam'
import type { UserInfoResp } from './types/resReturn'
import { reqCatch } from '@/modules/http'
/**
 * 获取飓风token
 */
export function createHurricaneToken(data: CreateTokenReqParams) {
  return reqCatch<UserInfoResp>(
    {
      method: 'POST',
      data,
      url: '/auth/auth/createHurricaneToken',
      headers: {},
    },
    {
      bubbleError: true,
    },
  )
}
/**
 * 获取系统的用户信息
 */
export function getSystemUserInfo(params: { loginId: string, systemCode: string }) {
  return reqCatch<Record<string, any>>(
    {
      url: '/vue/modules/getAllInfo',
      method: 'GET',
      params,
    },
    {
      bubbleError: true,
    },
  )
}
