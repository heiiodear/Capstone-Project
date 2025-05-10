import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    tel: "",
    discord: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: {
      plot: "",
      road: "",
      district: "",
      province: "",
      postal: "",
    },
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      setMessage("Please accept the terms and conditions.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    
    setIsLoading(true);
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
    <div className="min-h-screen flex items-center justify-center bg-indigo-100 px-4 py-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8 space-y-6">
        <div className="text-center text-3xl font-bold text-indigo-900">Projectname</div>
        <div className="text-center text-3xl font-bold text-indigo-900 ">Create an Account</div>
        <p className="text-center text-gray-500 text-sm">Enter your information to register</p>

        {message && <div className="text-center text-red-600 text-sm">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Discord Account</label>
            <input
              type="text"
              name="discord"
              value={formData.discord}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-3 text-sm text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:ring-2 focus:ring-indigo-500"
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword &&(
                <p className="text-sm mt-1 text-red-600">Passwords do not match</p>
              )}

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-9 right-3 text-sm text-gray-500"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Address Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="address.plot"
                placeholder="Plot / House Number, Village"
                value={formData.address.plot}
                onChange={handleChange}
                className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="address.road"
                placeholder="Road"
                value={formData.address.road}
                onChange={handleChange}
                className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="address.district"
                placeholder="District"
                value={formData.address.district}
                onChange={handleChange}
                className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="address.province"
                placeholder="Province"
                value={formData.address.province}
                onChange={handleChange}
                className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="address.postal"
                placeholder="Postal Code"
                value={formData.address.postal}
                onChange={handleChange}
                className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 col-span-1 md:col-span-2"
              />
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <label htmlFor="terms" className="text-sm">
              I accept the{" "}
              <Link to="/terms" className="text-indigo-600 hover:underline">
                terms and conditions
              </Link>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !acceptTerms}
            className="w-full bg-indigo-900 text-white py-2 rounded-md transition cursor-pointer"
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
}

export default Signup;
