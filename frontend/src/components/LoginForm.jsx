import { useState, useContext } from "react";
import { Eye, EyeOff, User } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function LoginForm({ intendedRole }) {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);

    try {
      await login(username, password);

      const expectedRole = sessionStorage.getItem("intendedRole");
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (expectedRole && storedUser?.role !== expectedRole) {
        setError(`You must log in as a ${expectedRole.replace("_", " ")}`);
        sessionStorage.removeItem("intendedRole");
        setLoading(false);
        return;
      }

      sessionStorage.removeItem("intendedRole");
    } catch {
      setError("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const formattedRole = intendedRole
    ? intendedRole.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "User";

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
          Logging in as <span className="text-blue-600">{formattedRole}</span>
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

        {error && (
          <p className="text-center text-red-500 font-medium">{error}</p>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          type="submit"
          disabled={loading}
          className={`w-full py-3 ${
            loading ? "bg-blue-300" : "bg-blue-600"
          } text-white font-medium rounded-lg transition`}
        >
          {loading ? "Logging in..." : "Log In"}
        </motion.button>

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
