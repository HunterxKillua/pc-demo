<script setup lang="ts">
import { debounce } from 'lodash-es'

interface Props {
  modelValue: string | Array<string | number> | null
  fetch: (query: string, pager: { pageSize: number, pageNum: number }) => Promise<Record<string, any>[]>
  labelKey?: string
  valueKey?: string
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
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | Array<string | number>): void
  (e: 'change', v: string | Array<string | number>): void
}>()

const options = ref<Record<string, any>[]>([])
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

const value = computed({
  get() {
    return props.modelValue
  },
  set(val: string | Array<string | number>) {
    emit('update:modelValue', val)
  },
})

function createDebouncedSearch(fetchFn: (query: string, pager: any) => Promise<unknown[]>, delay = 300) {
  async function search(query: string) {
    queryText.value = query
    pager.pageNum = 1
    loading.value = true
    try {
      const res = await fetchFn(query, unref(pager))
      options.value = res as Record<string, any>[]
    }
    finally {
      loading.value = false
    }
  }
  return debounce(search, delay)
}

const onSearch = createDebouncedSearch(props.fetch, 200)

// 下拉展开时，初始加载
async function onDropdownVisible(visible: boolean) {
  if (visible && options.value.length === 0) {
    await onSearch('')
    await nextTick()
    bindScroll()
  }
}

// 绑定下拉面板滚动事件
function bindScroll() {
  const popper = document.querySelector('.remote-select-popper .el-scrollbar__wrap')
  if (popper) {
    popper.removeEventListener('scroll', handleScroll)
    popper.addEventListener('scroll', handleScroll, { passive: true })
  }
}

// 滚动加载更多
async function handleScroll(e: Event) {
  const target = e.target as HTMLElement
  if (!target)
    return
  const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 20
  if (nearBottom && !loadingMore.value) {
    loadingMore.value = true
    pager.pageNum += 1
    try {
      const res = await props.fetch(queryText.value, unref(pager))
      if (res.length) {
        options.value.push(...res as Record<string, any>[])
      }
    }
    finally {
      loadingMore.value = false
    }
  }
}
</script>

<template>
  <ElSelect
    v-model="value"
    filterable
    remote
    clearable
    :remote-method="onSearch"
    :loading="loading"
    :multiple="multiple"
    :collapse-tags="multiple && showTags"
    :collapse-tags-tooltip="multiple && showTags"
    :placeholder="placeholder"
    popper-class="remote-select-popper"
    @visible-change="onDropdownVisible"
  >
    <ElOption
      v-for="item in options"
      :key="item[valueKey]"
      :label="item[labelKey]"
      :value="item[valueKey]"
    />
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
