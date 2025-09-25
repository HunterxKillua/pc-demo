<script lang="ts" setup>
const router = useRouter()
function onClick() {
  router.push({
    path: '/meeting/book',
  })
}
</script>

<template>
  <div>
    <ElButton @click="onClick">
      会议
    </ElButton>
  </div>
</template>
