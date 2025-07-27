<script setup lang="tsx">
import Cookie from 'js-cookie'
import { ElButton } from 'element-plus'
import { createHurricaneToken, getSystemUserInfo } from '~api/index'

const userInfo = reactive<{
  token?: string
  login_id?: string
  sysTemInfo: string
  ticket: string
}>({
  token: '',
  login_id: '',
  sysTemInfo: '',
  ticket: '',
})
async function getUserInfo(loginId: string) {
  const res = await getSystemUserInfo({
    loginId,
    systemCode: import.meta.env.VITE_SYSTEM_CODE,
  })
  if (!res.error) {
    userInfo.sysTemInfo = JSON.stringify(res.data)
  }
}
function onLogout() {
  Cookie.remove('token')
  localStorage.removeItem('token')
  setTimeout(() => {
    window.location.href = `${import.meta.env.VITE_CAS_API}/cas/login?service=${window.origin}${import.meta.env.VITE_APP_PATH}`
  }, 2000)
}
async function toLogin(ticket: string) {
  const res = await createHurricaneToken({
    app_id: import.meta.env.VITE_APP_ID,
    service: `${window.origin}${import.meta.env.VITE_APP_PATH}`,
    ticket,
  })
  if (!res.error) {
    userInfo.token = res.data?.token
    userInfo.login_id = res.data?.login_id
    localStorage.setItem('token', res.data?.token || '')
    Cookie.set('token', res.data?.token || '')
    if (res.data?.login_id) {
      getUserInfo(res.data.login_id as string)
    }
  }
  else {
    // 自定义错误信息行为
    ElMessage.error(res.error)
    onLogout()
  }
}
function onClick() {
  window.location.href = `${import.meta.env.VITE_CAS_API}/cas/login?service=${window.origin}${import.meta.env.VITE_APP_PATH}`
}
onMounted(() => {
  const url = new URL(window.location.href)
  // 使用 URLSearchParams 获取查询参数
  const searchParams = new URLSearchParams(url.search)
  const ticket = searchParams.get('ticket')
  console.log(searchParams, ticket)
  if (ticket) {
    userInfo.ticket = ticket
    toLogin(ticket)
  }
})
defineRender(() => {
  return (
    <div un-overflow-hidden un-w="100vw">
      <div>登录登出流程</div>
      <ElButton type="primary" onClick={() => onClick()}>
        登录
      </ElButton>
      <ElButton type="danger" onClick={() => onLogout()}>
        登出
      </ElButton>
      <div un-break-all un-m-4>
        ticket:
        "
        { userInfo.ticket }
        "
      </div>
      <div un-break-all un-m-4>
        token:
        "
        {
          userInfo.token
        }
        "
      </div>
      <div un-break-all un-m-4>
        用户的系统信息:
        "
        {
          userInfo.sysTemInfo
        }
        "
      </div>
    </div>
  )
})
</script>
