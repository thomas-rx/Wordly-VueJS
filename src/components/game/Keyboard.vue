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
        :class="[
          'w-12 h-12 m-1 text-xl rounded-lg flex items-center justify-center focus:outline-none',
          keyStates[key] === 'misplaced'
            ? 'bg-yellow-500'
            : keyStates[key] === 'correct'
              ? 'bg-green-500'
              : 'bg-white text-black',
        ]"
        :disabled="keyStates[key] === 'absent'"
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
    keyStates: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
