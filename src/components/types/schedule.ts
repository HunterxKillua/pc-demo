export interface Booking {
  roomId: number | string
  start: number
  end: number
  name: string
  [x: string]: any
}

export interface BookingRoom {
  id: number | string
  name: string
  [x: string]: any
}

export type ValidateFn = (
  start: number,
  end: number,
  side?: 'left' | 'right',
  id?: number | string
) => { start: number, end: number }

export interface FloatResizerProps {
  startTime: number // 起始时间
  start: number // 起始位置
  end: number // 结束为止
  total: number // 坐标总长度
  minutesPerPixel?: number // 每分钟对应多少px
  snap?: number // 可伸缩的最小区域 对应分钟
  min?: number // 最小像素点 可移动
  max?: number // 最大像素点
  disabled?: boolean // 禁用伸缩
  floating?: boolean // 是否正在伸缩中
  label?: string // 操作人信息
  validate?: ValidateFn // 校验方法
  id?: number | string // 当前操作的会议室id
  cellUnit?: number // 每个单元格代表的范围
  cellWidth?: number // 单元格的像素长度 单位px
  roomName: string // 会议室名称
  popoverTrigger?: 'click' | 'hover' // 预约信息的弹出层触发方式
}

export interface MettingProps {
  startHour?: number // 坐标轴起始时间点
  endHour?: number // 坐标轴结束时间点
  snapMinutes?: number // 最小伸缩的分钟数
  cellDuration?: number // 单元格代表的分钟数
  cellWidth?: number // 单元格的像素长度 单位px
  renderBooks: Booking[] // 已选择的会议室以及其标记区间段
  rooms: BookingRoom[] // 会议室列表
  popoverTrigger?: 'click' | 'hover'
}

export interface Org {
  label: string
  value: string
  [x: string]: any
}

export interface TimeLineProps {
  modelValue: string
  orgList: Org[]
  orgValue?: string
}

export interface FloatEventPrams {
  roomName: string
  timeStart: string
  timeEnd: string
}
