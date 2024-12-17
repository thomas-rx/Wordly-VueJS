<template>
  <div>
    <VueCountdown
      ref="countdown"
      :time="this.startcount"
      @end="onCountdownEnd"
      v-slot="{ minutes, seconds }"
    >
      Time Remaining: {{ minutes }} minutes, {{ seconds }} seconds.
    </VueCountdown>
  </div>
</template>

<script>
import VueCountdown from '@chenfengyuan/vue-countdown' // Import du composant
import countDownMixin from '@utils/countDownMixin'

export default {
  name: 'CountDown',
  components: {
    VueCountdown, // Enregistrement du composant
  },
  mixins: [countDownMixin],
  props: {
    startcount: {
      type: Number,
      required: true,
    },
  },
  methods: {
    /**
     *
     */
    abort() {
      this.$refs.countdown.abort()
    },
    /**
     *
     * @returns {number}
     */
    getCurrentTime() {
      return this.countDownTime
    },
  },
}
</script>

<style scoped>
/* Ajoutez des styles spécifiques au composant si nécessaire */
</style>
