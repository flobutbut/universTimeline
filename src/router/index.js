import { createRouter, createWebHistory } from 'vue-router'
import Timeline from '@/components/TimelineComponant.vue'
import ContributePage from '@/components/ContributePage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Timeline
  },
  {
    path: '/contribute',
    name: 'Contribute',
    component: ContributePage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router