import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = async () => {
    try {
      await logoutUser(); // Optional: makes server-side logout call
    } catch (err) {
      console.warn("Logout failed or already logged out:", err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/login');
    }
  };

  return (
    <header className="bg-blue-600 p-4 text-white shadow-md">
      <nav className="flex justify-between items-center">
        <div className="text-lg font-semibold">
          <Link to="/" className="hover:text-gray-300 transition">Bug Tracker</Link>
        </div>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-gray-300 transition">Home</Link>
          <Link to="/bugs" className="hover:text-gray-300 transition">Bugs</Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full transition duration-300 transform hover:scale-105"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300 transition">Login</Link>
              <Link to="/register" className="hover:text-gray-300 transition">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
