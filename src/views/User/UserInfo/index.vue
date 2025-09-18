<script setup lang="tsx">
import XSearch from '~components/common/xSearch/index.vue'
import XTable from '~components/common/xTable/index.vue'
import type { XTableColumn } from '~components/types/table'
import type { SearchListInterface } from '~components/types/search'

const listSearchFields = ref<SearchListInterface[]>([
  {
    key: 'prizeName',
    label: '活动商品名称',
    type: 'input',
    labelWidth: 100,
  },
  {
    key: 'prizeChannel',
    label: '渠道',
    type: 'select',
    options: [],
    attrs: {
      clearable: true,
    },
  },
  {
    key: 'isLinkActivity',
    label: '是否关联活动',
    type: 'select',
    labelWidth: 100,
    options: [
      {
        label: '是',
        value: true,
      },
      {
        label: '否',
        value: false,
      },
    ],
    attrs: {
      placeholder: '是否关联活动',
      clearable: true,
    },
  },
  {
    key: 'prizeStatus',
    label: '状态',
    type: 'select',
    options: [
      {
        label: '已上架',
        value: 'AVAILABLE',
      },
      {
        label: '已下架',
        value: 'REMOVED',
      },
    ],
  },
])

const columns = ref<XTableColumn[]>([
  { type: 'radio', label: '选择', rowKey: 'id' }, // radio 列
  { prop: 'name', label: '姓名', render: scope => h(ElButton, {
    type: 'primary',
  }, {
    default: () => `${scope.row.name}render`,
  }) },
  { prop: 'age', label: '年龄', formatter(row) {
    return row.age?.toString()
  } },
])

const tableData = ref<Record<string, any>[]>([
  { id: 1, name: '张三', age: 20 },
  { id: 2, name: '李四', age: 25 },
])

function handleSearch(conf: Record<string, any>) {
  console.log(conf)
}

defineRender(() => {
  return (
    <div>
      <XSearch list={listSearchFields.value} col={3} onSearch={handleSearch} />
      <XTable columns={columns.value} tableData={tableData.value}>
      </XTable>
    </div>
  )
})
onMounted(() => {
  console.log('1111')
})
onActivated(() => {
  console.log('trigger cache alive1')
})
</script>
