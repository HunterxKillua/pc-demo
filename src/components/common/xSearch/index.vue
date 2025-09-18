<script setup lang="ts">
import { ElCascader, ElCheckboxGroup, ElDatePicker, ElInput, ElRadioGroup, ElSelect, ElTreeSelect } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import type { SearchCompType, SearchListInterface, XSearchInterface } from '../../types/search'

defineOptions({
  name: 'XSearch',
})

const props = withDefaults(defineProps<XSearchInterface>(), {
  list: () => [],
  col: 4,
  hasSearch: true,
  hasReset: true,
  hasLabel: true,
  hasExpansion: true,
  defaultExpansion: true,
  showColon: false,
  disableTrim: true,
  labelWidth: 80,
})
const emits = defineEmits<
  {
    change: [value: Record<string, any>]
    resetOptions: [value: Record<string, any>]
    search: [value: Record<string, any>]
    reset: [value: Record<string, any>]
    expansion: [value: boolean]
  }
>()
const slots = useSlots()
const defaultDateRangeProps = {
  type: 'daterange',
  rangeSeparator: '至',
  startPlaceholder: '开始日期',
  endPlaceholder: '结束日期',
  valueFormat: 'yyyy-MM-dd',
  format: 'yyyy-MM-dd',
}
const defaultDatetimeRangeProps = {
  type: 'datetimerange',
  rangeSeparator: '至',
  startPlaceholder: '开始日期',
  endPlaceholder: '结束日期',
  valueFormat: 'yyyy-MM-dd HH:mm:ss',
  format: 'yyyy-MM-dd HH:mm:ss',
  defaultTime: ['00:00:00', '23:59:59'],
}

const visibleFields = ref<SearchListInterface[]>([])
const searchObj = ref<Record<string, any>>({})
const expansion = ref<boolean>(props.defaultExpansion)

const getFiledWidth = computed(() => {
  return function (type: SearchCompType, index: number) {
    const dateTypeList = visibleFields.value.filter(item => item.type?.includes?.('date'))
    if (dateTypeList.length > 1) {
      return type?.includes?.('date') ? `${200 / props.col}%` : `${100 / props.col}%`
    }
    else if (expansion.value && index === visibleFields.value.length - 2 && visibleFields.value.length % props.col === 0) {
      return `${200 / props.col}%`
    }
    else {
      return type?.includes?.('date') ? `${150 / props.col}%` : `${100 / props.col}%`
    }
  }
})
function updateRenderList() {
  // 将datePicker类型自动排序在后
  const sortedData = props.list
    .filter(item => !item.hidden)
    .map(item => item)
    .sort((a, b) => {
      if (a.type.includes('date') && !b.type.includes('date')) {
        return 1
      }
      if (b.type.includes('date') && !a.type.includes('date')) {
        return -1
      }
      return 0
    })
  const res = expansion.value
    ? sortedData
    : sortedData.slice(0, props.hasExpansion ? props.col - 1 : props.col)
  visibleFields.value = res.map((item) => {
    if (item.type === 'daterange') {
      if (item.attrs) {
        item.attrs = Object.assign({}, item.attrs, defaultDateRangeProps)
      }
      else {
        item.attrs = defaultDateRangeProps
      }
    }
    if (item.type === 'datetimerange') {
      if (item.attrs) {
        item.attrs = Object.assign(
          {},
          item.attrs,
          defaultDatetimeRangeProps,
        )
      }
      else {
        item.attrs = defaultDatetimeRangeProps
      }
    }
    if (item.attrs && !item.key) {
      return {
        ...item,
        key: item.key,
      }
    }
    else {
      return item
    }
  })
}

function setDefaultValue(field: SearchListInterface) {
  if (field.type) {
    if (
      field.type.includes('checkbox')
      || field.type.includes('range')
      || (['select', 'treeselect'].includes(field.type) && field?.attrs?.multiple)
    ) {
      return field.defaultValue || []
    }
    else if (typeof field.defaultValue === 'boolean') {
      return field.defaultValue
    }
    else {
      return field.defaultValue || ''
    }
  }
  else {
    return field.defaultValue || ''
  }
}

function init() {
  const obj: Record<string, any> = {}
  props.list.forEach((item) => {
    obj[item.key as string] = setDefaultValue(item)
  })
  searchObj.value = Object.assign({}, cloneDeep(searchObj.value), obj)
  return cloneDeep(searchObj.value)
}

function getComponentType(type: SearchCompType) {
  const componentMap = {
    input: ElInput,
    select: ElSelect,
    date: ElDatePicker,
    checkbox: ElCheckboxGroup,
    radio: ElRadioGroup,
    datetimerange: ElDatePicker,
    daterange: ElDatePicker,
    cascader: ElCascader,
    treeselect: ElTreeSelect,
  }
  return componentMap[type] || ElInput
}
function getPlaceholder(field: SearchListInterface) {
  if (field?.attrs?.placeholder) {
    return field.attrs.placeholder
  }
  switch (field.type) {
    case 'input':
      return `请输入${field.label}`
    case 'select':
      return `请选择${field.label}`
    case 'radio':
      return `请选择${field.label}`
    case 'checkbox':
      return `请选择${field.label}`
    case 'cascader':
    case 'treeselect':
      return `请选择${field.label}`
    default:
      return field.label
  }
}
function getEventHandlers(item: SearchListInterface) {
  const { events, options } = item
  const change = (val: number | string | unknown[] | boolean) => {
    if (item?.linkProps?.linkKey) {
      if (item?.linkProps?.linkType === 'reset') {
        const conf = props.list.find(ele => ele.key === item?.linkProps?.linkKey)
        const defaultValue = setDefaultValue(conf as SearchListInterface)
        const filterOptions = cloneDeep(options) || []
        emits('resetOptions', {
          val,
          selectOptions: filterOptions.filter((ele: Record<string, any>) => ele.value === val),
          key: item.linkProps.linkKey,
        })
        searchObj.value[item.linkProps.linkKey] = defaultValue
      }
    }
    const value = !props.disableTrim && typeof val === 'string' ? val.trim() : val
    nextTick(() => {
      emits('change', {
        key: item.key,
        value,
        target: unref(searchObj.value),
      })
    })
  }
  return Object.assign(
    {},
    {
      change,
    },
    events,
  )
}
function checkSearchRequired(result: Record<string, any>, showWarn: boolean = true) {
  const requiredList = visibleFields.value.filter(item => item.required)
  let status = true
  for (const item of requiredList) {
    if (!result[item.key as string]) {
      status = false
      if (showWarn) {
        ElMessage({
          type: 'error',
          message: item?.attrs?.placeholder || `${item.label}为必填参数`,
        })
      }
      break
    }
  }
  return status
}
function dealKeys(obj: Record<string, any>) {
  const result: Record<string, any> = {}
  Object.keys(obj).forEach((key) => {
    const field = props.list.find(item => item.key === key)
    // 默认去掉首尾空格，除非 `disableTrim` 为 true
    if (field && !field.disableTrim && typeof obj[key] === 'string') {
      obj[key] = obj[key].trim()
    }
    // key名为'start,end'这种，且值为数组时
    const keyArr = key.split(',')
    if (keyArr.length === 2) {
      result[keyArr[0]] = obj[key]?.[0] || ''
      result[keyArr[1]] = obj[key]?.[1] || ''
    }
    else {
      result[key] = obj[key]
    }
  })
  return result
}
function handleSearch() {
  const result = dealKeys(searchObj.value)
  const status = checkSearchRequired(result)
  if (status) {
    emits('search', result)
  }
}
function handleReset() {
  const obj = init()
  emits('reset', dealKeys(obj))
}
function toggleExpansion() {
  expansion.value = !expansion.value
  emits('expansion', expansion.value)
  nextTick(() => {
    updateRenderList()
  })
}
// 作用域插槽同步方法
function onSlotChange(key: string, value: unknown) {
  const field = props.list.find(item => item.key === key)
  let newValue = value

  // 判断是否为字符串并根据 `disableTrim` 配置去除首尾空格
  if (field && typeof newValue === 'string' && !field.disableTrim) {
    newValue = newValue.trim()
  }
  const keyArr = key.split(',')
  if (keyArr.length === 2) {
    searchObj.value[key] = newValue && (newValue as string).split(',')
  }
  else {
    searchObj.value[key] = newValue
  }
}
function exposeData() {
  return dealKeys(searchObj.value)
}
function setExtraData(key: string, val: unknown) {
  searchObj.value[key] = val
}
function hasSlot(name: string) {
  return !!slots[name]
}

updateRenderList()
init()

defineExpose({
  updateRenderList,
  exposeData,
  setExtraData,
})
</script>

<template>
  <div class="x-search">
    <div
      v-for="(item, index) of visibleFields"
      :key="item.key"
      class="search-item"
      :style="{
        width: getFiledWidth(item.type, index),
        marginRight: item.marginRight ? `${item.marginRight}px` : '0',
      }"
    >
      <span
        v-if="hasLabel && item.label"
        class="search-item-label" :class="[
          item.required ? 'search-item-label-required' : '',
        ]"
        :style="{ width: `${item.labelWidth || labelWidth}px` }"
      >
        {{ item.label }}
      </span>
      <div class="search-item-content">
        <template v-if="hasSlot(item.slotName || item.key as string)">
          <slot
            :name="item.slotName || item.key"
            :row="item"
            :value="searchObj[item.key as string]"
            :update-key="(val: unknown) => onSlotChange(item.key as string, val)"
          />
        </template>
        <template v-else>
          <component
            :is="getComponentType(item.type)"
            v-model="searchObj[item.key as string]"
            :placeholder="getPlaceholder(item)"
            v-bind="item.attrs"
            style="width: 100%"
            :collapse-tags="item.attrs && item.attrs.multiple"
            v-on="getEventHandlers(item)"
          >
            <template v-if="item.type === 'select'">
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </template>
            <template v-else-if="item.type && item.type.includes('checkbox')">
              <el-checkbox
                v-for="option in item.options"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-checkbox>
            </template>
            <template v-else-if="item.type && item.type.includes('radio')">
              <el-radio
                v-for="option in item.options"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-radio>
            </template>
          </component>
        </template>
      </div>
    </div>
    <div
      class="x-search-btns" :class="[
        expansion ? 'x-search-btns-left' : 'x-search-btns-right',
      ]"
      :style="{ marginLeft: `${labelWidth / 2}px` }"
    >
      <slot name="button" />
      <slot name="fixedRight">
        <ElButton
          v-if="hasReset"
          class="search-btn "
          @click="handleReset"
        >
          重置
        </ElButton>
        <ElButton
          v-if="hasSearch"
          type="primary"
          class="search-btn"
          @click="handleSearch"
        >
          查询
        </ElButton>
        <span
          v-if="list.length > col && hasExpansion"
          class="search-btn expansion"
          @click="toggleExpansion"
        >
          {{ expansion ? "收起" : "展开" }}
        </span>
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.x-search {
  padding: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}
.search-item {
  // height: 32px;
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  margin-bottom: 20px;
  min-height:32px;
}
.search-item-label {
  text-align: right;
  padding-right: 16px;
  font-size: 14px;
  &-required {
    position: relative;
    &::before {
      position: absolute;
      content: "*";
      left: 0;
      top: 0;
      color: #f56c6c;
    }
  }
}
.search-item-content {
  flex: 1;
  margin-right: 16px;
}
.col-item-hidden {
  display: none;
}
.x-search-btns {
  display: flex;
  align-items: center;
  text-align: right;
  margin-bottom: 20px;
  &-left {
    justify-content: flex-start;
  }
  &-right {
    justify-content: flex-end;
  }
}
.search-btn {
  vertical-align: top;
}
.expansion {
  margin-left: 14px;
  cursor: pointer;
  color: #0099ff;
  font-size:14px;

}
</style>
