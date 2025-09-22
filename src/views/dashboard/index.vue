<script setup lang="ts">
import { ElButton, ElPopover, ElTable, ElTableColumn } from 'element-plus'

const gridData = [
  { date: '2016-05-02', name: 'Jack', address: 'New York City' },
  { date: '2016-05-04', name: 'Jack', address: 'New York City' },
  { date: '2016-05-01', name: 'Jack', address: 'New York City' },
  { date: '2016-05-03', name: 'Jack', address: 'New York City' },
]
const visible = ref(true)

function onClick() {
  visible.value = !visible.value
}
</script>

<template>
  <div style="padding: 40px;">
    <ElButton type="primary" @click="onClick">
      Click
    </ElButton>
    <ElPopover
      placement="right"
      trigger="click"
      :width="400"
    >
      <template #reference>
        <div un-inline-block>
          <ElButton v-if="visible" type="primary">
            Click to activate
          </ElButton>
        </div>
      </template>

      <ElTable :data="gridData" height="300">
        <ElTableColumn prop="date" label="Date" width="150" />
        <ElTableColumn prop="name" label="Name" width="100" />
        <ElTableColumn prop="address" label="Address" width="300" />
      </ElTable>
    </ElPopover>
  </div>
</template>
