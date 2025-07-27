import type { Component, DefineComponent } from 'vue'

export interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

export type Components = Component | JSX.Element

const LoadingComponents = defineComponent({
  props: {
    delay: {
      type: Number,
      default: () => 0,
    },
  },
  setup(props) {
    const LoadingInstance = ElLoading.service({
      lock: true,
      text: '加载中',
    })
    setTimeout(() => {
      LoadingInstance.close()
    }, props.delay)
  },
})

export function useLazyImport<T>(
  loader: Fn,
  options: { delay?: number, timeout?: number, loadingTime?: number, showLoading?: boolean } = {},
  LoadingComponent: Components = LoadingComponents,
): DefineComponent<T> {
  const { delay = 100, timeout = 2000, loadingTime = 200, showLoading = true } = options
  return defineAsyncComponent({
    loader,
    loadingComponent: showLoading ? h(LoadingComponent, { delay: loadingTime }) : h('fragment', ''),
    timeout, // 如果load加载的时间超出了timeout会直接展示error组件指导被resolve或者直接被reject后
    delay, // delay时间一定需要比timeout以及组件加载消耗的时间短
    onError: (_, _retry, fail) => {
      ElMessage.error('加载失败')
      fail()
    },
  })
}
