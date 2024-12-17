<template>
  <div>
    <canvas
      id="canvas-confetti"
      class="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
    ></canvas>
    <div
      v-if="!isLoading"
      class="z-10 justify-center flex flex-col items-center"
    >
      <WordGrid
        ref="wordGrid"
        :rows="maxTries"
        :columns="wordLength"
        @word-verified="handleWordVerification"
      @update-key-state="handleKeyStateUpdate"
      />
      <InfoBox :message="infoMessage" :is-visible="infoVisible" />
      <Keyboard
      v-if="!isGameOver"
      :keyStates="keyStates"
      @key-press="handleKeyPress"
    />
      <button v-if="!isGameOver" @click="handleCancel" class="mt-2">
        <span class="text-red-600 underline">Abandonner la partie</span>
      </button>

      <RouterLink
        v-if="isGameOver"
        to="/"
        class="flex flex-row items-center justify-center w-64 h-12 bg-white rounded-lg mt-4"
      >
        <span class="text-black">Revenir à la page principale</span>
      </RouterLink>
    </div>
  </div>
</template>

<script>
import WordGrid from '@/components/game/WordGrid.vue'
import Keyboard from '@/components/game/Keyboard.vue'
import InfoBox from '@/components/game/InfoBox.vue'
import keyboardMixin from '@/utils/keyboardMixin.js'
import confettiMixin from '@/utils/confettiMixin.js'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  components: {
    WordGrid,
    Keyboard,
    InfoBox,
  },
  mixins: [keyboardMixin, confettiMixin],
  data() {
    return {
      maxTries: 6,
      infoMessage: '',
      infoVisible: false,
      word: 'HELLO',
      wordLength: 5,
      attempts: [],
      startTime: null,
      isGameOver: false,
      isLoading: true,
      keyStates: {},
    }
  },
  computed: {
    ...mapState('games', ['currentGame']),
    ...mapGetters('user', ['getUsername']),
  },
  async mounted() {
    this.startTime = Date.now()
    const gameState = await this.loadCurrentGame()
    this.isLoading = false
    await this.$nextTick()
    if (gameState) {
      this.restoreGameState(gameState)
    } else {
      this.word = 'HELLO'
    }
  },
  methods: {
    /**
     * Records the current game in the history.
     *
     * @param {boolean} isWin - Indicates whether the game was won or lost.
     * @returns {Promise<void>} - A promise that resolves when the game is recorded.
     *
     * The function calculates the elapsed time since the game started, constructs
     * the game data object with details such as the word, attempts, result, time,
     * username, and points. It then dispatches an action to add the game data to
     * the store. If the game is recorded successfully, a success message is logged
     * to the console. If an error occurs, it is caught and logged to the console.
     */
    async recordGameInHistory(isWin) {
      const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000)
      const gameData = {
        word: this.word.toUpperCase(),
        attempts: this.attempts.map((guess) => ({
          guess,
          result: guess === this.word.toUpperCase() ? 'correct' : 'incorrect',
        })),
        result: isWin ? 'win' : 'lose',
        time: elapsedTime,
        username: this.getUsername,
        points:
          Math.max(
            0,
            Math.floor(
              (this.wordLength * 1000 - elapsedTime) /
                (this.attempts.length + 1),
            ),
          ) * (isWin ? 1 : 0),
      }

      try {
        await this.$store.dispatch('games/addGame', gameData)
        console.log('Game recorded successfully!')
      } catch (error) {
        console.error('Error recording game:', error)
      }
    },

    /**
     * Handles the verification of the guessed word.
     * If the word is correctly guessed or the maximum number of tries is exceeded,
     * it records the game in history, sets the game over state, saves the game state,
     * and displays an appropriate message.
     *
     * @param {boolean} isWin - Indicates whether the word was correctly guessed.
     */
    handleWordVerification(isWin) {
      if (this.currentRow <= this.maxTries) {
        if (isWin || this.attempts.length >= this.maxTries) {
          this.recordGameInHistory(isWin)
          this.isGameOver = true
          this.saveGameState()
          this.infoMessage = isWin ? 'Victoire !' : 'Défaite !'
          this.infoVisible = true

          if (isWin) {
            this.showConfetti()
          }
        }
      }
    },

    /**
     * Saves the current game state by dispatching an action to the Vuex store.
     */
    saveGameState() {
      const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000)

      // Save the game state after 2 seconds (to allow animations to finish)
      setTimeout(() => {
        const gameState = {
          currentRow: this.currentRow,
          currentColumn: this.currentColumn,
          word: this.word,
          attempts: this.attempts,
          cellValues: this.$refs.wordGrid.cellValues,
          cellStyles: this.$refs.wordGrid.cellStyles,
          isGameOver: this.isGameOver,
          elapsedTime,
        }

        this.$store.dispatch('games/saveCurrentGame', gameState)
      }, 1000)
    },

    /**
     * Asynchronously loads the current game state by dispatching the 'games/loadCurrentGame' action
     * from the Vuex store.
     *
     * @returns {Promise<Object>} The current game state.
     */
    async loadCurrentGame() {
      const gameState = await this.$store.dispatch('games/loadCurrentGame')
      return gameState
    },

    /**
     * Restores the game state from a given gameState object.
     *
     * @param {Object} gameState - The state of the game to be restored.
     * @param {number} gameState.currentRow - The current row in the game.
     * @param {number} gameState.currentColumn - The current column in the game.
     * @param {string} gameState.word - The word to be guessed in the game.
     * @param {Array} gameState.attempts - The list of attempts made by the player.
     * @param {number} [gameState.elapsedTime=0] - The elapsed time in seconds since the game started.
     * @param {boolean} [gameState.isGameOver=false] - Indicates if the game is over.
     * @param {Object} gameState.cellValues - The values of the cells in the word grid.
     * @param {Object} gameState.cellStyles - The styles of the cells in the word grid.
     */
    restoreGameState(gameState) {
      this.currentRow = gameState.currentRow
      this.currentColumn = gameState.currentColumn
      this.word = gameState.word
      this.attempts = gameState.attempts
      this.startTime = Date.now() - (gameState.elapsedTime || 0) * 1000
      this.isGameOver = gameState.isGameOver || false

      this.$nextTick(() => {
        Object.keys(gameState.cellValues).forEach((cellId) => {
          const value = gameState.cellValues[cellId]
          const style = gameState.cellStyles[cellId]
          this.$refs.wordGrid.setCellValue(cellId, value)
          this.$refs.wordGrid.cellStyles[cellId] = style
        })
      })
    },

    /**
     * Handles the cancellation of the current game.
     * It clears the current game state and resets relevant data properties.
     */
    async handleCancel() {
        try {
          this.isGameOver = true
          this.infoMessage = 'Vous avez abandonné la partie.'
          this.infoVisible = true
          this.saveGameState()
          this.recordGameInHistory(false)
        } catch (error) {
          console.error('Error cancelling the game:', error)
          this.infoMessage =
            'An error occurred while trying to cancel the game.'
          this.infoVisible = true
      }
    },


    handleKeyStateUpdate({ letter, state }) {
      if (!letter || !state) {
        console.warn('Invalid key state update:', { letter, state })
        return
      }

      if (!this.keyStates[letter] || this.keyStates[letter] !== 'correct') {
        this.keyStates[letter] = state
      }
    },

    ...mapActions('games', [
      'loadCurrentGame',
      'saveCurrentGame',
      'clearCurrentGame',
      'addGame',
    ]),
  },
}
</script>
