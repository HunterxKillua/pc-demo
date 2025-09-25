<script lang="ts" setup>
import type { Booking, FloatEventPrams, MeetingProps, TimeLineProps } from '../../types/schedule'
import XSchedule from './meeting.vue'
import TimeLine from './timeLine.vue'

const props = withDefaults(defineProps<MeetingProps & TimeLineProps>(), {
  rooms: () => [],
  renderBooks: () => [],
  orgList: () => [],
  modelValue: '',
  orgValue: '',
  startHour: 7,
  endHour: 24,
  availableDays: 7,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'update:orgValue', v: string): void
  (e: 'confirm', v: Booking & FloatEventPrams): void
}>()

const TimeLineRef = ref<typeof TimeLine | null>(null)

function onUpdateSchedule(conf: Booking & FloatEventPrams) {
  emit('confirm', conf)
}
const selectedDate = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
const selectedOrg = computed({
  get() {
    return props.orgValue
  },
  set(val) {
    emit('update:orgValue', val)
  },
})

function setTimeLineValue(key: 'time' | 'org', val: string) {
  if (key === 'time') {
    TimeLineRef.value?.setTimeValue(val)
  }
  else {
    TimeLineRef.value?.setOrgValue(val)
  }
}

defineExpose({
  setTimeLineValue,
})
</script>

<template>
  <div class="common-page flex-v">
    <TimeLine
      ref="TimeLineRef"
      v-model="selectedDate"
      v-model:org-value="selectedOrg"
      :org-list="orgList"
      :available-days="availableDays"
      class="w-[100%] mb-[8px]"
    />
    <XSchedule
      :rooms="rooms"
      :render-books="renderBooks"
      :start-hour="startHour"
      :end-hour="endHour"
      :snap-minutes="snapMinutes"
      class="flex-1 w-[100%]"
      @update="onUpdateSchedule"
    />
  </div>
</template>
