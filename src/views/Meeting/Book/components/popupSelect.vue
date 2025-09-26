<script lang="ts" setup>
import { userForm } from '../form'
import XForm from '~components/common/xForm/index.vue'
import LoadSelect from '~components/atoms/Select/scrollLoad.vue'
import { getMeetingUser } from '@/api'

const props = withDefaults(defineProps<{
  recorderId: string
  hostId: string
  attendeeIds: string[]
}>(), {
  recorderId: '',
  hostId: '',
  attendeeIds: () => [],
})

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
    total: 0,
    rows: [],
  }
}

const forms = userForm.filter(item => item.prop !== 'cc').map((item) => {
  return {
    ...item,
    required: false,
  }
})
const { formFields } = useForm(forms)

const recorder = ref<string>(props.recorderId)
const host = ref<string>(props.hostId)
const attender = ref<string[]>(props.attendeeIds)

defineExpose({
  recorder,
  host,
  attender,
})
</script>

<template>
  <XForm
    :form-fields="formFields"
    align="right"
    label-width="54"
  >
    <template #attendeeIds="{ updateKey }">
      <LoadSelect
        v-model="attender"
        :fetch="fetchUsers"
        placeholder="搜索用户"
        style="width: 320px"
        multiple
        show-tags
        @change="updateKey"
      />
    </template>
    <template #hostId="{ updateKey }">
      <LoadSelect
        v-model="host"
        :fetch="fetchUsers"
        placeholder="搜索用户"
        style="width: 320px"
        @change="updateKey"
      />
    </template>
    <template #recorderId="{ updateKey }">
      <LoadSelect
        v-model="recorder"
        :fetch="fetchUsers"
        placeholder="搜索用户"
        style="width: 320px"
        @change="updateKey"
      />
    </template>
  </XForm>
</template>
