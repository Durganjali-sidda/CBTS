// src/context/AuthContext.js
import { createContext, useContext } from 'react';

// Create the authentication context
export const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
