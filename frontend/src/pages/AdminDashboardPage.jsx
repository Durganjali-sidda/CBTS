// pages/AdminDashboardPage.jsx
import React from "react";
import useRole from "../hooks/useRole"; // Import useRole hook

function AdminDashboardPage() {
  useRole("admin");  // Protect the route for only 'admin' role

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Only accessible to admin users.</p>
    </div>
  );
}

export default AdminDashboardPage;
