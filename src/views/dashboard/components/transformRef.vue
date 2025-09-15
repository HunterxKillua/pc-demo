<script setup lang="ts">

const msg = $ref('1')

console.log(msg)

withDefaults(defineProps<{
  title?: string
}>(), {
  title: ''
})

const emits = defineEmits<{
  click: []
}>()

function onClick() {
  emits('click')
}

function test() {
  console.log('slot instance')
}

defineExpose({
  test
})
</script>

<template>
  <div @click="onClick">
    {{ msg }} {{ title }}
  </div>
</template>
