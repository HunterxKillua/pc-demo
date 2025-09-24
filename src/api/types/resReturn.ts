export interface VerifyCodeReturn {
  img: string // 图片url base64
  uuid: string // 验证码对应的uuid
  [x: string]: any
}
