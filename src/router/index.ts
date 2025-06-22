import { createRouter, createWebHistory } from 'vue-router'
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
      component: () => import('@/views/Upload.vue')
    },
    {
      path: '/download/:id',
      name: 'download',
      component: Download
    }

  ],
})

export default router
