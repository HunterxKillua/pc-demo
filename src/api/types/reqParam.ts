export interface LoginReqParams {
  code: string // 验证码
  password: string // 加密后的密码
  username: string // 账号
  uuid: string // 验证码uuid
}

export interface MeetingRoomParams {
  areaId?: number // 会议室区域ID
  enable?: boolean // 会议室状态
  name?: string // 会议室名称
}

export interface AreaTreeParams {
  code?: string
  id?: number
  name?: string
}

export interface QueryMeetingParams {
  areaId: number // 区域
  capacity?: number // 容量
  roomId?: string // 会议室id
  tagIds?: number[] // 标签列表
  time: string // 查询日期
}
