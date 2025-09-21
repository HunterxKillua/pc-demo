<script setup lang="ts">
import FloatingResizer from './FloatingResizer.vue'

interface Booking { roomId: number, start: number, end: number, name: string }

const rooms = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `会议室${i + 1}`,
}))
const startHour = ref(7)
const endHour = ref(24)
const hoursCount = endHour.value - startHour.value
const totalMinutes = hoursCount * 60
const snapMinutes = 30
const cellDuration = 60
const cellWidth = 100

const bookings = ref<Booking | null>(null)

const renderBooks = reactive<Booking[]>(
  [
    {
      roomId: 2,
      start: 150,
      end: 210,
      name: 'ts',
    },
    {
      roomId: 2,
      start: 240,
      end: 420,
      name: 'ts',
    },
    {
      roomId: 2,
      start: 30,
      end: 60,
      name: 'ts',
    },
    {
      roomId: 2,
      start: 900,
      end: 960,
      name: 'ts',
    },
    {
      roomId: 1,
      start: 150,
      end: 270,
      name: 'ts',
    },
  ],
)

const timelineRef = ref<HTMLElement | null>(null)
const minutesPerPixel = ref(1) // px -> minutes

// 计算 minutesPerPixel（在容器 resize 时更新）
function computeMPP() {
  if (!timelineRef.value)
    return
  const w = Math.max(1, timelineRef.value.clientWidth)
  minutesPerPixel.value = totalMinutes / w
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

function validateRangeForRoom(roomId: number) {
  return (candStart: number, candEnd: number, side?: 'left' | 'right') => {
    let start = Math.max(0, Math.min(totalMinutes, candStart))
    let end = Math.max(0, Math.min(totalMinutes, candEnd))
    if (end - start < snapMinutes) {
      if (side === 'left')
        start = Math.max(0, end - snapMinutes)
      else end = Math.min(totalMinutes, start + snapMinutes)
    }
    const others = renderBooks
      .filter(b => b.roomId === roomId)
      .sort((a, b) => a.start - b.start)
    let minStart = 0
    for (const b of others) {
      if (b.end <= start)
        minStart = Math.max(minStart, b.end)
    }
    let maxEnd = totalMinutes
    for (const b of others) {
      if (b.start >= end) { maxEnd = Math.min(maxEnd, b.start); break }
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
    if (end - start < snapMinutes) {
      if (start + snapMinutes <= maxEnd)
        end = start + snapMinutes
      else start = Math.max(minStart, end - snapMinutes)
    }
    start = Math.round(start / snapMinutes) * snapMinutes
    end = Math.round(end / snapMinutes) * snapMinutes

    return { start, end }
  }
}

function confirmFloating() {
  if (bookings.value) {
    renderBooks.push(bookings.value)
    nextTick(() => {
      bookings.value = null
    })
  }
}
function cancelFloating() {
  bookings.value = null
}

function onExistingResizing(start: number, end: number) {
  console.log(start, end)
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
  return (roomId: number) => {
    return renderBooks.filter(item => item.roomId === roomId).map((b) => {
      const leftPercent = cellWidth / cellDuration * b.start
      const widthPercent = cellWidth / cellDuration * (b.end - b.start)
      return {
        ...b,
        leftPercent: `${leftPercent.toFixed(2)}px`,
        widthPercent: `${widthPercent.toFixed(2)}px`,
      }
    })
  }
})

function onDetail(book: Booking) {
  console.log(book)
}

function getAvailableCell(
  roomId: number,
  index: number,
): { start: number, end: number } {
  const currentItem = {
    start: (index - 1) * cellDuration,
    end: index * cellDuration,
  }
  const item = renderBooks.filter((b) => {
    if (b.roomId !== roomId)
      return false
    const overlap = b.start < currentItem.end && b.end > currentItem.start
    const misaligned = (b.start % cellDuration !== 0) || (b.end % cellDuration !== 0)
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

function onSelect(room: { id: number, name: string }, timeId: number) {
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
</script>

<template>
  <div class="scheduler">
    <!-- 左上角 -->
    <div class="corner">
      会议室
    </div>

    <!-- 时间轴 -->
    <div ref="headerScrollRef" class="timeline-scroll header">
      <div v-for="h in hoursCount" :key="`${h}-hour`" class="time-cell-header">
        {{ h + startHour - 1 }}:59
      </div>
    </div>

    <!-- 会议室列表 -->
    <div ref="roomScrollRef" class="room-col-scroll">
      <div v-for="room in rooms" :key="room.id" class="room-col">
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
        <div v-for="h in hoursCount" :key="`${room.id}-${h}-cell`" class="time-cell" @click="onSelect(room, h)" />
        <ElPopover
          placement="bottom"
        >
          <template #default>
            <div>123</div>
          </template>
          <template #reference>
            <FloatingResizer
              v-if="bookings?.roomId === room.id"
              :id="bookings.roomId"
              :key="bookings.roomId"
              :start="bookings.start"
              :end="bookings.end"
              :total="totalMinutes"
              :minutes-per-pixel="minutesPerPixel"
              :snap="snapMinutes"
              :validate="validateRangeForRoom(bookings.roomId)"
              :label="`#${bookings.name}`"
              @resizing="onExistingResizing"
              @resize-end="onExistingResizeEnd"
            />
          </template>
        </ElPopover>
        <div
          v-for="ele of renderBookList(room.id)"
          :key="`${ele.roomId}-book`"
          class="render-cell"
          :style="{ left: ele.leftPercent, width: ele.widthPercent }"
          @click="onDetail(ele)"
        >
          {{ ele.name }}
        </div>
      </div>
    </div>
    <div class="controls">
      <button @click="confirmFloating">
        确认浮层
      </button>
      <button @click="cancelFloating">
        取消浮层
      </button>
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
  height: 500px;
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

  .controls {
    grid-column: span 2;
    margin: 12px;
    display: flex;
    gap: 8px;
  }
}
</style>
