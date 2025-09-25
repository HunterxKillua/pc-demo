<script setup lang="ts">
import type { Booking, BookingRoom, FloatEventPrams, MeetingProps } from '../../types/schedule'
import FloatingResizer from './floatResizer.vue'

const props = withDefaults(defineProps<MeetingProps>(), {
  startHour: 7,
  endHour: 24,
  snapMinutes: 30,
  cellDuration: 60,
  cellWidth: 100,
  popoverTrigger: 'hover',
  renderBooks: () => [],
  rooms: () => [],
})

const emits = defineEmits<{
  update: [value: Booking & FloatEventPrams]
}>()

const hoursCount = computed(() => {
  return props.endHour - props.startHour
})

const totalMinutes = computed(() => {
  return hoursCount.value * props.cellDuration
})
const bookings = ref<Booking | null>(null)
const timelineRef = ref<HTMLElement | null>(null)
const minutesPerPixel = ref(1) // px -> minutes

// 计算 minutesPerPixel（在容器 resize 时更新）
function computeMPP() {
  if (!timelineRef.value)
    return
  const w = Math.max(1, timelineRef.value.clientWidth)
  minutesPerPixel.value = totalMinutes.value / w
}
let ro: ResizeObserver | null = null
onMounted(() => {
  nextTick(() => {
    computeMPP()
    if (timelineRef.value && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => computeMPP())
      ro.observe(timelineRef.value)
    }
    window.addEventListener('resize', computeMPP)
  })
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', computeMPP)
  if (ro && timelineRef.value)
    ro.unobserve(timelineRef.value)
})

function validateRangeForRoom(roomId: number | string) {
  return (candStart: number, candEnd: number, side?: 'left' | 'right') => {
    let start = Math.max(0, Math.min(totalMinutes.value, candStart))
    let end = Math.max(0, Math.min(totalMinutes.value, candEnd))
    if (end - start < props.snapMinutes) {
      if (side === 'left')
        start = Math.max(0, end - props.snapMinutes)
      else end = Math.min(totalMinutes.value, start + props.snapMinutes)
    }
    const others = props.renderBooks
      .filter(b => b.roomId === roomId)
      .sort((a, b) => a.start - b.start)
    let minStart = 0
    for (const b of others) {
      if (b.end <= start)
        minStart = Math.max(minStart, b.end)
    }
    let maxEnd = totalMinutes.value
    for (const b of others) {
      if (b.start >= end) {
        maxEnd = Math.min(maxEnd, b.start)
        break
      }
      if (!(end <= b.start || start >= b.end)) {
        const idx = others.indexOf(b)
        const prevEnd = idx > 0 ? others[idx - 1].end : 0
        const nextStart = b.start
        minStart = prevEnd
        maxEnd = nextStart
        break
      }
    }
    start = Math.max(start, minStart)
    end = Math.min(end, maxEnd)
    if (end - start < props.snapMinutes) {
      if (start + props.snapMinutes <= maxEnd)
        end = start + props.snapMinutes
      else start = Math.max(minStart, end - props.snapMinutes)
    }
    start = Math.round(start / props.snapMinutes) * props.snapMinutes
    end = Math.round(end / props.snapMinutes) * props.snapMinutes

    return { start, end }
  }
}

function confirmFloating(conf: {
  roomName: string
  timeStart: string
  timeEnd: string
}) {
  if (bookings.value) {
    emits('update', { ...unref(bookings.value), ...conf })
    nextTick(() => {
      bookings.value = null
    })
  }
}

function cancelFloating() {
  bookings.value = null
}

function onExistingResizing(_start: number, _end: number) {
  // console.log(start, end)
}
function onExistingResizeEnd(start: number, end: number) {
  if (bookings.value) {
    bookings.value.start = start
    bookings.value.end = end
  }
}

const headerScrollRef = ref<HTMLDivElement | null>(null)
const bodyScrollRef = ref<HTMLDivElement | null>(null)
const roomScrollRef = ref<HTMLDivElement | null>(null)

const renderBookList = computed(() => {
  return (roomId: number | string) => {
    return props.renderBooks.filter(item => item.roomId === roomId).map((b) => {
      const leftPercent = props.cellWidth / props.cellDuration * b.start
      const widthPercent = props.cellWidth / props.cellDuration * (b.end - b.start)
      return {
        ...b,
        leftPercent: `${leftPercent.toFixed(2)}px`,
        widthPercent: `${widthPercent.toFixed(2)}px`,
      }
    })
  }
})

function onDetail(book: Booking) {
  bookings.value = null
  console.log(book)
}

function getAvailableCell(
  roomId: number | string,
  index: number,
): { start: number, end: number } {
  const currentItem = {
    start: (index - 1) * props.cellDuration,
    end: index * props.cellDuration,
  }
  const item = props.renderBooks.filter((b) => {
    if (b.roomId !== roomId)
      return false
    const overlap = b.start < currentItem.end && b.end > currentItem.start
    const misaligned = (b.start % props.cellDuration !== 0) || (b.end % props.cellDuration !== 0)
    return overlap && misaligned
  })
  if (item.length) {
    const overlap = item[0]
    if (overlap.start <= currentItem.start) {
      return { start: overlap.end, end: currentItem.end }
    }
    else {
      return { start: currentItem.start, end: overlap.start }
    }
  }
  else {
    return currentItem
  }
}

function onSelect(room: BookingRoom, timeId: number) {
  if (timeId && room) {
    const { start, end } = getAvailableCell(room.id, timeId)
    bookings.value = {
      roomId: room.id,
      name: '',
      start,
      end,
    }
  }
}

onMounted(() => {
  const header = headerScrollRef.value!
  const body = bodyScrollRef.value!
  const room = roomScrollRef.value!

  // 监听 body 的滚动，联动 header 和左侧 room
  body.addEventListener('scroll', () => {
    header.scrollLeft = body.scrollLeft
    room.scrollTop = body.scrollTop
  })
})

defineExpose({
  cancelFloating,
})
</script>

<template>
  <div class="scheduler">
    <!-- 左上角 -->
    <div class="corner">
      会议室
    </div>

    <!-- 时间轴 -->
    <div ref="headerScrollRef" class="timeline-scroll header">
      <div
        v-for="h in hoursCount"
        :key="`${h}-hour`"
        class="time-cell-header"
      >
        {{ h + startHour - 1 }}:59
      </div>
    </div>

    <!-- 会议室列表 -->
    <div ref="roomScrollRef" class="room-col-scroll">
      <div
        v-for="room in rooms"
        :key="room.id"
        class="room-col"
      >
        {{ room.name }}
      </div>
    </div>

    <!-- 时间单元格 -->
    <div ref="bodyScrollRef" class="body-scroll">
      <div
        v-for="room in rooms"
        :key="room.id"
        class="timeline-row"
      >
        <div
          v-for="h in hoursCount"
          :key="`${room.id}-${h}-cell`"
          class="time-cell"
          @click.stop="onSelect(room, h)"
        />
        <FloatingResizer
          v-if="bookings?.roomId === room.id"
          :id="bookings.roomId"
          :key="bookings.roomId"
          :start="bookings.start"
          :end="bookings.end"
          :total="totalMinutes"
          :room-name="room.name"
          :start-time="startHour"
          :minutes-per-pixel="minutesPerPixel"
          :popover-trigger="popoverTrigger"
          :snap="snapMinutes"
          :validate="validateRangeForRoom(bookings.roomId)"
          :label="bookings.name"
          @resizing="onExistingResizing"
          @resize-end="onExistingResizeEnd"
          @check="confirmFloating"
        />
        <div
          v-for="ele of renderBookList(room.id)"
          :key="`${ele.roomId}-book`"
          v-ellipsis
          class="render-cell"
          :style="{
            left: ele.leftPercent,
            width: ele.widthPercent,
          }"
          @click.stop="onDetail(ele)"
        >
          {{ ele.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$cell: 100px;
$roomWidth: 160px;
$rowHeight: 60px;

.scheduler {
  display: grid;
  grid-template-columns: $roomWidth 1fr;
  grid-template-rows: 40px 1fr;
  border: 1px solid #eee;
  height: 100%;
  overflow: hidden;
  font-size: 13px;
  user-select: none;

  .corner {
    grid-row: 1;
    grid-column: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    background: #fff;
  }
  .header {
    grid-row: 1;
    grid-column: 2;
    display: flex;
    overflow-x: hidden;
    overflow-y: hidden;
    border-bottom: 1px solid #eee;
    background: #fafafa;
    white-space: nowrap;

    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .room-col-scroll {
    grid-row: 2;
    grid-column: 1;
    overflow-y: hidden;
    overflow-x: hidden;
    border-right: 1px solid #eee;

    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .body-scroll {
    grid-row: 2;
    grid-column: 2;
    overflow: auto;
    position: relative;
  }

  .time-cell-header {
    flex: 0 0 $cell;
    text-align: center;
    line-height: 40px;
    border-right: 1px solid #eee;
    color: #555;
    box-sizing: border-box;
  }

  .room-col {
    height: $rowHeight;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #f5f5f5;
    background: #fff;
  }

  .timeline-row {
    display: flex;
    top: 0;
    bottom: 0;
    line-height: $rowHeight;
    border-bottom: 1px solid #f5f5f5;
    position: relative;
  }

  .time-cell {
    flex: 0 0 $cell;
    border-right: 1px solid #fafafa;
    border-bottom: 1px solid #fafafa;
    box-sizing: border-box;
    height: $rowHeight;
    cursor: pointer;
  }

  .render-cell {
    position: absolute;
    height: 100%;
    text-align: center;
    line-height: $rowHeight;
    background: rgba(0, 120, 255, 0.3)
  }
}
</style>
