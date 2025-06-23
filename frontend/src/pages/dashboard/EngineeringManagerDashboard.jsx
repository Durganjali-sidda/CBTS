import React, { useEffect, useState } from "react";
import { fetchProjects, fetchBugs, fetchTeamMembers } from "../../services/api";

const EngineeringManagerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, bugsRes, teamsRes] = await Promise.all([
          fetchProjects(),
          fetchBugs(),
          fetchTeamMembers(),
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

  const getProjectBugStats = (projectId) => {
    const projectBugs = bugs.filter((bug) => bug.project === projectId);
    return {
      total: projectBugs.length,
      open: projectBugs.filter((b) => b.status === "open").length,
      closed: projectBugs.filter((b) => b.status === "closed").length,
      inProgress: projectBugs.filter((b) => b.status === "in_progress").length,
    };
  };

  const getTeamBugStats = (teamId) => {
    const teamBugs = bugs.filter((bug) => bug.team === teamId);
    return {
      total: teamBugs.length,
      open: teamBugs.filter((b) => b.status === "open").length,
      closed: teamBugs.filter((b) => b.status === "closed").length,
      inProgress: teamBugs.filter((b) => b.status === "in_progress").length,
    };
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
            {projects.map((project) => {
              const projectStats = getProjectBugStats(project.id);
              return (
                <li key={project.id} className="border rounded p-3 hover:bg-gray-50">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <p className="text-gray-700">{project.description || "No description provided."}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <h4 className="text-md font-bold">Total Bugs</h4>
                      <p className="text-lg text-indigo-600">{projectStats.total}</p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-md font-bold">Open</h4>
                      <p className="text-lg text-green-600">{projectStats.open}</p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-md font-bold">In Progress</h4>
                      <p className="text-lg text-yellow-600">{projectStats.inProgress}</p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-md font-bold">Closed</h4>
                      <p className="text-lg text-red-600">{projectStats.closed}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Bug Stats Overview */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Bug Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-100 rounded p-4 text-center">
            <h3 className="text-lg font-bold">Total Bugs</h3>
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
            {teams.map((team) => {
              const teamStats = getTeamBugStats(team.id);
              return (
                <li key={team.id} className="border rounded p-3 hover:bg-gray-50">
                  <h3 className="text-lg font-semibold">{team.name}</h3>
                  <p className="text-gray-700">{team.description || "No description provided."}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <h4 className="text-md font-bold">Total Bugs</h4>
                      <p className="text-lg text-indigo-600">{teamStats.total}</p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-md font-bold">Open</h4>
                      <p className="text-lg text-green-600">{teamStats.open}</p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-md font-bold">In Progress</h4>
                      <p className="text-lg text-yellow-600">{teamStats.inProgress}</p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-md font-bold">Closed</h4>
                      <p className="text-lg text-red-600">{teamStats.closed}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default EngineeringManagerDashboard;
