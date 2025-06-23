import React, { useEffect, useState } from "react";
import { fetchUsers, fetchBugs } from "../services/api";

const TeamLeadDashboard = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamBugs, setTeamBugs] = useState([]);
  const [bugStatusFilter, setBugStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const userTeamId = currentUser?.team;

        if (!userTeamId) {
          setError("Team ID not found. Please check your user details.");
          setLoading(false);
          return;
        }

        const [usersRes, bugsRes] = await Promise.all([
          fetchUsers(),
          fetchBugs(),
        ]);

        const teamUsers = usersRes.data.filter(user => user.team === userTeamId);
        const teamBugList = bugsRes.data.filter(bug => bug.team === userTeamId);

        setTeamMembers(teamUsers);
        setTeamBugs(teamBugList);
      } catch (err) {
        setError("Error fetching team data. Please try again.");
        console.error("Error fetching team data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const bugStats = {
    total: teamBugs.length,
    open: teamBugs.filter(b => b.status === "open").length,
    inProgress: teamBugs.filter(b => b.status === "in_progress").length,
    closed: teamBugs.filter(b => b.status === "closed").length,
  };

  const filteredBugs =
    bugStatusFilter === "all"
      ? teamBugs
      : teamBugs.filter(bug => bug.status === bugStatusFilter);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="flex justify-center items-center space-x-2">
          <div className="w-8 h-8 border-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-2">Loading Team Lead Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-purple-700">Team Lead Dashboard</h1>

      {/* Team Members Section */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
        {teamMembers.length === 0 ? (
          <p className="text-gray-600">No team members found.</p>
        ) : (
          <ul className="space-y-2">
            {teamMembers.map(member => (
              <li key={member.id} className="border rounded p-3 bg-gray-50">
                <span className="font-semibold text-gray-800">{member.username}</span>{" "}
                — <span className="capitalize text-sm text-gray-600">{member.role}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Bug Statistics Section */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Team Bug Overview</h2>

        <div className="mb-4">
          <label htmlFor="bug-status" className="text-sm font-semibold text-gray-700">
            Filter by Status:
          </label>
          <select
            id="bug-status"
            value={bugStatusFilter}
            onChange={(e) => setBugStatusFilter(e.target.value)}
            className="ml-2 p-2 rounded-md border"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-100 p-4 rounded text-center">
            <h3 className="text-lg font-semibold">Total</h3>
            <p className="text-2xl text-purple-700">{bugStats.total}</p>
          </div>
          <div className="bg-green-100 p-4 rounded text-center">
            <h3 className="text-lg font-semibold">Open</h3>
            <p className="text-2xl text-green-700">{bugStats.open}</p>
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

        <h3 className="text-xl font-semibold mt-6">Filtered Bugs</h3>
        {filteredBugs.length === 0 ? (
          <p className="text-gray-600">No bugs match the selected status.</p>
        ) : (
          <ul className="space-y-2">
            {filteredBugs.map((bug) => (
              <li key={bug.id} className="border p-3 rounded bg-gray-50">
                <h4 className="font-semibold text-gray-800">{bug.title}</h4>
                <p className="text-gray-600">{bug.description}</p>
                <p className="text-sm text-gray-500">Status: {bug.status}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default TeamLeadDashboard;
