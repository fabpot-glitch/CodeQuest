// ============================================
// FILE: src/services/api.js (FRONTEND ONLY - CLEAN VERSION)
// ============================================
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('codequest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('codequest_token');
      localStorage.removeItem('codequest_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== PROFILE API ENDPOINTS ==========

export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getProfileStats = async () => {
  try {
    const response = await api.get('/profile/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const uploadProfileImage = async (imageData) => {
  try {
    const response = await api.post('/profile/image', { imageData });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ========== AUTH API ENDPOINTS ==========

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('codequest_token', response.data.token);
      localStorage.setItem('codequest_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('codequest_token', response.data.token);
      localStorage.setItem('codequest_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const logout = () => {
  localStorage.removeItem('codequest_token');
  localStorage.removeItem('codequest_user');
};

export default api;