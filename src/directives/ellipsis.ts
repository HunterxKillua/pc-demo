import type { Directive } from 'vue'

const ellipsis: Directive<HTMLElement, number> = {
  mounted(el, binding) {
    const lines = binding.value || 1
    el.style.display = '-webkit-box'
    el.style.webkitBoxOrient = 'vertical'
    el.style.overflow = 'hidden'
    el.style.textOverflow = 'ellipsis'
    el.style.webkitLineClamp = `${lines}`
  },
  updated(el, binding) {
    const lines = binding.value || 1
    el.style.webkitLineClamp = `${lines}`
  },
}

export default ellipsis
