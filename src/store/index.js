import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('token') || ''
  },
  getters: {
  },
  mutations: {
    // 更新token
    updateToken(state, value) {
      state.token = value
      this.commit('persistedState','token')
    },
    persistedState(state, value) {
      localStorage.setItem(value, state[value])
    }
  },
  actions: {
  },
  modules: {
  },
})
