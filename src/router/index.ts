import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../services/supabase'
import Home from '../views/Home.vue'
import Features from '../views/Features.vue'
import Pricing from '../views/Pricing.vue'
import Download from '../views/Download.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/features',
      name: 'Features',
      component: Features
    },
    {
      path: '/pricing',
      name: 'Pricing',
      component: Pricing
    },
    {
      path: '/upload',
      name: 'Upload',
      component: () => import('../views/Upload.vue'),
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('../views/Auth.vue')
    },
    {
      path: '/download/:id',
      name: 'download',
      component: Download
    }
  ],
})

// Auth guard
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      next('/auth')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
