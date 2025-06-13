import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    if (!role) {
      alert("Please select a role to continue.");
      return;
    }
    navigate("/login", { state: { selectedRole: role } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-white">
      {/* Hero Section */}
      <section className="flex-grow flex flex-col justify-center items-center text-center px-4 md:px-20 lg:px-40">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold text-sky-700 mb-6"
        >
          Welcome to Pro‑Track Bug Tracker
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl md:text-2xl text-gray-600 max-w-3xl mb-8"
        >
          A fully‑featured, role‑based issue tracker built for modern development teams.  
          Report, assign, and squash bugs collaboratively—so you can ship with confidence.
        </motion.p>

        {/* Role Selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col items-center gap-4 w-full max-w-sm"
        >
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border border-sky-300 rounded-lg text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">Select Role</option>
            <option value="developer">Developer</option>
            <option value="tester">Tester</option>
            <option value="product_manager">Product Manager</option>
            <option value="Engineering_manager">Engineering Manager</option>
          </select>

          <button
            onClick={handleLoginRedirect}
            className="w-full px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-lg shadow-md transition transform hover:scale-105"
          >
            Continue to Login
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-4 md:px-20 lg:px-40">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">
          Why Pro‑Track?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          {[
            {
              title: "Role‑Based Access",
              desc: "Give each team member exactly the permissions they need—no more, no less. Managers, leads, developers, testers: everyone sees just what’s relevant.",
            },
            {
              title: "Real‑Time Dashboards",
              desc: "Track bug metrics in real time: open vs. closed, average resolution time, and more—so you always know where your project stands.",
            },
            {
              title: "Collaborative Comments",
              desc: "Developers and testers collaborate on each issue with threaded comments, attachments, and status updates—streamlining communication.",
            },
            {
              title: "Priority & SLA Tracking",
              desc: "Assign low, medium, high, or critical priority—and set SLAs to ensure urgent bugs are resolved in time.",
            },
            {
              title: "Integrations & API",
              desc: "Connect to GitHub, GitLab, or Bitbucket—automatically link pull requests to bug tickets and keep everything in sync.",
            },
            {
              title: "Custom Workflows",
              desc: "Design your own bug‑triage process: define statuses, transitions, and logic tailored to your team's needs.",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold text-sky-700 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Get Started Section */}
      <section className="bg-sky-600 py-12 text-white text-center mt-16 ">
        <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-4">Ready to Start Tracking?</h2>
        <p className="mb-6 text-lg max-w-2xl mx-auto">
          Admin will register your account. Once registered, log in with your assigned role  
          to access your personalized dashboard.
        </p>
        <button
          onClick={handleLoginRedirect}
          className="inline-block bg-white text-sky-600 px-8 py-4 rounded-2xl font-semibold shadow-md hover:shadow-xl transition transform hover:scale-105"
        >
          Log In with Role
        </button>
        </div>
      </section>
      
    </div>
  );
}
