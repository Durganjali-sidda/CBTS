// src/services/api.js
import axios from 'axios';

const isDocker = window.location.hostname !== 'localhost';

const API = axios.create({
  baseURL: isDocker
    ? import.meta.env.VITE_API_DOCKER
    : import.meta.env.VITE_API_LOCAL,
});

// 🔐 Auto-attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ================== Bug APIs ==================
export const fetchBugs = () => API.get('bugs/');
export const fetchBug = (id) => API.get(`bugs/${id}/`);
export const createBug = (bugData) => API.post('bugs/', bugData);
export const updateBug = (id, bugData) => API.put(`bugs/${id}/`, bugData);
export const deleteBug = (id) => API.delete(`bugs/${id}/`);

// ================== Auth APIs ==================
export const loginUser = (credentials) => API.post('token/', credentials);
export const refreshToken = () => {
  const refresh = localStorage.getItem('refresh_token');
  return API.post('token/refresh/', { refresh });
};
export const registerUser = (userData) => API.post('auth/registration/', userData);
export const logoutUser = () => API.post('auth/logout/');

// ================== Optional Admin/User APIs ==================
export const fetchCurrentUser = () => API.get('auth/user/');
export const fetchAllUsers = () => API.get('users/');
