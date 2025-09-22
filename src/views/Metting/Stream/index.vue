<script lang="ts" setup>
import XSchedule from '~components/common/xSchedule/metting.vue'
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
</script>

<template>
  <div class="common-page flex-v">
    <XSchedule
      :rooms="rooms"
      :render-books="renderBooks"
      @update="onUpdateSchedule"
    />
  </div>
</template>
