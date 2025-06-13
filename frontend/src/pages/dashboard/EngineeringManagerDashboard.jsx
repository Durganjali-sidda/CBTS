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
        const [projectsRes, bugsRes, teamsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/projects/"),
          axios.get("http://localhost:8000/api/bugs/"),
          axios.get("http://localhost:8000/api/teams/"),
        ]);
        setProjects(projectsRes.data);4
        setBugs(bugsRes.data);
        setTeams(teamsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Engineering Manager data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-4">Loading Engineering Manager Dashboard...</p>;

  const bugStats = {
    total: bugs.length,
    open: bugs.filter(b => b.status === "open").length,
    closed: bugs.filter(b => b.status === "closed").length,
    inProgress: bugs.filter(b => b.status === "in_progress").length,
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-indigo-700">Engineering Manager Dashboard</h1>

      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">All Projects</h2>
        {projects.length === 0 ? (
          <p>No projects available.</p>
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
        <h2 className="text-xl font-semibold mb-2">Bug Overview</h2>
        <ul className="list-disc list-inside">
          <li>Total Bugs: {bugStats.total}</li>
          <li>Open: {bugStats.open}</li>
          <li>In Progress: {bugStats.inProgress}</li>
          <li>Closed: {bugStats.closed}</li>
        </ul>
      </section>

      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Teams</h2>
        {teams.length === 0 ? (
          <p>No teams found.</p>
        ) : (
          <ul className="list-disc list-inside">
            {teams.map(team => (
              <li key={team.id}>
                <strong>{team.name}</strong> — {team.description || "No description"}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default EngineeringManagerDashboard;
