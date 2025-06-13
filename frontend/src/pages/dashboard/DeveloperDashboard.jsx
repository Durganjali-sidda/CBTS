import React, { useEffect, useState } from "react";
import axios from "axios";

const DeveloperDashboard = () => {
  const [assignedBugs, setAssignedBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeveloperData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;

        const res = await axios.get("http://localhost:8000/api/bugs/");
        const myBugs = res.data.filter(bug => bug.assigned_to === userId);

        setAssignedBugs(myBugs);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching developer bugs", err);
        setLoading(false);
      }
    };

    fetchDeveloperData();
  }, []);

  if (loading) return <p className="p-4">Loading Developer Dashboard...</p>;

  const bugStats = {
    total: assignedBugs.length,
    open: assignedBugs.filter(b => b.status === "open").length,
    closed: assignedBugs.filter(b => b.status === "closed").length,
    inProgress: assignedBugs.filter(b => b.status === "in_progress").length,
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">Developer Dashboard</h1>

      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Your Bug Summary</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Total Assigned: {bugStats.total}</li>
          <li>Open: {bugStats.open}</li>
          <li>In Progress: {bugStats.inProgress}</li>
          <li>Closed: {bugStats.closed}</li>
        </ul>
      </section>

      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Assigned Bugs</h2>
        {assignedBugs.length === 0 ? (
          <p>You have no assigned bugs.</p>
        ) : (
          <ul className="space-y-2">
            {assignedBugs.map(bug => (
              <li key={bug.id} className="border p-2 rounded-md">
                <strong>{bug.title}</strong> — {bug.status}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default DeveloperDashboard;
