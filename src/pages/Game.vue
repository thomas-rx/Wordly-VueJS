<template>
    <!-- En-tête -->
    <Header />

    <!-- Grille de mots -->
    <WordGrid ref="wordGrid" :rows="maxTries" :columns="wordLength" />

    <!-- Zone d'information -->
    <InfoBox :message="infoMessage" :is-visible="infoVisible" />

    <!-- Clavier -->
    <Keyboard @key-press="handleKeyPress" />

    <!-- Bas de page -->
    <Footer />
</template>

<script>
import Header from '@/components/common/Header.vue'
import WordGrid, { CellType } from '@/components/game/WordGrid.vue'
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
  mounted() {
    this.testGrid()
  },
  data() {
    return {
      maxTries: 6,
      wordLength: 5,
      infoMessage: '',
      infoVisible: false,
    }
  },
  methods: {
    handleKeyPress(key) {
      console.log(`Touche pressée : ${key}`)
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
