<script lang="ts" setup>
import { getSystemUser } from '@/api'

onMounted(async () => {
  const { data, error } = await getSystemUser()
  if (!error) {
    console.log(data)
  }
})
</script>

<template>
  <div>
    user
  </div>
</template>
