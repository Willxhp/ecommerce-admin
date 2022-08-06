import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'

const Layout = () => import('@/views/layout')
const Home = () => import('@/views/home')
const AddGoods = () => import('@/views/add-goods')
const Login = () => import('@/views/login')

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: Home
      },
      {
        path: 'addgoods',
        component: AddGoods
      }
    ]
  },
  {
    path: '/login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 定义访问白名单，在白名单中的路由不需要进行身份认证，直接放行
const whiteList = ['/login', '/register']
// 全局前置路由守卫，对需要身份认证的页面进行鉴权
router.beforeEach((to, from, next) => {
  // 如果前往的路由在白名单中，直接放行
  if (whiteList.includes(to.path)) {
    next()
  } else {
    // 否则检查是否有token，没有的token跳转至登录界面
    if (store.state.user.token) {
      next()
    } else {
      // 使用next()指定路由进行跳转时会重新触发一次全局前置路由守卫，所以必须设立白名单防止陷入死递归
      next('/login')
    }
  }
})

export default router
