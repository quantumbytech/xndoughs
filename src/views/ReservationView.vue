<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
    <!-- Loading Screen -->
    <LoadingScreen 
      v-if="isLoading"
      :show="true"
    />

    <!-- Notifications -->
    <div class="fixed top-4 right-4 z-50 space-y-4">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="p-4 rounded-lg shadow-lg backdrop-blur-lg border animate-slide-in"
        :class="{
          'bg-green-500/10 border-green-500/20 text-green-400': notification.type === 'success',
          'bg-red-500/10 border-red-500/20 text-red-400': notification.type === 'error'
        }"
      >
        {{ notification.message }}
      </div>
    </div>

    <div class="w-full max-w-lg">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-rose-500 text-transparent bg-clip-text">
          Reserve Your Box
        </h1>
        <p class="text-gray-400">Choose your pickup time and provide your details</p>
      </div>

      <!-- Form Section -->
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Branch Selection -->
          <div>
            <label for="branch" class="block text-sm font-medium text-gray-300 mb-2">Select Branch</label>
            <select
              id="branch"
              v-model="form.branch"
              required
              class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
            >
              <option value="">Select a branch</option>
              <option value="Clemenceau">Clemenceau</option>
              <option value="Jal El Dib">Jal El Dib</option>
              <option value="Kfarehbeb">Kfarehbeb</option>
              <option value="Bliss">Bliss</option>
            </select>
          </div>

          <!-- Pickup Time -->
          <div>
            <label for="time" class="block text-sm font-medium text-gray-300 mb-2">Pickup Time</label>
            <select
              id="time"
              v-model="form.time"
              required
              class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
            >
              <option value="">Select a time</option>
              <option v-for="time in availableTimes" :key="time" :value="time">
                {{ time }}
              </option>
            </select>
          </div>

          <!-- Contact Information -->
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                v-model="form.name"
                required
                class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <div class="flex">
                <div class="flex items-center px-4 py-3 bg-gray-900 border border-gray-700 rounded-l-lg text-gray-400">
                  +961
                </div>
                <input
                  type="tel"
                  id="phone"
                  v-model="form.phone"
                  required
                  class="w-full px-4 py-3 bg-gray-900 border border-gray-700 border-l-0 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  placeholder="XX XXX XXX"
                />
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Bake your Donut
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoadingScreen from '../components/LoadingScreen.vue'
import { reservationService } from '../services/reservationService'

const router = useRouter()
const isLoading = ref(false)
const API_URL = import.meta.env.VITE_API_URL
const form = ref({
  name: '',
  phone: '',
  time: '',
  branch: ''
})

// Check availability on mount
onMounted(() => {
  const stored = localStorage.getItem('boxAvailability')
  const isAvailable = stored === null ? true : stored === 'true'
  if (!isAvailable) {
    showNotification('The reservation system is currently closed.', 'error')
    setTimeout(() => {
      router.push('/')
    }, 2000) // Give time to see the notification
  }
})

// Watch for availability changes
window.addEventListener('storage', (event) => {
  if (event.key === 'boxAvailability') {
    const isAvailable = event.newValue === 'true'
    if (!isAvailable) {
      showNotification('The reservation system is now closed.', 'error')
      setTimeout(() => {
        router.push('/')
      }, 2000) // Give time to see the notification
    }
  }
})

// Generate available times in 12-hour format from 8 PM to 12 AM
const availableTimes = computed(() => {
  const times = []
  for (let hour = 20; hour <= 23; hour++) {
    const time = new Date()
    time.setHours(hour)
    time.setMinutes(0)
    times.push(time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }))
    
    time.setMinutes(30)
    times.push(time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }))
  }
  // Add 12:00 AM
  times.push('12:00 AM')
  return times
})

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    // Show loading screen
    isLoading.value = true;

    // Format phone number with proper validation
    const formattedPhone = form.value.phone ? formatPhoneNumber(form.value.phone) : null;
    if (!formattedPhone) {
      showNotification('Please enter a valid phone number', 'error');
      isLoading.value = false;
      return;
    }

    // Create reservation object
    const reservation = {
      name: form.value.name.trim(),
      phone: formattedPhone,
      branch: form.value.branch,
      time: form.value.time,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    console.log('Submitting reservation:', reservation);

    let retryCount = 0;
    let success = false;
    let response = null;
    
    // Retry mechanism for unreliable networks
    while (retryCount < 3 && !success) {
      try {
        // Send reservation to backend
        response = await reservationService.createReservation(reservation);
        success = true;
        console.log('Reservation created:', response);
      } catch (apiError) {
        retryCount++;
        if (retryCount >= 3) {
          throw apiError; // Re-throw after 3 attempts
        }
        console.log(`Retrying... (${retryCount}/3)`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
      }
    }
    
    if (success && response) {
      // Store the reservation with the ID from the backend response
      const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      const completeReservation = {...reservation, id: response._id};
      reservations.push(completeReservation);
      localStorage.setItem('reservations', JSON.stringify(reservations));
      localStorage.setItem('latestReservation', JSON.stringify(completeReservation));

      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('newReservation', { detail: completeReservation }));

      // Show success message
      showNotification('Reservation submitted successfully!', 'success');

      // Wait exactly 3.5 seconds before redirecting
      setTimeout(() => {
        isLoading.value = false;
        router.push('/confirmation');
      }, 3500);
    }
      
  } catch (error) {
    console.error('Submission error:', error);
    isLoading.value = false;
    
    // Handle connection errors specially
    if (!navigator.onLine || error.message.includes('Network Error')) {
      showNotification('Connection error. Please check your internet and try again.', 'error', 8000);
      return;
    }
    
    // Show specific error message
    const errorMessage = error.userMessage || 
                       error.response?.data?.message || 
                       'Error submitting reservation. Please try again later.';
    
    showNotification(errorMessage, 'error');
    
    // Log detailed error for debugging
    console.log('Detailed error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
  }
};

// Helper to reset submit button
const resetSubmitButton = (button) => {
  if (!button) {
    button = document.querySelector('button[type="submit"]');
  }
  if (button) {
    button.disabled = false;
    button.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> Submit Reservation';
  }
};

// Update formatPhoneNumber function with better validation
const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  
  // Remove any non-digit characters
  const cleaned = phone.toString().replace(/\D/g, '');
  
  // Validate length (7 or 8 digits for Lebanese numbers)
  if (cleaned.length < 7 || cleaned.length > 8) return null;
  
  // Add country code if not present
  return cleaned.startsWith('961') ? cleaned : '961' + cleaned;
};

// Update validateForm function
const validateForm = () => {
  // Check if any field is empty
  if (!form.value.name?.trim() || !form.value.phone?.trim() || !form.value.time || !form.value.branch) {
    showNotification('Please fill in all fields', 'error');
    return false;
  }

  // Validate phone number format
  const formattedPhone = formatPhoneNumber(form.value.phone);
  if (!formattedPhone) {
    showNotification('Please enter a valid Lebanese phone number (7 or 8 digits)', 'error');
    return false;
  }

  return true;
};

// Add notification system with duration parameter
const notifications = ref([])

const showNotification = (message, type = 'success', duration = 5000) => {
  const id = Date.now()
  notifications.value.push({ id, message, type })
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }, duration)
}
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style> 