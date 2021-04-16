import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/trade',
    children: [
      {
        path: '/trade',
        name: 'Trade',
        component: () => import('../views/Trade.vue')
      },
      {
        path: '/share',
        name: 'Share',
        component: () => import('../views/Share.vue')
      },
      {
        path: '/mine',
        name: 'Mine',
        component: () => import('../views/Mine.vue')
      },
      {
        path: '/clear',
        name: 'Clear',
        component: () => import('../views/Clear.vue')
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
  },
  
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
