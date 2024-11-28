<template>
  <div class="mt-6 flex justify-center px-5 pt-4">
    <table class="border-separate border-spacing-2 text-xl">
      <tbody>
        <tr v-for="row in rows" :key="row">
          <td
            v-for="cell in columns"
            :id="`cell-${row}-${cell}`"
            :key="cell"
            class="w-16 h-16 text-center rounded-lg border-2 transition-all duration-100 border-slate-600"
            :class="cellStyles[`cell-${row}-${cell}`]"
          >
            <span>{{ cellValues[`cell-${row}-${cell}`] || '' }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { reactive } from 'vue'

/**
 * Enum for cell types in the WordGrid component.
 * @readonly
 * @enum {string}
 */
export const CellType = Object.freeze({
  UNKNOWN: 'unknown',
  ABSENT: 'absent',
  CORRECT: 'correct',
  MISPLACED: 'misplaced',
})

export default {
  name: 'WordGrid',
  props: {
    rows: {
      type: Number,
      default: 6,
    },
    columns: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      cellValues: reactive({}), // The values of the cells in the word grid.
      cellStyles: reactive({}), // The styles of the cells in the word grid.
    }
  },
  methods: {
    /**
     * Return the value of a cell thanks to its ID
     *
     * @param cellID
     *
     */
    getCellValue(cellID){
      return this.cellValues[cellID]
    },
    /**
     * Sets the value and style of a cell in the word grid.
     *
     * @param {string} cellId - The ID of the cell to update.
     * @param {string} value - The value to set in the cell.
     * @param {CellType} [type=CellType.UNKNOWN] - The type of the cell, which determines its style.
     *
     */
    setCellValue(cellId, value, type = CellType.UNKNOWN) {
      const cellElement = document.getElementById(cellId)
      const animationDuration = 200

      if (!cellElement) {
        console.warn(`Cellule ${cellId} introuvable.`)
        return
      }

      if (type === CellType.UNKNOWN) {
        this.cellValues[cellId] = value
        this.cellStyles[cellId] =
          'bg-gray-900 border-blue-600 text-white text-3xl'
        return
      }

      const [row, col] = cellId.split('-').slice(1).map(Number)
      const delay =
        (row - 1) * this.columns * animationDuration + col * animationDuration

      setTimeout(() => {
        cellElement.animate(
          [{ transform: 'rotateX(0)' }, { transform: 'rotateX(0.5turn)' }],
          { duration: animationDuration },
        )

        setTimeout(() => {
          this.cellValues[cellId] = value
          switch (type) {
            case CellType.CORRECT:
              this.cellStyles[cellId] =
                'bg-green-500 border-green-600 text-white text-3xl'
              break
            case CellType.MISPLACED:
              this.cellStyles[cellId] =
                'bg-yellow-500 border-yellow-600 text-white text-3xl'
              break
            case CellType.ABSENT:
              this.cellStyles[cellId] =
                'bg-gray-900 border-gray-600 text-white text-3xl'
              break
          }
        }, animationDuration + 10)
      }, delay)
    },
    /**
     * Verifies the word entered by the user against the target word for the current attempt.
     *
     * @param {string} targetWord - The word that the user is trying to guess.
     * @param {number} currentTry - The current attempt number.
     *
     */
    verifyWord(targetWord, currentTry) {
      if (currentTry < 1 || currentTry > this.rows) {
        console.warn('Invalid current try number.')
        return
      }

      if (targetWord.length !== this.columns) {
        console.warn('Invalid target word length.')
        return
      }

      const targetChars = targetWord.toUpperCase().split('')

      console.log(this.cellValues)
      const rowValues = []
      for (let col = 1; col <= this.columns; col++) {
        const cellId = `cell-${currentTry}-${col}`
        const cellValue = this.cellValues[cellId]?.toUpperCase() || ''
        rowValues.push({ value: cellValue, cellId })
      }

      if (rowValues.some((cell) => cell.value === '')) {
        return
      }

      const matchedIndices = new Set()

      // First pass: Mark CORRECT letters
      rowValues.forEach((cell, index) => {
        if (cell.value === targetChars[index]) {
          this.setCellValue(cell.cellId, cell.value, CellType.CORRECT)
          matchedIndices.add(index)
        }
      })

      rowValues.forEach((cell, index) => {
        if (matchedIndices.has(index)) {
          return
        }

        if (
          targetChars.includes(cell.value) &&
          targetChars.findIndex(
            (char, i) => char === cell.value && !matchedIndices.has(i),
          ) >= 0
        ) {
          this.setCellValue(cell.cellId, cell.value, CellType.MISPLACED)
          matchedIndices.add(index)
        } else {
          this.setCellValue(cell.cellId, cell.value, CellType.ABSENT)
        }
      })

      // Check for win or loss after processing the row
      setTimeout(() => {
        if (
          rowValues.map((cell) => cell.value).join('') ===
          targetWord.toUpperCase()
        ) {
          this.$emit('word-verified', true)
          console.log('🎉 Winner!')
        } else if (currentTry === this.rows) {
          this.$emit('word-verified', false)
          console.log('Game over!')
        }
      }, this.columns * 200)
    },
  },
}
</script>
