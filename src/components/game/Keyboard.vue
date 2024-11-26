<template>
  <div class="px-5 pt-4">
    <div
      v-for="(row, rowIndex) in keyboardRows"
      :key="rowIndex"
      class="flex justify-center mb-2"
    >
      <button
        v-for="key in row"
        :id="key"
        :key="key"
        class="w-12 h-12 m-1 bg-white text-black text-xl rounded-lg flex items-center justify-center hover:text-gray-400"
        @click="$emit('keyPress', key)"
      >
        {{ key }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    keyboardRows: {
      type: Array,
      default: () => [
        ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
        ['↲', 'W', 'X', 'C', 'V', 'B', 'N', '⌫'],
      ],
    },
  },
}
</script>
