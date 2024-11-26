<template>
  <header class="relative w-full">
    <!-- Canvas pour les confettis -->
    <canvas id="canvas-confetti" class="absolute top-0 left-0 w-full h-full" />

    <!-- Conteneur principal de l'en-tête -->
    <div class="bg-slate-800 flex items-center justify-center h-16 w-full">
      <div class="absolute left-4 hidden lg:flex space-x-3">
        <button
          class="bg-slate-700 text-center h-12 w-12 rounded-md flex items-center justify-center hover:bg-slate-700 hover:bg-opacity-80"
        >
          <a id="share">
            <House />
          </a>
        </button>

        <button
          class="bg-slate-700 text-center h-12 w-12 rounded-md flex items-center justify-center hover:bg-slate-700 hover:bg-opacity-80"
        >
          <a id="gamepad">
            <Gamepad2 />
          </a>
        </button>
      </div>

      <!-- Titre principal -->
      <h1
        class="text-5xl font-bold text-white font-serif"
        style="font-family: 'Supermercado One', cursive"
      >
        Wordly
      </h1>
    </div>
  </header>
</template>

<script setup>
import { House, Gamepad2 } from 'lucide-vue-next'
</script>
