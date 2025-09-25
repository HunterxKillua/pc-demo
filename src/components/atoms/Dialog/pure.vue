<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  top?: string
  showFooter?: boolean
  cancelText?: string
  submitText?: string
  showCancel?: boolean
  showConfirm?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  top: '10vh',
  showFooter: false,
  cancelText: '取消',
  submitText: '确定',
  showCancel: true,
  showConfirm: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const attrs = useAttrs()

const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    if (!val)
      emit('close')
    emit('update:modelValue', val)
  },
})

function onCancel() {
  emit('cancel')
}

async function onSubmit() {
  emit('confirm')
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :top="top"
    :close-on-click-modal="true"
    v-bind="attrs"
  >
    <!-- 主体内容 -->
    <slot />

    <!-- footer 区域 -->
    <template v-if="showFooter" #footer>
      <div class="flex align-center flex-end pr-[20px]">
        <ElButton
          v-if="showCancel"
          class="mr-[12px]"
          @click="onCancel"
        >
          {{ cancelText }}
        </ElButton>
        <ElButton
          v-if="showConfirm"
          type="primary"
          @click="onSubmit"
        >
          {{ submitText }}
        </ElButton>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
::v-deep(.el-dialog) {
  border-radius: 8px;
  width: fit-content;
  min-width: 400px;

  &__body {
    padding: 16px 24px 24px 24px;
    box-sizing: border-box;
  }
  &__header {
    padding: 16px 24px;
    box-sizing: border-box;
  }
  &__title {
    font-size: 16px;
    line-height: 24px;
    color: #121924;
    font-weight: 600;
  }
  &__close {
    font-size: 24px;
  }
  &__headerbtn {
    top: 16px;
    right: 16px;
  }
}
</style>
