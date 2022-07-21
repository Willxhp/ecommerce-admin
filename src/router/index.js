import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    component: () => import('@/views/Layout'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/Home'),
      },
      {
        path: 'user-info',
        component: () => import('@/views/User/UserInfo.vue')
      },
      {
        path: 'user-avatar',
        component: () => import('@/views/User/UserAvatar.vue')
      },
      {
        path: 'user-pwd',
        component: () => import('@/views/User/UserPwd.vue')
      },
      {
        path: 'art-cate',
        component: () => import('@/views/Article/ArtCate.vue')
      },
      {
        path: 'art-list',
        component: () => import('@/views/Article/ArtList.vue')
      },
      {
        path: 'logout',
        redirect: '/'
      }
    ],
  },
  {
    path: '/register',
    component: () => import('@/views/Register'),
  },
  {
    path: '/login',
    component: () => import('@/views/Login'),
  },
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
    if (store.state.token) {
      // 若用户已经登录且vuex中没有用户相关信息时，发送请求获取用户信息
      if (!store.state.userInfo.username) {
        store.dispatch('updateUserInfo')
      }
      next()
    } else {
      // 使用next()指定路由进行跳转时会重新触发一次全局前置路由守卫，所以必须设立白名单防止陷入死递归
      next('/login')
    }
  }
})

export default router
