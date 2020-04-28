import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import 'bootstrap'
import JQuery from 'jquery'
import 'popper.js'
import VueSweetalert2 from 'vue-sweetalert2'
import 'bootstrap/dist/css/bootstrap.min.css'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Loading from 'vue-loading-overlay';
import { ClientTable } from 'vue-tables-2';

window.$ = JQuery
Vue.use(Loading);
Vue.use(VueSweetalert2)
Vue.use(ClientTable);
Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faCoffee, faTrash, faEye, faPen, faPlus, faWindowClose)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
