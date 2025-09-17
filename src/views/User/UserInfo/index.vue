<script setup lang="tsx">
defineRender(() => {
  return (
    <div>
      user info
    </div>
  )
})
onMounted(() => {
  console.log('1111')
})
onActivated(() => {
  console.log('trigger cache alive1')
})
</script>
