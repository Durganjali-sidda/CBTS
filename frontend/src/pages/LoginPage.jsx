// src/pages/LoginPage.jsx

import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // 1) Read the chosen role from sessionStorage
  const [intendedRole, setIntendedRole] = useState(null);
  useEffect(() => {
    const role = sessionStorage.getItem("intendedRole");
    setIntendedRole(role);
  }, []);

  // 2) Track any error message to show if role mismatch
  const [error, setError] = useState("");

  // 3) When `user` changes (i.e. after login), check role
  useEffect(() => {
    // If we have a logged-in user and we know what they intended
    if (user && intendedRole) {
      if (user.role !== intendedRole) {
        // Role mismatch → force logout and show error
        setError(`You must log in as a ${intendedRole}.`);
        logout(); // This clears the token + user and navigates to /login
      } else {
        // Role matches → send to /app/bugs
        navigate("/app/bugs");
      }
    }
  }, [user, intendedRole, logout, navigate]);

  // 4) Callbacks to pass down to LoginForm
  const handleLoginSuccess = () => {
    // Clear any previous errors
    setError("");
    // At this point, `user` is set, and useEffect will handle role check & redirect
  };

  const handleLoginError = () => {
    // If login failed, show a generic message
    setError("Login failed. Check credentials.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Show LoginForm with appropriate props */}
      <LoginForm
        intendedRole={intendedRole}
        onLoginSuccess={handleLoginSuccess}
        onLoginError={handleLoginError}
      />

      {/* If we have an error (e.g. role mismatch), show it below the form */}
      {error && (
        <p className="mt-4 text-center text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}

export default LoginPage;
