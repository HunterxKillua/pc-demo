/** 混入颜色透明度 */
/**
 *
 * @param color #000 ｜ #000000
 * @param opacity 0～1
 * @returns rgba-color []
 */
export function convertRgbaColor(color: string, opacity: number | number[], theme: 'dark' | 'light' = 'light'): string[] {
  const hexColorRegex = /^#(?:[A-F0-9]{3}){1,2}$/i
  if (!hexColorRegex.test(color)) {
    console.error('Invalid color format. Please use \'#RGB\' or \'#RRGGBB\'.')
    return []
  }

  // 如果颜色值是 "#RGB" 格式，则将其转换为 "#RRGGBB" 格式
  if (color.length === 4) {
    color = color.replace(/^#(.)(.)(.)$/, '#$1$1$2$2$3$3')
  }
  if (Array.isArray(opacity)) {
    return opacity.map((o) => {
      // 确保透明度值在有效范围 [0, 1] 内
      return convertRgba(hydrateColor(color, o, theme), o)
    })
  }
  else {
    return [convertRgba(hydrateColor(color, opacity, theme), opacity)]
  }
}

function hydrateColor(color: string, opacity: number, theme: 'dark' | 'light' = 'light'): string {
  let mergeColor
  if (theme === 'dark') {
    mergeColor = '#000000'
  }
  else {
    mergeColor = '#ffffff'
  };
  const weight = Math.max(Math.min(Number(opacity), 1), 0)
  const r1 = Number.parseInt(color.substring(1, 3), 16)
  const g1 = Number.parseInt(color.substring(3, 5), 16)
  const b1 = Number.parseInt(color.substring(5, 7), 16)
  const r2 = Number.parseInt(mergeColor.substring(1, 3), 16)
  const g2 = Number.parseInt(mergeColor.substring(3, 5), 16)
  const b2 = Number.parseInt(mergeColor.substring(5, 7), 16)
  const r = Math.round(r1 * (1 - weight) + r2 * weight)
  const g = Math.round(g1 * (1 - weight) + g2 * weight)
  const b = Math.round(b1 * (1 - weight) + b2 * weight)
  const _r = (`0${(r || 0).toString(16)}`).slice(-2)
  const _g = (`0${(g || 0).toString(16)}`).slice(-2)
  const _b = (`0${(b || 0).toString(16)}`).slice(-2)
  return `#${_r}${_g}${_b}`
}
/**
 * @description 16进制转rgba
 */
function convertRgba(color: string, opacity: number) {
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

function gamma(value: number) {
  value = value / 255
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}
/**
 * @description 获取颜色亮度
 */
export function rgbToLum(color: string) {
  let r = Number.parseInt(color.slice(1, 3), 16)
  let g = Number.parseInt(color.slice(3, 5), 16)
  let b = Number.parseInt(color.slice(5, 7), 16)

  r = gamma(r)
  g = gamma(g)
  b = gamma(b)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
