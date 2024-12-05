<template>
  <div v-if="!isLoading">
    <WordGrid
      ref="wordGrid"
      :rows="maxTries"
      :columns="wordLength"
      @word-verified="handleWordVerification"
    />

    <InfoBox :message="infoMessage" :is-visible="infoVisible" />
    <Keyboard v-if="!isGameOver" @key-press="handleKeyPress" />
  </div>
</template>

<script>
import WordGrid from '@/components/game/WordGrid.vue'
import Keyboard from '@/components/game/Keyboard.vue'
import InfoBox from '@/components/game/InfoBox.vue'
import keyboardMixin from '@/utils/keyboardMixin.js'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  components: {
    WordGrid,
    Keyboard,
    InfoBox,
  },
  mixins: [keyboardMixin], // Keyboard logic is shared between the Game and Keyboard components with a mixin.
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
          this.infoMessage = isWin
            ? 'Congratulations! You guessed the word!'
            : 'Game over! You did not guess the word.'
          this.infoVisible = true
        }
      }
    },

    /**
     * Saves the current game state by dispatching an action to the Vuex store.
     */
    saveGameState() {
      const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000)
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
    ...mapActions('games', [
      'loadCurrentGame',
      'saveCurrentGame',
      'clearCurrentGame',
      'addGame',
    ]),
  },
}
</script>
