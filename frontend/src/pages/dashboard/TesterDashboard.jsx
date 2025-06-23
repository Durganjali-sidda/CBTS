import React, { useState, useEffect } from "react";
import { createBug, fetchBugs } from "../../services/api"; // use centralized API logic

const TesterDashboard = () => {
  const [bugTitle, setBugTitle] = useState("");
  const [bugDescription, setBugDescription] = useState("");
  const [bugStatus, setBugStatus] = useState("open");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [bugs, setBugs] = useState([]);

  // Fetch bugs on mount and after new bug creation
  const loadBugs = async () => {
    try {
      const res = await fetchBugs();
      setBugs(res.data);
    } catch (err) {
      console.error("Error loading bugs", err);
    }
  };

  useEffect(() => {
    loadBugs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      await createBug({
        title: bugTitle,
        description: bugDescription,
        status: bugStatus,
      });

      setSuccessMessage("✅ Bug created successfully!");
      setBugTitle("");
      setBugDescription("");
      setBugStatus("open");
      loadBugs(); // Refresh bug stats
    } catch (err) {
      console.error("Error creating bug", err);
      setError("❌ Error creating bug. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const bugStats = {
    total: bugs.length,
    open: bugs.filter((b) => b.status === "open").length,
    inProgress: bugs.filter((b) => b.status === "in_progress").length,
    closed: bugs.filter((b) => b.status === "closed").length,
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-purple-700">Tester Dashboard</h1>

      {/* Bug Overview */}
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

      {/* Create Bug Form */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Create New Bug</h2>

        {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bug-title" className="block text-sm font-semibold text-gray-700">
              Bug Title
            </label>
            <input
              type="text"
              id="bug-title"
              value={bugTitle}
              onChange={(e) => setBugTitle(e.target.value)}
              required
              className="mt-2 p-2 w-full border rounded"
            />
          </div>

          <div>
            <label htmlFor="bug-description" className="block text-sm font-semibold text-gray-700">
              Bug Description
            </label>
            <textarea
              id="bug-description"
              value={bugDescription}
              onChange={(e) => setBugDescription(e.target.value)}
              required
              className="mt-2 p-2 w-full border rounded"
              rows="4"
            />
          </div>

          <div>
            <label htmlFor="bug-status" className="block text-sm font-semibold text-gray-700">
              Bug Status
            </label>
            <select
              id="bug-status"
              value={bugStatus}
              onChange={(e) => setBugStatus(e.target.value)}
              className="mt-2 p-2 w-full border rounded"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Bug"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default TesterDashboard;
