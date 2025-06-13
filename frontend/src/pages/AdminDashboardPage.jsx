// src/pages/AdminDashboardPage.jsx
import React from "react";
import useRole from "../hooks/useRole";

function AdminDashboardPage() {
  // Only product_manager users may stay on this page
  useRole("product_manager");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Product Manager Dashboard</h1>
      <p>Only accessible to users with the “product_manager” role.</p>
      {/* …add whatever “admin” widgets you need here… */}
    </div>
  );
}

export default AdminDashboardPage;
