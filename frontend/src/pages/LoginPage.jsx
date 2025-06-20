import React from "react";
import LoginForm from "../components/LoginForm";  // Assuming LoginForm is in the components folder

function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">Login to Your Account</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
