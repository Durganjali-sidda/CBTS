import React, { useEffect, useState } from "react";
import axios from "axios";

const TeamManagerDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBug, setNewBug] = useState({
    title: "",
    description: "",
    status: "open",
    team: "",
    assigned_to: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        // Fetch teams, members, and bugs data
        const [teamsRes, membersRes, bugsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/teams/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/users/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/bugs/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setTeams(teamsRes.data);
        setMembers(membersRes.data);
        setBugs(bugsRes.data);
      } catch (error) {
        console.error("Error fetching Team Manager data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle bug creation form
  const handleBugCreation = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://localhost:8000/api/bugs/",
        newBug,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBugs([...bugs, response.data]); // Update bugs list with newly created bug
      setNewBug({ title: "", description: "", status: "open", team: "", assigned_to: "" });
    } catch (error) {
      console.error("Error creating bug", error);
    }
  };

  // Handle bug assignment
  const handleAssignBug = async (bugId, assignedTo) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(
        `http://localhost:8000/api/bugs/${bugId}/`,
        { assigned_to: assignedTo },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update bugs state after assignment
      setBugs((prevBugs) =>
        prevBugs.map((bug) =>
          bug.id === bugId ? { ...bug, assigned_to: assignedTo } : bug
        )
      );
    } catch (error) {
      console.error("Error assigning bug", error);
    }
  };

  if (loading) return <p className="p-4">Loading Team Manager Dashboard...</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-blue-700">Team Manager Dashboard</h1>

      {/* Teams Section */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Teams</h2>
        {teams.length === 0 ? (
          <p className="text-gray-600">No teams found.</p>
        ) : (
          <ul className="space-y-3">
            {teams.map((team) => {
              const teamMembers = members.filter((member) => member.team === team.id);
              return (
                <li key={team.id} className="border p-3 rounded hover:bg-gray-50">
                  <h3 className="text-lg font-semibold">{team.name}</h3>
                  <p className="text-gray-700">{team.description || "No description available."}</p>

                  {/* Team Members */}
                  <div className="mt-4">
                    <h4 className="font-semibold">Team Members:</h4>
                    <ul className="list-disc pl-5">
                      {teamMembers.map((member) => (
                        <li key={member.id}>{member.username}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Assign Bug */}
                  <div className="mt-4">
                    <h4 className="font-semibold">Assign Bug:</h4>
                    <select
                      className="border rounded p-2"
                      onChange={() => setNewBug({ ...newBug, team: team.id })}
                    >
                      <option value="">Select Bug</option>
                      {bugs
                        .filter((bug) => bug.team === team.id && !bug.assigned_to)
                        .map((bug) => (
                          <option key={bug.id} value={bug.id}>
                            {bug.title}
                          </option>
                        ))}
                    </select>
                    <select
                      className="border rounded p-2 mt-2"
                      onChange={(e) => setNewBug({ ...newBug, assigned_to: e.target.value })}
                    >
                      <option value="">Select Member</option>
                      {teamMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.username}
                        </option>
                      ))}
                    </select>
                    <button
                      className="bg-blue-600 text-white mt-3 p-2 rounded"
                      onClick={() => handleAssignBug(newBug.team, newBug.assigned_to)}
                    >
                      Assign Bug
                    </button>
                  </div>

                  {/* Create New Bug */}
                  <div className="mt-4">
                    <h4 className="font-semibold">Create New Bug:</h4>
                    <input
                      type="text"
                      placeholder="Bug Title"
                      value={newBug.title}
                      onChange={(e) => setNewBug({ ...newBug, title: e.target.value })}
                      className="border rounded p-2 mb-2 w-full"
                    />
                    <textarea
                      placeholder="Bug Description"
                      value={newBug.description}
                      onChange={(e) => setNewBug({ ...newBug, description: e.target.value })}
                      className="border rounded p-2 mb-2 w-full"
                    />
                    <select
                      className="border rounded p-2 mb-2 w-full"
                      value={newBug.status}
                      onChange={(e) => setNewBug({ ...newBug, status: e.target.value })}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      className="bg-green-600 text-white mt-3 p-2 rounded"
                      onClick={handleBugCreation}
                    >
                      Create Bug
                    </button>
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

export default TeamManagerDashboard;
