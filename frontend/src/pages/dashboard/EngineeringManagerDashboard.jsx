import React, { useEffect, useState } from "react";
import axios from "axios";

const EngineeringManagerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const [projectsRes, bugsRes, teamsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/projects/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/bugs/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/teams/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProjects(projectsRes.data);
        setBugs(bugsRes.data);
        setTeams(teamsRes.data);
      } catch (error) {
        console.error("Error fetching Engineering Manager data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-4">Loading Engineering Manager Dashboard...</p>;

  const bugStats = {
    total: bugs.length,
    open: bugs.filter((b) => b.status === "open").length,
    closed: bugs.filter((b) => b.status === "closed").length,
    inProgress: bugs.filter((b) => b.status === "in_progress").length,
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-indigo-700">Engineering Manager Dashboard</h1>

      {/* Project List */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Projects</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects available.</p>
        ) : (
          <ul className="space-y-3">
            {projects.map((project) => (
              <li key={project.id} className="border rounded p-3 hover:bg-gray-50">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-gray-700">{project.description || "No description provided."}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Bug Stats */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Bug Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-100 rounded p-4 text-center">
            <h3 className="text-lg font-bold">Total</h3>
            <p className="text-xl text-indigo-600">{bugStats.total}</p>
          </div>
          <div className="bg-green-100 rounded p-4 text-center">
            <h3 className="text-lg font-bold">Open</h3>
            <p className="text-xl text-green-600">{bugStats.open}</p>
          </div>
          <div className="bg-yellow-100 rounded p-4 text-center">
            <h3 className="text-lg font-bold">In Progress</h3>
            <p className="text-xl text-yellow-600">{bugStats.inProgress}</p>
          </div>
          <div className="bg-red-100 rounded p-4 text-center">
            <h3 className="text-lg font-bold">Closed</h3>
            <p className="text-xl text-red-600">{bugStats.closed}</p>
          </div>
        </div>
      </section>

      {/* Team Overview */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Teams</h2>
        {teams.length === 0 ? (
          <p className="text-gray-500">No teams found.</p>
        ) : (
          <ul className="space-y-3">
            {teams.map((team) => (
              <li key={team.id} className="border rounded p-3 hover:bg-gray-50">
                <h3 className="text-lg font-semibold">{team.name}</h3>
                <p className="text-gray-700">{team.description || "No description provided."}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default EngineeringManagerDashboard;
