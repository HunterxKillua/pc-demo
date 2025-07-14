<script setup lang="ts">
import { ElButton } from 'element-plus'

defineProps<{
  value: string
}>()
let { msg } = $defineModels<{
  msg: ModelOptions<string, {
    passive: true
    required: true
  }>
}>()

function onClick() {
  msg = '123'
}
</script>

<template>
  <div>
    shortModel的值: {{ value }} - {{ msg }}
  </div>
  <ElButton @click="onClick">
    点击重置
  </ElButton>
</template>
