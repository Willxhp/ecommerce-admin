import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/register',
    component: () => import('@/views/Register'),
  },
  {
    path: '/login',
    component: () => import('@/views/Login'),
  },
  {
    path: '/layout',
    component: () => import('@/views/Layout')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
