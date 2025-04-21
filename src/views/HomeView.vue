<template>
  <div class="min-h-[80vh] flex items-center justify-center p-6">
    <div class="w-full max-w-3xl">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-4xl sm:text-5xl font-bold mb-4 text-white">
          Today's Surplus Box
        </h1>
        <p class="text-xl text-gray-400">Reserve your box before it's gone!</p>
      </div>

      <!-- Main Card -->
      <div class="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
        <!-- Header Section -->
        <div class="p-6 sm:p-8 border-b border-gray-700/50">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 class="text-2xl sm:text-3xl font-bold text-white mb-2">Donut Box</h2>
              <p class="text-gray-400 text-lg">
                A delicious assortment of our freshly made donuts
              </p>
            </div>
            <div class="inline-flex items-center px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-xl">
              <span class="text-pink-500 font-semibold">40% OFF</span>
            </div>
          </div>
        </div>

        <!-- Content Section -->
        <div class="p-6 sm:p-8 space-y-8">
          <!-- What's Included -->
          <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
            <h3 class="text-xl font-semibold text-white mb-6">What's included:</h3>
            <ul class="space-y-4">
              <li class="flex items-center gap-4">
                <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-lg text-gray-300">X assorted donuts</span>
              </li>
              <li class="flex items-center gap-4">
                <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-lg text-gray-300">Mix of classic and specialty flavors</span>
              </li>
              <li class="flex items-center gap-4">
                <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-lg text-gray-300">Freshly made daily</span>
              </li>
            </ul>
          </div>

          <!-- Action Section -->
          <div class="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full" :class="isAvailable ? 'bg-green-500' : 'bg-red-500'"></div>
              <span class="text-lg text-gray-300">{{ isAvailable ? 'Available' : 'Closed' }}</span>
            </div>
            <button
              @click="handleNavigation"
              :class="[
                'reserve-button',
                { 'reserve-button-disabled': !isAvailable }
              ]"
              :disabled="!isAvailable"
            >
              {{ isAvailable ? 'Reserve Now' : 'Closed' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAvailable = ref(true)

// Initialize availability status from localStorage
onMounted(() => {
  const stored = localStorage.getItem('boxAvailability')
  isAvailable.value = stored === null ? true : stored === 'true'
})

// Watch for changes in localStorage
window.addEventListener('storage', (event) => {
  if (event.key === 'boxAvailability') {
    isAvailable.value = event.newValue === 'true'
  }
})

const handleNavigation = () => {
  if (isAvailable.value) {
    router.push('/reservation')
  }
}
</script>

<style scoped>
.reserve-button {
  background-color: #4f46e5;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  text-decoration: none;
  display: inline-block;
}

.reserve-button:hover:not([aria-disabled="true"]) {
  background-color: #4338ca;
  transform: translateY(-1px);
}

.reserve-button-disabled {
  background-color: #6b7280;
  cursor: not-allowed;
}
</style> 