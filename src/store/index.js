import { createStore } from 'vuex'
import user from './modules/user'
import games from './modules/games'

/**
 * Creates a Vuex store with the specified modules.
 *
 * @constant {Object} store - The Vuex store instance.
 * @property {Object} modules - The modules to include in the store.
 * @property {Object} modules.user - The user module.
 * @property {Object} modules.games - The games module.
 */
export const store = createStore({
  modules: {
    user,
    games,
  },
})
