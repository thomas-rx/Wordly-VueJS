<template>
  <div>
    <VueCountdown
      :time="countdownTime"
      @end="onCountdownEnd"
      v-slot="{ days, hours, minutes, seconds }"
    >
      Time Remaining: {{ days }} days, {{ hours }} hours, {{ minutes }} minutes, {{ seconds }} seconds.
    </VueCountdown>
  </div>
</template>

<script>
import VueCountdown from '@chenfengyuan/vue-countdown'; // Import du composant
import countDownMixin from '@/utils/countDownMixin.js'; // Si vous utilisez un mixin personnalisé

export default {
  name: 'CountDown',
  components: {
    VueCountdown, // Enregistrement du composant
  },
  mixins: [countDownMixin], // Si vous avez un mixin pour réutiliser du code lié aux timers
  data() {
    return {
      countdownTime: 2 * 24 * 60 * 60 * 1000, // Temps en millisecondes (2 jours ici)
    };
  },
  methods: {

  },
};
</script>

<style scoped>
/* Ajoutez des styles spécifiques au composant si nécessaire */
</style>
