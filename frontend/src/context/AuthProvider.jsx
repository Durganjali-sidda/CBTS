// src/context/AuthProvider.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, fetchCurrentUser } from '../services/api';
import { AuthContext } from './AuthContext';

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Used to check current path
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  // ✅ Logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAccessToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // ✅ Role-based redirect
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
      default:
        navigate('/unauthorized');
    }
  }, [navigate]);

  // ✅ On mount: check token and fetch user (avoid redirect from public pages)
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    setAccessToken(token);

    (async () => {
      try {
        const resp = await fetchCurrentUser();
        const currentUser = resp.data;
        setUser(currentUser);

        // ✅ Only redirect if not on public pages
        const publicPaths = ['/', '/login'];
        if (!publicPaths.includes(location.pathname)) {
          redirectToDashboard(currentUser?.role);
        }
      } catch (err) {
        console.error('Failed to fetch current user', err);
        handleLogout();
      }
    })();
  }, [redirectToDashboard, handleLogout, location.pathname]);

  // ✅ Login handler
  const login = async (identifier, password) => {
    try {
      const resp = await loginUser({ username: identifier, password });
      const { access, refresh } = resp.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setAccessToken(access);

      const userResp = await fetchCurrentUser();
      const loggedInUser = userResp.data;
      setUser(loggedInUser);

      redirectToDashboard(loggedInUser?.role);
    } catch (err) {
      console.error('Login failed', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout: handleLogout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
}
