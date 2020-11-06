import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'

const baseURL = 'http://localhost:3030'
const api = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

Vue.prototype.$baseUrl = baseURL
Vue.prototype.$http = api
Vue.config.productionTip = false

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('x-auth-token')
    if (token) {
      config.headers.common['x-auth-token'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  (error) => {
    console.log(error)
    if (error.response?.status) {
      switch (error.response?.status) {
        case 400:
        case 401:
        case 404:
          Promise.resolve(error.response)
          break
        case 403:
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath },
          })
          break
        case 440:
          localStorage.removeItem('userId')
          localStorage.removeItem('username')
          localStorage.removeItem('token')
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath },
          })
          break
        case 502:
          setTimeout(() => {
            router.replace({
              path: '/login',
              query: {
                redirect: router.currentRoute.fullPath,
              },
            })
          }, 1000)
      }
      return Promise.reject(error.response)
    }
  }
)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
