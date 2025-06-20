import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import App from './App';
import './index.css';

// Pages
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import BugListPage from './pages/BugListPage';
import BugDetailsPage from './pages/BugDetailsPage';
import CreateBugPage from './pages/CreateBugPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ForgotPassword from './components/ForgotPassword';

// Dashboards
import ProductManagerDashboard from './pages/dashboard/ProductManagerDashboard';
import EngineeringManagerDashboard from './pages/dashboard/EngineeringManagerDashboard';
import TeamLeadDashboard from './pages/dashboard/TeamLeadDashboard';
import DeveloperDashboard from './pages/dashboard/DeveloperDashboard';
import TesterDashboard from './pages/dashboard/TesterDashboard';
import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import TeamManagerDashboard from './pages/dashboard/TeamManagerDashboard';

// Routing Guards
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';
import Layout from './components/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // AuthProvider wraps Outlet here
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'unauthorized', element: <UnauthorizedPage /> },

      {
        path: '',
        element: (
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        ),
        children: [
          {
            path: 'bugs',
            element: <Outlet />, // Parent for bug routes
            children: [
              { index: true, element: <BugListPage /> },
              { path: ':id', element: <BugDetailsPage /> },
            ],
          },
          {
            path: 'create-bug',
            element: (
              <RoleBasedRoute allowedRoles={['tester', 'customer', 'team_lead', 'admin']}>
                <CreateBugPage />
              </RoleBasedRoute>
            ),
          },
          {
            path: 'dashboard/product-manager',
            element: (
              <RoleBasedRoute allowedRoles={['product_manager']}>
                <ProductManagerDashboard />
              </RoleBasedRoute>
            ),
          },
          {
            path: 'dashboard/engineering-manager',
            element: (
              <RoleBasedRoute allowedRoles={['engineering_manager']}>
                <EngineeringManagerDashboard />
              </RoleBasedRoute>
            ),
          },
          {
            path: 'dashboard/team-lead',
            element: (
              <RoleBasedRoute allowedRoles={['team_lead']}>
                <TeamLeadDashboard />
              </RoleBasedRoute>
            ),
          },
          {
            path: 'dashboard/developer',
            element: (
              <RoleBasedRoute allowedRoles={['developer']}>
                <DeveloperDashboard />
              </RoleBasedRoute>
            ),
          },
          {
            path: 'dashboard/tester',
            element: (
              <RoleBasedRoute allowedRoles={['tester']}>
                <TesterDashboard />
              </RoleBasedRoute>
            ),
          },
          {
            path: 'dashboard/customer',
            element: (
              <RoleBasedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </RoleBasedRoute>
            ),
          },
          {
            path: 'dashboard/team-manager',
            element: (
              <RoleBasedRoute allowedRoles={['team_manager']}>
                <TeamManagerDashboard />
              </RoleBasedRoute>
            ),
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
