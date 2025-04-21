import axios from 'axios';

// Use environment variable with reliable fallback
const API_URL = import.meta.env.VITE_API_URL || 'https://xndoughs-backend-g4pzsxbia-hasansiblines-projects.vercel.app';

// Remove trailing slash if present
const baseURL = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

console.log('API URL:', baseURL); // Log the API URL to check it

// Configure axios defaults
const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Removing withCredentials as it adds complexity to CORS
  withCredentials: false
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(config => {
  console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
  console.log('Full URL:', `${config.baseURL}${config.url}`);
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
    console.error(`API Error: ${errorMessage}`, error);
    
    // Add more specific error details for debugging
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('Error request:', error.request);
    }
    
    return Promise.reject(error);
  }
);

export const reservationService = {
  async getAllReservations() {
    try {
      const response = await apiClient.get('/api/reservations');
      return response.data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      // Return empty array instead of throwing to prevent dashboard crashes
      return [];
    }
  },

  async createReservation(reservation) {
    try {
      const response = await apiClient.post('/api/reservations', reservation);
      return response.data;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  async updateReservation(id, updates) {
    try {
      const response = await apiClient.put(`/api/reservations/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
  },

  async deleteReservation(id) {
    try {
      await apiClient.delete(`/api/reservations/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting reservation:', error);
      throw error;
    }
  }
}; 