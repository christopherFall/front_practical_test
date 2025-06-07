import { createRouter, createWebHistory } from 'vue-router'
import SpecialistView from '@/views/SpecialistView.vue'

const routes = [
  {
    path: '/',
    redirect: '/especialistas',
  },
  {
    path: '/especialistas',
    name: 'Especialistas',
    component: SpecialistView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
