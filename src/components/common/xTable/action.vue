<script lang="tsx">
import { computed, defineComponent } from 'vue'
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon } from 'element-plus'
import { MoreFilled } from '@element-plus/icons-vue'
import type { VNode } from 'vue'
import { useAppStore } from '@/store/app'

/** 权限检查函数 */
function hasAuth(node: any, permissions: string[]) {
  const authDir = node.dirs?.find((d: any) => d.name === 'auth')
  if (authDir && authDir.arg !== 'disabled') {
    return permissions.includes(authDir.value as string)
  }
  return true
}

export default defineComponent({
  name: 'TableAction',
  props: {
    boundary: {
      type: Number,
      default: 3,
      validator: (value: number) => value > 0,
    },
    trigger: {
      type: String as () => 'hover' | 'click',
      default: 'hover',
    },
    moreIconVisible: {
      type: Boolean,
      default: false,
    },
    align: {
      type: String as () => 'left' | 'center' | 'right',
      default: 'center',
    },
  },
  setup(props, { slots }) {
    const appStore = useAppStore()

    const flexStyle = computed(() => {
      return `inline-flex items-center ${props.align === 'left' ? 'justify-start' : props.align === 'center' ? 'justify-center' : 'justify-end'}`
    })

    /** 获取有效子节点 */
    function filterNodes(): VNode[] {
      return (slots.default?.() || []).filter(node => !!node.type) as VNode[]
    }

    /** 默认更多按钮 */
    function renderMoreButton() {
      return slots.moreBtn?.() ?? (
        <ElIcon size={14} class="text-[var(--el-color-primary)] cursor-pointer">
          <MoreFilled />
        </ElIcon>
      )
    }

    /** 更多下拉菜单 */
    function renderMoreDropdown(moreNodes: VNode[]) {
      return (
        <ElDropdown trigger={props.trigger}>
          {{
            default: () => renderMoreButton(),
            dropdown: () => (
              <ElDropdownMenu class="table-action__dropdown">
                {moreNodes.map((node, index) => (
                  <ElDropdownItem key={index} class="block">{node}</ElDropdownItem>
                ))}
              </ElDropdownMenu>
            ),
          }}
        </ElDropdown>
      )
    }

    /** 渲染内容 */
    const renderContent = computed(() => {
      const filteredNodes = filterNodes().filter(node => hasAuth(node, appStore.permissions))

      if (filteredNodes.length <= props.boundary) {
        return filteredNodes
      }

      const normalNodes = filteredNodes.slice(0, props.boundary)
      const moreNodes = filteredNodes.slice(props.boundary)

      return [...normalNodes, renderMoreDropdown(moreNodes)]
    })

    return () => {
      if (!renderContent.value)
        return null
      return <div class={`table-action ${flexStyle.value} space-x-2`}>{renderContent.value}</div>
    }
  },
})
</script>

<style lang="scss">
.table-action__dropdown {
  .el-dropdown-menu__item {
		&:last-child {
			padding: 0 !important;
		}
    padding: 8px 12px;
  }
}
</style>
