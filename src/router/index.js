import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ReservationView from '../views/ReservationView.vue'
import AdminLogin from '../views/AdminLogin.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import ConfirmationView from '../views/ConfirmationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/reservation',
      name: 'reservation',
      component: ReservationView
    },
    {
      path: '/confirmation',
      name: 'confirmation',
      component: ConfirmationView
    },
    {
      path: '/admin',
      redirect: '/admin/login'
    },
    {
      path: '/admin/login',
      name: 'adminLogin',
      component: AdminLogin,
      meta: { requiresAuth: false }
    },
    {
      path: '/admin/dashboard',
      name: 'adminDashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('adminAuthenticated')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !isAuthenticated) {
    next('/admin/login')
  } else {
    next()
  }
})

export default router 