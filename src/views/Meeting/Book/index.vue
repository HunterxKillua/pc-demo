<script lang="ts" setup>
import BookBasicForm from './components/basic.vue'
import BookUserForm from './components/user.vue'
import type { BasicFormProps } from './form'
import { createMeetingBook } from '@/api'

const route = useRoute()

const basicData = ref<Partial<BasicFormProps>>({})
const BookBasicRef = ref<typeof BookBasicForm | null>(null)

onMounted(() => {
  const { query } = route as Record<string, any>
  basicData.value = {
    subject: '创建的主题会议',
    roomId: query.roomId,
    roomName: query.roomName,
    date: query.date,
    timeStart: query.timeStart,
    timeEnd: query.timeEnd,
    notificationFlag: query.notificationFlag || '1',
    time: query.date ? `${query.date} ${query.timeStart}-${query.date} ${query.timeEnd}` : '',
  }
  nextTick(() => {
    if (BookBasicRef.value) {
      BookBasicRef.value.initData(unref(basicData.value))
    }
  })
})

async function onClick() {
  const conf = await BookBasicRef.value?.exposeData()
  if (conf) {
    const { error, data } = await createMeetingBook({
      attendeeIds: [1928, 1883],
      hostId: 1883,
      recorderId: 1883,
      roomId: conf.roomId,
      notificationFlag: conf.notificationFlag,
      checkIn: conf.checkIn,
      subject: conf.subject,
      startTime: `${basicData.value.date} ${basicData.value.timeStart}:00`,
      endTime: `${basicData.value.date} ${basicData.value.timeEnd}:00`,
    })
    if (!error) {
      console.log(data)
    }
  }
}
</script>

<template>
  <div>
    <div class="form-box">
      <BookBasicForm
        ref="BookBasicRef"
        v-bind="basicData"
      />
    </div>
    <div class="form-box">
      <BookUserForm />
    </div>
    <div class="flex justify-end">
      <ElButton type="primary" @click="onClick">
        预定会议
      </ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form-box {
	box-sizing: border-box;
	background-color: #fff;
	border-radius: 12px;
	padding: 20px;
	margin-bottom: 20px;
}
</style>
