import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/pages/main/index.vue'
import Library from '@/pages/library/index.vue'

const routes = [
  { path: '/', name: 'Main', component: MainPage },
   { path: '/library', name: 'Library', component: Library },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
