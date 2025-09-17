<script lang="ts" setup>
import type { RouteRecordRaw } from 'vue-router'
import { useAppStore } from '@/store/app'
import { getRouter } from '@/modules/router'
import { type RenderMenuInterface, isHttpLink } from '@/utils'

const appStore = useAppStore()
const route = useRoute()
const router = useRouter()
const { isCollapse } = storeToRefs(appStore)
const { getMenus } = appStore
const menus = ref<Record<string, any>[]>([])

const currRoute = computed(() => {
  return (route?.name || '') as string
})

function handleSelect(e: RenderMenuInterface) {
  if (isHttpLink(e.path)) {
    window.open(e.path)
    return
  }
  if (e.key !== route.name) {
    router.push(e.path)
  }
}

onMounted(() => {
  const { options } = getRouter() || { routes: [] }
  menus.value = getMenus(options?.routes as RouteRecordRaw[])
})
</script>

<template>
  <div class="layout-side">
    <div class="layout-side-logo">
      logo
    </div>
    <div class="layout-side-menu">
      <el-menu
        :default-active="currRoute"
        class="el-menu-vertical-box"
        unique-opened
        :collapse="isCollapse"
      >
        <el-sub-menu v-for="item of menus" :key="item.key" :index="item.key">
          <template #title>
            <component :is="item.icon" />
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item v-for="ele of item.children" :key="ele.key" :index="ele.key" @click="() => handleSelect(ele)">
            <template #title>
              <component :is="ele.icon" />
              <span>{{ ele.title }}</span>
            </template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-side {
  width: 200px;
  height: 100%;
  background: #fff;
  @apply flex flex-col items-center overflow-hidden;
  &-logo {
    height: 50px;
    width: 100%;
  }
  &-menu {
    flex: 1;
    overflow-y: auto;
  }
  .el-menu {
    border-right: none;
  }
}
</style>
