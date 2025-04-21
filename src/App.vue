<template>
  <div class="min-h-screen flex flex-col bg-gray-900">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <AppFooter />
  </div>
</template>

<script setup>
import AppFooter from './components/AppFooter.vue'
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Ensure full height on mobile devices */
html, body {
  height: 100%;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style> 