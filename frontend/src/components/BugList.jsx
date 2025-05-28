import { useEffect, useState } from "react";
import { fetchBugs } from "../services/api";

function BugList() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(""); // Track error state

  useEffect(() => {
    const getBugs = async () => {
      try {
        const response = await fetchBugs();
        setBugs(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error)
        setError("Failed to fetch bugs. Please try again later.");
        setLoading(false);
      }
    };

    getBugs();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>; // Show loading message
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Bug List</h1>
      {error && <p className="text-red-500 text-center">{error}</p>} {/* Show error message if any */}
      {bugs.length === 0 ? (
        <p className="text-center text-gray-600">No bugs found.</p>
      ) : (
        <ul className="space-y-4">
          {bugs.map((bug) => (
            <li
              key={bug.id}
              className="p-4 border rounded-lg bg-white shadow-md hover:bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 ease-in-out"
            >
              <h2 className="font-semibold text-xl text-gray-800">{bug.title}</h2>
              <p className="text-gray-600">{bug.description}</p>
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <p>Status: <span className={`font-semibold ${bug.status === 'closed' ? 'text-green-600' : 'text-yellow-600'}`}>{bug.status}</span></p>
                <p>Assigned to: <span className="font-semibold">{bug.assigned_to}</span></p>
              </div>
              <div className="text-xs text-gray-400 mt-1">Reported by: {bug.reported_by}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BugList;
