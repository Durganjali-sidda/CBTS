import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerDashboard = () => {
  const [reportedBugs, setReportedBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerBugs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/bugs/");
        // Assuming bug has a `reported_by` field and user info is in localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        const userBugs = res.data.filter(bug => bug.reported_by === user?.id);
        setReportedBugs(userBugs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customer bugs", error);
        setLoading(false);
      }
    };

    fetchCustomerBugs();
  }, []);

  if (loading) return <p className="p-4">Loading Customer Dashboard...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">Customer Dashboard</h1>

      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">My Reported Bugs</h2>
        {reportedBugs.length === 0 ? (
          <p>You haven’t reported any bugs yet.</p>
        ) : (
          <ul className="space-y-2">
            {reportedBugs.map(bug => (
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

export default CustomerDashboard;
