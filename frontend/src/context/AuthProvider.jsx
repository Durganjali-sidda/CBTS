// src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, fetchCurrentUser } from '../services/api';
import { AuthContext } from './AuthContext';

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  // On mount: Check if token exists and fetch user
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    setAccessToken(token);

    (async () => {
      try {
        const resp = await fetchCurrentUser();
        const currentUser = resp.data;
        setUser(currentUser);

        // Optional: redirect to role-based dashboard
        redirectToDashboard(currentUser?.role);
      } catch (err) {
        console.error('Failed to fetch current user', err);
        localStorage.removeItem('access_token');
        setAccessToken(null);
        setUser(null);
        navigate('/login');
      }
    })();
  }, [navigate]);

  // Login handler
  const login = async (username, password) => {
    try {
      const resp = await loginUser({ username, password });
      const token = resp.data.access;

      localStorage.setItem('access_token', token);
      setAccessToken(token);

      const userResp = await fetchCurrentUser();
      const loggedInUser = userResp.data;
      setUser(loggedInUser);

      redirectToDashboard(loggedInUser?.role);
    } catch (err) {
      console.error('Login failed', err);
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('access_token');
    setAccessToken(null);
    setUser(null);
    navigate('/login');
  };

  // Role-based redirect
  const redirectToDashboard = (role) => {
    if (role === 'admin') {
      navigate('/admin-dashboard');
    } else if (role === 'project_manager') {
      navigate('/pm-dashboard');
    } else if (role === 'developer') {
      navigate('/developer-dashboard');
    } else {
      navigate('/dashboard'); // fallback
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
}
