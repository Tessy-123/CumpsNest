import apiClient, { isMockMode } from './apiClient';
import { MOCK_USER } from '../mocks/mockData';

export const authService = {
  async login(credentials) {
    if (isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 600)); // simulate network delay
      
      // Allow demo login
      const mockUser = {
        ...MOCK_USER,
        email: credentials.identifier.includes('@') ? credentials.identifier : MOCK_USER.email,
        phone: credentials.identifier.includes('@') ? MOCK_USER.phone : credentials.identifier,
      };

      const response = {
        user: mockUser,
        token: mockUser.token,
      };

      localStorage.setItem('campusnest_token', response.token);
      localStorage.setItem('campusnest_user', JSON.stringify(response.user));
      return response;
    }

    const { data } = await apiClient.post('/auth/login', credentials);
    if (data.token) {
      localStorage.setItem('campusnest_token', data.token);
      localStorage.setItem('campusnest_user', JSON.stringify(data.user));
    }
    return data;
  },

  async register(registrationData) {
    if (isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 700));

      const newUser = {
        id: `usr-${Date.now()}`,
        fullName: registrationData.fullName,
        email: registrationData.email,
        phone: registrationData.phone,
        university: registrationData.university,
        yearOfStudy: registrationData.yearOfStudy || '1st Year',
        campusLocation: `${registrationData.university.toUpperCase()} Campus`,
        isVerifiedStudent: true,
        token: `mock-token-${Date.now()}`,
        avatar: null,
      };

      const response = {
        user: newUser,
        token: newUser.token,
      };

      localStorage.setItem('campusnest_token', response.token);
      localStorage.setItem('campusnest_user', JSON.stringify(response.user));
      return response;
    }

    const { data } = await apiClient.post('/auth/register', registrationData);
    if (data.token) {
      localStorage.setItem('campusnest_token', data.token);
      localStorage.setItem('campusnest_user', JSON.stringify(data.user));
    }
    return data;
  },

  async loginWithGoogle(credential = null) {
    if (isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const googleUser = {
        ...MOCK_USER,
        fullName: 'Chisomo Banda (Google)',
        email: 'chisomo.banda@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        token: `mock-google-jwt-${Date.now()}`,
        authProvider: 'google',
      };

      const response = {
        user: googleUser,
        token: googleUser.token,
      };

      localStorage.setItem('campusnest_token', response.token);
      localStorage.setItem('campusnest_user', JSON.stringify(response.user));
      return response;
    }

    const { data } = await apiClient.post('/auth/google', { credential });
    if (data.token) {
      localStorage.setItem('campusnest_token', data.token);
      localStorage.setItem('campusnest_user', JSON.stringify(data.user));
    }
    return data;
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem('campusnest_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('campusnest_token');
  },

  logout() {
    localStorage.removeItem('campusnest_token');
    localStorage.removeItem('campusnest_user');
  },
};
