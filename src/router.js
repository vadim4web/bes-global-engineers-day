import { createRouter, createWebHistory } from 'vue-router'
import PortraitAdView from './views/PortraitAdView.vue'
import WideScreenAdView from './views/WideScreenAdView.vue'
import { getRouteDateValue } from './utils/dateInput.js'

function routeDateProps(route) {
  return {
    date: getRouteDateValue(route)
  }
}

function redirectToHome(route) {
  return {
    name: 'home',
    params: route.params?.d ? { d: route.params.d } : {},
    query: route.query
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:d(\\d{4}-\\d{2}-\\d{2})?',
      name: 'home',
      component: WideScreenAdView,
      props: routeDateProps
    },
    {
      path: '/draft/:d(\\d{4}-\\d{2}-\\d{2})?',
      redirect: redirectToHome
    },
    {
      path: '/wide-screen-ad/:d(\\d{4}-\\d{2}-\\d{2})?',
      redirect: redirectToHome
    },
    {
      path: '/portrait-ad/:d(\\d{4}-\\d{2}-\\d{2})?',
      name: 'portrait',
      component: PortraitAdView,
      props: routeDateProps
    },
    {
      path: '/portrait/:d(\\d{4}-\\d{2}-\\d{2})?',
      redirect: (route) => ({
        name: 'portrait',
        params: route.params?.d ? { d: route.params.d } : {},
        query: route.query
      })
    }
  ]
})

export default router
