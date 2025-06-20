// src/context/AuthProvider.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, fetchCurrentUser } from '../services/api';
import { AuthContext } from './AuthContext';

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const redirectToDashboard = useCallback((role) => {
    switch (role) {
      case 'product_manager':
        navigate('/dashboard/product-manager');
        break;
      case 'engineering_manager':
        navigate('/dashboard/engineering-manager');
        break;
      case 'team_lead':
        navigate('/dashboard/team-lead');
        break;
      case 'developer':
        navigate('/dashboard/developer');
        break;
      case 'tester':
        navigate('/dashboard/tester');
        break;
      case 'customer':
        navigate('/dashboard/customer');
        break;
      case 'team_manager':
        navigate('/dashboard/team-manager');
        break;
      default:
        navigate('/unauthorized');
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    setAccessToken(token);

    (async () => {
      try {
        const resp = await fetchCurrentUser();
        const currentUser = resp.data;
        setUser(currentUser);
        localStorage.setItem('user', JSON.stringify(currentUser));

        // ✅ FIX: Only redirect if coming from login page
        if (location.state?.fromLogin) {
          redirectToDashboard(currentUser?.role);
        }
      } catch (err) {
        console.error('Failed to fetch current user', err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    })();
  }, [redirectToDashboard, handleLogout, location]);

  const login = async (username, password) => {
    try {
      const resp = await loginUser({ username, password });
      const { access, refresh } = resp.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setAccessToken(access);

      const userResp = await fetchCurrentUser();
      const loggedInUser = userResp.data;
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      // ✅ pass a flag to know it's a login
      navigate('/', { state: { fromLogin: true } });
    } catch (err) {
      console.error('Login failed', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout: handleLogout,
        accessToken,
        isAuthenticated: !!accessToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
