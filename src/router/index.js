import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CalendarView from '@/views/CalendarView.vue'
import AboutView from '@/views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView
    },
    {
      path: '/profile',
      name: 'profile',
      // 懒加载
      meta: { isLogin : true },
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/submit',
      name: 'submit',
      meta: { isLogin : true },
      component: () => import('../views/SubmitView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/admindash',
      name: 'admin',
      meta: { isAdmin: true },
      component: () => import('../views/AdminDashView.vue'),
    },
    {
      path: '/adminlogin',
      name: 'adminlogin',
      component: () => import('../views/AdminLoginView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, left: 0 }
  }
})

router.beforeEach((to, from, next) => {
  // 判断将要访问的路由信息对象是否需要用户登录
  if (to.meta.isLogin) {
    let userLogin = sessionStorage.getItem('auth') // 获取存储对象
    // 判断用户是否已经登陆了
    if(userLogin == null) {
      // 未登录 --> 跳转至登录页
      return next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
  if (to.meta.isAdmin) {
    let adminLogin = sessionStorage.getItem('admin')
    if(adminLogin == null) {
      return next({
        path: '/adminlogin',
        query: { redirect: to.fullPath }
      })
    }
  }
  return next() // 放行
})

export default router
