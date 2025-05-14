import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'; 
import { fab } from '@fortawesome/free-brands-svg-icons'; 
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
library.add(fas, fab, far);
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
      localStorage.setItem("userId", res.data.user._id);
      setMessage(res.data.message);
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.error || "Login failed");
    }
    setIsLoading(false);
  };

  return (
    <>
    <style>
      {`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }

        input[type="password"]::-webkit-credentials-auto-fill-button,
        input[type="password"]::-webkit-textfield-decoration-container {
          display: none !important;
        }
      `}
    </style>
    <div className="min-h-screen flex justify-center items-center p-4 bg-indigo-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="text-center text-2xl font-bold text-indigo-900 cursor-default">Projectname</div>
        <div className="text-center text-2xl font-bold text-indigo-900 cursor-default">Welcome back</div>
        <p className="text-center text-gray-500 text-sm cursor-default">Please sign in to access your account</p>
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
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-gray-500 cursor-pointer"
              >
                {showPassword ? <FontAwesomeIcon icon="fa-regular fa-eye-slash" style={{color: "#6B7280",}} /> : <FontAwesomeIcon icon="fa-regular fa-eye" style={{color: "#6B7280",}} />}
              </button>
            </div>
            <div className="text-right text-sm mt-1">
              <Link to="/forgotpassword" className="text-indigo-700 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-900 text-white font-medium py-2 rounded-lg hover:bg-indigo-800 flex justify-center items-center gap-2 cursor-pointer"
          >
            {isLoading ? "Logging in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center text-sm cursor-default">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-700 font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;

