// src/components/RoleBasedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * roles: array of roles allowed to view this route
 */
export default function RoleBasedRoute({ roles, children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // not logged in
    return <Navigate to="/login" replace />;
  }
  if (!roles.includes(user.role)) {
    // logged in but wrong role
    return <Navigate to="/dashboard" replace />;
  }
  // allowed
  return children || <Outlet />;
}
