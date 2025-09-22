<script lang="ts" setup>
import XSchedule from '~components/common/xSchedule/index.vue'
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
const selectedDate = ref('2025-09-22')
const orgValue = ref('')
const cellSetting = reactive({
  startHour: 7,
  endHour: 24,
})
const orgOptions = ref([
  { label: '总部', value: 'hq' },
  { label: '分部1', value: 'b1' },
  { label: '分部2', value: 'b2' },
])
function onUpdateSchedule(conf: Booking) {
  console.log(conf, selectedDate.value, orgValue.value)
}
</script>

<template>
  <XSchedule
    v-model="selectedDate"
    v-model:org-value="orgValue"
    :rooms="rooms"
    :org-list="orgOptions"
    :render-books="renderBooks"
    v-bind="cellSetting"
    @confirm="onUpdateSchedule"
  />
</template>
