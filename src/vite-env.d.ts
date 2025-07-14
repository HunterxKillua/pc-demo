/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CAS_API: string
  readonly VITE_ZUUL_API: string
  readonly VITE_SYSTEM_CODE: string
  readonly VITE_APP_ID: string
  readonly VITE_APP_PATH: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
