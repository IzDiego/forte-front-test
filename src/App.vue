<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
</script>

<template>
  <main-layout />
</template>

<style>
@import '@/assets/main.css';

/* Dark mode styles */
.dark {
  color-scheme: dark;
}

/* Smooth transitions for dark mode */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom scrollbar for dark mode */
.dark ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.dark ::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark ::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
</style>
