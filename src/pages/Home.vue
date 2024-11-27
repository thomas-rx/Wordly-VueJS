<template>
    <Header />
    <router-link to="/history">
      History
    </router-link>
    <router-link to="/game">
      New Game
    </router-link>
    <Footer />
</template>

<script>
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'

export default {
  name: 'Home',
  components: { Footer, Header },
  data() {
    return {}
  },
}
</script>

<style scoped></style>