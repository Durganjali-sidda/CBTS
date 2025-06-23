// src/services/api.js
import axios from 'axios';

// ✅ Get API URL from global runtime config or fallback
const baseURL =
  window.__ENV__?.VITE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

console.log('🌐 Backend API URL:', baseURL);

const API = axios.create({
  baseURL,
});
// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Auto-refresh token on 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh_token');
        const res = await API.post('token/refresh/', { refresh });
        const { access } = res.data;

        localStorage.setItem('access_token', access);
        API.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        originalRequest.headers.Authorization = `Bearer ${access}`;

        return API(originalRequest);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ================== ✅ Bug APIs ==================
export const fetchBugs = () => API.get('bugs/');
export const fetchBug = (id) => API.get(`bugs/${id}/`);
export const createBug = (bugData) => API.post('bugs/', bugData);
export const updateBug = (id, bugData) => API.put(`bugs/${id}/`, bugData);
export const deleteBug = (id) => API.delete(`bugs/${id}/`);

// ================== ✅ Team + Project APIs ==================
export const fetchTeamMembers = () => API.get('teams/members/');
export const fetchProjects = () => API.get('projects/');
export const fetchTeams = () => API.get('teams/');  // ✅ Add this line

// ================== ✅ Auth APIs ==================
export const loginUser = ({ username, password }) =>
  API.post('token/', { username, password });

export const refreshToken = () => {
  const refresh = localStorage.getItem('refresh_token');
  return API.post('token/refresh/', { refresh });
};
export const registerUser = (userData) => API.post('auth/registration/', userData);
export const logoutUser = () => API.post('auth/logout/');
export const sendPasswordResetEmail = (email) => API.post('password-reset/', { email });
export const fetchCurrentUser = () => API.get('auth/user/'); // ✅ REQUIRED

// ================== ✅ Admin-only APIs ==================
export const fetchAllUsers = () => API.get('auth/users/'); // ✅ Your missing function restored

export const assignBugToUser = (bugId, userId) =>
  API.patch(`bugs/${bugId}/`, { assigned_to: userId });
