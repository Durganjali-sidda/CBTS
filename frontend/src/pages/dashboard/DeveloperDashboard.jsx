import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeveloperDashboard = () => {
  const [assignedBugs, setAssignedBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeveloperBugs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("access_token");

        if (!user || !token) {
          console.error("User or token not found");
          return;
        }

        const res = await axios.get(
          `http://localhost:8000/api/bugs/?assigned_to=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAssignedBugs(res.data);
      } catch (err) {
        console.error("Error fetching assigned bugs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloperBugs();
  }, []);

  if (loading) return <p className="p-4">Loading Developer Dashboard...</p>;

  const bugStats = {
    total: assignedBugs.length,
    open: assignedBugs.filter((b) => b.status === "open").length,
    closed: assignedBugs.filter((b) => b.status === "closed").length,
    inProgress: assignedBugs.filter((b) => b.status === "in_progress").length,
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">Developer Dashboard</h1>

      {/* Bug Summary */}
      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Your Bug Summary</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Total Assigned: {bugStats.total}</li>
          <li>Open: {bugStats.open}</li>
          <li>In Progress: {bugStats.inProgress}</li>
          <li>Closed: {bugStats.closed}</li>
        </ul>
      </section>

      {/* Assigned Bugs */}
      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Assigned Bugs</h2>

        {assignedBugs.length === 0 ? (
          <p className="text-gray-600">You have no assigned bugs.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {assignedBugs.map((bug) => (
              <li
                key={bug.id}
                onClick={() => navigate(`/bug/${bug.id}`)}
                className="cursor-pointer border p-4 rounded-lg shadow-sm hover:bg-gray-50 transition"
              >
                <h3 className="text-lg font-bold text-blue-700">{bug.title}</h3>
                <p className="text-sm text-gray-700">
                  <strong>Status:</strong> {bug.status}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Priority:</strong> {bug.priority}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Reported On:</strong>{" "}
                  {new Date(bug.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default DeveloperDashboard;
