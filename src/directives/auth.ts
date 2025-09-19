import type { Directive } from 'vue'
import { useAppStore } from '@/store/app'

function applyAuth(el: HTMLElement, binding: any) {
  const appStore = useAppStore()
  const authValue = binding.value

  const hasPermission = appStore.permissions.includes(authValue)

  if (!hasPermission) {
    if (binding.arg === 'disabled') {
      //  只处理ElButton的disabled
      if (el.classList.contains('el-button')) {
        (el as HTMLButtonElement).disabled = true
      }
    }
    else if (binding.arg === 'show') {
      el.style.display = 'none'
    }
    else {
      el.parentNode?.removeChild(el)
    }
  }
  else {
    if (binding.arg === 'show') {
      el.style.display = ''
    }
    if (binding.arg === 'disabled' && el.classList.contains('el-button')) {
      (el as HTMLButtonElement).disabled = false
    }
  }
}

const auth: Directive = {
  mounted(el, binding) {
    applyAuth(el, binding)
  },
  updated(el, binding) {
    applyAuth(el, binding)
  },
}

export default auth
