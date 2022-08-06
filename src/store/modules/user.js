export default {
  namespaced: true,
  state() {
    return {
      token: ''
    }
  },
  actions: {

  },
  mutations: {
    updateToken(state, value) {
      state.token = value
    }
  },
}