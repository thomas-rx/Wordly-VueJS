<template>
  <div>
    <VueCountdown
      ref="countdown"
      :time="startCount"
      :auto-start="true"
      :interval="200"
      @end="onCountdownEnd"
      v-slot="{ minutes, seconds }"
    >
      <span class="text-2xl font-bold">
        {{ minutes.toString().padStart(2, '0') }}:
        {{ seconds.toString().padStart(2, '0') }}
      </span>
    </VueCountdown>
  </div>
</template>

<script>
import VueCountdown from '@chenfengyuan/vue-countdown'
import countDownMixin from '@/utils/countDownMixin'

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
     * Aborts the countdown by calling the abort method on the countdown component reference.
     */
    abort() {
      this.$refs.countdown.abort()
    },
    /**
     * Calculates the current time elapsed since the countdown started.
     *
     * @returns {number} The time elapsed in milliseconds.
     */
    getCurrentTime() {
      const totalDuration = this.startCountDown()
      const timeLeft = this.$refs.countdown.totalMilliseconds
      return totalDuration - timeLeft
    },
    /**
     * Emits an 'end' event when the countdown ends.
     * This method should be called when the countdown timer reaches zero.
     */
    onCountdownEnd() {
      this.$emit('end')
    },
  },
}
</script>
