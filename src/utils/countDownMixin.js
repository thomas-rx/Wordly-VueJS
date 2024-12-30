export default {
  methods: {
    /**
     * Returns the default remaining time in milliseconds.
     *
     * @returns {number} The default remaining time in milliseconds (10 minutes).
     */
    getDefaultRemainingTime() {
      return 10 * 1000 * 60 // 10 minutes
    },
  },
}
