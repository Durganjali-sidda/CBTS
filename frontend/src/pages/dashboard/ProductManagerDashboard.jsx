// src/pages/dashboard/ProductManagerDashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductManagerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [bugStats, setBugStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, bugsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/projects/"),
          axios.get("http://localhost:8000/api/bugs/"),
        ]);

        const bugs = bugsRes.data;
        const stats = {
          total: bugs.length,
          open: bugs.filter(bug => bug.status === "open").length,
          closed: bugs.filter(bug => bug.status === "closed").length,
          inProgress: bugs.filter(bug => bug.status === "in_progress").length,
        };

        setProjects(projectsRes.data);
        setBugStats(stats);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p className="p-4">Loading dashboard...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Product Manager Dashboard</h1>

      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Project Overview</h2>
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <ul className="list-disc list-inside">
            {projects.map(project => (
              <li key={project.id}>
                <strong>{project.name}</strong> — {project.description}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Bug Statistics</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Total Bugs: {bugStats.total}</li>
          <li>Open: {bugStats.open}</li>
          <li>In Progress: {bugStats.inProgress}</li>
          <li>Closed: {bugStats.closed}</li>
        </ul>
      </section>
    </div>
  );
};

export default ProductManagerDashboard;
