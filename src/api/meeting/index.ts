import type { AreaTreeParams, MeetingRoomParams, QueryMeetingParams } from '../types/reqParam'
import { reqCatch } from '@/modules/http'
/**
 * @description 获取会议室列表
 */
export function getMeetingRoomList(params?: MeetingRoomParams) {
  return reqCatch<{
    total: number
    rows: Record<string, any>[]
    [x: string]: any
  }>({
    url: '/meeting/room/list',
    method: 'get',
    params,
  })
}
/**
 * @description 区域树查询
 */
export function getAreaTree(params?: AreaTreeParams) {
  return reqCatch<{ data: Record<string, any>[] }>({
    url: '/system/area/tree',
    method: 'get',
    params,
  })
}
/**
 * @description 预约会议室的配置
 */
export function getMeetingRoomConfig() {
  return reqCatch<{
    data: {
      endTime: string
      interval: number | string
      period: number | string
      startTime: string
    }
  }>({
    url: '/meeting/config',
    method: 'get',
  })
}
/**
 * @description 根据日期以及区域查询会议室使用情况
 */
export function getUsedMeeting(data: QueryMeetingParams) {
  return reqCatch<Record<string, any>>({
    url: '/meeting/query/AllRoom',
    method: 'post',
    data,
  })
}
/**
 * @description 查询人员
 */
export function getUserByUserName(params: { userName: string }) {
  return reqCatch<{
    total: number
    rows: []
  }>({
    url: '/system/user/getMeetingUser',
    method: 'get',
    params,
  })
}
/**
 * @description 预定会议
 */
export function createMeetingBook(data: Record<string, any>) {
  return reqCatch({
    url: '/meeting/reserve',
    method: 'post',
    data,
  })
}
