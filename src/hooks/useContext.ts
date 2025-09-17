import type { InjectionKey, UnwrapRef } from 'vue'
import { readonly as defineReadOnly } from 'vue'

export interface CreateContextOptions {
  readonly?: boolean
  createProvider?: boolean
  native?: boolean
}

export type shallowUnwrapRef<T> = {
  [Key in keyof T]: UnwrapRef<T[Key]>
}

export function createContext<T>(
  context: any,
  key: InjectionKey<T> = Symbol(''),
  options: CreateContextOptions = {},
) {
  const { readonly = true, createProvider = false, native = false } = options
  const state = reactive(context)
  const provideData = readonly ? defineReadOnly(state) : state
  if (!createProvider)
    provide(key, native ? context : provideData)
  return {
    state,
  }
}

export function useContext<T>(key: InjectionKey<T>, native?: boolean): T

export function useContext<T>(
  key: InjectionKey<T> = Symbol(''),
  defaultValue?: any,
): shallowUnwrapRef<T> {
  return inject(key, defaultValue || {})
}
