import { createStore } from 'vuex'
import user from './modules/user'
import createPersistedState from "vuex-persistedstate"

export default createStore({
  modules: {
    user
  },
  // 配置vuex持久化插件
  plugins: [createPersistedState({
    // 指定存储在localStorage中的key名
    key: 'ecommerce-admin',
    path: ['user']
  })]
})
