import { JSEncrypt } from 'jsencrypt'

export function encrypt(txt: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(import.meta.env.VITE_SECRET_PRIVATE_KEY)
  return encryptor.encrypt(txt)
}

export function decrypt(txt: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(import.meta.env.VITE_SECRET_PRIVATE_KEY)
  return encryptor.decrypt(txt)
}

/**
 * 解析时间范围字符串并计算坐标
 * @param timeRange 时间范围字符串，格式如"202509240908-202509240915"
 * @param startScale 起始刻度，默认为"00:00"
 * @returns 包含start和end坐标的对象
 * @throws 如果时间格式不正确则抛出错误
 */
export function calculateTimeCoordinates(
  timeRange: string,
  startScale: string = '00:00',
): { start: number, end: number } {
  // 验证时间范围格式
  const rangeRegex = /^\d{12}-\d{12}$/
  if (!rangeRegex.test(timeRange)) {
    throw new Error('时间范围格式不正确，请使用"YYYYMMDDHHmm-YYYYMMDDHHmm"格式')
  }

  // 拆分起始和结束时间
  const [startTimeStr, endTimeStr] = timeRange.split('-')

  // 提取时间部分（HHmm）
  const startTimeHM = startTimeStr.slice(8, 12) // 提取HHmm部分
  const endTimeHM = endTimeStr.slice(8, 12)

  // 转换为HH:MM格式
  const formatTime = (hm: string): string => {
    return `${hm.slice(0, 2)}:${hm.slice(2, 4)}`
  }

  const startTimeFormatted = formatTime(startTimeHM)
  const endTimeFormatted = formatTime(endTimeHM)

  // 验证时间格式
  const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/
  if (!timeRegex.test(startTimeFormatted) || !timeRegex.test(endTimeFormatted) || !timeRegex.test(startScale)) {
    throw new Error('时间格式不正确，请使用HH:MM格式')
  }

  // 计算与起始刻度的分钟差（1分钟=1刻度，1小时=60刻度）
  const getScaleFromStart = (time: string, start: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    const [startHours, startMinutes] = start.split(':').map(Number)

    // 计算总分钟差，直接作为刻度（1分钟=1刻度）
    const totalMinutes = (hours * 60 + minutes) - (startHours * 60 + startMinutes)
    return Math.max(0, totalMinutes) // 确保不会返回负数
  }

  // 计算起始和结束刻度
  const start = getScaleFromStart(startTimeFormatted, startScale)
  const end = getScaleFromStart(endTimeFormatted, startScale)

  return { start, end }
}

// 转换时间格式
export function convertTimeToInteger(time: string): number {
  const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/
  if (!timeRegex.test(time)) {
    throw new Error('时间格式不正确，请使用HH:MM格式')
  }

  // 拆分小时和分钟
  const [hourStr, minuteStr] = time.split(':')
  const hour = Number.parseInt(hourStr, 10)
  const minute = Number.parseInt(minuteStr, 10)

  // 如果是23点且分钟大于0，则返回24
  if (hour === 23 && minute > 0) {
    return 24
  }

  // 其他情况直接返回小时数
  return hour
}
