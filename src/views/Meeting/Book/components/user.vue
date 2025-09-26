<script lang="ts" setup>
import { userForm } from '../form'
import PopupSelect from './popupSelect.vue'
import XForm from '~components/common/xForm/index.vue'
import LoadSelect from '~components/atoms/Select/scrollLoad.vue'
import SelectUser from '~components/atoms/Select/user.vue'
import { getMeetingUser } from '@/api'

async function fetchUsers(query: string, pager: {
  pageSize: number
  pageNum: number
}): Promise<{
    total: number
    rows: Record<string, any>[]
  }> {
  const { data, error } = await getMeetingUser({
    nickName: query,
    ...pager,
  })
  if (!error) {
    if (data) {
      const { total, rows } = data
      return {
        total,
        rows: rows.map((item) => {
          const { nickName, userId, ...conf } = item
          return {
            label: nickName,
            value: userId.toString(),
            ...conf,
          }
        }),
      }
    }
  }
  return {
    total: 100,
    rows: Array.from({ length: 10 }, (_, index) => {
      return {
        label: `测试字段${pager.pageNum}${index}`,
        value: pager.pageNum + index,
      }
    }),
  }
}

const { mount, unMount } = usePopup()
const SelectRef = ref<typeof PopupSelect | null>(null)
const recorderId = ref<string>('')
const hostId = ref<string>('')
const attendeeIds = ref<{
  label: string
  value: string
}[]>([])
function onChoose() {
  mount(() => import('@/components/atoms/Dialog/index.vue'), {
    title: '选择会议人员',
    modelValue: true,
    width: '480',
    top: '20vh',
    onCancel: () => {
      unMount()
    },
    onConfirm: () => {
      if (SelectRef.value) {
        const { recorder, host, attender } = SelectRef.value
        recorderId.value = unref(recorder)
        hostId.value = unref(host)
        attender.value = unref(attender)
      }
      unMount()
    },
  }, {
    default: () => h(PopupSelect, {
      ref: SelectRef,
      recorderId: recorderId.value,
      hostId: hostId.value,
      attendeeIds: attendeeIds.value as unknown as string[],
    }),
  })
}
function onBatchChoose() {
  console.log('onBatchChoose')
}
function onGroupChoose() {
  console.log('onGroupChoose')
}

const { formFields, FormInstance } = useForm(userForm)
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
