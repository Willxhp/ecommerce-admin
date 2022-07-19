import axios from 'axios'
import store from '@/store'
import router from '@/router'

const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})

// 请求拦截器，用于给需要身份验证的接口添加Authorization请求头
myAxios.interceptors.request.use(
  config => {
    // 如果vuex中有token属性，说明此时已经登录
    if (store.state.token) {
      config.headers.Authorization = store.state.token
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器，对token过期返回401状态码进行统一处理
myAxios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // 返回401状态码说明token过期，清除vuex中保存的信息并且强制跳转至登录页面
    if (error.response.status === 401 && (store.state.token || store.state.userInfo.username)) {
      store.commit('updateToken', '')
      store.commit('updateUserInfo', {})
      router.push('/login')
      ElMessage.error('身份认证过期，请重新登录！')
    }
    return new Promise(() => {})
  }
)

export default myAxios