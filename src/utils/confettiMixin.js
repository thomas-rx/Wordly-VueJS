import ConfettiGenerator from 'confetti-js'

export default {
  methods: {
    showConfetti() {
      const confettiSettings = {
        target: 'canvas-confetti',
        size: 1,
        start_from_edge: true,
        respawn: false,
        clock: 20,
        max: 150,
        rotate: true,
      }
      const confetti = new ConfettiGenerator(confettiSettings)
      confetti.render()
    },
  },
}
