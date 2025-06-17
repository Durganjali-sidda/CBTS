import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  const role = user.role;

  const dashboardRoutes = {
    product_manager: '/dashboard/product-manager',
    engineering_manager: '/dashboard/engineering-manager',
    team_lead: '/dashboard/team-lead',
    developer: '/dashboard/developer',
    tester: '/dashboard/tester',
    customer: '/dashboard/customer',
  };

  const dashboardPath = dashboardRoutes[role];

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-xl font-semibold">Bug Tracker</span>

        <div className="space-x-4 flex items-center">
          {/* Common Link */}
          <Link to="/bugs" className="hover:underline">Bugs</Link>

          {/* Developer-specific: Assigned Bugs view only */}
          {role === 'developer' && (
            <Link to="/dashboard/developer" className="hover:underline">Dashboard</Link>
          )}

          {/* Team Lead */}
          {role === 'team_lead' && (
            <Link to={dashboardPath} className="hover:underline">Team Dashboard</Link>
          )}

          {/* Product Manager */}
          {role === 'product_manager' && (
            <>
              <Link to="/create-project" className="hover:underline">Create Project</Link>
              <Link to="/create-user" className="hover:underline">Add User</Link>
              <Link to={dashboardPath} className="hover:underline">Dashboard</Link>
            </>
          )}

          {/* Engineering Manager */}
          {role === 'engineering_manager' && (
            <>
              <Link to="/teams" className="hover:underline">Teams</Link>
              <Link to={dashboardPath} className="hover:underline">Dashboard</Link>
            </>
          )}

          {/* Tester */}
          {role === 'tester' && (
            <>
              <Link to="/create-bug" className="hover:underline">Report Bug</Link>
              <Link to={dashboardPath} className="hover:underline">Dashboard</Link>
            </>
          )}

          {/* Customer */}
          {role === 'customer' && (
            <>
              <Link to="/create-bug" className="hover:underline">Report Bug</Link>
              <Link to={dashboardPath} className="hover:underline">Dashboard</Link>
            </>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
