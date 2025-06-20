import { useEffect, useState } from "react";
import { createBug, fetchProjects, fetchTeamMembers } from "../services/api";

function BugForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "open",
    assigned_to: "",
    project: "",
    team: "",
  });

  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const projectList = await fetchProjects();
        setProjects(projectList);
        // Fetch developers for assignment (optional enhancement)
        const members = await fetchTeamMembers();
        setTeamMembers(members);
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };
    loadInitialData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBug(formData);
      setSuccess("Bug submitted successfully.");
      setError("");
      setFormData({
        title: "",
        description: "",
        status: "open",
        assigned_to: "",
        project: "",
        team: "",
      });
      onSuccess && onSuccess();
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

        <select
          name="project"
          value={formData.project}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <select
          name="assigned_to"
          value={formData.assigned_to}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Assign Developer</option>
          {teamMembers.map((dev) => (
            <option key={dev.id} value={dev.id}>
              {dev.first_name} {dev.last_name} ({dev.email})
            </option>
          ))}
        </select>

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
