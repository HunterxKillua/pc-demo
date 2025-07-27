<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import Test from './components/test.vue'
import Test1 from './components/transformRef.vue'
import Test2 from './components/model.vue'
import Test3 from './components/shortBind.vue'
import { useAccountStore } from '~store/user'

const accountStore = useAccountStore()
const { token, userInfo } = storeToRefs(accountStore)
const msg = ref('')
const value = $ref('shortBind')
console.log(isRef(token.value), isRef(userInfo), userInfo)

function onClick() {
  window.location.href = `${import.meta.env.VITE_CAS_API}/cas/login?service=${window.origin}${import.meta.env.VITE_APP_PATH}`
}
</script>

<template>
  <ElButton type="primary" @click="onClick">
    按钮 <Icon icon="mdi:eye" />
  </ElButton>
  <Test />
  <Test1 />
  <div>
    <div>
      defineModel语法糖
    </div>
    <ElInput v-model="msg" />
    <Test2 v-model="msg" />
    <Test3 v-model:msg="msg" :value />
  </div>
</template>
