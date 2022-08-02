import { createStore } from 'vuex'
import { getUserInfoAPI } from '@/api'

export default createStore({
  state: {
    // 存储的token字段，用于身份验证
    token: JSON.parse(localStorage.getItem('token')) || '',
    // 用户信息
    userInfo: JSON.parse( localStorage.getItem('userInfo')) || {}
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
      this.commit('persistedState', 'token')
    },
    // 持久化存储
    persistedState(state, value) {
      localStorage.setItem(value, JSON.stringify(state[value]))
    },
    // 更新用户信息
    updateUserInfo(state, value) {
      state.userInfo = value
      // 防止页面刷新导致用户信息丢失，需要对用户信息进行本地化存储
      this.commit('persistedState', 'userInfo')
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
