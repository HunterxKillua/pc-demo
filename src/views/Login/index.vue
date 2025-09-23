<script setup lang="ts">
import Banner from '@/assets/login/login.svg'
import XForm from '~components/common/xForm/index.vue'
import type { XFormField } from '~components/types/form'
import { getLoginCode, toLogin } from '@/api/login' // toLogin
import { encrypt } from '@/utils'

const fields: XFormField[] = [
  {
    prop: 'username',
    label: '账号',
    type: 'input',
    required: true,
  },
  {
    prop: 'password',
    label: '密码',
    type: 'input',
    required: true,
    defaultValue: '',
    componentProps: {
      'type': 'password',
      'show-password': true,
    },
  },
  {
    prop: 'code',
    label: '验证码',
    required: true,
    defaultValue: '',
  },
]
const code = ref('')
const codeImagePath = ref('')
const uuid = ref('')
const loading = ref(false)

async function getVerifyCode() {
  const res = await getLoginCode()
  const { error, data } = res
  if (!error) {
    codeImagePath.value = `data:image/gif;base64, ${data?.img || ''}`
    uuid.value = data?.uuid || ''
  }
  else {
    console.log(error)
  }
}

onMounted(() => {
  getVerifyCode()
})

const { formFields, FormInstance, onSubmit } = useForm(fields, async (conf) => {
  if (conf) {
    loading.value = true
    const { data, error } = await toLogin({
      code: code.value,
      username: conf.username,
      password: encrypt(conf.password) as string,
      uuid: uuid.value,
    })
    if (!error) {
      console.log(data)
    }
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
})
</script>

<template>
  <div class="login-container flex-v justify-center">
    <div class="login-container-form">
      <div class="box-border px-[20px] py-[30px]">
        <img :src="Banner" alt="login_banner" width="320px">
      </div>
      <div class="login-container-form-body">
        <div class="text-[24px] font-600 text-center mb-[40px]" color="#6a6a6a">
          HD智慧会议系统
        </div>
        <XForm
          ref="FormInstance"
          :form-fields="formFields"
          size="large"
          trigger="change"
          align="right"
        >
          <template #code="{ updateKey }">
            <div class="flex items-center">
              <ElInput
                v-model="code"
                maxlength="6"
                @change="updateKey"
              />
              <img
                :src="codeImagePath"
                class="h-[40px] w-[120px] ml-[12px]"
                alt="code"
              >
            </div>
          </template>
        </XForm>
        <div class="flex items-center justify-end">
          <ElButton
            type="primary"
            size="large"
            :loading="loading"
            class="w-264px mt-[10px]"
            @click="onSubmit"
          >
            登录
          </ElButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  background-size: cover;
  background-image: url('@/assets/login/login_bg.webp');
  &-form {
    box-sizing: border-box;
    padding: 20px 0;
    border-radius: 10px;
    opacity: 0.6;
    background: #fff;
    box-shadow: 0 1px 2px -2px #00000029, 0 3px 6px #0000001f,
    0 5px 12px 4px #00000017;
    margin: auto;
    display: flex;
    align-items: center;
    &-body {
      width: 360px;
      margin-right: 40px;
    }
  }
}
</style>
