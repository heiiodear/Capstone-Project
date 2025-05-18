import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import WebhookModal from "./../components/WebhookModal";
import TermsModal from "./../components/TermsModal";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import logo from "./../assets/logo.png";
import axios from "axios";

library.add(fas, fab, far, faEye, faEyeSlash);

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
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isWebhookOpen, setIsWebhookOpen] = useState(false);
  const [showError, setShowError] = useState(false);
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
      setShowError(true);
      return;
    }
    setShowError(false);

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://capstone-server-8hss.onrender.com/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Registration failed");
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* <style>
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
      </style> */}
      <div className="min-h-screen flex items-center justify-center bg-indigo-100 px-4 py-6">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8 space-y-6">
          <div className="flex justify-center">
            <img src={logo} alt="Logo" className="h-27 w-auto -mb-12 -mt-5" />
          </div>
          <div className="text-center text-3xl font-bold text-indigo-900 cursor-default">
            Create an Account
          </div>
          <p className="text-center text-gray-500 text-sm cursor-default">
            Enter your information to register
          </p>

          {message && (
            <div
              className={`text-center text-sm ${
                message.toLowerCase().includes("success") ||
                message.toLowerCase().includes("created")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="tel"
                  value={formData.tel}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Discord Webhook URL (Optional)
              </label>
              <input
                type="text"
                name="discord"
                value={formData.discord}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setIsWebhookOpen(true)}
                className="absolute top-8.5 right-3 text-md text-gray-500 cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  style={{ color: "#6B7280" }}
                />
              </button>
            </div>

            <WebhookModal
              isOpen={isWebhookOpen}
              onClose={() => setIsWebhookOpen(false)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-9 right-3 text-sm text-gray-500 cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    style={{ color: "#6B7280" }}
                  />
                </button>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  onChange={handleChange}
                  required
                  className="mt-1 w-full h-11 rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:ring-2 focus:ring-indigo-500"
                />
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-sm mt-1 text-red-600">
                      Passwords do not match
                    </p>
                  )}
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute top-9 right-3 text-sm text-gray-500 cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                    style={{ color: "#6B7280" }}
                  />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="address.plot"
                  placeholder="Plot / House Number, Village"
                  value={formData.address.plot}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  name="address.road"
                  placeholder="Road"
                  value={formData.address.road}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  name="address.district"
                  placeholder="District"
                  value={formData.address.district}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  name="address.province"
                  placeholder="Province"
                  value={formData.address.province}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  name="address.postal"
                  placeholder="Postal Code"
                  value={formData.address.postal}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 col-span-1 md:col-span-2"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                className="cursor-pointer"
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  if (e.target.checked) setShowError(false);
                }}
              />
              <label htmlFor="terms" className="text-sm">
                I accept the{" "}
                <button
                  type="button"
                  onClick={() => setIsTermsOpen(true)}
                  className="text-indigo-700 hover:underline cursor-pointer"
                >
                  terms and conditions
                </button>
              </label>
            </div>

            {showError && (
              <p className="text-red-500 text-sm">
                Please accept the terms and conditions.
              </p>
            )}

            <TermsModal
              isOpen={isTermsOpen}
              onClose={() => setIsTermsOpen(false)}
            />

            <button
              type="submit"
              disabled={isLoading || !acceptTerms}
              className="w-full bg-indigo-900 text-white font-medium py-2 rounded-lg cursor-pointer"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center text-sm cursor-default">
            Already have an account?{" "}
            <Link to="/" className="text-indigo-700 font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
