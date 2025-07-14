import type { App } from 'vue'
import type { Router } from 'vue-router'

export type UserModule = (ctx: { router: Router, app: App }) => void
