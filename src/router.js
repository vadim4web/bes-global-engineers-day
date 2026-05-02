import { createRouter, createWebHistory } from 'vue-router'
import DraftView from './views/DraftView.vue'
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
      component: WideScreenAdView,
      props: routeDateProps
    },
    {
      path: '/draft/:d(\\d{4}-\\d{2}-\\d{2})?',
      name: 'landing',
      component: DraftView,
      props: routeDateProps
    }
  ]
})

export default router
