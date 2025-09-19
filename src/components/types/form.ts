export interface OptionItem {
  label: string
  value: string | number | boolean
  disabled?: boolean
  children?: OptionItem[]
}

export interface XFormField {
  prop: string
  label?: string
  type?: 'input' | 'radio' | 'select' | 'checkbox' | 'daterange' | 'datetimerange' | 'cascader' | 'input-number'
  rules?: Record<string, any>[]
  error?: string
  required?: boolean
  defaultValue?: string | Array<any> | number | boolean
  componentProps?: Record<string, any>
  componentStyle?: Record<string, any>
  options?: OptionItem[]
  aliasKey?: string
  aliasValue?: Array<number | string>[]
  excludeValue?: any[]
  controlKey?: string
  trim?: boolean
  class?: string
}

export interface XFormRules {
  [key: string]: any[]
}

export interface XFormProps {
  formFields: XFormField[]
  formRules?: XFormRules
  inline?: boolean
  size?: 'default' | 'large' | 'small'
  align?: 'left' | 'right'
  labelWidth?: string | number
  showSubmit?: boolean
  submitText?: string
  required?: boolean
  trigger?: 'blur' | 'change'
  footerAlign?: 'left' | 'right' | 'center'
  bubbleKeys?: string[]
  trim?: boolean
}

export interface XFormExpose {
  handleSubmit: () => void
  clearValidate: () => void
  validateByKey: (key: string, callback?: (message: boolean) => void) => Promise<boolean>
  validate: () => Promise<boolean>
  modifyControlOption: (key: string, val: unknown, reset?: boolean) => void
  modifyFormData: (data: Record<string, any>) => void
}
