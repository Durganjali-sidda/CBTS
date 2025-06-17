import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerDashboard = () => {
  const [reportedBugs, setReportedBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerBugs = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.id) {
          console.error("User info missing in localStorage");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:8000/api/bugs/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userBugs = res.data.filter((bug) => bug.reported_by === user.id);
        setReportedBugs(userBugs);
      } catch (error) {
        console.error("Error fetching customer bugs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerBugs();
  }, []);

  if (loading) return <p className="p-4">Loading Customer Dashboard...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">Customer Dashboard</h1>

      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">My Reported Bugs</h2>

        {reportedBugs.length === 0 ? (
          <p className="text-gray-600">You haven’t reported any bugs yet.</p>
        ) : (
          <ul className="space-y-3">
            {reportedBugs.map((bug) => (
              <li
                key={bug.id}
                className="border rounded p-4 bg-gray-50 hover:bg-gray-100 transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {bug.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      bug.status === "open"
                        ? "text-green-600"
                        : bug.status === "in_progress"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {bug.status.replace("_", " ")}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default CustomerDashboard;
