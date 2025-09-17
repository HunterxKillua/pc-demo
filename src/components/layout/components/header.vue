<script setup lang="tsx">
const appStore = useAppStore()
const { toggleMenu } = appStore
const { isCollapse } = storeToRefs(appStore)
defineRender(() => {
  return (
    <div class="layout-header">
      <el-button onClick={toggleMenu}>
        { isCollapse.value ? '展开' : '收起' }
      </el-button>
      header
    </div>
  )
})
</script>

<style lang="scss" scoped>
.layout-header {
  width: 100%;
  height: 50px;
  background-color: #fff;
}
</style>
