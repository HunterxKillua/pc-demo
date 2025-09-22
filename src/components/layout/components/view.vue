<script setup lang="ts">
import type { MenuTag } from '@/store/app'
import { isHttpLink } from '@/utils'

const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const { tags } = storeToRefs(appStore)
const { setTag } = appStore

const cacheRoute = computed(() => {
  return tags.value.filter(item => item.alive).map(item => item.name)
})

const activeTag = computed(() => {
  return route.name
})

function handleClose(tag: MenuTag) {
  const cacheTag = setTag(tag, 'remove')
  if (cacheTag.length) {
    if (tag.name === activeTag.value) {
      const ele = cacheTag[cacheTag.length - 1]
      router.push({
        name: ele.name,
      })
    }
  }
  else {
    router.replace('/dashboard')
  }
}

function onClick(tag: MenuTag) {
  if (isHttpLink(tag.path)) {
    window.open(tag.path)
    return
  }
  if (tag.name !== route.name) {
    router.push({
      name: tag.name,
    })
  }
}
</script>

<template>
  <div class="layout-view">
    <div class="layout-view-tag">
      <el-tag
        v-for="tag in tags"
        :key="tag.name"
        closable
        size="default"
        :disable-transitions="false"
        :type="activeTag === tag.name ? 'primary' : 'info'"
        class="m-[8px]"
        @click="() => onClick(tag)"
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
    box-shadow:
      0 4px 6px rgba(0, 0, 0, 0.06),
      0 10px 20px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s ease;
    @apply bg-white w-[100%] overflow-x-auto box-border;
  }
  &-body {
    @apply flex-1 w-[100%] box-border p-[20px];
  }
}
</style>
