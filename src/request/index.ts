import axios from 'axios'
import CryptoJS from 'crypto-js'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'
import { history } from '@/utils/history'

const url = window.location.origin === 'http://192.168.1.164:8000' ? 'http://192.168.1.164:8080' : 'http://183.194.23.142:58080'
const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8080' : url,
  timeout: 5000,
})
console.log();

interface AxiosRequestType {
  baseURL?: string
  url?: string | undefined
  data?: any
  params?: any
  method?: string
  headers?: any
  timeout?: number
  value?: any
  cancelToken?: any
}


instance.interceptors.request.use(
  (config: AxiosRequestType) => {
    let token = localStorage.getItem('fakeToken')
    if (token) {
      token = token.replace(/^"|"$/g, '');
    }
    config.headers['Authorization'] = token ? "Bearer " + token : ''
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res.data.code === 401) {
      message.warning('token过期，请重新登录！')
      localStorage.removeItem('my-token')
      localStorage.removeItem('fakeToken')
      localStorage.removeItem('userInfo')
      history.push('/login')
      setTimeout(() => {
        window.location.reload()
      }, 500);
    }

    return res.data
  },
  (err) => {
    message.warning('服务器连接异常，请稍后重试！')
    localStorage.removeItem('my-token')
    localStorage.removeItem('userInfo')
    history.push('/login')

    return Promise.reject(err)
  }
)
export default instance
