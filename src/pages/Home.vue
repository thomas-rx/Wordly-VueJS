<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <router-link
      to="/game"
      class="border-2 rounded-lg border-white px-14 py-4 m-5 flex items-center gap-2 animate-pulse"
    >
      <lucide-play class="w-5 h-5" /> Démarrer une partie
    </router-link>

    <router-link
      to="/history"
      class="border-2 rounded-lg border-white px-14 py-4 m-5 flex items-center gap-2"
    >
      <lucide-clock class="w-5 h-5" /> Consulter les parties précédentes
    </router-link>
  </div>
</template>

<script>
import { Play, Clock } from 'lucide-vue-next'

export default {
  name: 'Home',
  components: {
    LucidePlay: Play,
    LucideClock: Clock,
  },
}
</script>
