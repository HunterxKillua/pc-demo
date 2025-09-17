<script setup lang="tsx">
import XSearch from '~components/common/xSearch/index.vue'
import type { SearchListInterface } from '~components/types/search'

const listSearchFields: SearchListInterface[] = [
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
    marginRight: 24,
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
]

defineRender(() => {
  return (
    <div>
      <XSearch list={listSearchFields} />
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
