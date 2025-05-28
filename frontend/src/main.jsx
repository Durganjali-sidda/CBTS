// main.jsx
import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';  // App layout component
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import BugListPage from './pages/BugListPage';
import RegisterPage from './pages/RegisterPage';
import CreateBugPage from './pages/CreateBugPage';
import PrivateRoute from './components/PrivateRoute';  // Import PrivateRoute

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    <BrowserRouter>
      <Routes>
        {/* App component wraps all routes and contains the navbar/footer */}
        <Route path="/" element={<App />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          {/* Protect routes with PrivateRoute */}
          <Route element={<PrivateRoute />}>
            <Route path="bugs" element={<BugListPage />} />
            <Route path="create-bug" element={<CreateBugPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
