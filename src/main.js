/**
 * Main entry point for the Vue application.
 *
 * This script sets up and mounts the Vue application with the default layout,
 * router, and store. It also initializes the user and subscribes to user games.
 *
 */
import { createApp } from 'vue'
import DefaultLayout from '@layouts/DefaultLayout.vue'
import router from '@router'
import { store } from '@store'
import '@assets/styles/index.css'

createApp(DefaultLayout).use(store).use(router).mount('#app')

store.dispatch('user/initializeUser').then(() => {
  store.dispatch('games/subscribeToUserGames')
})

window.addEventListener('beforeunload', () => {
  alert('Unsubscribing from user games...')
  store.dispatch('games/unsubscribeFromUserGames')
})
