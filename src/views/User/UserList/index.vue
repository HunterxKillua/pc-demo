<script setup lang="tsx">
import { getCurrentInstance } from 'vue'

defineRender(() => {
  return (
    <div>
      user-list
    </div>
  )
})
onMounted(() => {
  const instance = getCurrentInstance()
  console.log('2222', instance)
})
onActivated(() => {
  console.log('trigger cache alive2')
})
</script>
