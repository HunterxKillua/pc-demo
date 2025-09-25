<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  content?: string
  showConfirm?: boolean
  showCancel?: boolean
  // type?: 'base' | 'success' | 'warn' | 'info' | 'error'
  width?: string | number
  cancelText?: string
  submitText?: string
  closeOnClickModal?: boolean
  cancelLoading?: boolean
  confirmLoading?: boolean
  autoLoading?: boolean
  appendToBody?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  content: '',
  showConfirm: true,
  showCancel: true,
  // type: 'base',
  width: '80%',
  cancelText: '取消',
  submitText: '确定',
  closeOnClickModal: false,
  cancelLoading: false,
  confirmLoading: false,
  autoLoading: false,
  appendToBody: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'close'): void
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

// 内部 loading 状态
const submitLoading = ref(false)

// 绑定给 ElDialog 的值
const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

// loading 计算
const loading = computed(() =>
  props.autoLoading
    ? submitLoading.value || props.confirmLoading
    : props.confirmLoading || submitLoading.value,
)

// 取消
function onCancel() {
  emit('cancel')
}

// 确认
async function onSubmit() {
  if (props.autoLoading) {
    submitLoading.value = true
  }
  emit('confirm')

  setTimeout(() => {
    submitLoading.value = false
  }, 1500)
}
</script>

<template>
  <ElDialog
    v-model="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    :append-to-body="appendToBody"
    top="10vh"
    v-bind="$attrs"
    @close="emit('close')"
  >
    <template #header>
      <slot name="title">
        <div class="dialog-title">
          {{ title }}
        </div>
      </slot>
    </template>
    <div>
      <slot />
    </div>

    <template #footer>
      <slot name="footer">
        <ElButton
          v-if="showCancel"
          :loading="cancelLoading"
          class="mr12"
          :style="{ minWidth: '110px' }"
          @click="onCancel"
        >
          {{ cancelText }}
        </ElButton>
        <ElButton
          v-if="showConfirm"
          :loading="loading"
          type="primary"
          @click="onSubmit"
        >
          {{ submitText }}
        </ElButton>
      </slot>
    </template>
  </ElDialog>
</template>

<style scoped lang="scss">
::v-deep(.el-dialog) {
  background: #ffffff;
  border-radius: 16px !important;
  color: #121924 !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  max-height: 640px;

  .el-dialog__header {
    padding: 20px 24px 14px 24px;
    width: 100%;
    .el-dialog__title,
    .dialog-title {
      color: #121924;
      font-weight: 600;
      font-size: 16px;
    }
  }

  .el-dialog__body {
    padding: 0px 24px 0px 24px;
    width: 100%;
    flex: 1;
    overflow: auto;
  }

  .el-dialog__footer {
    width: 100%;
    padding: 20px;
  }
}
</style>
