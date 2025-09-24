<script setup lang="ts">
import { ElButton, ElDatePicker, ElTreeSelect } from 'element-plus'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

import type { TimeLineProps } from '../../types/schedule'

const props = withDefaults(defineProps<TimeLineProps>(), {
  modelValue: '',
  orgList: () => [],
  orgValue: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'update:orgValue', v: string): void
}>()

dayjs.locale('zh-cn')

const TreeSelectRef = ref<typeof ElTreeSelect | null>(null)

const selectedOrg = ref<string>(props.orgValue || '')

const selectedDate = ref(props.modelValue || dayjs().format('YYYY-MM-DD'))

const startOfWeek = computed(() => dayjs(selectedDate.value).startOf('week'))

const weekDays = computed(() => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = startOfWeek.value.add(i, 'day')
    return {
      date: d.format('YYYY-MM-DD'),
      label: d.format('MM-DD'),
      week: d.format('ddd'),
    }
  })
})

function selectDate(date: string) {
  selectedDate.value = date
  emit('update:modelValue', date)
}

function prevWeek() {
  selectedDate.value = startOfWeek.value.subtract(7, 'day').format('YYYY-MM-DD')
  emit('update:modelValue', selectedDate.value)
}

function nextWeek() {
  selectedDate.value = startOfWeek.value.add(7, 'day').format('YYYY-MM-DD')
  emit('update:modelValue', selectedDate.value)
}

function onOrgChange(val: string) {
  selectedOrg.value = val
  emit('update:orgValue', val)
}

function getCurrentLabel(info: {
  date: string
  label: string
  week: string
}) {
  if (info.date === dayjs().format('YYYY-MM-DD')) {
    return '今天'
  }
  else {
    return info.week
  }
}

function setOrgValue(val: string) {
  selectedOrg.value = val
}

function setTimeValue(val: string) {
  selectedDate.value = val
}

defineExpose({
  setOrgValue,
  setTimeValue,
})
</script>

<template>
  <div class="date-org-selector">
    <div class="header">
      <ElDatePicker
        v-model="selectedDate"
        type="date"
        placeholder="选择日期"
        value-format="YYYY-MM-DD"
        @change="selectDate"
      />
      <ElTreeSelect
        ref="TreeSelectRef"
        v-model="selectedOrg"
        placeholder="选择区域"
        :data="orgList"
        node-key="id"
        value-key="id"
        highlight-current
        check-strictly
        :indent="24"
        accordion
        :props="{
          label: 'label',
          children: 'children',
          disabled: 'disabled',
        }"
        style="margin-left: 12px; width: 240px"
        @change="onOrgChange"
      />
    </div>

    <div class="week-nav">
      <ElButton link @click="prevWeek">
        &lt;
      </ElButton>
      <div class="days">
        <div
          v-for="d in weekDays"
          :key="d.date"
          class="day-item"
          :class="{ active: d.date === selectedDate }"
          @click="selectDate(d.date)"
        >
          <div class="week">
            {{ getCurrentLabel(d) }}
          </div>
          <div class="date">
            {{ d.label }}
          </div>
        </div>
      </div>
      <ElButton link @click="nextWeek">
        &gt;
      </ElButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.date-org-selector {
  .header {
    background: #f5f7fa;
    padding: 12px;
    border-radius: 8px;
    display: flex;
    align-items: center;
  }

  .week-nav {
    margin-top: 12px;
    background: #fff;
    border-radius: 8px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

    .days {
      flex: 1;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .day-item {
        cursor: pointer;
        text-align: center;
        padding: 6px 10px;
        border-radius: 6px;
        transition: all 0.2s ease;

        .date {
          font-weight: 500;
        }
        .week {
          font-size: 12px;
          color: #888;
        }

        &:hover {
          background: #f0f2f5;
        }
        &.active {
          background: #409eff;
          color: #fff;
          .week {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
