<script setup lang="ts">
import { useRoute } from 'vue-router'
import { watchEffect } from 'vue'

const route = useRoute()
watchEffect(() => {
  console.log(route.query?.ticket)
})
</script>

<template>
  <RouterView />
</template>
