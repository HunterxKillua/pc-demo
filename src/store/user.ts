export const useAccountStore = defineStore('user', () => {
  const token = ref<string>('')
  const userInfo = reactive<{
    name: string
    age: number
  }>({
    name: '',
    age: 18,
  })
  return {
    token,
    userInfo,
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot))
}
