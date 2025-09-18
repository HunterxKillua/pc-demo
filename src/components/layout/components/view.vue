<script setup lang="ts">
import type { MenuTag } from '@/store/app'

const appStore = useAppStore()
const { tags } = storeToRefs(appStore)
const { setTag } = appStore

const cacheRoute = computed(() => {
  return tags.value.filter(item => item.alive).map(item => item.name)
})

function handleClose(tag: MenuTag) {
  setTag(tag, 'remove')
}
</script>

<template>
  <div class="layout-view">
    <div class="layout-view-tag">
      <el-tag
        v-for="tag in tags"
        :key="tag.name"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
      >
        {{ tag.label }}
      </el-tag>
    </div>
    <div class="layout-view-body">
      <RouterView v-slot="{ Component }">
        <Transition mode="out-in" appear>
          <KeepAlive :include="cacheRoute">
            <component :is="Component" />
          </KeepAlive>
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-view {
  @apply flex-1 w-[100%] flex flex-col items-center;
  &-tag {
    @apply bg-white w-[100%] overflow-x-auto;
  }
  &-body {
    @apply flex-1 w-[100%] box-border p-[20px];
  }
}
</style>
