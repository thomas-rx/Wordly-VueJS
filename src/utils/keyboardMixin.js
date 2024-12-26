export default {
  data() {
    return {
      currentColumn: 1,
      currentRow: 1,
      infoMessage: '',
      isVerifying: false,
    }
  },
  methods: {
    /**
     * Handles key press events for the game.
     *
     * @param {string} key - The key that was pressed.
     * @returns {void}
     */
    async handleKeyPress(key) {
      if (this.isGameOver || this.isVerifying) {
        return
      }
      const regex = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      switch (key) {
        case 'BACKSPACE':
        case '⌫':
          if (
            this.currentColumn > 1 ||
            (this.currentColumn === this.wordLength + 1 &&
              this.$refs.wordGrid.getCellValue(
                `cell-${this.currentRow}-${this.wordLength}`,
              ) !== '')
          ) {
            if (
              this.currentColumn === this.wordLength + 1 &&
              this.$refs.wordGrid.getCellValue(
                `cell-${this.currentRow}-${this.wordLength}`,
              ) !== ''
            ) {
              this.$refs.wordGrid.setCellValue(
                `cell-${this.currentRow}-${this.wordLength}`,
                '',
              )
              this.currentColumn = this.wordLength
            } else {
              this.currentColumn--
              this.$refs.wordGrid.setCellValue(
                `cell-${this.currentRow}-${this.currentColumn}`,
                '',
              )
            }
          }
          this.saveGameState()
          break
        case 'ENTER':
        case '↲':
          if (
            this.currentColumn === this.wordLength + 1 &&
            this.currentRow <= this.maxTries
          ) {
            const guess = Array.from(
              { length: this.wordLength },
              (_, colIndex) =>
                this.$refs.wordGrid.getCellValue(
                  `cell-${this.currentRow}-${colIndex + 1}`,
                ),
            ).join('')
            this.isVerifying = true
            const beforeVerify = await this.$refs.wordGrid.beforeVerify(
              this.currentRow,
            )
            this.isVerifying = false

            if (beforeVerify) {
              this.attempts.push(guess)
              this.$refs.wordGrid.verifyWord(this.word, this.currentRow, true)
              if (this.currentRow !== this.maxTries) {
                this.currentRow++
                this.currentColumn = 1
              }
              this.saveGameState()
            } else {
              console.log("Looks like the word doesn't exist.")
              this.showInfoMessage("Le mot n'est pas dans la liste.")
            }
          } else {
            this.showInfoMessage(
              'Veuillez compléter la ligne avant de valider.',
            )
          }
          break
        default:
          if (regex.includes(key)) {
            if (this.currentColumn <= this.wordLength) {
              this.$refs.wordGrid.setCellValue(
                `cell-${this.currentRow}-${this.currentColumn}`,
                key,
              )
              this.currentColumn++
              this.saveGameState()
            }
          }
          break
      }
    },

    /**
     * Handles key press events and processes the key input.
     * If the game is over, the function returns immediately.
     * If the event type is 'keydown', it converts the key to uppercase and handles the key press.
     * Otherwise, it handles the key press directly with the event.
     *
     * @param {Event} event - The key press event object.
     */
    getTypeKeyPress(event) {
      if (this.isGameOver || this.isVerifying) {
        return
      }
      if (event.type === 'keydown') {
        this.handleKeyPress(event.key.toUpperCase())
      } else {
        this.handleKeyPress(event)
      }
    },

    /**
     * Displays an informational message to the user for 3 seconds.
     *
     * @param {string} message - The message to be displayed.
     */
    showInfoMessage(message) {
      this.infoMessage = message
      this.infoVisible = true

      setTimeout(() => {
        this.infoMessage = ''
        this.infoVisible = false
      }, 3000)
    },
  },
  mounted() {
    window.addEventListener('keydown', this.getTypeKeyPress) // Add event listener for key press events
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.getTypeKeyPress) // Remove event listener for key press events
  },
}
