<script setup lang="ts">
import { uniqBy } from 'lodash-es'
import { ElPagination, ElRadio, ElTable, ElTableColumn } from 'element-plus'
import type { XTableColumn, XTableInterface, XTablePager } from '../../types/table'
import RenderColumn from './column.vue'

const props = withDefaults(defineProps<{
  pagination?: Partial<typeof defaultSetting>
} & XTableInterface>(), {
  columns: () => [],
  tableData: () => [],
  loading: false,
  showPagination: false,
  pager: () => ({
    pageSize: 10,
    pageNum: 1,
  }),
  total: 0,
  excludeKey: '',
  align: 'left',
  showTooltip: true,
  defaultSelectedRows: () => [],
  rowsKey: 'id',
  tableHeight: '',
})

const emits = defineEmits<{
  (e: 'update:pager', pager: XTablePager): void
  (e: 'pagerChange', pager: XTablePager): void
  (e: 'update:defaultSelectedRows', rows: any[]): void
}>()

const slots = useSlots()

const defaultSetting = {
  layout: 'total, sizes, prev, pager, next, jumper',
  pageSizes: [10, 20, 50, 100],
  max: 5,
  small: true,
  disabled: false,
  autoHide: false,
  align: 'flex-end',
}

const tableRef = ref<typeof ElTable | null>(null)
const selectedRows = ref([...props.defaultSelectedRows ?? []])
const selectedRow = ref<string | number | undefined>('')

const paginationSetting = computed(() => {
  const config = Object.assign({}, defaultSetting, props.pagination)
  if (props.excludeKey) {
    config.layout = config.layout
      .split(',')
      .filter((key: string) => key.trim() !== props.excludeKey)
      .join(',')
  }
  return config
})

function getRowKey(): string {
  if (props.rowsKey)
    return props.rowsKey
  const col = props.columns.find(c =>
    ['radio', 'selection'].includes(c.type ?? ''),
  )
  return col?.rowKey ?? ''
}

const rowKey = computed(() => getRowKey())

const selectionType = computed(() => {
  const col = props.columns.find(c =>
    ['radio', 'selection'].includes(c.type ?? ''),
  )
  return col?.selectionType ?? null
})

function setTooltip(config?: Record<string, any>) {
  if (config && 'showTooltip' in config) {
    return config.showTooltip
  }
  return props.showTooltip ?? true
}

function setAlign(column: XTableColumn) {
  const { attrs, prop, type } = column
  if (prop) {
    const isSortOrAction = ['action', 'operate', 'index'].includes(prop)
    if (attrs && 'align' in attrs) {
      return attrs.align || (isSortOrAction && 'center')
    }
    else {
      const isSelection = type && ['radio', 'selection'].includes(type)
      return isSortOrAction || isSelection ? 'center' : props.align ?? 'left'
    }
  }
  else {
    return props.align ?? 'left'
  }
}

function onSizeChange(val: number) {
  const pagerConfig: XTablePager = { pageSize: val, pageNum: 1 }
  emits('update:pager', pagerConfig)
  emits('pagerChange', pagerConfig)
}

function onPageChange(val: number) {
  const pagerConfig: XTablePager = { pageSize: props.pager.pageSize, pageNum: val }
  emits('update:pager', pagerConfig)
  emits('pagerChange', pagerConfig)
}

function resetTable() {
  if (tableRef.value) {
    tableRef.value?.clearSelection()
    tableRef.value?.doLayout()
  }
}

function handleSelectionChange(_val: unknown, row?: Record<string, any>) {
  if (selectionType.value === 'multiple' && row) {
    const key = row[rowKey.value]
    const exists = selectedRows.value.some(item => item[rowKey.value] === key)

    selectedRows.value = exists
      ? selectedRows.value.filter(item => item[rowKey.value] !== key)
      : [...selectedRows.value, row]

    emits('update:defaultSelectedRows', selectedRows.value)
  }
  else {
    if (row)
      emits('update:defaultSelectedRows', [row])
  }
}

function handleSelectAll(selection: unknown[]) {
  if (
    selectionType.value === 'multiple'
  ) {
    selectedRows.value = selection.length === 0
      ? []
      : uniqBy([...selectedRows.value, ...props.tableData], rowKey.value)
    emits('update:defaultSelectedRows', selectedRows.value)
  }
}
function getCellFallback(row: Record<string, any>, column: XTableColumn, radioValue?: string | number) {
  // 内置 index 类型
  if (column.type === 'index') {
    return ((props.pager.pageNum - 1) * props.pager.pageSize + (row?.__index ?? 0) + 1).toString?.()
  }
  // ✅ 自定义 radio 类型
  if (column.type === 'radio') {
    if (!column.rowKey) {
      console.warn(`[XTable]: radio 类型的列必须设置 rowKey`)
      return null
    }
    return h(ElRadio, {
      'label': '',
      'modelValue': radioValue,
      'value': row[props.rowsKey],
      'onUpdate:modelValue': (val: any) => (selectedRow.value = val),
    })
  }

  if (column.formatter) {
    return column.formatter(row, row[column.prop!])
  }

  const val = column.prop ? row[column.prop] : ''
  return val?.toString?.() || '--'
}

function setDefaultSelection() {
  if (
    selectionType.value === 'multiple'
  ) {
    tableRef.value?.clearSelection()
    const selectionKeys = selectedRows.value.map(item => item[rowKey.value])
    props.tableData.forEach((row) => {
      if (selectionKeys.includes(row[rowKey.value])) {
        tableRef.value?.toggleRowSelection(row, true)
      }
    })
  }
  else if (selectionType.value === 'single') {
    selectedRow.value = props.defaultSelectedRows?.[0]?.[rowKey.value] ?? ''
  }
}

function resetSelection() {
  if (selectionType.value) {
    selectedRows.value = props.defaultSelectedRows ?? []
    nextTick(() => setDefaultSelection())
  }
}

setDefaultSelection()

onMounted(() => {
  console.log(slots)
})

defineExpose({
  resetSelection,
  resetTable,
})
</script>

<template>
  <div class="x-table">
    <div class="x-table-table">
      <ElTable
        ref="tableRef"
        v-loading="loading"
        :data="tableData"
        v-bind="$attrs"
        :height="tableHeight || undefined"
        @select="handleSelectionChange"
        @select-all="handleSelectAll"
      >
        <ElTableColumn
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :type="column.type || ''"
          :align="setAlign(column)"
          :show-overflow-tooltip="setTooltip(column.attrs)"
          v-bind="column.attrs"
        >
          <template #header="scope">
            <slot :name="`${column.prop}-header`" v-bind="scope">
              <RenderColumn
                :slot-fn="slots[`${column.prop}-header`]"
                :render-fn="column.renderHeader"
                :scope="{ column, $index: scope.$index }"
                :fallback-text="column.label"
              />
            </slot>
          </template>
          <template #default="scope">
            <slot :name="column.prop" v-bind="scope">
              <RenderColumn
                :slot-fn="column.prop ? slots[column.prop] : undefined"
                :render-fn="column.render"
                :scope="{ row: scope.row, column, $index: scope.$index }"
                :fallback-text="getCellFallback(scope.row, column, selectedRow)"
              />
            </slot>
          </template>
        </ElTableColumn>
        <template #empty>
          <slot name="empty">
            暂无内容
          </slot>
        </template>
      </ElTable>
    </div>

    <div
      v-if="showPagination && total > 0"
      class="x-table-pagination" :class="[paginationSetting.align]"
    >
      <slot name="footer-left" />
      <slot name="footer">
        <ElPagination
          :page-size="pager.pageSize"
          :current-page="pager.pageNum"
          :total="total"
          :small="paginationSetting.small"
          :pager-count="paginationSetting.max"
          :layout="paginationSetting.layout"
          :disabled="paginationSetting.disabled"
          :page-sizes="paginationSetting.pageSizes"
          :hide-on-single-page="paginationSetting.autoHide"
          @size-change="onSizeChange"
          @current-change="onPageChange"
        />
      </slot>
      <slot name="footer-right" />
    </div>
  </div>
</template>

<style lang="scss">
$SmallPaginationHeight: 28px;
$PrimaryColor: #0080ff;
.x-table {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  flex-direction: column;
  &-table {
    flex: 1;
    width: 100%;
    overflow: hidden;
    .el-table {
      width: 100%;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      &__body-wrapper {
        flex: 1;
      }
      th.el-table__cell.is-leaf,
      // td.el-table__cell {
      //   border-bottom: none !important;
      //   padding: 2px 0;
      // }
      // th.el-table__cell.is-leaf {
      //   padding: 2px 0;
      // }
      &__empty-block {
        width: 100% !important;
        overflow: hidden;
      }
      // .cell {
      //   line-height: 32px;
      // }
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background: #f5f7fa;
    }
    .el-table--group,
    .el-table--border {
      border: none !important;
      &::after {
        width: 0px;
      }
      .el-table__cell {
        border-right: 1px solid #dde0e6;
      }
    }
    .el-table__body {
      tr.hover-row > td.el-table__cell {
        background-color: #e2f5ff !important;
      }
    }
  }
  &-pagination {
    display: flex;
    align-items: center;
    margin: 20px auto;
    margin-bottom: 0px;
    width: 100%;
    .el-pagination {
      display: inline-flex;
      align-items: center;
      &__total {
        margin-right: 4px;
      }
      &__sizes {
        margin: 0;
      }
      &__jump {
        margin-left: 8px;
      }
      &__editor {
        height: 28px;
        width: 52px !important;
      }
      .btn-prev,
      .btn-next {
        background-color: transparent;
      }
    }
    .el-pager {
      display: inline-flex;
      align-items: center;
      li {
        margin: 0 2px !important;
        &:last-child {
          border-color: $PrimaryColor;
        }
      }
      .active {
        box-sizing: border-box;
        border: 1px solid $PrimaryColor;
        border-radius: 4px;
      }
    }
    .el-pagination--small {
      .el-pagination__jump {
        height: $SmallPaginationHeight;
        line-height: $SmallPaginationHeight;
        .el-input__inner {
          height: $SmallPaginationHeight !important;
          line-height: $SmallPaginationHeight !important;
          padding-right: 0;
          padding-left: 0;
        }
      }
      .el-pagination__sizes {
        height: $SmallPaginationHeight;
      }
    }
  }
}
.x-table-pagination {
  margin-top: 12px;
}
</style>
