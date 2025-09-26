import type { XFormExpose, XFormField } from '~components/types/form'

export function useForm(fields: XFormField[], fn?: (data: Record<string, any>) => void) {
  const FormInstance = ref<XFormExpose | null>(null)
  const formFields = ref(fields)
  const onSubmit = async () => {
    const res = await FormInstance.value?.handleSubmit()
    if (res) {
      fn?.(res)
    }
  }
  const toValidate = async (key?: string | string[], callback?: (msg: boolean) => void) => {
    if (key) {
      if (typeof key === 'string') {
        return await FormInstance.value?.validateByKey(key, callback)
      }
      else {
        const res = await Promise.all(key.map(k => FormInstance.value?.validateByKey(k, callback)))
        return !res.some(k => !k)
      }
    }
    else {
      return await FormInstance.value?.validate()
    }
  }
  const modifyForm = (data: Record<string, any>) => {
    FormInstance.value?.modifyFormData(data)
  }
  return {
    formFields,
    FormInstance,
    onSubmit,
    toValidate,
    modifyForm,
  }
}
