import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { registerUser } from "../services/api";

function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password1: "",
    password2: "",
  });

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password1 !== formData.password2) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    try {
      await registerUser(formData);
      setSuccess("Registration successful! Please login.");
      setError("");
      setFormData({
        email: "",
        username: "",
        password1: "",
        password2: "",
      });
    } catch (err) {
      console.error(err);
      setSuccess("");
      setError("Registration failed. Check inputs.");
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Create an Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className="relative">
          <input
            type={showPassword1 ? "text" : "password"}
            name="password1"
            placeholder="Password"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.password1}
            onChange={handleChange}
            required
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword1(!showPassword1)}
          >
            {showPassword1 ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
        <div className="relative">
          <input
            type={showPassword2 ? "text" : "password"}
            name="password2"
            placeholder="Confirm Password"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.password2}
            onChange={handleChange}
            required
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword2(!showPassword2)}
          >
            {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg transition hover:bg-green-600"
        >
          Register
        </motion.button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
      </form>
    </motion.div>
  );
}

export default RegisterForm;
