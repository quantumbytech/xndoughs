<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <button
        @click="showAddBoxModal = true"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Add New Box
      </button>
    </div>

    <!-- Reservations Table -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Box Type
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pickup Time
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="reservation in reservations" :key="reservation.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ reservation.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ reservation.phone }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ reservation.boxType }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ reservation.pickupTime }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'bg-yellow-100 text-yellow-800': reservation.status === 'pending',
                  'bg-green-100 text-green-800': reservation.status === 'confirmed',
                  'bg-red-100 text-red-800': reservation.status === 'canceled',
                  'bg-blue-100 text-blue-800': reservation.status === 'picked-up'
                }"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ reservation.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button
                v-if="reservation.status === 'pending'"
                @click="confirmReservation(reservation.id)"
                class="text-indigo-600 hover:text-indigo-900 mr-3"
              >
                Confirm
              </button>
              <button
                v-if="reservation.status === 'confirmed'"
                @click="markAsPickedUp(reservation.id)"
                class="text-green-600 hover:text-green-900 mr-3"
              >
                Mark as Picked Up
              </button>
              <button
                @click="cancelReservation(reservation.id)"
                class="text-red-600 hover:text-red-900"
              >
                Cancel
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Box Modal -->
    <div v-if="showAddBoxModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Add New Box</h2>
        <form @submit.prevent="addNewBox" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Box Type</label>
            <input
              v-model="newBox.type"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              v-model="newBox.description"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              v-model="newBox.quantity"
              type="number"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Discount (%)</label>
            <input
              v-model="newBox.discount"
              type="number"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showAddBoxModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Box
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showAddBoxModal = ref(false)
const newBox = ref({
  type: '',
  description: '',
  quantity: 0,
  discount: 0
})

// Mock data - replace with actual data from your backend
const reservations = ref([
  {
    id: 1,
    name: 'John Doe',
    phone: '+961 70 123 456',
    boxType: 'Donut Box',
    pickupTime: '2:00 PM',
    status: 'pending'
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone: '+961 70 789 012',
    boxType: 'Croissant Box',
    pickupTime: '3:00 PM',
    status: 'confirmed'
  }
])

const confirmReservation = (id) => {
  const reservation = reservations.value.find(r => r.id === id)
  if (reservation) reservation.status = 'confirmed'
}

const markAsPickedUp = (id) => {
  const reservation = reservations.value.find(r => r.id === id)
  if (reservation) reservation.status = 'picked-up'
}

const cancelReservation = (id) => {
  const reservation = reservations.value.find(r => r.id === id)
  if (reservation) reservation.status = 'canceled'
}

const addNewBox = () => {
  // Here you would typically send the new box data to your backend
  console.log('Adding new box:', newBox.value)
  showAddBoxModal.value = false
  newBox.value = {
    type: '',
    description: '',
    quantity: 0,
    discount: 0
  }
}
</script> 