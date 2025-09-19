import type { Directive, DirectiveBinding } from 'vue'
import { debounce } from 'lodash-es'

interface DebounceEl extends HTMLElement {
  _debouncedHandler?: {
    handler: EventListener
    eventType: string
  }
}

const mouse: Directive = {
  mounted(el: DebounceEl, binding: DirectiveBinding) {
    const delay = Number(binding.arg) || 300

    const eventType = binding.modifiers.mouseenter
      ? 'mouseenter'
      : binding.modifiers.mouseleave
        ? 'mouseleave'
        : null

    if (!eventType) {
      console.error('v-debounce 只支持 "mouseenter" 或 "mouseleave" 事件修饰符')
      return
    }

    if (typeof binding.value !== 'function') {
      console.error('v-debounce 指令的值必须是函数')
      return
    }

    const debouncedHandler = debounce(binding.value, delay)

    el.addEventListener(eventType, debouncedHandler)

    // 存储到元素上，方便卸载
    el._debouncedHandler = {
      handler: debouncedHandler,
      eventType,
    }
  },

  unmounted(el: DebounceEl) {
    if (el._debouncedHandler) {
      const { handler, eventType } = el._debouncedHandler
      el.removeEventListener(eventType, handler)
      delete el._debouncedHandler
    }
  },
}

export default mouse
