import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import WideScreenAdView from './views/WideScreenAdView.vue'
import { getRouteDateValue } from './utils/dateInput.js'

function routeDateProps(route) {
  return {
    date: getRouteDateValue(route)
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:d(\\d{4}-\\d{2}-\\d{2})?',
      name: 'home',
      component: HomeView,
      props: routeDateProps
    },
    {
      path: '/wide-screen-ad/:d(\\d{4}-\\d{2}-\\d{2})?',
      name: 'wide-screen-ad',
      component: WideScreenAdView,
      props: routeDateProps
    }
  ]
})

export default router
