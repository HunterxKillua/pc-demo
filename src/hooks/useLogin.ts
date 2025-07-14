import { reactive } from 'vue'

export function useLogin() {
  const userInfo = reactive({})
  return {
    userInfo,
  }
}
