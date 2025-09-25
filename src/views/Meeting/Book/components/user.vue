<script lang="ts" setup>
import { userForm } from '../form'
import XForm from '~components/common/xForm/index.vue'
import UserSelect from '~components/atoms/Select/user.vue'

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
      <UserSelect />
    </template>
    <template #cc>
      <div>抄送人</div>
    </template>
  </XForm>
</template>
