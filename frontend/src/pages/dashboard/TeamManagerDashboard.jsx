import React, { useEffect, useState } from "react";
import { fetchTeams, fetchUsers, fetchBugs, createBug, assignBugToUser } from "../services/api";

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
        const [teamsRes, membersRes, bugsRes] = await Promise.all([
          fetchTeams(),
          fetchUsers(),
          fetchBugs(),
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

  // Create a new bug
  const handleBugCreation = async () => {
    try {
      const res = await createBug(newBug);
      setBugs([...bugs, res.data]);
      setNewBug({
        title: "",
        description: "",
        status: "open",
        team: "",
        assigned_to: "",
      });
    } catch (error) {
      console.error("Error creating bug", error);
    }
  };

  // Assign a bug to a user
  const handleAssignBug = async (bugId, assignedTo) => {
    try {
      await assignBugToUser(bugId, assignedTo);
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

      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Teams</h2>
        {teams.length === 0 ? (
          <p className="text-gray-600">No teams found.</p>
        ) : (
          <ul className="space-y-6">
            {teams.map((team) => {
              const teamMembers = members.filter((member) => member.team === team.id);
              const unassignedBugs = bugs.filter((bug) => bug.team === team.id && !bug.assigned_to);
              return (
                <li key={team.id} className="border p-4 rounded-lg bg-gray-50 shadow-sm">
                  <h3 className="text-xl font-semibold">{team.name}</h3>
                  <p className="text-gray-600">{team.description || "No description available."}</p>

                  {/* Team Members */}
                  <div className="mt-4">
                    <h4 className="font-semibold mb-1">Team Members:</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      {teamMembers.map((member) => (
                        <li key={member.id}>{member.username}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Assign Bug */}
                  {unassignedBugs.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Assign Bug:</h4>
                      {unassignedBugs.map((bug) => (
                        <div key={bug.id} className="mb-4 border rounded p-3 bg-white shadow">
                          <p className="font-medium">{bug.title}</p>
                          <select
                            className="border rounded p-2 mt-2 w-full"
                            onChange={(e) => handleAssignBug(bug.id, e.target.value)}
                          >
                            <option value="">Assign to member</option>
                            {teamMembers.map((member) => (
                              <option key={member.id} value={member.id}>
                                {member.username}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Create Bug */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Create New Bug:</h4>
                    <input
                      type="text"
                      placeholder="Bug Title"
                      value={newBug.title}
                      onChange={(e) =>
                        setNewBug({ ...newBug, title: e.target.value, team: team.id })
                      }
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
                      className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
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
