<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
// import { ElDialog } from 'element-plus'
import Test from './components/test.vue'
import Test1 from './components/transformRef.vue'
import Test2 from './components/model.vue'
import Test3 from './components/shortBind.vue'
import Modal from './components/asyncImport.vue'
import { useAccountStore } from '~store/user'
import { usePopup } from '@/hooks/usePopup'

const accountStore = useAccountStore()
const { token, userInfo } = storeToRefs(accountStore)
const msg = ref('')
const value = $ref('shortBind')
console.log(isRef(token.value), isRef(userInfo), userInfo)

const { mount } = usePopup()

const show = ref(false)

const testRef = ref<InstanceType<typeof Test1> | null>(null)
const mockRef = ref<InstanceType<typeof Modal> | null>(null)

function onClick() {
  mount(Modal, {
    title: 'popup hook',
    modelValue: true,
    onClick: () => {
      console.log(userInfo, 'parent')
    },
  }, {
    header: () => h('div', 'slot透传'),
    default: () => h(Test1, {
      title: '透传插槽',
      onClick: () => {
        console.log(userInfo, 'slot child')
        testRef.value?.test()
      },
    }),
  })
}

function onModalClick() {
  mockRef?.value?.test111?.()
}
</script>

<template>
  <Modal ref="mockRef" v-model="show" @click="onModalClick" />
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
