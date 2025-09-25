<script lang="ts" setup>
import { userForm } from '../form'
import XForm from '~components/common/xForm/index.vue'
import LoadSelect from '~components/atoms/Select/scrollLoad.vue'
import SelectUser from '~components/atoms/Select/user.vue'

async function fetchUsers(query: string, pager: {
  pageSize: number
  pageNum: number
}): Promise<{ [x: string]: any, label: string, value: string }[]> {
  await new Promise(r => setTimeout(r, 500)) // 模拟延迟
  return Array.from({ length: 10 }).map((_, i) => ({
    label: `${query || '用户'}-${pager.pageNum}-${i}`,
    value: `${pager.pageNum}-${i}`,
  }))
}
const ButtonRef = ref<typeof ElButton | null>(null)
const { mount, unMount } = usePopup()

const recorderId = ref<string>('')
const hostId = ref<string>('')
const attendeeIds = ref<{
  label: string
  value: string
}[]>([
  {
    label: '1111',
    value: '2222',
  },
  {
    label: '1111',
    value: '3333',
  },
])
function onChoose() {
  mount(() => import('@/components/atoms/Dialog/index.vue'), {
    modelValue: true,
    title: '弹窗',
    autoLoading: true,
    onConfirm: () => {
      console.log('dialog confirm')
    },
    onCancel: () => {
      unMount()
    },
  }, {
    default: () => h(ElButton, {
      type: 'primary',
      ref: ButtonRef,
      onClick: () => {
        console.log('click')
      },
    }, {
      default: () => h('span', 'slot 透传'),
    }),
  })
}
function onBatchChoose() {
  console.log('onBatchChoose')
}
function onGroupChoose() {
  console.log('onGroupChoose')
}

const { formFields, FormInstance } = useForm(userForm, async (data) => {
  console.log(data)
})
</script>

<template>
  <XForm
    ref="FormInstance"
    :form-fields="formFields"
    align="right"
    label-width="120"
  >
    <template #attendeeIds>
      <SelectUser
        v-model="attendeeIds"
        style="width: 100%;"
        @choose="onChoose"
        @batch-click="onBatchChoose"
        @select-group="onGroupChoose"
      />
    </template>
    <template #hostId="{ updateKey }">
      <LoadSelect
        v-model="hostId"
        :fetch="fetchUsers"
        placeholder="搜索用户"
        style="width: 320px"
        @change="updateKey"
      />
    </template>
    <template #recorderId="{ updateKey }">
      <LoadSelect
        v-model="recorderId"
        :fetch="fetchUsers"
        placeholder="搜索用户"
        style="width: 320px"
        @change="updateKey"
      />
    </template>
  </XForm>
</template>
