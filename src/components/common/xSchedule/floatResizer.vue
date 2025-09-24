<script setup lang="ts">
import { ElPopover } from 'element-plus'
import type { FloatEventPrams, FloatResizerProps } from '../../types/schedule'
/**
 * props
 * start/end: 单位分钟（相对于 timeline 起点）
 * total: timeline 总分钟（用于计算百分比）
 * minutesPerPixel: px -> 分钟 的系数（父组件计算并传入）
 * validate: 可选 - 父组件提供的校验/约束函数，返回被允许的 start/end
 */
const props = withDefaults(defineProps<FloatResizerProps>(), {
  snap: 30,
  min: 0,
  disabled: false,
  floating: false,
  label: '',
  minutesPerPixel: 1,
  cellWidth: 100, // 单元格宽度 用像素计算
  cellUnit: 60, // 单元格刻度 分钟
  popoverTrigger: 'hover',
  roomName: '',
})

const emit = defineEmits<{
  (e: 'resizeStart'): void
  (e: 'resizing', l: number, m: number): void
  (e: 'resizeEnd', l: number, m: number): void
  (e: 'check', val: FloatEventPrams): void
}>()

const localStart = ref(props.start)
const localEnd = ref(props.end)
const isResizing = ref(false)
const activeSide = ref<'left' | 'right' | null>(null)

// 初始值（在 mousedown 时记录）
const initialMouseX = ref(0)
const initialStart = ref(0)
const initialEnd = ref(0)

// watch 外部 props，在未 resize 时同步本地显示
watch(() => props.start, (v) => {
  if (!isResizing.value) {
    localStart.value = v
  }
})
watch(() => props.end, (v) => {
  if (!isResizing.value) {
    localEnd.value = v
  }
})

// 计算最大最小边界
const minAllowed = computed(() => props.min ?? 0)
const maxAllowed = computed(() => props.max ?? props.total)

function pxToMin(px: number) {
  return px * props.minutesPerPixel
}
function snapVal(v: number) {
  const s = props.snap ?? 1
  return Math.round(v / s) * s
}
function clamp(v: number, a = minAllowed.value, b = maxAllowed.value) {
  return Math.max(a, Math.min(b, v))
}
function pct(type: 'width' | 'left') {
  if (props.total === 0)
    return '0'
  if (type === 'left') {
    return `${(localStart.value / props.cellUnit) * props.cellWidth}px`
  }
  else {
    const range = localEnd.value - localStart.value
    return `${(range / props.cellUnit) * props.cellWidth}px`
  }
}

// 伸缩
function onHandleDown(ev: MouseEvent, side: 'left' | 'right') {
  if (props.disabled)
    return
  isResizing.value = true
  activeSide.value = side
  initialMouseX.value = ev.clientX
  initialStart.value = props.start
  initialEnd.value = props.end
  // 禁止文本选中带来的跳动
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', onDocMove)
  document.addEventListener('mouseup', onDocUp)
  emit('resizeStart')
}

function onDocMove(ev: MouseEvent) {
  if (!isResizing.value || !activeSide.value)
    return
  const dx = ev.clientX - initialMouseX.value
  const deltaMin = pxToMin(dx)
  let candStart = initialStart.value
  let candEnd = initialEnd.value

  if (activeSide.value === 'left') {
    candStart = initialStart.value + deltaMin
    // 保证不超过右边 - 最小间隔
    candStart = Math.min(candStart, candEnd - (props.snap ?? 1))
  }
  else {
    candEnd = initialEnd.value + deltaMin
    candEnd = Math.max(candEnd, candStart + (props.snap ?? 1))
  }

  // 吸附与边界
  candStart = clamp(snapVal(candStart))
  candEnd = clamp(snapVal(candEnd))

  // 若传 validate，则先用它来最终约束
  let final = { start: candStart, end: candEnd }
  if (props.validate) {
    try {
      final = props.validate(candStart, candEnd, activeSide.value, props.id)
      // 防御性处理：确保值在 min/max
      final.start = clamp(snapVal(final.start))
      final.end = clamp(snapVal(final.end))
    }
    catch {
      // 如果 validate 抛错，退回到 cand
      final = { start: candStart, end: candEnd }
    }
  }

  localStart.value = final.start
  localEnd.value = final.end
  emit('resizing', final.start, final.end)
}

function formatHour(hourDecimal: number) {
  const h = Math.floor(hourDecimal)
  const m = Math.round((hourDecimal - h) * 60)
  return `${h}:${m.toString().padStart(2, '0')}`
}

const timeRange = computed(() => {
  const start = (localStart.value / props.cellUnit) + props.startTime
  const end = (localEnd.value / props.cellUnit) + props.startTime
  return {
    start: formatHour(start),
    end: formatHour(end),
  }
})

function onCheck() {
  emit('check', {
    roomName: props.roomName,
    timeStart: timeRange.value.start,
    timeEnd: timeRange.value.end,
  })
}

function onDocUp() {
  if (!isResizing.value)
    return
  isResizing.value = false
  activeSide.value = null
  document.body.style.userSelect = ''
  document.removeEventListener('mousemove', onDocMove)
  document.removeEventListener('mouseup', onDocUp)
  emit('resizeEnd', localStart.value, localEnd.value)
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onDocMove)
  document.removeEventListener('mouseup', onDocUp)
  document.body.style.userSelect = ''
})
</script>

<template>
  <ElPopover placement="bottom" :trigger="popoverTrigger">
    <template #reference>
      <div
        class="fr-root"
        :class="{ floating }"
        :style="{
          left: pct('left'),
          width: pct('width'),
        }"
        @mousedown.stop.prevent
      >
        <div class="fr-content">
          <slot>
            <!-- 默认内容 -->
            <div class="fr-label">
              {{ label }}
            </div>
          </slot>
        </div>

        <!-- 左把手 -->
        <div
          class="fr-handle left"
          role="slider"
          aria-orientation="horizontal"
          @mousedown.prevent="onHandleDown($event, 'left')"
        >
          <div class="fr-handle-dot" />
        </div>

        <!-- 右把手 -->
        <div
          class="fr-handle right"
          role="slider"
          aria-orientation="horizontal"
          @mousedown.prevent="onHandleDown($event, 'right')"
        >
          <div class="fr-handle-dot" />
        </div>
      </div>
    </template>
    <template #default>
      <div class="box-border">
        <div class="text-center font-600 leading-[32px]">
          {{ roomName }}
        </div>
        <div class="text-center font-500 leading-[24px]">
          {{ timeRange.start }}-{{ timeRange.end }}
        </div>
        <div class="flex items-center justify-center my-[8px]">
          <ElButton type="primary" @click="onCheck">
            预定
          </ElButton>
        </div>
      </div>
    </template>
  </ElPopover>
</template>

<style scoped>
.fr-root {
  position: absolute;
  top: 0;
  bottom: 1px;
  box-sizing: border-box;
  background: rgba(0, 120, 255, 0.3);
  border: 1px solid rgba(0,120,255,0.5);
  display: flex;
  align-items: center;
  user-select: none;
}
.fr-root.floating {
  background: rgba(0,120,255,0.05);
  border-style: dashed;
}
.fr-content {
  flex: 1;
  padding: 0 28px;
  display: flex;
  align-items: center;
}
.fr-label {
  color: #0a66c2;
  font-size: 12px;
}
.fr-handle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  cursor: ew-resize;
}
.fr-handle.left { left: -9px; }
.fr-handle.right { right: -9px; }
.fr-handle-dot {
  width: 8px;
  height: 8px;
  background: #ffffff;
  border-radius: 50%;
  box-sizing: border-box;
  border: 1px solid rgba(0,120,255,0.5);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.02) inset;
}
</style>
