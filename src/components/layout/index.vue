<script setup lang="tsx">
import LayoutHeader from './components/header.vue'
import LayoutSide from './components/sideMenu.vue'
import LayoutFooter from './components/footer.vue'
import LayoutView from './components/view.vue'

defineRender(() => {
  return (
    <div class="layout">
      <LayoutSide />
      <div class="layout-container">
        <LayoutHeader />
        <LayoutView	/>
        <LayoutFooter />
      </div>
    </div>
  )
})
</script>

<style lang="scss">
.layout {
  @apply flex items-center h-[100%] overflow-hidden;
  &-container {
    @apply flex-1 flex flex-col justify-center w-[100%] h-[100%] overflow-hidden;
  }
}
</style>
