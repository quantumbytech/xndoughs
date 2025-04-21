<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <select
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
    class="w-full max-w-[200px] px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
  >
    <option value="" disabled>Select reason</option>
    <option value="customer_changed_mind">Customer Changed Mind</option>
    <option value="no_show">No Show</option>
    <option value="duplicate_order">Duplicate Order</option>
    <option value="store_capacity">Store at Capacity</option>
    <option value="technical_issue">Technical Issue</option>
    <option value="other">Other</option>
  </select>
</template>

<style scoped>
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}
</style> 