import { createStore } from 'vuex'
import { getUserInfoAPI } from '@/api'

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    // 用户信息
    userInfo: {}
  },
  getters: {
    username: state => state.userInfo.username,
    nickname: state => state.userInfo.nickname,
    userPic: state => state.userInfo.user_pic
  },
  mutations: {
    // 更新token
    updateToken(state, value) {
      state.token = value
      this.commit('persistedState','token')
    },
    // 持久化存储
    persistedState(state, value) {
      localStorage.setItem(value, state[value])
    },
    // 更新用户信息
    updateUserInfo(state, value) {
      state.userInfo = value
    }
  },
  actions: {
    // 发送ajax请求，异步获取用户信息，获取成功后更新state
    async updateUserInfo(context) {
      const {data} = await getUserInfoAPI()
      if (data.code === 0 ) context.commit('updateUserInfo', data.data)
    }
  },
  modules: {
  },
})
