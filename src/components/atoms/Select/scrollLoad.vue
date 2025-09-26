<script setup lang="ts">
import { ElSelect } from 'element-plus'
import { debounce } from 'lodash-es'

interface Props {
  modelValue: string | Array<string | number> | null
  fetch: (query: string, pager: { pageSize: number, pageNum: number }) => Promise<{
    total: number
    rows: Record<string, any>[]
  }>
  defaultOptions?: {
    label: string
    value: string
    [x: string]: any
  }[]
  labelKey?: string
  valueKey?: string
  deptKey?: string
  placeholder?: string
  multiple?: boolean
  showTags?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  labelKey: 'label',
  valueKey: 'value',
  placeholder: '请选择',
  multiple: false,
  showTags: true,
  deptKey: 'ancestorNames',
  defaultOptions: () => [],
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | Array<string | number>): void
  (e: 'change', v: string | Array<string | number>): void
}>()

const options = ref<Record<string, any>[]>(props.defaultOptions)
const loading = ref(false)
const loadingMore = ref(false)
const pager = reactive<{
  pageSize: number
  pageNum: number
}>({
  pageSize: 10,
  pageNum: 1,
})
const queryText = ref('')
const count = ref(0)

const value = computed({
  get() {
    return props.modelValue
  },
  set(val: string | Array<string | number>) {
    emit('update:modelValue', val)
  },
})

function createDebouncedSearch(fetchFn: (query: string, pager: { pageSize: number, pageNum: number }) => Promise<any>, delay = 300) {
  async function search(query: string) {
    queryText.value = query
    pager.pageNum = 1
    loading.value = true
    try {
      const { total, rows } = await fetchFn(query, unref(pager))
      count.value = total
      options.value = rows as Record<string, any>[]
    }
    finally {
      loading.value = false
    }
  }
  return debounce(search, delay)
}

const onSearch = createDebouncedSearch(props.fetch, 200)

const selectRef = ref<InstanceType<typeof ElSelect> | null>(null)
const scrollElement = ref<HTMLElement | null>(null)

// 下拉展开时，初始加载
async function onDropdownVisible(visible: boolean) {
  if (visible && options.value.length === 0) {
    await nextTick()
    bindScroll()
  }
  else {
    loadingMore.value = false
  }
}

// 绑定当前组件的下拉面板滚动事件
function bindScroll() {
  unbindScroll()

  if (selectRef.value?.wrapperRef) {
    // 在当前组件的下拉面板内查找滚动容器
    scrollElement.value = selectRef.value.wrapperRef
    if (scrollElement.value) {
      scrollElement.value.addEventListener('scroll', handleScroll, { passive: true })
    }
  }
}

// 清除当前组件的滚动事件
function unbindScroll() {
  if (scrollElement.value) {
    scrollElement.value.removeEventListener('scroll', handleScroll)
    scrollElement.value = null
  }
}

// 滚动加载更多
async function handleScroll(e: Event) {
  const target = e.target as HTMLElement
  if (!target)
    return
  const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 30
  if (nearBottom && !loadingMore.value && (pager.pageNum * pager.pageSize) < count.value) {
    loadingMore.value = true
    pager.pageNum += 1
    const { total, rows } = await props.fetch(queryText.value, unref(pager))
    count.value = total
    if (rows.length) {
      options.value.push(...rows as Record<string, any>[])
    }
    setTimeout(() => {
      loadingMore.value = false
    }, 500)
  }
}
</script>

<template>
  <ElSelect
    ref="selectRef"
    v-model="value"
    filterable
    remote
    clearable
    :remote-method="onSearch"
    :loading="loading"
    :multiple="multiple"
    :collapse-tags="multiple && showTags"
    :collapse-tags-tooltip="multiple && showTags"
    :max-collapse-tags="3"
    :placeholder="placeholder"
    :reserve-keyword="false"
    remote-show-suffix
    popper-class="remote-select-popper"
    @change="(val) => emit('change', val)"
    @visible-change="onDropdownVisible"
  >
    <ElOption
      v-for="item in options"
      :key="item[valueKey]"
      :label="item[labelKey]"
      :value="item[valueKey]"
      style="maxWidth: 480px;"
    >
      <div class="flex items-center justify-between">
        <div class="mr-[12px]">
          {{ item[labelKey] }}
        </div>
        <div class="flex-1 text-[#999] truncate">
          {{ item[deptKey] || '' }}
        </div>
      </div>
    </ElOption>
    <template v-if="loadingMore">
      <div class="loading-more">
        加载中...
      </div>
    </template>
  </ElSelect>
</template>

<style scoped>
.loading-more {
  padding: 6px;
  text-align: center;
  color: #999;
  font-size: 13px;
}
</style>
