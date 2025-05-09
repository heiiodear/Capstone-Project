import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      localStorage.setItem("authToken", res.data.token);
      setMessage(res.data.message);
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.error || "Login failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 bg-indigo-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-4">
        <div className="text-center text-2xl font-bold text-indigo-900">Projectname</div>
        <div className="text-center text-2xl font-bold text-indigo-900">Welcome back</div>
        <p className="text-center text-gray-500 text-sm">Please sign in to access your account</p>
        {message && <div className="text-center text-red-600 text-sm">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="text-right text-sm mt-1">
              <Link to="/forgotpassword" className="text-indigo-500 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-900 text-white py-2 rounded-md transition"
          >
            {isLoading ? "Logging in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-500 font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

