import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    tel: "",
    discord: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    // if (!acceptTerms) {
    //   setMessage("Please accept the terms and conditions.");
    //   return;
    // }
    // จะให้มันแสดงข้อความว่ายังไม่ได้เช็คเงื่อนไข แต่มันยังไม่ขึ้น (ตอนนี้ถ้าไม่เช็คจะกด signup ไม่ได้)

    setIsLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Registration failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-indigo-100 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 space-y-4">
      <div className="text-center text-2xl font-bold text-indigo-800">Projectname</div>
      <div className="text-center text-2xl font-bold text-indigo-800">Create an Account</div>
        <p className="text-center text-gray-500">Enter your information to register</p>
        {message && <div className="text-center text-red-600">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              placeholder="full name"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="tel"
              placeholder="(+66) 00000000"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Discord Account</label>
            <input
              type="text"
              name="discord"
              placeholder="discord username"
              value={formData.discord}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-11 right-3 transform -translate-y-1/2 text-sm text-gray-500">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-11 right-3 transform -translate-y-1/2 text-sm text-gray-500">
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <label htmlFor="terms" className="text-sm">
              I accept the{" "}
              <a href="/terms" className="text-indigo-600 hover:underline">
                terms and conditions
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !acceptTerms}
            className="w-full bg-indigo-700 text-white py-2 rounded hover:bg-indigo-800 transition"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-700 font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
