import userApi from '@/api/users'

/**
 * Vuex module for managing user state.
 *
 * @module store/modules/user
 */

export default {
  /**
   * Namespaced module.
   *
   * @type {boolean}
   */
  namespaced: true,

  /**
   * Returns the initial state for the user module.
   *
   * @returns {Object} The initial state object.
   * @returns {number|null} id - The user's ID, initially null.
   * @returns {string} username - The user's username, initially 'Guest'.
   */
  state() {
    return {
      id: null,
      username: 'Guest',
    }
  },

  /**
   * Getters for the user module.
   */
  getters: {
    /**
     * Get the user state.
     *
     * @param {Object} state - The current state.
     * @returns {Object} The user state.
     */
    getUser(state) {
      return state
    },

    /**
     * Retrieves the username from the state.
     *
     * @param {Object} state - The state object containing user information.
     * @returns {string} The username from the state.
     */
    getUsername(state) {
      return state.username
    },
  },

  mutations: {
    setUser(state, { id, username }) {
      state.id = id
      state.username = username
    },
  },

  actions: {
    /**
     * Initializes the user by retrieving the user information from the API.
     * If the user does not exist, a new user is generated and saved.
     * Commits the user information to the store.
     *
     * @param {Object} context - The Vuex action context.
     * @param {Function} context.commit - The Vuex commit function.
     */
    initializeUser({ commit }) {
      let { id, username } = userApi.getUser()

      if (!id || !username) {
        const newUser = userApi.generateNewUser()
        id = newUser.id
        username = newUser.username
        console.log('Generated new user:', username)
        userApi.setUser(id, username)
      }

      commit('setUser', { id, username })
      console.log('User initialized:', { id, username })
    },
  },
}
