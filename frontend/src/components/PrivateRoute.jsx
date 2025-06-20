// src/routes/PrivateRoute.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, redirectPath = '/login' }) => {
  const { user } = useContext(AuthContext);
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Delay redirect until user context is resolved
    const timer = setTimeout(() => {
      setChecking(false);
    }, 100); // wait briefly so AuthProvider can rehydrate from localStorage
    return () => clearTimeout(timer);
  }, [user]);

  if (checking) {
    return <div className="p-4 text-center text-gray-600">Loading...</div>;
  }

  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
