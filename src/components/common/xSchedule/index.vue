<script lang="ts" setup>
import type { Booking, FloatEventPrams, MettingProps, TimeLineProps } from '../../types/schedule'
import XSchedule from './metting.vue'
import TimeLine from './timeLine.vue'

const props = withDefaults(defineProps<MettingProps & TimeLineProps>(), {
  rooms: () => [],
  renderBooks: () => [],
  orgList: () => [],
  modelValue: '',
  orgValue: '',
  startHour: 7,
  endHour: 24,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'update:orgValue', v: string): void
  (e: 'confirm', v: Booking & FloatEventPrams): void
}>()

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
</script>

<template>
  <div class="common-page flex-v">
    <TimeLine
      v-model="selectedDate"
      v-model:org-value="selectedOrg"
      :org-list="orgList"
      class="w-[100%] mb-[8px]"
    />
    <XSchedule
      :rooms="rooms"
      :render-books="renderBooks"
      :start-hour="startHour"
      :end-hour="endHour"
      class="flex-1 w-[100%]"
      @update="onUpdateSchedule"
    />
  </div>
</template>
