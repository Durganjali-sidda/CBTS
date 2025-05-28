import { useState } from "react";
import { createBug } from "../services/api"; // Import the createBug function

function BugForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "open",
    assigned_to: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await createBug(formData, token); // Use the createBug function from api.js
      setSuccess("Bug submitted successfully.");
      setError("");
      setFormData({ title: "", description: "", status: "open", assigned_to: "" });
      onSuccess && onSuccess(); // optional callback
    } catch (err) {
      console.error(err);
      setError("Error submitting bug.");
      setSuccess("");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow p-6 rounded-lg mt-6">
      <h2 className="text-xl font-bold mb-4">Report a Bug</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <input
          type="text"
          name="assigned_to"
          placeholder="Assign to (username)"
          value={formData.assigned_to}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          Submit Bug
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
      </form>
    </div>
  );
}

export default BugForm;
