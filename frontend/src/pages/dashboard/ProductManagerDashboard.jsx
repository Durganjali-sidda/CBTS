import React, { useEffect, useState } from "react";
import { fetchProjects, fetchBugs } from "../services/api";

const ProductManagerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, bugsRes] = await Promise.all([
          fetchProjects(),
          fetchBugs(),
        ]);

        setProjects(projectsRes.data);
        setBugs(bugsRes.data);
      } catch (error) {
        setError("There was an issue fetching the data. Please try again later.");
        console.error("Error fetching Product Manager data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const bugStats = {
    total: bugs.length,
    open: bugs.filter((bug) => bug.status === "open").length,
    closed: bugs.filter((bug) => bug.status === "closed").length,
    inProgress: bugs.filter((bug) => bug.status === "in_progress").length,
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="flex justify-center items-center space-x-2">
          <div className="w-8 h-8 border-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-2">Loading Product Manager Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-blue-700">Product Manager Dashboard</h1>

      {/* Project Section */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        {projects.length === 0 ? (
          <p className="text-gray-600">No projects found.</p>
        ) : (
          <ul className="space-y-3">
            {projects.map((project) => (
              <li key={project.id} className="border p-3 rounded hover:bg-gray-50">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-gray-700">{project.description || "No description available."}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Bug Statistics Section */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Bug Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-100 p-4 rounded text-center">
            <h3 className="text-lg font-semibold">Total</h3>
            <p className="text-2xl text-blue-600">{bugStats.total}</p>
          </div>
          <div className="bg-green-100 p-4 rounded text-center">
            <h3 className="text-lg font-semibold">Open</h3>
            <p className="text-2xl text-green-600">{bugStats.open}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded text-center">
            <h3 className="text-lg font-semibold">In Progress</h3>
            <p className="text-2xl text-yellow-600">{bugStats.inProgress}</p>
          </div>
          <div className="bg-red-100 p-4 rounded text-center">
            <h3 className="text-lg font-semibold">Closed</h3>
            <p className="text-2xl text-red-600">{bugStats.closed}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductManagerDashboard;
