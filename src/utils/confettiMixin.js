import ConfettiGenerator from 'confetti-js'

export default {
  methods: {
    showConfetti() {
      const confettiSettings = {
        target: 'canvas-confetti',
        size: 1.3,
        start_from_edge: true,
        respawn: false,
        clock: 25,
        max: 200,
        rotate: true,
        colors: [
          [165, 104, 246],
          [230, 61, 135],
          [0, 199, 228],
          [253, 214, 126],
        ],
        animate: true,
      }

      const confetti = new ConfettiGenerator(confettiSettings)
      confetti.render()
    },
  },
}
