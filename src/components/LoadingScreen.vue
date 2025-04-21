<template>
  <div 
    v-if="show"
    class="fixed inset-0 bg-gray-900 bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div class="text-center">
      <div class="mb-6 relative">
        <!-- Animated Donut -->
        <div class="w-32 h-32 relative mx-auto">
          <!-- Steam animation -->
          <div class="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div class="steam steam-1">〜</div>
            <div class="steam steam-2">〜</div>
            <div class="steam steam-3">〜</div>
          </div>
          
          <!-- Outer ring animation -->
          <div class="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
          <div class="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
          
          <!-- Inner donut shape -->
          <div class="absolute inset-6 rounded-full bg-gray-900 flex items-center justify-center">
            <!-- Sprinkles animation -->
            <div class="absolute w-2 h-2 bg-pink-500 rounded-full animate-bounce" style="top: 20%; left: 70%"></div>
            <div class="absolute w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style="top: 70%; left: 20%"></div>
            <div class="absolute w-2 h-2 bg-green-500 rounded-full animate-bounce" style="top: 30%; left: 30%"></div>
            <div class="absolute w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="top: 60%; left: 80%"></div>
            <div class="absolute w-2 h-2 bg-purple-500 rounded-full animate-bounce" style="top: 80%; left: 40%"></div>
          </div>
          
          <!-- Glow effect -->
          <div class="absolute inset-0 rounded-full bg-indigo-500/10 animate-pulse filter blur-xl"></div>
        </div>
      </div>
      
      <!-- Brand name with gradient -->
      <h2 class="text-3xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-indigo-500 text-transparent bg-clip-text animate-pulse">
        XnDoughs
      </h2>
      
      <!-- Baking message -->
      <div class="space-y-2">
        <p class="text-xl font-medium text-white animate-pulse">
          Baking your Donut 🍩
        </p>
        <p class="text-gray-400 text-sm">
          {{ message || 'Please wait...' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  show: {
    type: Boolean,
    default: true
  },
  message: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
    opacity: 0;
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
    opacity: 1;
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
  animation-delay: var(--delay, 0ms);
}

/* Add different delays for sprinkles */
.animate-bounce:nth-child(1) { --delay: 0ms; }
.animate-bounce:nth-child(2) { --delay: 200ms; }
.animate-bounce:nth-child(3) { --delay: 400ms; }
.animate-bounce:nth-child(4) { --delay: 600ms; }
.animate-bounce:nth-child(5) { --delay: 800ms; }

/* Steam animation */
.steam {
  position: absolute;
  font-size: 24px;
  color: #6366f1;
  opacity: 0;
  filter: blur(1px);
}

.steam-1 {
  animation: float 3s infinite;
  animation-delay: 0s;
}

.steam-2 {
  animation: float 3s infinite;
  animation-delay: 1s;
  left: -10px;
}

.steam-3 {
  animation: float 3s infinite;
  animation-delay: 2s;
  left: 10px;
}
</style> 