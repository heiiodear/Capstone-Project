import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    tel: "",
    discord: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Registration failed");
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full sm:w-2/3 flex justify-center items-center p-6 sm:p-10 border-t sm:border-l sm:border-t-0 border-blue-200">

        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
          <h1 className="text-3xl sm:text-5xl text-indigo-950 font-bold text-center mb-8 sm:mb-12">
            Create Account
          </h1>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
            required
          />
          <input
            type="tel"
            name="tel"
            placeholder="Tel."
            value={formData.tel}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
            required
          />
          <input
            type="text"
            name="discord"
            placeholder="Discord Account"
            value={formData.discord}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-950 text-white font-medium py-3.5 rounded-lg hover:bg-indigo-900 active:scale-98 transition-all shadow-md">
            Signup
          </button>
        </form>
        {message && <p className="mt-3 text-center text-blue-500">{message}</p>}
      </div>

      <div className="w-full sm:w-1/3 bg-indigo-950 text-white p-6 sm:p-10 flex flex-col justify-center h-40 sm:h-auto">
        <div className="max-w-xs mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Project Name</h2>
          <p className="text-xl mb-8">Hello, there!</p>
          <button onClick={handleLoginClick}
          className="border border-white text-white font-medium py-2.5 px-8 rounded-lg hover:bg-white hover:text-indigo-950 transition-all">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
