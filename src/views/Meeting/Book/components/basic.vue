<script lang="ts" setup>
import { Calendar, Clock } from '@element-plus/icons-vue'
import { type BasicFormProps, basicForm } from '../form'
import XForm from '~components/common/xForm/index.vue'

withDefaults(defineProps<Partial<BasicFormProps>>(), {
  subject: '',
  roomId: '',
  roomName: '',
  timeEnd: '',
  timeStart: '',
  date: '',
  notificationFlag: '1',
  tips: '预约本会议室包含场地使用费, 30元/半小时',
})

const { formFields, FormInstance, toValidate } = useForm(basicForm)

function initData(data: Record<string, any>) {
  FormInstance.value?.modifyFormData(data)
  nextTick(() => {
    toValidate(['roomId', 'time'])
  })
}

async function exposeData() {
  return await FormInstance.value?.handleSubmit()
}

function onClick() {
  console.log('choose time')
}

defineExpose({
  initData,
  exposeData,
})
</script>

<template>
  <div>
    <slot name="header" />
    <XForm
      ref="FormInstance"
      :form-fields="formFields"
      label-width="120"
      align="right"
      required
    >
      <template #roomId>
        <div class="flex item-center w-[100%]">
          <ElInput :model-value="roomName" disabled class="mr-[12px]" style="width: 80%;" />
          <ElButton link type="primary" @click="onClick">
            选择会议室及时间
          </ElButton>
        </div>
        <div v-if="tips" class="text-[13px] text-[#999]">
          {{ tips }}
        </div>
      </template>
      <template #time>
        <div class="flex items-center">
          <ElInput :model-value="date" :suffix-icon="Calendar" disabled class="mr-[12px]" />
          <ElInput :model-value="timeStart" disabled class="mr-[12px]" :suffix-icon="Clock" style="width: 150px" />
          <ElInput :model-value="timeEnd" disabled :suffix-icon="Clock" style="width: 150px" />
        </div>
      </template>
      <template #notificationFlag="{ updateKey, value }">
        <ElSwitch
          :model-value="value"
          active-value="1"
          inactive-value="0"
          @change="updateKey"
        />
      </template>
    </XForm>
  </div>
</template>
