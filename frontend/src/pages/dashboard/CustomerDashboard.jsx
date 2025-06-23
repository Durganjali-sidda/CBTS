import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBugs } from "../services/api";

const CustomerDashboard = () => {
  const [reportedBugs, setReportedBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerBugs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          console.error("User info missing in localStorage");
          setLoading(false);
          return;
        }

        const res = await fetchBugs();
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
                <Link
                  to={`/bug/${bug.id}`}
                  className="text-lg font-semibold text-blue-700 hover:underline"
                >
                  {bug.title}
                </Link>
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
