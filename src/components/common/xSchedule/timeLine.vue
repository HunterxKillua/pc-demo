<script setup lang="ts">
import { ElButton, ElDatePicker, ElOption, ElSelect } from 'element-plus'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

const props = withDefaults(defineProps<{
  modelValue: string
  orgList: Org[]
  orgValue?: string
}>(), {
  modelValue: '',
  orgList: () => [],
  orgValue: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'update:orgValue', v: string): void
}>()

dayjs.locale('zh-cn')

interface Org {
  label: string
  value: string
}

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
</script>

<template>
  <div class="date-org-selector">
    <div class="header">
      <ElDatePicker
        v-model="selectedDate"
        type="date"
        placeholder="选择日期"
        value-format="YYYY-MM-DD"
      />
      <ElSelect
        v-model="selectedOrg"
        placeholder="选择组织"
        style="margin-left: 12px; width: 200px"
        @change="onOrgChange"
      >
        <ElOption
          v-for="org in props.orgList"
          :key="org.value"
          :label="org.label"
          :value="org.value"
        />
      </ElSelect>
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
