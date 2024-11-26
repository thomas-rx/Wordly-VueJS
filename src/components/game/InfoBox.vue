<template>
  <div
    class="block text-center pt-2 cursor-pointer transition-opacity duration-250 ease-in-out"
    :class="{ 'opacity-100': isVisible, 'opacity-0': !isVisible }"
  >
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: '',
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
