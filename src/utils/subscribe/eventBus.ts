import mitt from 'mitt'

/**
 * 索引为事件名
 * 参数类型为回调方法的入参数类型
 */
export interface EventBus {
  logout: void
  login: void
  [x: string | symbol]: any
}

const emitter = mitt<EventBus>()

export function addEventListener<K extends keyof EventBus>(
  evtName: K,
  callback: (payload: EventBus[K]) => void,
) {
  return emitter.on(evtName, callback)
}

export function emitEvent<K extends keyof EventBus>(evtName: K, payload?: EventBus[K]) {
  return emitter.emit(evtName, payload)
}

export function offEvent(evtName: keyof EventBus, handler?: () => void) {
  return emitter.off(evtName, handler)
}

export function offEvents(list: Array<keyof EventBus>) {
  list.forEach(eventName => offEvent(eventName))
}

export const clearEvent = () => emitter.all.clear()

export default emitter
