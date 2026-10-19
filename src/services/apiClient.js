import axios from 'axios';

export const isMockMode = import.meta.env.VITE_USE_MOCKS === 'true';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach the authentication token to API requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusnest_token');

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('campusnest_token');
      localStorage.removeItem('campusnest_user');

      window.dispatchEvent(new Event('auth:unauthorized'));

      if (window.location.pathname !== '/login') {
        window.location.href =
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;