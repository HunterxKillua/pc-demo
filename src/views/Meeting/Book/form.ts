import type { XFormField } from '~components/types/form'

export interface BasicFormProps {
  subject: string
  roomId: string
  roomName: string
  date: string
  timeStart: string
  timeEnd: string
  time: string
  notificationFlag: '0' | '1'
  tips?: string
}

export const basicForm: XFormField[] = [
  {
    label: '会议主题',
    prop: 'subject',
    type: 'input',
    componentProps: {
      maxlength: '30',
    },
  },
  {
    label: '会议室',
    prop: 'roomId',
    componentProps: {
      'show-message': false,
    },
  },
  {
    label: '会议时间',
    prop: 'time',
    componentProps: {
      'show-message': false,
    },
  },
  {
    label: '开启消息通知',
    prop: 'notificationFlag',
    defaultValue: '1',
    componentProps: {
      'show-message': false,
    },
  },
  {
    label: '是否需要签到',
    prop: 'checkIn',
    type: 'radio',
    defaultValue: '1',
    options: [
      {
        label: '是',
        value: '1',
      },
      {
        label: '否',
        value: '0',
      },
    ],
  },
]

export const userForm: XFormField[] = [
  {
    label: '参会人',
    prop: 'attendeeIds',
    required: true,
  },
  {
    label: '主持人',
    type: 'select',
    prop: 'hostId',
    options: [],
    componentProps: {},
    required: true,
  },
  {
    label: '记录人',
    type: 'select',
    prop: 'recorderId',
    options: [],
    required: true,
  },
  {
    label: '抄送人',
    prop: 'cc',
  },
]
