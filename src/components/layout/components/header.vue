<script setup lang="ts">
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { Expand, Fold } from '@element-plus/icons-vue'

const appStore = useAppStore()

const { toggleMenu } = appStore
const { isCollapse } = storeToRefs(appStore)
const route = useRoute()

const breadcrumbs = computed<{
  name: string
  path: string
  title: string
  disabled: boolean
}[]>(() => {
  return route.matched
    .filter(r => r.meta?.title && r.name && r.path !== '/')
    .map((r, index, arr) => {
      const currentPath = route.path
      const parentRedirect = arr[index - 1]?.redirect
      const disabled = r.path === currentPath || parentRedirect === currentPath

      return {
        name: r.name as string,
        path: r.path,
        title: r.meta.title as string,
        disabled,
      }
    })
})
</script>

<template>
  <div class="layout-header">
    <ElButton class="mr-8" @click="toggleMenu">
      <ElIcon>
        <Expand v-if="isCollapse" />
        <Fold v-else />
      </ElIcon>
    </ElButton>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem
        v-for="crumb in breadcrumbs"
        :key="crumb.name"
      >
        <RouterLink v-if="!crumb.disabled" :to="crumb.path">
          {{ crumb.title }}
        </RouterLink>
        <span v-else>{{ crumb.title }}</span>
      </ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>
</template>

<style lang="scss" scoped>
.layout-header {
  width: 100%;
  height: 50px;
  background-color: #fff;
  @apply flex items-center;
}
</style>
