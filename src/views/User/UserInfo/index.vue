<script setup lang="ts">
import { ref } from 'vue'
import { Document } from '@element-plus/icons-vue'
import XForm from '~components/common/xForm/index.vue'
import type { XFormField } from '~components/types/form'

const formFields = ref<XFormField[]>([
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
])

const formRef = ref<InstanceType<typeof XForm> | null>(null)

async function handleSubmit() {
  const res = await formRef.value?.handleSubmit()
  console.log(res)
}

function handleReset() {
  console.log('表单已重置')
}

function testValidate() {
  formRef.value?.validateByKey('username', (msg) => {
    console.log('校验结果:', msg)
  })
}

function setMockData() {
  formRef.value?.modifyFormData({
    username: '张三',
    gender: 'male',
    city: 'shanghai',
  })
}

const remark = ref('')
</script>

<template>
  <div>
    <XForm
      ref="formRef"
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
      <ElButton type="primary" @click="testValidate">
        触发单字段校验
      </ElButton>
      <ElButton type="success" @click="setMockData">
        填充测试数据
      </ElButton>
      <ElButton type="success" @click="handleSubmit">
        提交表单
      </ElButton>
    </div>
  </div>
</template>
