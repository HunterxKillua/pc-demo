/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CAS_API: string
  readonly VITE_ZUUL_API: string
  readonly VITE_SYSTEM_CODE: string
  readonly VITE_APP_ID: string
  readonly VITE_APP_PATH: string
  readonly VITE_BASE_URL: string
  readonly VITE_SECRET_PUBLIC_KEY: string
  readonly VITE_SECRET_PRIVATE_KEY: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
