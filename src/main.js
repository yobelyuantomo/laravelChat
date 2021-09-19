import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Particles from 'particles.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueChatScroll from 'vue-chat-scroll'

Vue.use(VueChatScroll)

window.Pusher = require('pusher-js')

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.config.productionTip = false
Vue.use(Particles)
Vue.prototype.$http = axios

Vue.prototype.$api = 'https://api.nirbana.id/api'
Vue.prototype.$main = 'https://api.nirbana.id'

// Vue.prototype.$api = 'http://nirbana.tripleway.xyz/api'
// Vue.prototype.$main = 'http://nirbana.tripleway.xyz'

// Vue.prototype.$api = 'http://127.0.0.1:8000/api'
// Vue.prototype.$main = 'http://127.0.0.1:8000'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
