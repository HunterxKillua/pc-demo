<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { ElCascader, ElCheckboxGroup, ElDatePicker, ElForm, ElInput, ElInputNumber, ElSelect } from 'element-plus'
import type { XFormField, XFormProps, XFormRules } from '../../types/form'

const props = withDefaults(defineProps<XFormProps>(), {
  formFields: () => [],
  formRules: () => ({}),
  inline: false,
  size: 'default',
  align: 'left',
  labelWidth: '80',
  showSubmit: false,
  required: false,
  trigger: 'change',
  footerAlign: 'left',
  bubbleKeys: () => [],
  trim: true,
  submitText: '提交',
})
const emits = defineEmits<{
  (e: 'submit', form: Record<string, any>): void
  (e: 'reset'): void
  (e: 'resetOptions', payload: Record<string, any>): void
  (e: 'propChange', payload: Record<string, any>): void
}>()
const slots = useSlots()
const attrs = useAttrs()
const formRef = ref<typeof ElForm | null>(null)
const formModel = reactive<Record<string, any>>({})
const renderFormFields = ref<XFormField[]>([])

const defaultDateRangeProps = {
  type: 'daterange',
  rangeSeparator: '至',
  startPlaceholder: '开始日期',
  endPlaceholder: '结束日期',
  valueFormat: 'yyyy-MM-dd',
  format: 'yyyy-MM-dd',
}
const defaultDatetimeRangeProps = {
  type: 'datetimerange',
  rangeSeparator: '至',
  startPlaceholder: '开始日期',
  endPlaceholder: '结束日期',
  valueFormat: 'yyyy-MM-dd HH:mm:ss',
  format: 'yyyy-MM-dd HH:mm:ss',
  defaultTime: ['00:00:00', '23:59:59'],
}

function initializeFormModel() {
  const model: Record<string, any> = {}
  props.formFields.forEach((field) => {
    model[field.prop] = setDefaultValue(field)
  })
  return model
}

function setDefaultValue(field: XFormField) {
  if (field.type) {
    if (field.type.includes('checkbox'))
      return field.defaultValue || []
    if (typeof field.defaultValue === 'boolean')
      return field.defaultValue || false
    return field.defaultValue ?? ''
  }
  return field.defaultValue ?? ''
}

const generatedRules = computed(() => {
  const rules: XFormRules = {}
  if (props.required) {
    renderFormFields.value.forEach((field) => {
      rules[field.prop] = field.rules || props.formRules?.[field.prop] || []
      if (!rules[field.prop].some(rule => rule.required)) {
        rules[field.prop].push({
          required: true,
          message: field.error || getPlaceholder(field, true),
          trigger: props.trigger,
        })
      }
    })
  }
  else {
    renderFormFields.value.forEach((field) => {
      rules[field.prop] = field.rules || props.formRules?.[field.prop] || []
      if (field.required && !rules[field.prop].some(rule => rule.required)) {
        rules[field.prop].push({
          required: true,
          message: field.error || getPlaceholder(field, true),
          trigger: props.trigger,
        })
      }
    })
  }
  return rules
})

function hasSlot(name: string) {
  return !!slots?.[name]
}

function getRenderFields(callback?: (fields: XFormField[]) => void) {
  const clearKeys: string[] = []
  const list = cloneDeep(props.formFields).map((field) => {
    if (field.type === 'daterange') {
      field.componentProps = Object.assign({}, field.componentProps || {}, defaultDateRangeProps)
    }
    if (field.type === 'datetimerange') {
      field.componentProps = Object.assign({}, field.componentProps || {}, defaultDatetimeRangeProps)
    }

    if (field.aliasKey) {
      const value = formModel[field.aliasKey]
      const status = field.excludeValue ? value && !field.excludeValue.includes(value) : false
      if ((value && field.aliasValue?.includes(value)) || status) {
        if (field && clearKeys.includes(field.aliasKey)) {
          return null
        }
        return field
      }
      else {
        clearKeys.push(field.prop)
        return null
      }
    }
    else {
      return field
    }
  })
  clearValidateByKey(clearKeys)
  renderFormFields.value = list.filter(f => f) as XFormField[]
  nextTick(() => {
    if (callback && typeof callback === 'function')
      callback(renderFormFields.value)
  })
}

function clearValidateByKey(keys: string[]) {
  if (formRef.value && typeof formRef.value.clearValidate === 'function') {
    formRef.value.clearValidate(keys)
  }
}

function getPlaceholder(field: XFormField, ruleWarn = false) {
  const type = field?.type || 'input'
  if (field.componentProps && field.componentProps.placeholder)
    return field.componentProps.placeholder

  if (type === 'input')
    return `请输入${field.label}`
  if (type === 'select')
    return `请选择${field.label}`
  if (type === 'radio')
    return `请选择${field.label}`
  if (type === 'checkbox')
    return `请选择${field.label}`
  return ruleWarn ? `${field.label}不能为空` : field.label || ''
}

function getComponentType(type = 'input') {
  if (type.includes('input-number'))
    return ElInputNumber
  if (type.includes('input'))
    return ElInput
  if (type.includes('select'))
    return ElSelect
  if (type.includes('checkbox'))
    return ElCheckboxGroup
  if (type.includes('date'))
    return ElDatePicker
  if (type.includes('cascader'))
    return ElCascader
  return ElInput
}

function handleSubmit() {
  return new Promise((resolve) => {
    if (formRef.value && typeof formRef.value.validate === 'function') {
      formRef.value.validate((valid: boolean) => {
        if (valid) {
          emits('submit', formModel)
          resolve(formModel)
        }
        else {
          resolve(null)
        }
      })
    }
    else {
      resolve(null)
    }
  })
}

function handleReset() {
  if (formRef.value && typeof formRef.value.resetFields === 'function')
    formRef.value.resetFields()
  Object.assign(formModel, initializeFormModel())
  emits('reset')
}

function clearValidate() {
  if (formRef.value && typeof formRef.value.clearValidate === 'function') {
    formRef.value.clearValidate()
  }
  Object.assign(formModel, initializeFormModel())
}

function onSlotChange(key: string, value: any) {
  formModel[key] = value
}

function validateByKey(key: string, callback?: (msg: any) => void) {
  if (formRef.value && typeof formRef.value.validateField === 'function') {
    formRef.value.validateField(key, (msg: any) => {
      if (callback)
        callback(msg)
    })
  }
}

function validate() {
  if (formRef.value && typeof formRef.value.validate === 'function') {
    let result = true
    formRef.value.validate((valid: boolean) => {
      result = !!valid
    })
    return result
  }
  return true
}

function onFiledChange(row: XFormField, val: any, reset = true) {
  const keys = new Set((props.formFields || []).filter(item => item.aliasKey).map(item => item.aliasKey!))
  if (keys.has(row.prop)) {
    getRenderFields()
  }
  if (row.controlKey) {
    const conf = row?.options?.find(item => item.value === val)
    const field = (props.formFields || []).find(item => item.prop === row.controlKey) || ({} as XFormField)
    const children = conf?.children || []
    if (reset) {
      formModel[row.controlKey] = setDefaultValue(field)
    }
    emits('resetOptions', {
      key: row.controlKey,
      options: children.length ? children : field.options,
      reset,
      val,
      sourceKey: row.prop,
    })
  }
  if ((props.bubbleKeys || []).includes(row.prop)) {
    emits('propChange', { key: row.prop, val })
  }
}

function modifyControlOption(key: string, val: any, reset = true) {
  const row = (props.formFields || []).find(item => item.prop === key)
  const conf = row?.options?.find(item => item.value === val)
  if (conf) {
    const children = conf.children || []
    emits('resetOptions', {
      key: row?.controlKey,
      options: children,
      val,
      sourceKey: key,
      reset,
    })
  }
}

function modifyFormData(data: Record<string, any>, type = 'source') {
  for (const key in data) {
    if (type === 'source')
      formModel[key] = data[key]
  }
}

function handleTrim(prop: string) {
  const field = (props.formFields || []).find(f => f.prop === prop)
  if ((props.trim || field?.trim) && typeof formModel[prop] === 'string') {
    formModel[prop] = formModel[prop].trim()
  }
}

const footerClass = computed(() => {
  return props.footerAlign === 'left' ? 'justify-start' : props.footerAlign === 'right' ? 'justify-end' : 'justify-center'
})

getRenderFields()
Object.assign(formModel, initializeFormModel())

defineExpose({
  handleSubmit,
  clearValidate,
  validateByKey,
  validate,
  modifyControlOption,
  modifyFormData,
})
</script>

<template>
  <div class="x-form">
    <ElForm
      ref="formRef"
      :model="formModel"
      :rules="generatedRules"
      :inline="props.inline"
      :size="props.size"
      :label-position="props.align"
      :label-width="props.labelWidth"
      v-bind="attrs"
    >
      <template v-for="field in renderFormFields" :key="field.prop">
        <ElFormItem
          :label="field.label"
          :prop="field.prop"
          v-bind="field.componentProps"
          :class="[field.class]"
        >
          <template #label>
            <slot :name="`label-${field.prop}`" :field="field">
              <span class="inline-block">{{ field.label }}</span>
            </slot>
          </template>

          <template v-if="hasSlot(field.prop)">
            <slot
              :name="field.prop"
              :row="field"
              :value="formModel[field.prop]"
              :update-key="(val: unknown) => onSlotChange(field.prop, val)"
            />
          </template>

          <!-- 避免动态组件el-radio-group出现警告的问题 -->
          <template v-else-if="field.type && field.type.includes('radio')">
            <ElRadioGroup
              v-model="formModel[field.prop]"
              :placeholder="getPlaceholder(field)"
              v-bind="field.componentProps"
              :style="field.componentStyle || {}"
              @change="(val: unknown) => onFiledChange(field, val)"
            >
              <ElRadio
                v-for="option in field.options"
                :key="(option.value as string)"
                v-bind="option"
              />
            </ElRadioGroup>
          </template>

          <template v-else>
            <component
              :is="getComponentType(field.type)"
              v-model="formModel[field.prop]"
              :placeholder="getPlaceholder(field)"
              v-bind="field.componentProps"
              :style="field.componentStyle || {}"
              @change="(val: unknown) => onFiledChange(field, val)"
              @blur="() => handleTrim(field.prop)"
            >
              <template v-if="field.type && field.type.includes('select')">
                <el-option
                  v-for="option in field.options"
                  :key="(option.value as string)"
                  :label="option.label"
                  :value="option.value"
                  :disabled="option.disabled"
                />
              </template>
              <template v-else-if="field.type && field.type.includes('checkbox')">
                <el-checkbox
                  v-for="option in field.options"
                  :key="(option.value as string)"
                  v-bind="option"
                  :disabled="option.disabled"
                />
              </template>
            </component>
          </template>

          <slot name="append" />
        </ElFormItem>
      </template>

      <slot name="submit">
        <ElFormItem v-if="props.showSubmit">
          <div
            class="flex items-center" :class="[footerClass]"
          >
            <ElButton
              class="mr-[10px]"
              @click="handleReset"
            >
              重置
            </ElButton>
            <ElButton
              type="primary"
              :style="{ width: '64px' }"
              @click="handleSubmit"
            >
              {{ props.submitText }}
            </ElButton>
          </div>
        </ElFormItem>
      </slot>
    </ElForm>
  </div>
</template>

<style lang="scss">
.x-form {
  box-sizing: border-box;
  width: 100%;
  .el-form-item {
    width: 100%;
  }
  .el-form {
    .el-form-item {
      margin-bottom: 16px;
      display: inline-flex;
      &__label {
        margin-right: 16px !important;
        padding-right: 0px !important;
      }
      &__content {
        flex: 1;
        margin-left: 0 !important;
        .el-input--small{
          font-size:14px;
        }
      }
      .el-date-editor.el-input, .el-date-editor.el-input__inner {
        margin-left: 0px;
      }
    }
    &--inline {
      .el-form-item {
        width: fit-content;
      }
    }
  }

  .el-date-editor.el-input {
    margin: 0 !important;
  }
  .el-date-editor{
    .el-range-input,.el-range-separator{
      font-size: 14px;
    }
  }
  .el-checkbox-group {
    height: 32px;
  }
  .el-checkbox__label {
    font-weight: 400;
  }
  .el-radio__label {
    font-weight: 400;
  }
}
</style>
