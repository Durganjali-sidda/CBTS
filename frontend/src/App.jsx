// App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import Navbar
import Footer from './components/Footer'; // Import Footer

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content (will be populated by routed pages) */}
      <div className="flex-grow p-4">
        <Outlet /> {/* Renders the currently matched route */}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
