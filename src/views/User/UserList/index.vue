<script setup lang="ts">
import XSearch from '~components/common/xSearch/index.vue'
import XTable from '~components/common/xTable/index.vue'
import TableAction from '~components/common/xTable/action.vue'
import type { XTableColumn } from '~components/types/table'
import type { SearchListInterface } from '~components/types/search'
import { useSearchTable } from '@/hooks/useSearchTable'

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
    options: [],
    asyncOptions: () => new Promise((resolve) => {
      resolve([
        {
          label: 'vue',
          value: 'vue',
        },
        {
          label: 'react',
          value: 'react',
        },
      ])
    }),
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
const mock = [
  { id: 1, name: '张三', age: 20 },
  { id: 2, name: '李四', age: 25 },
]

function getDemoData(index: number) {
  return mock.map((item) => {
    const { id, ...conf } = item
    return {
      id: id * index,
      ...conf,
    }
  })
}

async function getData(params: Record<string, any>): Promise<{
  data: Record<string, any>[]
  total?: number
}> {
  console.log(params)
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: getDemoData(params.pageNum),
        total: 100,
      })
    }, 2000)
  })
}

const col: XTableColumn[] = [
  { type: 'radio', label: '选择', rowKey: 'id', attrs: {
    width: 60,
  } }, // radio 列
  { type: 'index', label: '序号', attrs: {
    width: 100,
  } },
  { prop: 'name', label: '姓名', render: scope => h(ElButton, {
    type: 'primary',
  }, {
    default: () => `${scope.row.name}render`,
  }) },
  { prop: 'age', label: '年龄' },
  {
    prop: 'action',
    label: '操作',
    attrs: {
      width: 210,
    },
  },
]

const {
  columns,
  tableData,
  pager,
  showPagination,
  loading,
  total,
  tableInstance,
  searchList,
  SearchInstance,
  onSearch,
} = useSearchTable(listSearchFields, col, getData)
</script>

<template>
  <div class="flex flex-col w-[100%] h-[100%] items-center">
    <XSearch ref="SearchInstance" :list="searchList" :col="3" @search="onSearch" @reset="onSearch">
      <template #prizeName>
        <ElTag>slot element</ElTag>
      </template>
    </XSearch>
    <XTable
      ref="tableInstance"
      v-model:pager="pager"
      :total="total"
      :columns="columns"
      :table-data="tableData"
      :loading="loading"
      :show-pagination="showPagination"
      class="flex-1 w-[100%]"
    >
      <template #age="scope">
        <div>{{ scope.row.age }}</div>
        <ElTag>{{ 1 + 1 }}</ElTag>
      </template>
      <template #action>
        <TableAction :boundary="3" align="center" trigger="click">
          <ElButton type="primary" link>
            编辑
          </ElButton>
          <ElButton type="success" link>
            查看
          </ElButton>

          <!-- 有权限控制 -->
          <ElButton v-auth="'btn:delete'" type="danger" link>
            删除
          </ElButton>
          <ElButton v-auth:disabled="'btn:export'" type="warning" link>
            导出
          </ElButton>
          <ElButton v-auth:show="'btn:print'" type="info" link>
            打印
          </ElButton>
        </TableAction>
      </template>
    </XTable>
  </div>
</template>
