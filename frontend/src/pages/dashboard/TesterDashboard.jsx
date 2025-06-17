import React, { useEffect, useState } from "react";
import axios from "axios";

const TesterDashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await axios.get("http://localhost:8000/api/bugs/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBugs(res.data);
      } catch (error) {
        console.error("Error fetching bugs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBugs();
  }, []);

  if (loading) return <p className="p-4">Loading Tester Dashboard...</p>;

  const bugStats = {
    total: bugs.length,
    open: bugs.filter((b) => b.status === "open").length,
    inProgress: bugs.filter((b) => b.status === "in_progress").length,
    closed: bugs.filter((b) => b.status === "closed").length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "text-green-700";
      case "in_progress":
        return "text-yellow-700";
      case "closed":
        return "text-red-700";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-purple-700">Tester Dashboard</h1>

      {/* Bug Overview Stats */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Bug Overview</h2>
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

      {/* All Bugs List */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">All Bugs</h2>
        {bugs.length === 0 ? (
          <p className="text-gray-600">No bugs found.</p>
        ) : (
          <ul className="space-y-3">
            {bugs.map((bug) => (
              <li
                key={bug.id}
                className="border rounded p-4 bg-gray-50 hover:bg-gray-100 transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {bug.title}
                </h3>
                <p className={`text-sm ${getStatusColor(bug.status)}`}>
                  {bug.status.replace("_", " ")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default TesterDashboard;
