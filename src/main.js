import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/global.less'

const app = createApp(App)
app.use(store)
app.use(router)
// 注册全部的icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 全局注册QuillEditor富文本编辑器组件
app.mount('#app')
