<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType, VNode } from 'vue'

/**
 * 优先使用 slotFn(slot)，其次使用 renderFn(render)，否则返回 fallbackText
 */
export default defineComponent({
  name: 'RenderColumn',
  props: {
    slotFn: Function as PropType<((scope: Record<string, any>) => VNode[]) | undefined>,
    renderFn: Function as PropType<((scope: Record<string, any>) => VNode | VNode[]) | undefined>,
    scope: { type: Object as PropType<Record<string, any>>, required: true },
    fallbackText: { type: [String, Object] as PropType<string | VNode>, default: '' },
  },
  setup(props) {
    return () => {
      if (props.slotFn)
        return props.slotFn(props.scope)
      if (props.renderFn)
        return props.renderFn(props.scope)
      return props.fallbackText || ''
    }
  },
})
</script>
