<template>
  <!-- En-tête -->
  <Header/>

  <!-- Grille de mots -->
  <WordGrid ref="wordGrid" :rows="maxTries" :columns="wordLength"/>

  <!-- Zone d'information -->
  <InfoBox :message="infoMessage" :is-visible="infoVisible"/>

  <!-- Clavier -->
  <Keyboard @key-press="getTypeKeyPress"/>

  <!-- Bas de page -->
  <Footer/>
</template>

<script>
import Header from '@/components/common/Header.vue'
import WordGrid, {CellType} from '@/components/game/WordGrid.vue'
import Keyboard from '@/components/game/Keyboard.vue'
import InfoBox from '@/components/game/InfoBox.vue'
import Footer from '@/components/common/Footer.vue'

export default {
  components: {
    Header,
    WordGrid,
    Keyboard,
    InfoBox,
    Footer,
  },
  data() {
    return {
      maxTries: 6,
      wordLength: 5,
      infoMessage: '',
      infoVisible: false,
      currentColumn: 1,
      countTry: 1,
      currentRow: 1,
      word: 'azert',
    }
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.getTypeKeyPress)
  },
  mounted() {
    window.addEventListener('keydown', this.getTypeKeyPress)
  },
  methods: {
    /**
     * Handles keyboard input and triggers corresponding actions based on the pressed key.
     *
     * @param {string} key - The key pressed by the user. It should represent a valid key input.
     *
     */
    handleKeyPress(key) {
      const regex = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      switch (key) {
        case 'BACKSPACE':
        case '⌫':
          if (this.currentColumn === this.wordLength && this.$refs.wordGrid.getCellValue(`cell-${this.currentRow}-${this.currentColumn}`) !== '') {
            this.$refs.wordGrid.setCellValue(
                `cell-${this.currentRow}-${this.currentColumn}`,
                '',
            )
          } else if (this.currentColumn > 1) {
            this.currentColumn--
            this.$refs.wordGrid.setCellValue(
                `cell-${this.currentRow}-${this.currentColumn}`,
                '',
            )
          }
          break
        case 'ENTER':
        case '↲':
          if (
              this.currentColumn === this.wordLength &&
              this.currentRow <= this.maxTries
          ) {
            this.$refs.wordGrid.verifyWord(this.word, this.currentRow)
            if (this.currentRow != this.maxTries) {
              this.currentRow++
              this.currentColumn = 1
            }
          }
          break
        default:
          if (regex.includes(key)) {
            this.$refs.wordGrid.setCellValue(
                `cell-${this.currentRow}-${this.currentColumn}`,
                key,
            )
            if (this.currentColumn < this.wordLength) {
              this.currentColumn++
            }
          } else {
            console.log('default case')
          }
          break
      }
    },
    /**
     * Determines the type of keyboard event and processes the key accordingly.
     *
     * @param {object} key - The keyboard event object containing details about the pressed key
     */
    getTypeKeyPress(key) {
      if (key.type === 'keydown') {
        this.handleKeyPress(key.key.toUpperCase())
      } else {
        this.handleKeyPress(key)
      }
    },
    testGrid() {
      if (this.$refs.wordGrid) {
        setTimeout(() => {
          this.$refs.wordGrid.setCellValue('cell-1-1', 'H', CellType.UNKNOWN)
          this.$refs.wordGrid.setCellValue('cell-1-2', 'E', CellType.UNKNOWN)
          this.$refs.wordGrid.setCellValue('cell-1-3', 'L', CellType.UNKNOWN)
          this.$refs.wordGrid.setCellValue('cell-1-4', 'L', CellType.UNKNOWN)
          this.$refs.wordGrid.setCellValue('cell-1-5', 'O', CellType.UNKNOWN)
        }, 1000)
        setTimeout(() => {
          this.$refs.wordGrid.verifyWord('HELLA', 1)
        }, 2000)
      } else {
        console.error('Unable to access WordGrid component.')
      }
    },
  },
}
</script>
