import gamesApi from '@/api/games'

export default {
  namespaced: true,

  /**
   * State of the games module.
   * @returns {Object} The state object.
   * @property {Array} gamesHistory - Array of game history objects.
   * @property {Object} currentGame - Current game state object.
   */
  state() {
    return {
      gamesHistory: [],
      currentGame: null,
      unsubscribeFromUserGames: null,
    }
  },

  getters: {
    /**
     * Get the game history.
     * @param {Object} state - The state object.
     * @returns {Array} The games history array.
     */
    getGameHistory(state) {
      return state.gamesHistory
    },

    /**
     * Get the current game state.
     * @param {Object} state - The state object.
     * @returns {Object} The current game state object.
     * @returns {null} If no current game state is set.
     */
    getCurrentGame(state) {
      return state.currentGame
    },
  },

  mutations: {
    /**
     * Set the game history.
     * @param {Object} state - The state object.
     * @param {Array} games - The array of games to set.
     */
    setGameHistory(state, games) {
      state.gamesHistory = games
    },

    /**
     * Add a game to the history.
     * @param {Object} state - The state object.
     * @param {Object} game - The game object to add.
     */
    addGameToHistory(state, game) {
      state.gamesHistory.unshift(game)
    },

    /**
     * Sets the current game state.
     *
     * @param {Object} state - The current state of the store.
     * @param {Object} gameState - The new game state to be set.
     */
    setCurrentGame(state, gameState) {
      state.currentGame = gameState
    },

    /**
     * Clears the current game state by setting `currentGame` to null.
     *
     * @param {Object} state - The state object of the Vuex store module.
     */
    clearCurrentGame(state) {
      state.currentGame = null
    },
  },

  actions: {
    /**
     * Adds a fake game to the store.
     *
     * This function creates a fake game object with predefined values and dispatches
     * an action to add the game to the store. If there is an error during the dispatch,
     * it logs the error to the console.
     *
     * @param {Object} context - The Vuex action context.
     * @param {Function} context.dispatch - The Vuex dispatch function.
     * @returns {Promise<void>} - A promise that resolves when the game is added.
     */
    async addFakeGame({ dispatch }) {
      const fakeGame = {
        word: 'MANGO',
        attempts: [
          { guess: 'MONEY', result: 'incorrect' },
          { guess: 'MAGIC', result: 'incorrect' },
          { guess: 'MANGO', result: 'correct' },
        ],
        points: 30,
        result: 'win',
        time: 15,
      }

      try {
        await dispatch('addGame', fakeGame)
      } catch (error) {
        console.error('Error adding fake game:', error)
      }
    },

    /**
     * Adds a new game to the user's game history.
     *
     * @param {Object} context - The Vuex action context.
     * @param {Object} context.rootState - The root state of the Vuex store.
     * @param {Function} context.commit - The Vuex commit function.
     * @param {Object} gameData - The data of the game to be added.
     * @returns {Promise<void>} - A promise that resolves when the game is added.
     * @throws {Error} - Throws an error if there is an issue adding the game.
     */
    async addGame({ rootState, commit }, gameData) {
      const userId = rootState.user.id
      const username = rootState.user.username
      if (!userId) {
        console.error('User ID is required to add a game.')
        return
      }

      try {
        const game = await gamesApi.addGame(userId, username, gameData)
        commit('addGameToHistory', game)
        console.log('Game added successfully:', game.id)
      } catch (error) {
        console.error('Error adding game:', error)
      }
    },

    /**
     * Subscribes to the user's games and commits the game history to the store.
     *
     * @param {Object} context - The Vuex action context.
     * @param {Function} context.commit - The Vuex commit function.
     * @param {Object} context.rootState - The root state of the Vuex store.
     * @param {Object} context.rootState.user - The user state object.
     * @param {string} context.rootState.user.id - The ID of the current user.
     */
    subscribeToUserGames({ commit, rootState, state }) {
      const userId = rootState.user.id
      if (!userId) {
        console.error('User ID is required to subscribe to games.')
        return
      }

      const unsubscribe = gamesApi.subscribeToUserGames(userId, (games) => {
        commit('setGameHistory', games)
      })

      state.unsubscribeFromUserGames = unsubscribe
    },

    /**
     * Unsubscribes from the user's games if a subscription exists.
     *
     * @param {Object} context - The Vuex action context.
     * @param {Object} context.state - The state object of the Vuex module.
     */
    unsubscribeFromUserGames({ state }) {
      if (state.unsubscribeFromUserGames) {
        state.unsubscribeFromUserGames()
        state.unsubscribeFromUserGames = null
      }
    },

    /**
     * Fetches the games for the current user and commits the game history to the store.
     *
     * @param {Object} context - The Vuex action context.
     * @param {Function} context.commit - The Vuex commit function.
     * @param {Object} context.rootState - The root state of the Vuex store.
     * @param {Object} context.rootState.user - The user state object.
     * @param {string} context.rootState.user.id - The ID of the current user.
     *
     * @throws Will throw an error if the games cannot be fetched.
     */
    async fetchGames({ commit, rootState }) {
      const userId = rootState.user.id
      if (!userId) {
        console.error('User ID is required to fetch games.')
        return
      }

      try {
        const games = await gamesApi.fetchGames(userId)
        commit('setGameHistory', games)
      } catch (error) {
        console.error('Error fetching games:', error)
        throw error
      }
    },

    /**
     * Saves the current game state for the user.
     *
     * @param {Object} context - The Vuex action context.
     * @param {Object} context.rootState - The root state of the Vuex store.
     * @param {Function} context.commit - The Vuex commit function.
     * @param {Object} gameState - The current state of the game to be saved.
     * @returns {Promise<void>} - A promise that resolves when the game state is saved.
     */
    async saveCurrentGame({ rootState, commit }, gameState) {
      const userId = rootState.user.id
      if (!userId) {
        console.error('User ID is required to save current game.')
        return
      }

      try {
        await gamesApi.saveCurrentGame(userId, gameState)
        commit('setCurrentGame', gameState)
        console.log('Current game state saved successfully.')
      } catch (error) {
        console.error('Error saving current game state:', error)
      }
    },

    /**
     * Loads the current game state for the logged-in user.
     *
     * @param {Object} context - The Vuex action context.
     * @param {Object} context.rootState - The root state of the Vuex store.
     * @param {Function} context.commit - The Vuex commit function.
     * @returns {Promise<Object|null>} The current game state if found, otherwise null.
     */
    async loadCurrentGame({ rootState, commit }) {
      const userId = rootState.user.id
      if (!userId) {
        console.error('User ID is required to load current game.')
        return null
      }

      try {
        const gameState = await gamesApi.loadCurrentGame(userId)
        if (gameState) {
          commit('setCurrentGame', gameState)
          console.log('Current game state loaded successfully.')
          return gameState
        } else {
          console.log('No current game state found.')
          commit('clearCurrentGame')
          return null
        }
      } catch (error) {
        console.error('Error loading current game state:', error)
        return null
      }
    },

    /**
     * Clears the current game state for the user.
     *
     * This action fetches the user ID from the root state and uses it to clear the current game state
     * via the gamesApi. If the user ID is not available, it logs an error message and exits.
     * On successful clearing of the game state, it commits the 'clearCurrentGame' mutation and logs a success message.
     * If an error occurs during the API call, it logs the error message.
     *
     * @param {Object} context - The Vuex action context.
     * @param {Object} context.rootState - The root state of the Vuex store.
     * @param {Function} context.commit - The Vuex commit function.
     * @returns {Promise<void>} - A promise that resolves when the game state is cleared.
     */
    async clearCurrentGame({ rootState, commit }) {
      const userId = rootState.user.id
      if (!userId) {
        console.error('User ID is required to clear current game.')
        return
      }

      try {
        await gamesApi.clearCurrentGame(userId)
        commit('clearCurrentGame')
        console.log('Current game state cleared successfully.')
      } catch (error) {
        console.error('Error clearing current game state:', error)
      }
    },
  },
}
