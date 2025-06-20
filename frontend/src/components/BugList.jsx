import React, { useEffect, useState } from "react";
import { fetchBugs } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you have this context to get the logged-in user's details

function BugList() {
  const { user } = useAuth(); // Get the logged-in user's data
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getBugs = async () => {
      try {
        let bugsData;

        // Check user role and fetch bugs accordingly
        if (user.role === "project_manager" || user.role === "engineering_manager") {
          // Project Manager / Engineering Manager - show all bugs
          bugsData = await fetchBugs();
        } else if (user.role === "team_lead") {
          // Team Lead - show bugs assigned to their team
          bugsData = await fetchBugs({ team: user.team.id });  // Assuming team id is in user object
        } else if (user.role === "team_manager") {
          // Team Manager - show bugs from all teams (maybe filter by performance later)
          bugsData = await fetchBugs();
        } else {
          throw new Error("Unauthorized role");
        }

        setBugs(bugsData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch bugs. Please try again later.");
        setLoading(false);
      }
    };
    getBugs();
  }, [user]);

  const handleBugClick = (bugId) => {
    navigate(`/bugs/${bugId}`);
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Bug List</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {bugs.length === 0 ? (
        <p className="text-center text-gray-600">No bugs found.</p>
      ) : (
        <ul className="space-y-4">
          {bugs.map((bug) => (
            <li
              key={bug.id}
              onClick={() => handleBugClick(bug.id)}
              className="p-4 border rounded-lg bg-white shadow-md hover:bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 ease-in-out cursor-pointer"
            >
              <h2 className="font-semibold text-xl text-gray-800">{bug.title}</h2>
              <p className="text-gray-600">{bug.description}</p>
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <p>
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      bug.status === "closed" ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {bug.status}
                  </span>
                </p>
                <p>
                  Assigned to:{" "}
                  <span className="font-semibold">{bug.assigned_to || "Unassigned"}</span>
                </p>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Reported by: {bug.reported_by}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BugList;
