import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  //Login
  {
    path: '/',
    name: 'Login',
    meta: { title: 'Login' },
    component: () => import('../components/Login.vue')
  },

  //Chats
  {
    path: '/chats',
    name: 'Chats',
    meta: { title: 'Chats' },
    component: () => import('../components/ChatsComponent.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.fullPath !== '/') {
      if (localStorage.getItem('token') == 'null' || localStorage.getItem('token') == null) {
          router.push('/')
      }
      else
      {
          document.title = to.meta.title
          next()
      }
  } else {
      next()
  }
})

export default router
