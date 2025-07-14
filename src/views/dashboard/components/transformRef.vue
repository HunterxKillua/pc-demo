<script setup lang="ts">
const msg = $ref('1')

console.log(msg)
</script>

<template>
  <div>
    {{ msg }}
  </div>
</template>
