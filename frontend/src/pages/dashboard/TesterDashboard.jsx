import React, { useEffect, useState } from "react";
import axios from "axios";

const TesterDashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/bugs/");
        setBugs(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bugs", error);
        setLoading(false);
      }
    };

    fetchBugs();
  }, []);

  if (loading) return <p className="p-4">Loading Tester Dashboard...</p>;

  const bugStats = {
    total: bugs.length,
    open: bugs.filter(b => b.status === "open").length,
    inProgress: bugs.filter(b => b.status === "in_progress").length,
    closed: bugs.filter(b => b.status === "closed").length,
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-purple-700">Tester Dashboard</h1>

      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Bug Overview</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Total Bugs: {bugStats.total}</li>
          <li>Open: {bugStats.open}</li>
          <li>In Progress: {bugStats.inProgress}</li>
          <li>Closed: {bugStats.closed}</li>
        </ul>
      </section>

      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">All Bugs</h2>
        {bugs.length === 0 ? (
          <p>No bugs found.</p>
        ) : (
          <ul className="space-y-2">
            {bugs.map(bug => (
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

export default TesterDashboard;
