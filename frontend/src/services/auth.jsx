// src/services/auth.jsx
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Axios instance with baseURL and headers
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add token to headers if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// REGISTER
export const registerUser = async (username, email, password) => {
  const res = await axiosInstance.post('/register', { username, email, password });
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data.user));
  return res.data;
};

// LOGIN
export const loginUser = async (username, password) => {
  const res = await axiosInstance.post('/login', { username, password });
  localStorage.setItem('token', res.data.token);
  // Store the complete user data including email
  localStorage.setItem('user', JSON.stringify(res.data.user));
  return res.data;
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return true;
};