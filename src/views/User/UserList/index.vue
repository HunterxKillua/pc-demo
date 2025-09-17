<script setup lang="tsx">
defineRender(() => {
  return (
    <div>
      user-list
    </div>
  )
})
onMounted(() => {
  console.log('2222')
})
onActivated(() => {
  console.log('trigger cache alive2')
})
</script>
