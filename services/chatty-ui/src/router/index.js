import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import Game from "../views/Game.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      guest: true,
    },
  },
  {
    path: "/signup",
    name: "Register",
    component: Register,
    meta: {
      guest: true,
    },
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/game/:gameId",
    name: "Game",
    component: Game,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
]

const router = new VueRouter({
  mode: "history",
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!localStorage.getItem("x-auth-token")) {
      return next({ path: "/" })
    } else {
      return next()
    }
  } else {
    return next()
  }
})

export default router
