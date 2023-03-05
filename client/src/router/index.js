import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/ping',
    name: 'ping',
    component: () => import('@/views/PingView.vue')
  },
  {
    path: '/books',
    name: 'books',
    component: () => import('@/views/BooksView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
