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
      <div class="mt-2">
        <CountDown
          id="timer"
          ref="countDown"
          :startCount="countDownTime"
          @end="handleCountdownEnd"
        />
      </div>
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
      <button v-if="!isGameOver" @click="handleCancel">
        <span class="underline text-sm">Abandonner la partie</span>
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
import { mapActions, mapGetters, mapState } from 'vuex'
import { getDailyWord } from '@/api/word'
import CountDown from '@/components/game/CountDown.vue'
import countDownMixin from '@/utils/countDownMixin'

export default {
  components: {
    WordGrid,
    Keyboard,
    InfoBox,
    CountDown,
  },
  mixins: [keyboardMixin, confettiMixin, countDownMixin],
  data() {
    return {
      maxTries: 6,
      infoMessage: '',
      infoVisible: false,
      currentColumn: 1,
      countTry: 1,
      currentRow: 1,
      word: '',
      wordLength: 5,
      attempts: [],
      isGameOver: false,
      isLoading: true,
      keyStates: {},
      elapsedTime: 0,
      countDownTime: 0,
    }
  },
  computed: {
    ...mapState('games', ['currentGame']),
    ...mapGetters('user', ['getUsername']),
  },
  async mounted() {
    const totalDuration = this.getDefaultRemainingTime()
    const gameState = await this.loadCurrentGame()
    if (gameState && gameState.isGameOver) {
      await this.$store.dispatch('games/clearCurrentGame')
      await this.startNewGame()
      this.countDownTime = totalDuration
      this.isLoading = false
    } else if (gameState && !gameState.isGameOver) {
      this.elapsedTime = gameState.time || 0
      this.countDownTime = totalDuration - this.elapsedTime
      if (this.countDownTime < 0) this.countDownTime = 0
      this.isLoading = false
      await this.$nextTick()
      this.restoreGameState(gameState)
    } else {
      await this.startNewGame()
      this.countDownTime = totalDuration
      this.isLoading = false
    }
  },
  beforeRouteLeave(_, __, next) {
    this.updateElapsedTime()
    this.saveGameState()
    next()
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
      this.updateElapsedTime()
      const gameData = {
        word: this.word.toUpperCase(),
        attempts: this.attempts.map((guess) => ({
          guess,
          result: guess === this.word.toUpperCase() ? 'correct' : 'incorrect',
        })),
        result: isWin ? 'win' : 'lose',
        time: this.elapsedTime,
        username: this.getUsername,
        points:
          Math.max(
            0,
            Math.floor(
              (this.wordLength * 1000 -
                (this.getDefaultRemainingTime() - this.countDownTime)) /
                (this.attempts.length + 1),
            ),
          ) * (isWin ? 1 : 0),
      }
      try {
        await this.$store.dispatch('games/addGame', gameData)
      } catch (error) {
        console.error('Error recording game:', error)
      }
    },
    /**
     * Starts a new game by fetching the daily word and initializing game state.
     *
     * @returns {Promise<void>} A promise that resolves when the game has started.
     * @throws Will log an error message to the console if there is an issue starting a new game.
     */
    async startNewGame() {
      try {
        await this.$store.dispatch('games/clearCurrentGame')
        this.word = await getDailyWord()
        this.currentRow = 1
        this.currentColumn = 1
        this.attempts = []
        this.isGameOver = false
        this.elapsedTime = 0
        this.countDownTime = this.getDefaultRemainingTime()
        if (this.$refs.wordGrid) {
          this.$refs.wordGrid.clearGrid()
        }
        this.saveGameState()
      } catch (error) {
        console.error('Error while starting a new game:', error)
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
          this.$refs.countDown.abort()
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
      this.updateElapsedTime()
      const gameState = {
        currentRow: this.currentRow,
        currentColumn: this.currentColumn,
        word: this.word,
        attempts: this.attempts,
        cellValues: this.$refs.wordGrid
          ? this.$refs.wordGrid.cellValues
          : this.$store.state.games.currentGame?.cellValues,
        cellStyles: this.$refs.wordGrid
          ? this.$refs.wordGrid.cellStyles
          : this.$store.state.games.currentGame?.cellStyles,
        isGameOver: this.isGameOver,
        time: this.elapsedTime,
      }
      this.$store.commit('games/setCurrentGame', gameState)
      setTimeout(() => {
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
      return await this.$store.dispatch('games/loadCurrentGame')
    },
    /**
     * Restores the game state from a given gameState object.
     *
     * @param {Object} gameState - The state of the game to be restored.
     * @param {number} gameState.currentRow - The current row in the game.
     * @param {number} gameState.currentColumn - The current column in the game.
     * @param {string} gameState.word - The word to be guessed in the game.
     * @param {Array} gameState.attempts - The list of attempts made by the player.
     * @param {number} gameState.time
     * @param {boolean} [gameState.isGameOver=false] - Indicates if the game is over.
     * @param {Object} gameState.cellValues - The values of the cells in the word grid.
     * @param {Object} gameState.cellStyles - The styles of the cells in the word grid.
     */
    restoreGameState(gameState) {
      this.currentRow = gameState.currentRow
      this.currentColumn = gameState.currentColumn
      this.word = gameState.word
      this.attempts = gameState.attempts
      this.isGameOver = gameState.isGameOver || false
      this.$nextTick(() => {
        if (
          this.$refs.wordGrid &&
          gameState.cellValues &&
          gameState.cellStyles
        ) {
          Object.keys(gameState.cellValues).forEach((cellId) => {
            const value = gameState.cellValues[cellId]
            const style = gameState.cellStyles[cellId]
            this.$refs.wordGrid.setCellValue(cellId, value)
            this.$refs.wordGrid.cellStyles[cellId] = style
          })
        }
      })
    },
    /**
     * Handles the cancellation of the current game.
     * It clears the current game state and resets relevant data properties.
     */
    async handleCancel() {
      try {
        this.$refs.countDown?.abort()
        this.updateElapsedTime()
        this.isGameOver = true
        this.infoMessage = 'Vous avez abandonné la partie.'
        this.infoVisible = true
        this.saveGameState()
        await this.recordGameInHistory(false)
      } catch (error) {
        console.error('Error cancelling the game:', error)
        this.infoMessage =
          "Une erreur s'est produite lors de la tentative d'annulation de la partie."
        this.infoVisible = true
      }
    },
    /**
     * Updates the state of a key based on the provided letter and state.
     *
     * @param {Object} param - The parameter object.
     * @param {string} param.letter - The letter of the key to update.
     * @param {string} param.state - The new state of the key (e.g., 'correct', 'incorrect').
     *
     * @returns {void}
     */
    handleKeyStateUpdate({ letter, state }) {
      if (!letter || !state) {
        console.warn('Invalid key state update:', { letter, state })
        return
      }
      if (!this.keyStates[letter] || this.keyStates[letter] !== 'correct') {
        this.keyStates[letter] = state
      }
    },
    /**
     * Handles the end of the countdown timer.
     * If the game is not already over, it sets the game state to over,
     * displays a message indicating that the time has run out and the player has lost,
     * makes the info message visible, saves the current game state,
     * and records the game result in the history as a loss.
     */
    handleCountdownEnd() {
      if (!this.isGameOver) {
        this.isGameOver = true
        this.infoMessage = 'Temps écoulé ! Vous avez perdu.'
        this.infoVisible = true
        this.saveGameState()
        this.recordGameInHistory(false)
      }
    },
    /**
     * Updates the elapsed time by retrieving the current time from the countdown component.
     * If the countdown component reference exists, it sets the elapsedTime to the current time
     * obtained from the countdown component.
     */
    updateElapsedTime() {
      if (this.$refs.countDown) {
        this.elapsedTime = this.$refs.countDown.getCurrentTime()
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
