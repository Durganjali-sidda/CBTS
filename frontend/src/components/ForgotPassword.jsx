import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "../services/api"; // Import the service function

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMessage("");

    try {
      await sendPasswordResetEmail(email);
      setSuccessMessage("If an account with that email exists, a reset link has been sent.");
      setEmail(""); // Clear the field after success
    } catch (err) {
      console.error("Forgot Password error:", err);
      const errMsg = err.response?.data?.email?.[0] || "Error sending reset email.";
      setLocalError(errMsg);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl border border-gray-200"
    >
      <h2 className="text-xl font-semibold text-center text-gray-800">
        Forgot Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Send Reset Link
        </motion.button>

        {localError && (
          <p className="text-center text-red-500 font-medium">{localError}</p>
        )}

        {successMessage && (
          <p className="text-center text-green-500 font-medium">{successMessage}</p>
        )}
      </form>

      <div className="text-center mt-4">
        <button
          onClick={() => navigate("/login")}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          Back to Login
        </button>
      </div>
    </motion.div>
  );
}

export default ForgotPassword;
