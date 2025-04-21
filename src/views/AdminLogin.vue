<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          Admin Login
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input
              id="username"
              v-model="username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-800"
              placeholder="Username"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-800"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </div>
        
        <div v-if="error" class="text-red-500 text-sm text-center mt-2">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  try {
    // Clear any existing authentication
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('isSuperAdmin')

    // Trim whitespace from inputs
    const trimmedUsername = username.value.trim()
    const trimmedPassword = password.value.trim()

    // Define credentials for easier debugging
    const SUPER_ADMIN = {
      username: 'xndoughs_super_2024',
      password: 'XND@ughs!Super@dm1n#2024'
    }

    const REGULAR_ADMIN = {
      username: 'xndoughs_admin_2024',
      password: 'XND@ughs!Adm1n#2024'
    }

    // Log input values
    console.log('Input values:', {
      username: trimmedUsername,
      password: trimmedPassword,
      usernameLength: trimmedUsername.length,
      passwordLength: trimmedPassword.length
    })

    // Log expected values
    console.log('Expected values:', {
      superAdmin: {
        username: SUPER_ADMIN.username,
        usernameLength: SUPER_ADMIN.username.length,
        password: SUPER_ADMIN.password,
        passwordLength: SUPER_ADMIN.password.length
      },
      regularAdmin: {
        username: REGULAR_ADMIN.username,
        usernameLength: REGULAR_ADMIN.username.length,
        password: REGULAR_ADMIN.password,
        passwordLength: REGULAR_ADMIN.password.length
      }
    })

    // Check if credentials match exactly
    const isSuperAdmin = 
      trimmedUsername === SUPER_ADMIN.username && 
      trimmedPassword === SUPER_ADMIN.password

    const isRegularAdmin = 
      trimmedUsername === REGULAR_ADMIN.username && 
      trimmedPassword === REGULAR_ADMIN.password

    console.log('Comparison results:', {
      isSuperAdmin,
      isRegularAdmin,
      usernameMatch: trimmedUsername === SUPER_ADMIN.username || trimmedUsername === REGULAR_ADMIN.username,
      passwordMatch: trimmedPassword === SUPER_ADMIN.password || trimmedPassword === REGULAR_ADMIN.password
    })

    if (isSuperAdmin) {
      console.log('Super admin login successful')
      localStorage.setItem('adminAuthenticated', 'true')
      localStorage.setItem('isSuperAdmin', 'true')
      router.push('/admin/super')
      return
    }

    if (isRegularAdmin) {
      console.log('Regular admin login successful')
      localStorage.setItem('adminAuthenticated', 'true')
      localStorage.setItem('isSuperAdmin', 'false')
      router.push('/admin/dashboard')
      return
    }

    // Old credentials check (temporary for transition)
    if (trimmedUsername === 'admin' && trimmedPassword === 'xndoughs2024') {
      console.log('Old admin credentials detected')
      error.value = `Please use the new credentials:
        Username: ${REGULAR_ADMIN.username}
        Password: ${REGULAR_ADMIN.password}`
      return
    }

    if (trimmedUsername === 'superadmin' && trimmedPassword === 'xndoughs2024') {
      console.log('Old super admin credentials detected')
      error.value = `Please use the new credentials:
        Username: ${SUPER_ADMIN.username}
        Password: ${SUPER_ADMIN.password}`
      return
    }

    console.log('Login failed - invalid credentials')
    error.value = `Invalid credentials. Please use:
      For Super Admin:
      Username: ${SUPER_ADMIN.username}
      Password: ${SUPER_ADMIN.password}
      
      For Regular Admin:
      Username: ${REGULAR_ADMIN.username}
      Password: ${REGULAR_ADMIN.password}`
  } catch (err) {
    console.error('Login error:', err)
    error.value = 'An error occurred during login. Please try again.'
  }
}
</script> 