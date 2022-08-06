import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 后端接口的根路径
export const baseURL = 'http://backend-api-02.newbee.ltd'
const myAxios = axios.create({
  baseURL
})

// 请求拦截器，用于给需要身份验证的接口添加Authorization请求头
myAxios.interceptors.request.use(
  config => {
    // 如果vuex中有token属性，说明此时已经登录
    if (store.state.user.token) {
      config.headers.Authorization = `Bearer ${store.state.user.token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器，对token过期返回401状态码进行统一处理
myAxios.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // 返回401状态码说明token过期，清除vuex中保存的信息并且强制跳转至登录页面
    if (error.response.status === 401 && store.state.user.token) {
      store.commit('user/updateToken', '')
      router.push('/login')
      ElMessage.error('身份认证过期，请重新登录！')
    }
    return new Promise(() => {})
  }
)

export default myAxios