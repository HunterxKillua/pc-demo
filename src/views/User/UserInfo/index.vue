<script setup lang="ts">
import { Document } from '@element-plus/icons-vue'
import XForm from '~components/common/xForm/index.vue'
import type { XFormField } from '~components/types/form'
import { useForm } from '@/hooks/useForm'

const fields: XFormField[] = [
  {
    prop: 'username',
    label: '用户名',
    type: 'input',
    required: true,
    error: '用户名不能为空啊啊啊',
  },
  {
    prop: 'age',
    label: '年龄',
    type: 'input-number',
    required: true,
    defaultValue: 18,
  },
  {
    prop: 'gender',
    label: '性别',
    type: 'radio',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
    required: true,
  },
  {
    prop: 'hobbies',
    label: '爱好',
    type: 'checkbox',
    options: [
      { label: '篮球', value: 'basketball' },
      { label: '足球', value: 'football' },
      { label: '音乐', value: 'music' },
    ],
  },
  {
    prop: 'city',
    label: '城市',
    type: 'select',
    options: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '广州', value: 'guangzhou' },
    ],
    required: true,
  },
  {
    prop: 'remark',
    label: '备注',
    type: 'input',
    componentProps: {
      showMessage: false,
    },
  },
]

function handleReset() {
  console.log('表单已重置')
}
async function submit(data: Record<string, any>) {
  console.log(data)
}

const { formFields, FormInstance, onSubmit, toValidate, modifyForm } = useForm(fields, submit)

async function onCheck() {
  console.log(await toValidate('username'))
  console.log(await toValidate(['username', 'gender']))
  console.log(await toValidate())
}

function onClick() {
  modifyForm({
    username: 'lll',
    gender: 'female',
  })
}

const remark = ref('')

function onMouseEnter(id: number) {
  console.log(id)
}
function onMouseLeave(id: 2) {
  console.log(id)
}
</script>

<template>
  <div>
    <XForm
      ref="FormInstance"
      :form-fields="formFields"
      align="right"
      required
      @reset="handleReset"
    >
      <!-- 自定义 label 插槽 -->
      <template #label-remark="{ field }">
        <div class="inline-flex items-center">
          <span>{{ field.label }}</span>
          <ElTooltip content="这里是备注说明" placement="top">
            <ElIcon><Document /></ElIcon>
          </ElTooltip>
        </div>
      </template>

      <!-- 自定义表单项插槽 -->
      <template #remark="{ updateKey }">
        <ElInput
          v-model="remark"
          type="textarea"
          :rows="3"
          placeholder="请输入备注（自定义插槽覆盖默认）"
          @change="updateKey"
        />
      </template>
    </XForm>

    <div class="mt-4 flex gap-2">
      <ElButton type="primary" @click="onCheck">
        触发单字段校验
      </ElButton>
      <ElButton type="success" @click="onClick">
        填充测试数据
      </ElButton>
      <ElButton type="success" @click="onSubmit">
        提交表单
      </ElButton>
    </div>

    <button v-mouse:500.mouseenter="() => onMouseEnter(1)">
      鼠标进入延迟触发
    </button>
    <button v-mouse:200.mouseleave="() => onMouseLeave(2)">
      鼠标离开延迟触发
    </button>

    <div v-ellipsis="2" style="width: 50px;">
      这是一段很长的文本，用于测试 v-ellipsis-tooltip 指令。超出两行将自动显示 Element Plus Tooltip。
    </div>
  </div>
</template>
