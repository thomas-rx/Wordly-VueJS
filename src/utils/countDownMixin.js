export default {
  methods: {
    /**
     * Set up the countDown just before the game starts
     */
    startCountDown() {
      return 600000
    },
    /**
     * Callback pour l'événement "end"
     */
    onCountdownEnd() {
      console.log('Le compte à rebours est terminé.')
      this.$emit('end')
    },
  },
}