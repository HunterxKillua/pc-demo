const root: HTMLElement = document.documentElement
const cache = new Map()

export enum ElPlusThemeWeights {
  ZeroPointTwo = 0.2,
  ZeroPointThree = 0.3,
  ZeroPointFive = 0.5,
  ZeroPointSeven = 0.7,
  ZeroPointEight = 0.8,
  ZeroPointNine = 0.9,
}

export type ElPlusThemes = 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type OptionTheme = {
  [key in ElPlusThemes]?: string
}

export interface ThemeProperty {
  key: string
  value: string
  dom?: HTMLElement
}

export function setColors(options: ThemeProperty | ThemeProperty[]) {
  if (Array.isArray(options))
    options.forEach(option => setColor(option))
  else setColor(options)
}

export function getColor(key: string, dom = root) {
  return getComputedStyle(dom).getPropertyValue(key) || ''
}

export function setColor(options: ThemeProperty) {
  const { key, value, dom = root } = options
  dom.style.setProperty(key, value)
}

export function setTheme(options: OptionTheme) {
  const { primary, success, info, warning, danger } = options
  const vars = {}
  if (primary)
    Object.assign(vars, createCssVars('primary', primary), { '--el-color-primary': primary })
  if (success)
    Object.assign(vars, createCssVars('success', success), { '--el-color-success': success })
  if (info)
    Object.assign(vars, createCssVars('info', info), { '--el-color-info': info })
  if (warning)
    Object.assign(vars, createCssVars('warning', warning), { '--el-color-warning': warning })
  if (danger)
    Object.assign(vars, createCssVars('danger', danger), { '--el-color-danger': danger })
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value as string)
  })
}

export function createCssVars(theme: ElPlusThemes, value: string) {
  const validColor = /^#(?:[0-9a-f]{3}){1,2}$/i.test(value)
  if (!validColor)
    throw new Error('Invalid color value')
  const lightWeight = [3, 5, 7, 8, 9]
  const darkWeight = [2]
  const cacheKey = JSON.stringify({ [theme]: value })
  if (cache.get(cacheKey))
    return cache.get(cacheKey)
  const result: Record<string, string> = {}
  lightWeight.forEach((weight) => {
    const key = `--el-color-${theme}-light-${weight}`
    result[key] = mixColor(value, weight / 10)
  })
  darkWeight.forEach((weight) => {
    const key = `--el-color-${theme}-dark-${weight}`
    result[key] = mixColor(value, weight / 10, 'dark')
  })
  cache.set(cacheKey, result)
  return result
}

export function mixColor(
  themeColor: string,
  weight: ElPlusThemeWeights,
  theme: 'dark' | 'light' = 'light',
) {
  let mergeColor
  if (theme === 'dark')
    mergeColor = '#000000'
  else mergeColor = '#ffffff'

  weight = Math.max(Math.min(Number(weight), 1), 0)
  const r1 = Number.parseInt(themeColor.substring(1, 3), 16)
  const g1 = Number.parseInt(themeColor.substring(3, 5), 16)
  const b1 = Number.parseInt(themeColor.substring(5, 7), 16)
  const r2 = Number.parseInt(mergeColor.substring(1, 3), 16)
  const g2 = Number.parseInt(mergeColor.substring(3, 5), 16)
  const b2 = Number.parseInt(mergeColor.substring(5, 7), 16)
  const r = Math.round(r1 * (1 - weight) + r2 * weight)
  const g = Math.round(g1 * (1 - weight) + g2 * weight)
  const b = Math.round(b1 * (1 - weight) + b2 * weight)
  const _r = `0${(r || 0).toString(16)}`.slice(-2)
  const _g = `0${(g || 0).toString(16)}`.slice(-2)
  const _b = `0${(b || 0).toString(16)}`.slice(-2)
  return `#${_r}${_g}${_b}`
}
