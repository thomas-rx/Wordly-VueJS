<template>
  <header class="relative w-full">
    <div
      class="bg-slate-800 flex items-center justify-between h-24 w-full px-4"
    >
      <div class="hidden lg:flex space-x-3 w-1/3">
        <router-link to="/" class="button-link">
          <button
            id="home"
            :class="{
              'bg-white text-black': $route.path === '/',
              'bg-slate-700': $route.path !== '/',
            }"
            class="text-center h-12 w-12 rounded-md flex items-center justify-center hover:bg-opacity-80"
            aria-label="Home"
          >
            <House />
          </button>
        </router-link>
        <router-link
          to="/game"
          class="button-link"
          :class="{ 'active-route': $router.currentRoute === '/game' }"
        >
          <button
            :class="{
              'bg-white text-black': $route.path === '/game',
              'bg-slate-700': $route.path !== '/game',
            }"
            class="bg-slate-700 text-center h-12 w-12 rounded-md flex items-center justify-center hover:bg-opacity-80"
            aria-label="Game"
          >
            <Gamepad2 />
          </button>
        </router-link>
        <router-link
          to="/history"
          class="button-link"
          :class="{ 'active-route': $router.currentRoute === '/history' }"
        >
          <button
            :class="{
              'bg-white text-black': $route.path === '/history',
              'bg-slate-700': $route.path !== '/history',
            }"
            class="bg-slate-700 text-center h-12 w-12 rounded-md flex items-center justify-center hover:bg-opacity-80"
            aria-label="History"
          >
            <History />
          </button>
        </router-link>
      </div>

      <h1
        class="text-5xl font-bold text-white font-serif text-center flex-grow w-1/3"
        style="font-family: 'Supermercado One', cursive"
      >
        Wordly
      </h1>

      <div class="w-1/3">
        <div
          v-if="bestPlayer"
          class="text-white text-right hidden lg:flex flex-col items-end"
        >
          <span class="text-lg">Joueur de la semaine</span>
          <span class="text-md pt-1">{{ bestPlayer.username }} 🥇</span>
          <span class="text-xs">
            {{ bestPlayer.points }} points -
            {{ millisecondsToDayjs(bestPlayer.time) }}
          </span>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useCollection } from 'vuefire'
import { collection, query, orderBy, limit, where } from 'firebase/firestore'
import { House, Gamepad2, History } from 'lucide-vue-next'
import { useFirestore } from 'vuefire'
import { millisecondsToDayjs } from '@utils/dateUtils'
import dayjs from 'dayjs'

export default {
  name: 'Header',
  methods: { millisecondsToDayjs },
  components: {
    House,
    Gamepad2,
    History,
  },
  setup() {
    const firestore = useFirestore()
    const leaderboardCollection = collection(firestore, 'games')
    const startOfWeek = dayjs().startOf('week').toDate()
    const endOfWeek = dayjs().endOf('week').toDate()

    const leaderboardQuery = query(
      leaderboardCollection,
      where('date', '>=', startOfWeek),
      where('date', '<=', endOfWeek),
      where('points', '>', 0),
      orderBy('points', 'desc'),
      limit(1),
    )
    const leaderboard = useCollection(leaderboardQuery)
    const bestPlayer = computed(() => leaderboard.value?.[0] || null)

    return {
      bestPlayer,
      millisecondsToDayjs,
    }
  },
}
</script>
