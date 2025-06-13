// src/pages/RolePicker.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RolePicker() {
  const navigate = useNavigate();

  const chooseRole = (role) => {
    // store the intended role in sessionStorage
    sessionStorage.setItem('intendedRole', role);
    // navigate to login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Select Your Role</h1>
      <div className="space-y-4">
        <button
          onClick={() => chooseRole('product_manager')}
          className="w-64 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Product Manager
        </button>
        <button
          onClick={() => chooseRole('engineering_manager')}
          className="w-64 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Engineering Manager
        </button>
        <button
          onClick={() => chooseRole('team_lead')}
          className="w-64 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Team Lead
        </button>
        <button
          onClick={() => chooseRole('developer')}
          className="w-64 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Developer
        </button>
        <button
          onClick={() => chooseRole('tester')}
          className="w-64 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tester
        </button>
      </div>
    </div>
  );
}
