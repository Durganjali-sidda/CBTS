// src/routes/RoleBasedRoute.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function RoleBasedRoute({ allowedRoles, children }) {
  const { user } = useContext(AuthContext);
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setChecking(false);
    }, 100); // wait briefly for context to hydrate
    return () => clearTimeout(timer);
  }, [user]);

  if (checking) {
    return <div className="p-4 text-center text-gray-600">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
}
