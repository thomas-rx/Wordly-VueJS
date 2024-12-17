<template>
  <div class="w-screen h-24 py-14 border-slate-700 border-b border-dashed">
    <div class="flex flex-row justify-around h-full w-[90%] mx-auto">
      <div
        v-if="isLoading"
        class="w-1/6 h-5 bg-gray-700 rounded animate-pulse"
      />
      <div v-else class="w-1/4 flex flex-col items-center justify-center">
        <h1 class="text-2xl font-bold text-white">Parties jouées</h1>
        <p class="text-gray-400">{{ nbGamesPlayed }}</p>
      </div>

      <div
        v-if="isLoading"
        class="w-1/6 h-5 bg-gray-700 rounded animate-pulse"
      />
      <div v-else class="w-1/4 flex flex-col items-center justify-center">
        <h1 class="text-2xl font-bold text-white">Tentatives moyennes</h1>
        <p class="text-gray-400">{{ avgWinRate }}%</p>
      </div>

      <div
        v-if="isLoading"
        class="w-1/6 h-5 bg-gray-700 rounded animate-pulse"
      />
      <div v-else class="w-1/4 flex flex-col items-center justify-center">
        <h1 class="text-2xl font-bold text-white">Temps de jeu total</h1>
        <p class="text-gray-400">{{ totalTimePlayed }}</p>
      </div>
    </div>
  </div>

  <div class="flex h-full justify-around w-[90%] p-4 space-x-4">
    <div
      class="w-1/2 p-4 flex flex-col items-center justify-start text-white hide-scrollbar overflow-y-auto"
    >
      <h1 class="text-2xl font-bold mb-4 text-white">
        Historique de jeu pour <span class="text-blue-500">{{ username }}</span>
      </h1>
      <p class="text-gray-400">
        Vous trouverez ici l'historique de vos parties.
      </p>

      <div v-if="isLoading" class="space-y-4 pt-10 pb-[25%] w-full">
        <div
          v-for="n in 5"
          :key="n"
          class="p-4 bg-gray-700 rounded-lg animate-pulse"
        >
          <div class="h-6 w-2/3 bg-gray-600 rounded mb-2"></div>
          <div class="h-4 w-1/2 bg-gray-500 rounded mb-1"></div>
          <div class="h-4 w-1/3 bg-gray-500 rounded"></div>
        </div>
      </div>

      <!-- Actual Game History -->
      <div
        v-else-if="gamesHistory.length > 0"
        class="space-y-2 pt-10 pb-[25%] w-full"
      >
        <ul class="space-y-4">
          <li
            v-for="(game, index) in gamesHistory"
            :key="index"
            class="p-4 border-2 border-dotted rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-colors duration-200 ease-in-out"
            :class="
              selectedGame === index
                ? ' text-white'
                : game.result === 'win'
                  ? ' border-green-700 text-white'
                  : ' border-red-700 text-white'
            "
            @click="selectGame(index)"
          >
            <div class="flex justify-between w-full">
              <h2 class="text-lg font-semibold">
                Vous avez joué le {{ formatTitle(game.date) }}
              </h2>
              <p class="text-sm">
                {{
                  game.result === 'win'
                    ? 'Vous avez gagné 🎉🥳'
                    : 'Vous avez perdu 😢'
                }}
              </p>
            </div>
            <p>
              Le mot était <strong>{{ game.word }}</strong>
            </p>

            <div class="flex flex-row w-full space-x-5 pt-10">
              <p>
                Essais: <strong>{{ game.attempts.length }}</strong>
              </p>
              <p>
                Points: <strong>{{ game.points }}</strong>
              </p>
              <p>
                Temps: <strong>{{ secondsToDayjs(game.time) }}</strong>
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div v-else>
        <p class="text-gray-400 pt-10">
          Vous n'avez pas encore joué de parties.
        </p>
      </div>
    </div>

    <div class="w-1/2 p-4 flex flex-col items-center justify-start text-white">
      <h2 class="text-xl font-bold mb-4">Déroulement de la partie</h2>
      <p class="text-gray-400">
        Découvrez le déroulement de la partie sélectionnée.
      </p>
      <WordGrid
        ref="wordGrid"
        :rows="maxTries"
        :columns="wordLength"
        v-if="selectedGameData && !isLoading"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import WordGrid, { CellType } from '@/components/game/WordGrid.vue'
import { nextTick } from 'vue'
import { formatTitle, formatDate, secondsToDayjs } from '@/utils/dateUtils'

export default {
  name: 'History',
  components: {
    WordGrid,
  },
  data() {
    return {
      selectedGame: null,
      isLoading: true,
    }
  },
  mounted() {
    this.$store
      .dispatch('games/fetchGames')
      .then(() => {
        this.isLoading = false
      })
      .catch((error) => {
        console.error('Failed to fetch games:', error)
        this.isLoading = false
      })
  },
  computed: {
    ...mapGetters('games', ['getGameHistory']), // Get the game history from the store
    ...mapGetters('user', ['getUsername']), // Get the username from the store
    /**
     * Retrieves the game history.
     *
     * @returns {Array} The history of games.
     */
    gamesHistory() {
      return this.getGameHistory
    },
    /**
     * Returns the data of the selected game from the games history.
     *
     * @returns {Object|null} The data of the selected game if a game is selected, otherwise null.
     */
    selectedGameData() {
      return this.selectedGame !== null
        ? this.gamesHistory[this.selectedGame]
        : null
    },
    /**
     * Returns the maximum number of tries allowed for the selected game.
     * If `selectedGameData` is available, it returns the length of the `attempts` array.
     * Otherwise, it defaults to 6.
     *
     * @returns {number} The maximum number of tries.
     */
    maxTries() {
      return this.selectedGameData ? this.selectedGameData.attempts.length : 6
    },

    /**
     * Returns the length of the word from the selected game data.
     * If no game data is selected, it returns a default length of 5.
     *
     * @returns {number} The length of the word or 5 if no game data is selected.
     */
    wordLength() {
      return this.selectedGameData ? this.selectedGameData.word.length : 5
    },

    /**
     * Returns the number of games played.
     *
     * @returns {number} The total number of games played.
     */
    nbGamesPlayed() {
      return this.gamesHistory.length
    },
    /**
     * Calculates the average win rate as a percentage.
     *
     * @returns {string|number} The average win rate percentage, formatted to two decimal places if there are games played, otherwise 0.
     */
    avgWinRate() {
      return this.nbGamesPlayed > 0
        ? (
            (this.gamesHistory.filter((game) => game.result === 'win').length /
              this.nbGamesPlayed) *
            100
          ).toFixed(2)
        : 0
    },

    /**
     * Calculates the average number of attempts per game.
     *
     * @returns {string|number} The average number of attempts per game,
     *                          formatted to two decimal places if there are games played,
     *                          otherwise returns 0.
     */
    avgAttempts() {
      return this.nbGamesPlayed > 0
        ? (
            this.gamesHistory.reduce(
              (acc, game) => acc + game.attempts.length,
              0,
            ) / this.nbGamesPlayed
          ).toFixed(2)
        : 0
    },

    /**
     * Calculates the total time played by summing up the time of each game in the games history.
     *
     * @returns {Object} - A Day.js object representing the total time played.
     */
    totalTimePlayed() {
      const totalSeconds = this.gamesHistory.reduce((acc, game) => {
        const nbSeconds = game.time
        return acc + nbSeconds
      }, 0)
      return secondsToDayjs(totalSeconds)
    },

    /**
     * Method to retrieve the username.
     *
     * @returns {string} The username.
     */
    username() {
      return this.getUsername
    },
  },
  watch: {
    selectedGameData(newGameData) {
      if (newGameData) {
        this.populateGrid(newGameData)
      }
    },
  },
  methods: {
    formatTitle,
    formatDate,
    secondsToDayjs,

    /**
     * Selects a game based on the provided index.
     *
     * @param {number} index - The index of the game to be selected.
     */
    selectGame(index) {
      this.selectedGame = index
    },

    /**
     * Populates the word grid with game data.
     *
     * @param {Object} gameData - The game data containing attempts and the word to guess.
     * @param {Array} gameData.attempts - Array of attempts made by the player.
     * @param {string} gameData.word - The word to be guessed.
     *
     */
    populateGrid(gameData) {
      if (!gameData) return

      nextTick(() => {
        const wordGrid = this.$refs.wordGrid

        if (!wordGrid) {
          console.error('Unable to access WordGrid component.')
          return
        }

        wordGrid.clearGrid()

        gameData.attempts.forEach((attempt, rowIndex) => {
          attempt.guess.split('').forEach((letter, colIndex) => {
            const cellId = `cell-${rowIndex + 1}-${colIndex + 1}`
            wordGrid.setCellValue(cellId, letter, CellType.UNKNOWN)
          })
        })

        gameData.attempts.forEach((attempt, rowIndex) => {
          wordGrid.verifyWord(gameData.word, rowIndex + 1)
        })
      })
    },
  },
}
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: -ms-autohiding-scrollbar;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
