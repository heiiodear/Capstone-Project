import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/login", { email, password }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      localStorage.setItem("authToken", res.data.token); 
      setMessage(res.data.message); 
      navigate("/dashboard"); 
    } catch (error) {
      setMessage(error.response?.data?.error || "Login failed");
    }
  };

  const handleSignUpClick = () => {
    navigate("/register");
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row h-screen">
        <div className="w-full sm:w-1/3 bg-indigo-950 text-white p-6 sm:p-10 flex flex-col justify-center h-40 sm:h-auto">
          <div className="mb-4 sm:mb-16 ml-4 sm:ml-10">
            <h1 className="text-2xl sm:text-5xl font-bold mb-1 sm:mb-2">Project Name</h1>
            <p className="text-base sm:text-xl text-indigo-200">Welcome back!</p>
          </div>
          <button
            onClick={handleSignUpClick}
            className="hidden lg:block ml-4 sm:ml-10 font-semibold text-white rounded-full px-4 sm:px-6 py-2 w-28 sm:w-32 outline-1 outline-offset-1 outline-white
                    hover:bg-white hover:text-indigo-950 transition-transform active:scale-95"
          >
            SIGN UP
          </button>
        </div>

        <div className="w-full sm:w-2/3 flex justify-center items-center p-6 sm:p-10 border-t sm:border-l sm:border-t-0 border-blue-200">
          <div className="w-full max-w-md px-4 flex flex-col items-center">
            <h2 className="text-3xl sm:text-5xl text-indigo-950 font-bold text-center mb-8 sm:mb-12">
              LOGIN
            </h2>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-4 w-full">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-full bg-indigo-100 focus:outline-none focus:ring-1 focus:ring-indigo-950"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-1 w-full">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-full bg-indigo-100 focus:outline-none focus:ring-1 focus:ring-indigo-950"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-right mb-6">
                <a href="#" className="text-xs text-gray-500 hover:text-indigo-900">
                  Forgot Password
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-950 text-white font-semibold py-3 rounded-full hover:bg-indigo-900 active:scale-95 transition-all"
              >
                LOGIN
              </button>
            </form>
            <div className="lg:hidden mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-indigo-950 font-medium hover:text-indigo-900 cursor-pointer"
              >
                SIGN UP
              </span>
            </div>
            {message && <div className="mt-3 text-red-500 text-center">{message}</div>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
