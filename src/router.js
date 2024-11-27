import {createRouter, createWebHistory} from 'vue-router'
import Home from "@/pages/Home.vue";
import Game from "@/pages/Game.vue";
import History from "@/pages/History.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path : "/game",
    name : 'Game',
    component: Game
  },
  {
    path : "/history",
    name : 'History',
    component: History
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router