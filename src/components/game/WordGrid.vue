<template>
  <div class="flex justify-center px-5">
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
import { checkWord } from '@/api/word'

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
    getCellValue(cellID) {
      return this.cellValues[cellID] || ''
    },
    /**
     * Sets the value and style of a cell in the word grid.
     *
     * @param {string} cellId - The ID of the cell to update.
     * @param {string} value - The value to set in the cell.
     * @param {CellType} [type=CellType.UNKNOWN] - The type of the cell, which determines its style.
     *
     */
    setCellValue(cellId, value, type = CellType.UNKNOWN, animated = true) {
      const cellElement = document.getElementById(cellId)
      const animationDuration = 200 * animated ? 200 : 0

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

      const [_, row, col] = cellId.split('-')
      const delay = col * animationDuration

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
     * Generates the word and collects row values for the current attempt.
     *
     * @param {number} currentTry - The current row number being processed.
     * @returns {[string, Array<{value: string, cellId: string}>]} An array containing:
     * - The concatenated string of cell values for the current row (`word`).
     * - An array of objects representing the row's cell values and their corresponding IDs (`rowValues`).
     */
    getAttemptWord(currentTry) {
      let word = ''
      const rowValues = []
      for (let col = 1; col <= this.columns; col++) {
        const cellId = `cell-${currentTry}-${col}`
        const cellValue = this.cellValues[cellId]?.toUpperCase() || ''
        rowValues.push({ value: cellValue, cellId })
        word += cellValue
      }
      return [word, rowValues]
    },
    /**
     * Verifies if the constructed word exists in the allowed word list.
     *
     * @param {number} currentTry - The current row number being verified.
     * @returns {Promise<boolean>} A Promise resolving to `true` if the word exists in the list,
     * otherwise `false`.
     */
    async beforeVerify(currentTry) {
      const [word] = this.getAttemptWord(currentTry)
      return await checkWord(word.toLowerCase())
    },
    /**
     * Verifies the target word against the current attempt in the word grid.
     *
     * @param {string} targetWord - The word to verify against.
     * @param {number} currentTry - The current attempt number.
     * @param {boolean} [animated=false] - Whether to animate the cell updates.
     *
     * @returns {void}
     *
     * @throws {Error} If the current try number is invalid.
     * @throws {Error} If the target word length is invalid.
     *
     * @emits {Event} word-verified - Emits true if the word is correct, false otherwise.
     */
    verifyWord(targetWord, currentTry, animated = false) {
      if (typeof targetWord !== 'string') {
        console.warn(
          'Invalid target word type, expected a string, got:',
          typeof targetWord,
        )
        return
      }

      if (targetWord.length !== this.columns) {
        console.warn(
          'Invalid target word length, expected:',
          this.columns,
          'got:',
          targetWord.length,
        )
        return
      }

      if (currentTry < 1 || currentTry > this.rows) {
        console.warn('Invalid current try number.')
        return
      }

      const [word, rowValues] = this.getAttemptWord(currentTry)
      console.debug(`Verifying ${word} against ${targetWord}`)

      const targetChars = targetWord.toUpperCase().split('')
      const targetLetterCounts = {}
      targetChars.forEach((char) => {
        targetLetterCounts[char] = (targetLetterCounts[char] || 0) + 1
      })

      const results = []
      const targetMatched = new Array(this.columns).fill(false)

      for (let i = 0; i < this.columns; i++) {
        if (rowValues[i].value === targetChars[i]) {
          results[i] = CellType.CORRECT
          targetMatched[i] = true
          targetLetterCounts[rowValues[i].value]--
        }
      }

      for (let i = 0; i < this.columns; i++) {
        if (results[i]) continue

        const letter = rowValues[i].value
        if (targetLetterCounts[letter] > 0) {
          results[i] = CellType.MISPLACED
          targetLetterCounts[letter]--
        } else {
          results[i] = CellType.ABSENT
        }
      }

      for (let i = 0; i < this.columns; i++) {
        this.setCellValue(
          rowValues[i].cellId,
          rowValues[i].value,
          results[i],
          animated,
        )

        const letter = rowValues[i].value
        if (!letter) continue

        let currentState = results[i]
        const existingState = this.keyStates?.[letter]

        if (
          !existingState ||
          (existingState === 'misplaced' && currentState === 'correct') ||
          (existingState === 'absent' && currentState !== 'absent')
        ) {
          this.$emit('update-key-state', { letter, state: currentState })
        }
      }

      setTimeout(() => {
        if (word.toLowerCase() === targetWord) {
          this.$emit('word-verified', true)
          console.log('🎉 Winner!')
        } else if (currentTry === this.rows) {
          this.$emit('word-verified', false)
          console.log('Game over!')
        }
      }, this.columns * 200)
    },
    clearGrid() {
      Object.keys(this.cellValues).forEach((cellId) => {
        this.cellValues[cellId] = ''
        this.cellStyles[cellId] = ''
      })
    },
  },
}
</script>
