import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import {AuthContext} from '../context/AuthContext';

const Layout = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {user && <Navbar />}  {/* Show Navbar only after login */}
      <div className="flex-grow p-4">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
