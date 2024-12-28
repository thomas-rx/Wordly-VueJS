<template>
  <div>
    <VueCountdown
      ref="countdown"
      :time="this.startCount"
      :auto-start="true"
      @end="onCountdownEnd"
      v-slot="{ minutes, seconds }"
    >
      Time Remaining: {{ minutes }} minutes, {{ seconds }} seconds.
    </VueCountdown>
  </div>
</template>

<script>
import VueCountdown from '@chenfengyuan/vue-countdown'
import countDownMixin from '@utils/countDownMixin'

export default {
  name: 'CountDown',
  components: {
    VueCountdown,
  },
  mixins: [countDownMixin],
  props: {
    startCount: {
      type: Number,
      required: true,
    },
  },
  methods: {
    /**
     * Stops the countdown timer.
     *
     * This method calls the `abort` function of the countdown component, stopping
     * the timer immediately. It is useful for scenarios where the countdown
     * needs to be halted before completion, such as when the game is canceled
     * or a user navigates away from the page.
     */
    abort() {
      this.$refs.countdown.abort()
    },
    /**
     * Retrieves the time elapsed from the countdown timer.
     *
     * @returns {number} - The interval value representing the time elapsed in milliseconds.
     */
    getCurrentTime() {
      return this.startCountDown() - this.$refs.countdown.totalMilliseconds
    },
  },
}
</script>
