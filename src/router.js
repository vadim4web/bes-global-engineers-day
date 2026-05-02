import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import WideScreenAdView from './views/WideScreenAdView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/wide-screen-ad',
      name: 'wide-screen-ad',
      component: WideScreenAdView
    }
  ]
})

export default router
