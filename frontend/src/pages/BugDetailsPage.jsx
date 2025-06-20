import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BugDetailsPage = () => {
  const { id } = useParams();
  const [bug, setBug] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchBug = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/bugs/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBug(res.data);
        setStatus(res.data.status);
        console.log("Bug fetched:", res.data); // ✅ You're seeing this
      } catch (err) {
        setError("Failed to load bug");
        console.error("Error fetching bug:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBug();
  }, [id, token]);

  const handleStatusUpdate = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/api/bugs/${id}/`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Status updated!");
    } catch (err) {
      setError("Status update failed");
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <p className="p-4">Loading bug details...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!bug) return <p className="p-4 text-red-500">Bug not found.</p>;

  const canUpdateStatus =
    user && ["admin", "team_lead", "developer"].includes(user.role);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-green-700">{bug.title}</h1>
      <p className="text-gray-800">{bug.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
        <div>
          <p><strong>Status:</strong> {bug.status}</p>
          <p><strong>Priority:</strong> {bug.priority}</p>
          <p><strong>Created At:</strong> {new Date(bug.created_at).toLocaleString()}</p>
        </div>
        <div>
          <p><strong>Reported by:</strong> {bug.reported_by || "N/A"}</p>
          <p><strong>Assigned To:</strong> {bug.assigned_to || "Unassigned"}</p>
          <p><strong>Team ID:</strong> {bug.team || "None"}</p>
          <p><strong>Project ID:</strong> {bug.project || "N/A"}</p>
        </div>
      </div>

      {canUpdateStatus && (
        <div className="bg-white p-4 rounded shadow space-y-2">
          <label htmlFor="status" className="block font-medium">Update Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <button
            onClick={handleStatusUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Status
          </button>
        </div>
      )}
    </div>
  );
};

export default BugDetailsPage;
