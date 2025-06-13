import { useState, useContext } from "react";
import { Eye, EyeOff, User } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import for navigation

function LoginForm({ intendedRole, onLoginSuccess, onLoginError }) {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate(); // For navigation to reset password page

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    try {
      await login(username, password);
      onLoginSuccess();
    } catch (err) {
      console.error("Login error:", err);
      setLocalError("Login failed. Check credentials.");
      onLoginError();
    }
  };

  const formattedRole = intendedRole
    ? intendedRole.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "User";

  const handleForgotPassword = () => {
    navigate("/forgot-password"); // Navigate to the Forgot Password page
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl border border-gray-200"
    >
      <div className="flex flex-col items-center mb-6">
        <div className="bg-blue-100 text-blue-700 rounded-full p-4 mb-2">
          <User size={32} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          Logging in as{" "}
          <span className="text-blue-600">{formattedRole}</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Log In
        </motion.button>

        {localError && (
          <p className="text-center text-red-500 font-medium">
            {localError}
          </p>
        )}

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default LoginForm;
