import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api"; // Make sure this path is correct

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser(); // Invalidate token on server (optional but recommended)
    } catch (error) {
      console.warn("Logout API failed (may already be logged out):", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-red-600 hover:shadow-lg transition duration-300 transform hover:scale-105"
      >
        Logout
      </button>
    </div>
  );
}

export default LogoutButton;
