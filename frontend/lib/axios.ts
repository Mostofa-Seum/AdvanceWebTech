import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Set a default base URL so you don't have to type it everywhere
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Only run on the client side (where window is defined)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
