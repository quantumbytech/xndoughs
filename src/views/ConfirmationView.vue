<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4">
    <div class="text-center max-w-lg w-full">
      <!-- Success Icon -->
      <div class="mb-8">
        <div class="w-24 h-24 rounded-full bg-green-900/30 mx-auto flex items-center justify-center">
          <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <!-- Thank You Message -->
      <h1 class="text-4xl font-bold text-white mb-4">Thank You!</h1>
      <p class="text-green-500 text-xl mb-6">Your order has been submitted successfully</p>
      
      <!-- Don't be late message -->
      <p class="text-gray-300 mb-8">
        <span class="mx-2">🍩</span>
        Don't be late!
        <span class="mx-2">🍩</span>
      </p>

      <!-- Reservation Details Card -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 text-left space-y-4">
        <h2 class="text-2xl font-semibold text-white mb-6">Reservation Details</h2>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-400">Branch:</span>
            <span class="text-white">{{ reservation.branch }}</span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-gray-400">Pickup Time:</span>
            <span class="text-white">{{ reservation.time }}</span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-gray-400">Name:</span>
            <span class="text-white">{{ reservation.name }}</span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-gray-400">Phone:</span>
            <span class="text-white">+{{ reservation.phone }}</span>
          </div>
        </div>
      </div>

      <!-- Return Home Button -->
      <button
        @click="router.push('/')"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Return Home
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const reservation = ref({
  branch: '',
  time: '',
  name: '',
  phone: ''
})

onMounted(() => {
  // Get the latest reservation from localStorage
  try {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]')
    if (reservations.length > 0) {
      // Get the most recent reservation
      const latestReservation = reservations[reservations.length - 1]
      reservation.value = {
        branch: latestReservation.branch,
        time: latestReservation.time,
        name: latestReservation.name,
        phone: latestReservation.phone
      }
    } else {
      // If no reservation found, redirect to home
      router.push('/')
    }
  } catch (error) {
    console.error('Error loading reservation:', error)
    router.push('/')
  }
})
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}
</style> 