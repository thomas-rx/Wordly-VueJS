<template>
  <div
    class="font-serif flex flex-col items-center justify-start bg-gray-900 text-white h-screen overflow-hidden"
  >
    <Header />
    <router-view />
  </div>
</template>

<script>
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'

export default {
  name: 'DefaultLayout',
  components: {
    Header,
    Footer,
  },
}
</script>
