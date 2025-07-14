<script setup lang="ts">
const { modelValue, count } = defineModels<{
  modelValue: string
  count?: number
}>()
// $defineModels解构后的结构是与$ref一致

console.log(modelValue.value, count.value)
modelValue.value = 'defineModels'
</script>

<template>
  {{ modelValue }}
</template>
