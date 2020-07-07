import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import MainFeature from '../views/MainFeature.vue'
import DaftarWisata from '../views/DaftarWisata.vue'
import Review from '../views/Review.vue'
import ManualItinerary from '../views/ManualItinerary.vue'

Vue.use(VueRouter)

const routes = [{
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
  {
    path: '/review/:id',
    name: 'review',
    component: Review
  },
  {
    path: '/ManualItinerary',
    name: 'manual itinerary',
    component: ManualItinerary
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router