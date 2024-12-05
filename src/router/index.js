import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Game from '@/pages/Game.vue'
import History from '@/pages/History.vue'

/**
 * Array of route objects for the application.
 * Each route object contains the following properties:
 *
 * @type {Array<Object>}
 * @property {string} path - The URL path of the route.
 * @property {string} name - The name of the route.
 * @property {Object} component - The component to be rendered for the route.
 */
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
  },
  {
    path: '/history',
    name: 'History',
    component: History,
  },
]

/**
 * Creates a router instance with the specified routes.
 *
 * @constant {Object} router - The router instance.
 * @property {Object} history - The history mode to use.
 * @property {Array<Object>} routes - The routes to include in the router.
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
