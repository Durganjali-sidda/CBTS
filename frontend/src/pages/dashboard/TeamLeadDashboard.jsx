import React, { useEffect, useState } from "react";
import axios from "axios";

const TeamLeadDashboard = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamBugs, setTeamBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const [usersRes, bugsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/users/"),
          axios.get("http://localhost:8000/api/bugs/"),
        ]);

        // Get current user's team from local storage (assuming user is saved there)
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const userTeam = currentUser?.team;

        // Filter users in the same team
        const teamUsers = usersRes.data.filter(user => user.team === userTeam);
        const bugs = bugsRes.data.filter(bug => bug.team === userTeam);

        setTeamMembers(teamUsers);
        setTeamBugs(bugs);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching team data", err);
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  if (loading) return <p className="p-4">Loading Team Lead Dashboard...</p>;

  const bugStats = {
    total: teamBugs.length,
    open: teamBugs.filter(b => b.status === "open").length,
    closed: teamBugs.filter(b => b.status === "closed").length,
    inProgress: teamBugs.filter(b => b.status === "in_progress").length,
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-purple-700">Team Lead Dashboard</h1>

      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Team Members</h2>
        {teamMembers.length === 0 ? (
          <p>No members in your team.</p>
        ) : (
          <ul className="list-disc list-inside">
            {teamMembers.map(member => (
              <li key={member.id}>
                {member.username} — {member.role}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Team Bug Overview</h2>
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

export default TeamLeadDashboard;
