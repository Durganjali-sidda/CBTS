import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center">
        
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold text-sky-700"
        >
          Bug Tracker
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-xl text-gray-600 max-w-2xl"
        >
          Track, manage, and squash bugs like a pro — built for teams who care about shipping quality software.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 flex gap-4"
        >
          <Link
            to="/login"
            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl text-lg shadow-md transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white border-2 border-sky-600 text-sky-600 hover:bg-sky-50 px-6 py-3 rounded-2xl text-lg shadow-md transition"
          >
            Register
          </Link>
        </motion.div>
      </div>

      <footer className="absolute bottom-4 w-full text-center text-gray-500 text-sm">
        © 2025 Bug Tracker. Built with ❤️ by YourName
      </footer>
    </div>
  );
}
