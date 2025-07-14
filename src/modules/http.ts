import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import type { Router } from 'vue-router'
import type { UserModule } from '~types/index'

export interface ServerParams extends AxiosRequestConfig<any> {
  [x: string]: any
}

export interface ServerExtraOption {
  bubbleError?: boolean // 跳过公共的try catch将错误信息冒泡出去
}

export interface PendingTask {
  config: AxiosRequestConfig
  resolve: Function
  // reject: Function
}

let refreshing = false
const queue: PendingTask[] = []
// 如果需要开启代理则需要处理
const baseURL = import.meta.env.VITE_ZUUL_API

const RouterConfig: {
  router?: Router
} = {}

export const install: UserModule = ({ router }) => {
  RouterConfig.router = router
}
// 暂时写在这里
const whiteList: string[] = ['auth/auth/createHurricaneToken']
function needAuth(url: string) {
  return !whiteList.some(str => url.includes(str))
}

async function refreshToken() {
  return axios.request({
    url: `${baseURL}${import.meta.env.VITE_PASSPORT_PREFIX || ''}` + `/api/v1/user/token/refresh`,
    method: 'post',
    data: {
      refresh_token: localStorage.getItem('refresh_token'),
    },
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
    withCredentials: true,
  })
}

export function httpRequest(config: ServerParams, extraOptions?: ServerExtraOption) {
  const Server: AxiosInstance = axios.create({
    baseURL,
    timeout: 10 * 1000,
    headers: {
      'Accept': 'application/json;charset=UTF-8',
      'Content-Type': 'application/json;charset=UTF-8',
      'App_id': import.meta.env.VITE_APP_ID,
      'Systemcode': import.meta.env.VITE_SYSTEM_CODE,
    },
  })
  Server.interceptors.request.use(
    (config) => {
      if (config.method === 'get')
        config.params._t = new Date().getTime()
      const token = localStorage.getItem('token')
      if (token && needAuth(config.url as string)) {
        config.headers['Hurricane-Token'] = `Bearer ${token}`
      }
      return config
    },
    (err) => {
      Promise.reject(err)
    },
  )
  // 响应拦截
  Server.interceptors.response.use(
    (response) => {
      return new Promise((resolve, reject) => {
        const res = response?.data
        if (Number(res.code) === 0) {
          resolve(res.data)
        }
        else {
          if (extraOptions?.bubbleError) {
            reject(res)
          }
          else {
            ElMessage.error(res.msg || 'server error')
            resolve(null as any)
          }
        }
      })
    },
    async (error) => {
      const { status, message, data, config } = error.response
      if (refreshing) {
        return new Promise((resolve) => {
          queue.unshift({
            config,
            resolve,
          })
        })
      }
      if (status === 500) {
        ElMessage.error('server error')
        return undefined
      }
      else if (status === 401) {
        refreshing = true
        try {
          const res = await refreshToken()
          refreshing = false
          if (res.status === 200) {
            const { access_token, refresh_token } = res.data
            localStorage.setItem('access_token', access_token)
            localStorage.setItem('refresh_token', refresh_token)
            queue.forEach(({ config, resolve }) => {
              if (config.headers) {
                config.headers.Authorization = `Bearer ${access_token}`
              }
              resolve(axios(config))
            })
            queue.splice(0)
            config.headers.Authorization = `Bearer ${access_token}`
            return axios(config)
          }
          else {
            console.log('刷新token失败, 登出处理')
            return Promise.reject(res.data)
          }
        }
        catch (e) {
          console.log('刷新token失败, 登出处理')
        }
        ElMessage.error('登录过期')
        RouterConfig?.router?.replace({ name: 'login' })
      }
      else {
        if (extraOptions?.bubbleError) {
          return Promise.reject(data)
        }
        else {
          ElMessage.error(message || data?.msg || 'oops! request failed')
          return undefined
        }
      }
    },
  )
  return Server(config)
}

export interface ReqReturn<T> {
  data: T | null | undefined
  error: string | null
}
/**
 *
 * @param {AxiosRequestConfig} req - 实际的请求方法参数
 * @returns {Promise<{ data: AxiosResponse<any> | null | undefined, error: string | null }>} 请求返回结构体
 * @returns {AxiosResponse<any> | null} return.data - 接口成功返回的数据， 如果请求异常则为null
 * @returns {string | null} return.error - 错误信息, 如果请求异常则为异常提示信息 否则为null
 *
 */
export async function reqCatch<T = Record<string, any>>(
  req: AxiosRequestConfig,
  extraOptions?: ServerExtraOption,
): Promise<ReqReturn<T>> {
  try {
    const data = (await httpRequest(req, extraOptions)) as T
    return {
      data,
      error: null,
    }
  }
  catch (e) {
    return {
      data: null,
      error: ((e as unknown as any)?.msg as string) || '',
    }
  }
}
