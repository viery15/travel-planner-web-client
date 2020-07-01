import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import MainFeature from '../views/MainFeature.vue'
import DaftarWisata from '../views/DaftarWisata.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/itinerary',
    name: 'itinerary',
    component: Home
  },
  {
    path: '/daftar_wisata',
    name: 'daftar wisata',
    component: DaftarWisata
  },
  {
    path: '/main',
    name: 'MainFeature',
    component: MainFeature
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
