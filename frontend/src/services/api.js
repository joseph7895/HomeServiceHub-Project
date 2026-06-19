import axios from 'axios';

// Set up base Axios client
const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Outgoing Request Interceptor: Inject JWT token into headers dynamically
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Unified Error handling helper
const handleApiError = (error) => {
  const message =
    error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : error.message || 'An unexpected networking issue occurred';
  throw new Error(message);
};

// API Services
export const authService = {
  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  login: async (credentials) => {
    try {
      const response = await API.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  getProfile: async () => {
    try {
      const response = await API.get('/auth/profile');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  updateProfile: async (profileData) => {
    try {
      const response = await API.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export const workerService = {
  getWorkers: async (params) => {
    try {
      const response = await API.get('/workers', { params });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  getWorkerById: async (id) => {
    try {
      const response = await API.get(`/workers/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  updateAvailability: async (availabilityData) => {
    try {
      const response = await API.put('/workers/availability', availabilityData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const response = await API.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  getBookings: async () => {
    try {
      const response = await API.get('/bookings');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  getBookingById: async (id) => {
    try {
      const response = await API.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  updateBookingStatus: async (id, statusData) => {
    try {
      const response = await API.put(`/bookings/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export const reviewService = {
  createReview: async (reviewData) => {
    try {
      const response = await API.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  getWorkerReviews: async (workerId) => {
    try {
      const response = await API.get(`/reviews/worker/${workerId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export const adminService = {
  getStats: async () => {
    try {
      const response = await API.get('/admin/stats');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  getUsers: async () => {
    try {
      const response = await API.get('/admin/users');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  deleteUser: async (id) => {
    try {
      const response = await API.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  toggleWorkerApproval: async (id, data) => {
    try {
      const response = await API.put(`/admin/workers/${id}/approve`, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export const uploadService = {
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await API.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default API;
