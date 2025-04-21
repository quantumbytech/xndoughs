<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Header -->
    <header class="bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-4">
            <h1 class="text-2xl font-bold">{{ appName }}</h1>
            <div class="text-gray-400 text-sm">
              {{ currentDate }}
            </div>
            <div class="relative">
              <select
                v-model="selectedBranch"
                class="appearance-none pl-4 pr-10 py-2 bg-gray-900 border-2 border-indigo-500 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white min-w-[160px]"
              >
                <option value="">All Branches</option>
                <option v-for="branch in branches" :key="branch" :value="branch">
                  {{ branch }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <!-- Availability Toggle -->
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" :class="isAvailable ? 'bg-green-500' : 'bg-red-500'"></div>
              <button
                @click="toggleAvailability"
                class="px-4 py-2 rounded-md text-sm font-medium"
                :class="isAvailable ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
              >
                {{ isAvailable ? 'Set to Closed' : 'Set to Available' }}
              </button>
            </div>
            <button
              @click="handleLogout"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Notifications -->
      <div class="fixed top-20 right-4 z-50 space-y-4">
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
          <div v-if="notification.hasAction" 
            class="cursor-pointer mt-2 text-xs underline"
            @click="notification.actionCallback && notification.actionCallback()"
          >
            Click to enable
          </div>
        </div>
      </div>

      <!-- Branch Info Banner -->
      <div class="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-medium text-white">
              {{ selectedBranch ? `${selectedBranch} Branch` : 'All Branches' }}
            </h2>
            <p class="text-sm text-gray-400">
              {{ selectedBranch ? 'Viewing orders for selected branch' : 'Viewing orders for all branches' }}
            </p>
          </div>
          <div class="grid grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-yellow-500">{{ pendingCount }}</div>
              <div class="text-xs text-gray-400">Pending</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-500">{{ confirmedCount }}</div>
              <div class="text-xs text-gray-400">Confirmed</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-red-500">{{ cancelledCount }}</div>
              <div class="text-xs text-gray-400">Cancelled</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-white">{{ totalCount }}</div>
              <div class="text-xs text-gray-400">Total</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filter Section -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by name or phone..."
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div class="flex gap-2">
          <select
            v-model="statusFilter"
            class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <!-- Debug Info -->
      <div v-if="!filteredReservations.length" class="mb-4 p-6 bg-gray-800 rounded-lg text-center">
        <div class="flex flex-col items-center justify-center space-y-4">
          <svg class="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="text-lg font-medium text-gray-400">No Reservations Found</h3>
          <p class="text-sm text-gray-500">
            {{ selectedBranch 
              ? `There are no reservations yet for ${selectedBranch} branch.` 
              : 'There are no reservations yet.' }}
          </p>
        </div>
      </div>

      <!-- Reservations Table -->
      <div v-else class="bg-gray-800 shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Branch</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">OTP</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Reason</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="reservation in filteredReservations" :key="reservation.id" class="hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ reservation.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ reservation.phone }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ reservation.branch }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ reservation.time }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="reservation.status === 'pending' || reservation.status === 'cancelled'" 
                      :class="getStatusClass(reservation.status)" 
                      class="px-2 py-1 text-xs rounded-full">
                  {{ reservation.status }}
                </span>
                <select
                  v-else
                  v-model="reservation.status"
                  @change="handleStatusChange(reservation)"
                  :class="getStatusClass(reservation.status)"
                  class="px-2 py-1 text-xs rounded-full bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <option value="confirmed">confirmed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="getOTPClass(reservation)">{{ reservation.otp || 'Not Generated' }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <div class="flex items-center gap-2">
                  <button
                    v-if="reservation.status === 'pending'"
                    @click="confirmReservation(reservation)"
                    class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    v-if="reservation.status === 'pending'"
                    @click="cancelReservation(reservation)"
                    class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <select
                  v-if="reservation.status === 'cancelled'"
                  v-model="reservation.cancellationReason"
                  @change="updateCancellationReason(reservation)"
                  class="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="" disabled>Select reason</option>
                  <option value="customer_changed_mind">Customer Changed Mind</option>
                  <option value="no_show">No Show</option>
                  <option value="duplicate_order">Duplicate Order</option>
                  <option value="store_capacity">Store at Capacity</option>
                  <option value="technical_issue">Technical Issue</option>
                  <option value="other">Other</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Archive and Export Buttons -->
      <div class="mt-6 flex justify-end gap-4">
        <button
          @click="exportToCSV"
          class="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
          :class="[
            isExportUrgent 
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
              : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
          ]"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Today's Sales
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { notificationService } from '@/services/NotificationService'
import ReasonSelect from '@/components/ReasonSelect.vue'
import { reservationService } from '../services/reservationService'

const router = useRouter()
const notifications = ref([])
const reservations = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const selectedBranch = ref('')
const isAvailable = ref(true)
const notificationInterval = ref(null)
const soundInterval = ref(null)
const pollingInterval = ref(null)
const isInitialLoad = ref(true)
const audioContext = ref(null)

// Environment variables
const appName = ref(process.env.VITE_APP_NAME || 'XN Doughs Admin')
const apiUrl = process.env.VITE_API_URL || 'http://localhost:3000/api'

// Get branches from environment variable or use default list
const branches = process.env.VITE_BRANCHES ? 
  JSON.parse(process.env.VITE_BRANCHES) : 
  ['Clemenceau', 'Jal El Dib', 'Kfarehbeb', 'Bliss']

// Status priority order constant
const STATUS_PRIORITY = {
  'pending': 0,    // Highest priority
  'confirmed': 1,  // Medium priority
  'cancelled': 2   // Lowest priority
}

// Current date in Lebanon timezone
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    timeZone: 'Asia/Beirut',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Filtered reservations
const filteredReservations = computed(() => {
  let filtered = [...reservations.value]

  // Branch filter - Always apply branch filter first if selected
  if (selectedBranch.value) {
    filtered = filtered.filter(r => r.branch === selectedBranch.value)
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(r => r.status === statusFilter.value)
  }

  // Search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(r => 
      r.name.toLowerCase().includes(query) ||
      r.phone.includes(query)
    )
  }

  return filtered.sort((a, b) => {
    // Compare status priorities
    const statusCompare = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]
    if (statusCompare !== 0) return statusCompare
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
})

// Computed counts - Only count for current branch if selected
const pendingCount = computed(() => {
  return filteredReservations.value.filter(r => r.status === 'pending').length
})

const confirmedCount = computed(() => {
  return filteredReservations.value.filter(r => r.status === 'confirmed').length
})

const cancelledCount = computed(() => {
  return filteredReservations.value.filter(r => r.status === 'cancelled').length
})

const totalCount = computed(() => {
  return filteredReservations.value.length
})

// Function to create beep sound
const createBeep = () => {
  try {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    }

    const oscillator = audioContext.value.createOscillator()
    const gainNode = audioContext.value.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.value.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(1000, audioContext.value.currentTime) // Frequency in hertz
    gainNode.gain.setValueAtTime(0.5, audioContext.value.currentTime) // Volume

    oscillator.start(audioContext.value.currentTime)
    oscillator.stop(audioContext.value.currentTime + 0.15) // Duration in seconds

    // Create second beep after a short delay
    setTimeout(() => {
      const oscillator2 = audioContext.value.createOscillator()
      oscillator2.connect(gainNode)
      oscillator2.type = 'sine'
      oscillator2.frequency.setValueAtTime(1000, audioContext.value.currentTime)
      oscillator2.start(audioContext.value.currentTime)
      oscillator2.stop(audioContext.value.currentTime + 0.15)
    }, 250) // 250ms delay between beeps
  } catch (error) {
    console.error('Error creating beep sound:', error)
  }
}

// Function to safely play notification sound
const playNotificationSound = async () => {
  try {
    await createBeep()
  } catch (error) {
    console.error('Error playing notification sound:', error)
    if (error.name === 'NotAllowedError') {
      showNotification(
        'Please enable sound notifications to hear new order alerts',
        'error',
        0,
        true,
        () => {
          // Try playing again when user interacts
          playNotificationSound()
        }
      )
    }
  }
}

// Function to start repeating notification sound
const startRepeatingSound = () => {
  // Clear any existing interval
  if (soundInterval.value) {
    clearInterval(soundInterval.value)
  }
  
  // Play immediately
  playNotificationSound()
  
  // Then repeat every 3 seconds
  soundInterval.value = setInterval(() => {
    playNotificationSound()
  }, 3000)
}

// Check if there are any pending orders
const hasPendingOrders = computed(() => {
  return reservations.value.some(r => r.status === 'pending')
})

// Watch for changes in pending orders
watch(hasPendingOrders, (newHasPending) => {
  if (newHasPending) {
    // Start repeating sound if we have pending orders, regardless of visibility
    startRepeatingSound()
  } else {
    // Stop sound if no pending orders
    stopRepeatingSound()
  }
})

// Function to start polling
const startPolling = () => {
  // Clear any existing interval
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
  }
  
  // Initial load
  loadReservations(true)
  
  // Poll every 0.5 seconds (500ms) for near real-time updates
  pollingInterval.value = setInterval(async () => {
    await loadReservations(true)
  }, 500)
}

// Load reservations
const loadReservations = async (silent = false) => {
  try {
    const previousCount = reservations.value.length
    const previousPendingIds = new Set(
      reservations.value
        .filter(r => r.status === 'pending')
        .map(r => r._id || r.id)
    )
    
    const newReservations = await reservationService.getAllReservations()
    
    // If we got an empty array and previously had reservations, it might be an error
    if (newReservations.length === 0 && previousCount > 0) {
      console.warn('Received empty reservations array. May be a connection issue. Retrying in 5s...')
      setTimeout(() => loadReservations(true), 5000)
      return
    }
    
    // Check for new pending reservations
    const newPendingReservations = newReservations.filter(
      reservation => reservation.status === 'pending' &&
      !previousPendingIds.has(reservation._id || reservation.id)
    )
    
    // Update reservations immediately
    reservations.value = newReservations
    
    // If there are new pending orders and it's not the initial load
    if (newPendingReservations.length > 0 && !isInitialLoad.value) {
      console.log('New pending orders detected:', newPendingReservations.length)
      showNotification(`${newPendingReservations.length} new order(s) received!`, 'success')
      // Ensure sound starts playing immediately for new pending orders
      startRepeatingSound()
    }
    
    // After first load, set initial load to false
    isInitialLoad.value = false
    
  } catch (error) {
    console.error('Error loading reservations:', error)
    if (!silent) {
      showNotification('Error loading reservations. Will retry in 5 seconds.', 'error')
    }
    setTimeout(() => loadReservations(true), 5000)
  }
}

// Keep track of used OTPs
const usedOTPs = new Set()

// Generate unique OTP
function generateUniqueOTP() {
  let otp
  do {
    otp = 'XND' + Math.floor(100000 + Math.random() * 900000).toString()
  } while (usedOTPs.has(otp))
  
  usedOTPs.add(otp)
  return otp
}

// Update the confirm reservation function
const confirmReservation = async (reservation) => {
  try {
    const otp = generateUniqueOTP()
    const reservationId = reservation._id || reservation.id
    
    if (!reservationId) {
      showNotification('Invalid reservation ID', 'error')
      return
    }

    await reservationService.updateReservation(reservationId, {
      status: 'confirmed',
      otp
    })
    
    // Send WhatsApp confirmation message with OTP
    const confirmationMessage = 
`Dear ${reservation.name},

Your reservation at XN Doughs has been confirmed! 🎉

Details:
• Branch: ${reservation.branch}
• Pickup Time: ${reservation.time}
• Your OTP: ${otp}

Please present this OTP when collecting your order. Our team will be ready to serve you at your scheduled time.

Thank you for choosing XN Doughs! We look forward to serving you.

Best regards,
XN Doughs Team`

    const phoneNumber = reservation.phone.startsWith('961') ? reservation.phone : `961${reservation.phone}`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(confirmationMessage)}`
    window.open(whatsappUrl, '_blank')
    
    showNotification('Reservation confirmed successfully', 'success')
    await loadReservations()
  } catch (error) {
    console.error('Error confirming reservation:', error)
    showNotification('Error confirming reservation', 'error')
  }
}

// Cancel reservation
const cancelReservation = async (reservation, isConfirmedOrder = false) => {
  try {
    const reservationId = reservation._id || reservation.id
    
    if (!reservationId) {
      showNotification('Invalid reservation ID', 'error');
      return;
    }

    await reservationService.updateReservation(reservationId, {
      status: 'cancelled'
    });
    
    // Only send WhatsApp message if cancelling a pending order
    if (!isConfirmedOrder) {
      const cancellationMessage = 
`Dear ${reservation.name},

We regret to inform you that your reservation at XN Doughs has been cancelled.

Reservation Details:
• Branch: ${reservation.branch}
• Scheduled Time: ${reservation.time}
${reservation.cancellationReason ? `• Reason: ${reservation.cancellationReason}` : ''}

We apologize for any inconvenience this may have caused. You are welcome to make a new reservation at your convenience through our website.

Thank you for your understanding.

Best regards,
XN Doughs Team`;

      const phoneNumber = reservation.phone.startsWith('961') ? reservation.phone : `961${reservation.phone}`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(cancellationMessage)}`;
      window.open(whatsappUrl, '_blank');
    }
    
    showNotification('Reservation cancelled successfully', 'success');
    await loadReservations();
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    showNotification('Error cancelling reservation', 'error');
  }
};

// Toggle availability
function toggleAvailability() {
  isAvailable.value = !isAvailable.value
  localStorage.setItem('boxAvailability', isAvailable.value.toString())
  showNotification(`Box is now ${isAvailable.value ? 'available' : 'closed'}`, 'success')
}

// Utility functions
function getStatusClass(status) {
  return {
    'bg-yellow-500/20 text-yellow-500': status === 'pending',
    'bg-green-500/20 text-green-500': status === 'confirmed',
    'bg-red-500/20 text-red-400': status === 'cancelled'
  }
}

function getOTPClass(reservation) {
  return {
    'text-gray-400': !reservation.otp,
    'text-green-400 font-medium': reservation.otp
  }
}

// Notifications with more options
function showNotification(message, type = 'success', duration = 5000, hasAction = false, actionCallback = null) {
  const id = Date.now();
  notifications.value.push({ id, message, type, hasAction, actionCallback });
  
  if (duration > 0) {
    setTimeout(() => {
      notifications.value = notifications.value.filter(n => n.id !== id);
    }, duration);
  }
}

// Handle logout
function handleLogout() {
  localStorage.removeItem('adminAuthenticated')
  router.push('/admin/login')
}

// Setup
onMounted(async () => {
  // Initialize audio context on first user interaction
  const initAudioContext = () => {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    }
    document.removeEventListener('click', initAudioContext)
  }
  document.addEventListener('click', initAudioContext)
  
  // Start polling immediately
  startPolling()
  
  // Check availability
  const stored = localStorage.getItem('boxAvailability')
  isAvailable.value = stored === null ? true : stored === 'true'

  // Add visibility change listener
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      startPolling()
    } else {
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
      }
    }
  })

  // Add storage event listener for real-time updates
  window.addEventListener('storage', (event) => {
    if (event.key === 'newReservation' || event.key === 'reservations') {
      loadReservations(true)
    }
  })
  
  // Start sound if there are pending orders
  if (hasPendingOrders.value) {
    startRepeatingSound()
  }
})

// Cleanup
onUnmounted(() => {
  stopRepeatingSound()
  if (notificationInterval.value) {
    clearTimeout(notificationInterval.value)
  }
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
  }
  // Cleanup audio context
  if (audioContext.value) {
    audioContext.value.close()
  }
  // Remove event listeners
  window.removeEventListener('storage', handleStorageChange)
  document.removeEventListener('visibilitychange', () => {})
})

// Update storage event listener
const handleStorageChange = (event) => {
  if (event.key === 'reservations') {
    loadReservations();
  }
};

// Add export functionality
const isExportUrgent = computed(() => {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  return hours === 23 && minutes >= 59
})

// Add the cancellationReasons mapping
const cancellationReasons = {
  customer_changed_mind: "Customer Changed Mind",
  no_show: "No Show",
  duplicate_order: "Duplicate Order",
  store_capacity: "Store at Capacity",
  technical_issue: "Technical Issue",
  other: "Other"
}

const exportToCSV = () => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const headers = ['Name', 'Phone', 'Branch', 'Time', 'Status', 'OTP', 'Cancellation Reason', 'Created At']
    
    const csvContent = [
      headers.join(','),
      ...filteredReservations.value.map(reservation => [
        reservation.name,
        reservation.phone,
        reservation.branch,
        reservation.time,
        reservation.status,
        reservation.otp || 'N/A',
        reservation.status === 'cancelled' ? (cancellationReasons[reservation.cancellationReason] || 'Not Specified') : 'N/A',
        new Date(reservation.createdAt).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      ].map(field => `"${field}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `xndoughs_sales_${today}.csv`)
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    showNotification('Sales data exported successfully!')
  } catch (error) {
    console.error('Error exporting sales:', error)
    showNotification('Error exporting sales data. Please try again.', 'error')
  }
}

// Update the handleStatusChange function
async function handleStatusChange(reservation) {
  if (reservation.status === 'cancelled') {
    try {
      if (confirm('Are you sure you want to cancel this confirmed order?')) {
        // Pass true to indicate it's a confirmed order being cancelled - no WhatsApp message needed
        await cancelReservation(reservation, true);
      } else {
        reservation.status = 'confirmed';
      }
    } catch (error) {
      console.error('Error changing status:', error);
      showNotification('Failed to change order status', 'error');
    }
  }
}

// Update the updateCancellationReason function
async function updateCancellationReason(reservation) {
  try {
    if (!reservation.cancellationReason) {
      reservation.cancellationReason = 'other'
    }
    loadReservations()
    showNotification('Cancellation reason updated', 'success')
  } catch (error) {
    console.error('Error updating cancellation reason:', error)
    showNotification('Failed to update cancellation reason', 'error')
  }
}

// Function to stop repeating sound
const stopRepeatingSound = () => {
  if (soundInterval.value) {
    clearInterval(soundInterval.value)
    soundInterval.value = null
  }
}
</script>

<style scoped>
select option {
  background-color: #1f2937;
  color: white;
}

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