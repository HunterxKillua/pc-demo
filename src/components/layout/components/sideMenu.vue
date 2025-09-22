<script lang="ts" setup>
import type { RouteRecordRaw } from 'vue-router'
import { ElPopover, ElSubMenu } from 'element-plus'
import { Platform } from '@element-plus/icons-vue'
import { getRouter } from '@/modules/router'
import { type RenderMenuInterface, isHttpLink } from '@/utils'

const appStore = useAppStore()
const route = useRoute()
const router = useRouter()
const { isCollapse } = storeToRefs(appStore)
const { getMenus, setTag } = appStore
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

watch(() => route.name, () => {
  setTag({
    name: (route.name as string) || '',
    label: route.meta.title,
    alive: route.meta.keepAlive || false,
  }, 'add')
}, {
  immediate: true,
})

onMounted(() => {
  const { options } = getRouter() || { routes: [] }
  menus.value = getMenus(options?.routes as RouteRecordRaw[])
})
</script>

<template>
  <div class="layout-side">
    <div class="layout-side-logo">
      <ElIcon class="mr-[8px]">
        <Platform />
      </ElIcon>
      <div>HD智慧会议</div>
    </div>
    <div class="layout-side-menu">
      <ElMenu
        :default-active="currRoute"
        class="el-menu-vertical-box"
        unique-opened
        :collapse="isCollapse"
      >
        <template v-for="item of menus" :key="item.key">
          <ElMenuItem
            v-if="!item.children.length"
            :index="item.key"
            @click="() => handleSelect(item as RenderMenuInterface)"
          >
            <ElPopover
              trigger="hover"
              placement="right"
              :disabled="!isCollapse"
            >
              <template #reference>
                <div un-inline-block>
                  <component :is="item.icon" />
                  <span v-show="!isCollapse">{{ item.title }}</span>
                </div>
              </template>
              <span>{{ item.title }}</span>
            </ElPopover>
          </ElMenuItem>
          <ElSubMenu v-else :index="item.key">
            <template #title>
              <component :is="item.icon" />
              <span>{{ item.title }}</span>
            </template>
            <ElMenuItem v-for="ele of item.children" :key="ele.key" :index="ele.key" @click="() => handleSelect(ele)">
              <template #title>
                <component :is="ele.icon" />
                <span>{{ ele.title }}</span>
              </template>
            </ElMenuItem>
          </ElSubMenu>
        </template>
      </ElMenu>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-side {
  height: 100%;
  background: #fff;
  border-right: 1px solid #ebeef5;
  box-shadow:
    4px 0 8px rgba(0, 0, 0, 0.08),
    12px 0 20px rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.2s ease;
  @apply flex flex-col items-center overflow-hidden;
  &-logo {
    height: 50px;
    width: 100%;
    border-bottom: 1px solid #ebeef5;
    @apply flex items-center justify-center box-border pr-[24px] pl-[12px];
  }
  &-menu {
    flex: 1;
    overflow-y: auto;
    @apply pr-[24px] pl-[12px];
  }
  .el-menu {
    border-right: none;
  }
}
</style>
