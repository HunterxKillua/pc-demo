import { JSEncrypt } from 'jsencrypt'

export function encrypt(txt: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(import.meta.env.VITE_SECRET_PUBLIC_KEY)
  return encryptor.encrypt(txt)
}

export function decrypt(txt: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(import.meta.env.VITE_SECRET_PRIVATE_KEY)
  return encryptor.decrypt(txt)
}
