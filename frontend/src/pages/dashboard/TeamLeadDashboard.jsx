import React, { useEffect, useState } from "react";
import axios from "axios";

const TeamLeadDashboard = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamBugs, setTeamBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const userTeamId = currentUser?.team;

        if (!userTeamId) {
          console.error("User team not found.");
          setLoading(false);
          return;
        }

        const [usersRes, bugsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/users/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:8000/api/bugs/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const teamUsers = usersRes.data.filter(user => user.team === userTeamId);
        const teamBugList = bugsRes.data.filter(bug => bug.team === userTeamId);

        setTeamMembers(teamUsers);
        setTeamBugs(teamBugList);
      } catch (err) {
        console.error("Error fetching team data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  if (loading) return <p className="p-4">Loading Team Lead Dashboard...</p>;

  const bugStats = {
    total: teamBugs.length,
    open: teamBugs.filter(b => b.status === "open").length,
    inProgress: teamBugs.filter(b => b.status === "in_progress").length,
    closed: teamBugs.filter(b => b.status === "closed").length,
  };

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
      </section>
    </div>
  );
};

export default TeamLeadDashboard;
