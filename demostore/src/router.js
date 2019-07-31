import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import store from './store'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/latest',
      name: 'latest',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/Latest.vue')
    },
    {
      path: '/tshirts',
      name: 'tshirts',
      component: () => import('./views/TShirts.vue')
    },
    {
      path: '/:category/:product',
      name: 'product',
      props: true,
      component: () => import('./views/Product.vue')
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('./views/Checkout.vue'),
      beforeEnter: (to, from, next) => {
        if(store.state.cart.subtotal > 0) {
          next()
        } else {
          next("/")
        }
      }
    },
    {
      path: '/order-complete',
      name: 'order-complete',
      component: () => import('./views/OrderComplete.vue')
    },
  ]
})
