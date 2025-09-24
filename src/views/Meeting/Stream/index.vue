<script lang="ts" setup>
import dayjs from 'dayjs'
import XSchedule from '~components/common/xSchedule/index.vue'
import type { Booking, BookingRoom, Org } from '~components/types/schedule'
import { getAreaTree, getMeetingRoomConfig, getMeetingRoomList, getUsedMeeting } from '@/api'
import type { QueryMeetingParams } from '@/api'
import { calculateTimeCoordinates, convertTimeToInteger } from '@/utils'

const ScheduleRef = ref<typeof XSchedule | null>(null)
const rooms = ref<BookingRoom[]>([])
const renderBooks = ref<Booking[]>([])
const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const orgValue = ref('')
const cellSetting = reactive({
  startHour: 7,
  endHour: 24,
  snapMinutes: 30,
})
const orgOptions = ref<Org[]>([])
async function getRooms() {
  const { data, error } = await getMeetingRoomList(orgValue.value
    ? {
        areaId: Number(orgValue.value),
      }
    : {})
  if (!error) {
    rooms.value = (data?.rows as BookingRoom[])?.map((item) => {
      const { id, ...conf } = item
      return {
        id: id?.toString(),
        ...conf,
      }
    })
  }
}
// 递归转换树数据转成字符串
function deepReduce(arr: Org[]) {
  const list: Org[] = []
  arr.forEach((item) => {
    const { id, children = [], ...conf } = item
    list.push({
      id: id?.toString(),
      value: id?.toString(),
      ...conf,
      children: deepReduce(children),
    })
  })
  return list
}
function convertNumberToTime(hour: number, minute: number = 0): string {
  if (hour < 0 || hour > 23) {
    throw new Error('小时必须在0-23之间')
  }
  if (minute < 0 || minute > 59) {
    throw new Error('分钟必须在0-59之间')
  }
  // 使用dayjs进行格式化
  return dayjs()
    .hour(hour) // 设置小时
    .minute(minute) // 设置分钟
    .second(0) // 清除秒数
    .millisecond(0) // 清除毫秒
    .format('HH:mm') // 格式化为HH:MM
}

async function getArea() {
  const { data, error } = await getAreaTree()
  if (!error) {
    if (!orgValue.value) {
      if (data?.data?.length) {
        const orgId = (data.data[0].id).toString() || ''
        orgOptions.value = deepReduce(data.data as Org[])
        orgValue.value = orgId
        nextTick(() => {
          ScheduleRef.value?.setTimeLineValue('org', orgId)
        })
      }
    }
  }
}
async function getConfig() {
  const { data, error } = await getMeetingRoomConfig()
  if (!error) {
    if (data?.data) {
      const source = data.data
      cellSetting.startHour = convertTimeToInteger(source?.startTime)
      cellSetting.endHour = convertTimeToInteger(source?.endTime)
      cellSetting.snapMinutes = Number(source?.interval)
    }
  }
}
async function getRenderBooks(params: QueryMeetingParams) {
  const { data, error } = await getUsedMeeting(params)
  if (!error) {
    if (data) {
      const source = data?.data
      if (source) {
        const list: Booking[] = []
        for (const roomId in source) {
          const roomInfo = rooms.value.find(item => item.id === roomId)
          const bookInfo = source[roomId]
          const book = {
            roomId,
            roomName: roomInfo?.name || '',
          }
          if (bookInfo) {
            for (const key in bookInfo) {
              const { start, end } = calculateTimeCoordinates(key, convertNumberToTime(cellSetting.startHour))
              const name = bookInfo[key]
              list.push({
                ...book,
                start,
                end,
                name,
              })
            }
          }
        }
        renderBooks.value = [...list]
      }
    }
    else {
      renderBooks.value = []
    }
  }
}
function onUpdateSchedule(conf: Booking) {
  console.log(conf, selectedDate.value, orgValue.value)
}
async function init() {
  getConfig()
  await getArea()
  getRooms()
}
watch(() => [selectedDate.value, orgValue.value], async () => {
  if (!orgValue.value) {
    return
  }
  await getRooms()
  getRenderBooks({
    areaId: Number(orgValue.value),
    time: dayjs(selectedDate.value).format('YYYY-MM-DD HH:mm:ss'),
  })
})

onMounted(() => {
  init()
})
</script>

<template>
  <XSchedule
    ref="ScheduleRef"
    v-model="selectedDate"
    v-model:org-value="orgValue"
    :rooms="rooms"
    :org-list="orgOptions"
    :render-books="renderBooks"
    v-bind="cellSetting"
    @confirm="onUpdateSchedule"
  />
</template>
