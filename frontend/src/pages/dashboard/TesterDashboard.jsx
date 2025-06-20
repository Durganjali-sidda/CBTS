import React, { useState } from "react";
import axios from "axios";

const TesterDashboard = () => {
  const [bugTitle, setBugTitle] = useState("");
  const [bugDescription, setBugDescription] = useState("");
  const [bugStatus, setBugStatus] = useState("open");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("access_token");

      // Prepare the bug data
      const newBug = {
        title: bugTitle,
        description: bugDescription,
        status: bugStatus,
      };

      // Send the POST request
      await axios.post("http://localhost:8000/api/bugs/", newBug, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage("Bug created successfully!");
      setBugTitle(""); // Clear the title
      setBugDescription(""); // Clear the description
      setBugStatus("open"); // Reset the status
    } catch (error) {
      setError("Error creating bug. Please try again.");
      console.error("Error creating bug", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-purple-700">Tester Dashboard</h1>

      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Bug Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-100 p-4 rounded text-center">
            <h3 className="text-lg font-semibold">Total</h3>
            <p className="text-2xl text-purple-700">0</p> {/* Placeholder */}
          </div>
          <div className="bg-green-100 p-4 rounded text-center">
            <h3 className="text-lg font-semibold">Open</h3>
            <p className="text-2xl text-green-700">0</p> {/* Placeholder */}
          </div>
          <div className="bg-yellow-100 p-4 rounded text-center">
            <h3 className="text-lg font-semibold">In Progress</h3>
            <p className="text-2xl text-yellow-600">0</p> {/* Placeholder */}
          </div>
          <div className="bg-red-100 p-4 rounded text-center">
            <h3 className="text-lg font-semibold">Closed</h3>
            <p className="text-2xl text-red-600">0</p> {/* Placeholder */}
          </div>
        </div>
      </section>

      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Create New Bug</h2>

        {successMessage && (
          <div className="text-green-600 mb-4">{successMessage}</div>
        )}

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="bug-title"
              className="block text-sm font-semibold text-gray-700"
            >
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
            <label
              htmlFor="bug-description"
              className="block text-sm font-semibold text-gray-700"
            >
              Bug Description
            </label>
            <textarea
              id="bug-description"
              value={bugDescription}
              onChange={(e) => setBugDescription(e.target.value)}
              required
              className="mt-2 p-2 w-full border rounded"
              rows="4"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="bug-status"
              className="block text-sm font-semibold text-gray-700"
            >
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
