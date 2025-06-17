// src/services/api.js
import axios from 'axios';

const isDocker = window.location.hostname !== 'localhost';

const API = axios.create({
  baseURL: isDocker
    ? import.meta.env.VITE_API_DOCKER
    : import.meta.env.VITE_API_LOCAL,
});

// 🔐 Attach token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔁 Refresh token on 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once and if 401 Unauthorized
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh_token');
        const res = await API.post('token/refresh/', { refresh });
        const { access } = res.data;

        localStorage.setItem('access_token', access);
        API.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        originalRequest.headers.Authorization = `Bearer ${access}`;

        return API(originalRequest); // Retry original request
      } catch  {
        // Refresh token expired or invalid
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // Optional: redirect to login
      }
    }

    return Promise.reject(error);
  }
);

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
