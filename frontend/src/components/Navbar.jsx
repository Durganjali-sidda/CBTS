import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  if (!user) return null; // Just in case

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-xl font-semibold">Bug Tracker</span>

        <div className="space-x-4">
          <Link to="/bugs" className="hover:underline">Bugs</Link>

          {user.role === 'developer' && (
            <>
              <Link to="/create-bug" className="hover:underline">Create Bug</Link>
              <Link to="/dashboard/developer" className="hover:underline">Dashboard</Link>
            </>
          )}

          {user.role === 'product_manager' && (
            <Link to="/dashboard/product-manager" className="hover:underline">Dashboard</Link>
          )}

          {user.role === 'engineering_manager' && (
            <Link to="/dashboard/engineering-manager" className="hover:underline">Dashboard</Link>
          )}

          {user.role === 'team_lead' && (
            <Link to="/dashboard/team-lead" className="hover:underline">Dashboard</Link>
          )}

          {user.role === 'tester' && (
            <Link to="/dashboard/tester" className="hover:underline">Dashboard</Link>
          )}

          {user.role === 'customer' && (
            <Link to="/dashboard/customer" className="hover:underline">Dashboard</Link>
          )}

          <button onClick={logoutUser} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
