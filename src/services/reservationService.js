import axios from 'axios';

// Use the environment variable or fall back to the production URL
const BASE_URL = import.meta.env.VITE_API_URL || 'https://xndoughs-backend.vercel.app';

// Remove the /api suffix if it's already in the BASE_URL
const apiBasePath = BASE_URL.endsWith('/api') ? '' : '/api';

// Configure axios defaults
const apiClient = axios.create({
  baseURL: `${BASE_URL}${apiBasePath}`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': window.location.origin // Add origin header for CORS
  },
  withCredentials: false // Changed to false for cross-domain requests in production
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(config => {
  console.log('Making request:', {
    method: config.method.toUpperCase(),
    url: `${config.baseURL}${config.url}`,
    data: config.data,
    headers: config.headers
  });
  
  // Add timestamp to prevent caching issues
  const timestamp = new Date().getTime();
  config.url += config.url.includes('?') ? `&_t=${timestamp}` : `?_t=${timestamp}`;
  
  return config;
}, error => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    console.log('Response received:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    
    // Enhance error message based on the type of error
    let errorMessage = 'An error occurred while processing your request.';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data?.message || 
                    `Server error: ${error.response.status}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'Connection error. Please check your internet connection and try again.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = 'Error setting up the request. Please try again.';
    }
    
    error.userMessage = errorMessage;
    return Promise.reject(error);
  }
);

// Utility function to retry failed requests
const retryRequest = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 1.5);
  }
};

export const reservationService = {
  async getAllReservations() {
    try {
      return await retryRequest(async () => {
        const response = await apiClient.get('/reservations');
        return response.data;
      });
    } catch (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }
  },

  async createReservation(reservation) {
    try {
      console.log('Creating reservation with data:', reservation);
      return await retryRequest(async () => {
        const response = await apiClient.post('/reservations', reservation);
        console.log('Reservation created successfully:', response.data);
        return response.data;
      });
    } catch (error) {
      console.error('Error creating reservation:', {
        error: error,
        userMessage: error.userMessage,
        data: reservation
      });
      throw error;
    }
  },

  async updateReservation(id, updates) {
    try {
      return await retryRequest(async () => {
        const response = await apiClient.put(`/reservations/${id}`, updates);
        return response.data;
      });
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
  },

  async deleteReservation(id) {
    try {
      return await retryRequest(async () => {
        const response = await apiClient.delete(`/reservations/${id}`);
        return { success: true, message: response.data?.message };
      });
    } catch (error) {
      // Try the alternative POST delete endpoint if DELETE fails
      try {
        console.log('Trying alternative delete method...');
        const response = await apiClient.post(`/reservations/${id}/delete`);
        return { success: true, message: response.data?.message };
      } catch (alternativeError) {
        console.error('Error deleting reservation (both methods failed):', {
          original: error,
          alternative: alternativeError
        });
        throw error;
      }
    }
  }
}; 