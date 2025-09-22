<script lang="ts" setup>
import XSchedule from '~components/common/xSchedule/metting.vue'
import TimeLine from '~components/common/xSchedule/timeLine.vue'
import type { Booking, BookingRoom } from '~components/types/schedule'

const rooms = ref<BookingRoom[]>([
  {
    id: 1,
    name: '会议室1',
  },
  {
    id: 2,
    name: '会议室2',
  },
])
const renderBooks = ref<Booking[]>([
  {
    roomId: 1,
    start: 90,
    end: 240,
    name: 'goku',
  },
  {
    roomId: 2,
    start: 240,
    end: 360,
    name: '卡卡罗特',
  },
])

function onUpdateSchedule(conf: Booking) {
  console.log(conf)
}
function onOrgChange(val: string) {
  console.log(val)
}
const selectedDate = ref('2025-09-22')
const orgOptions = [
  { label: '总部', value: 'hq' },
  { label: '分部1', value: 'b1' },
  { label: '分部2', value: 'b2' },
]
</script>

<template>
  <div class="common-page flex-v">
    <TimeLine
      v-model="selectedDate"
      :org-list="orgOptions"
      class="w-[100%] mb-[8px]"
      @update:org="onOrgChange"
    />
    <XSchedule
      :rooms="rooms"
      :render-books="renderBooks"
      class="flex-1 w-[100%]"
      @update="onUpdateSchedule"
    />
  </div>
</template>
