import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import axios from "axios";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post("https://capstone-server-8hss.onrender.com/api/send-verification-code", { email });

            if (response.status === 200) {
                navigate("/verifycode", { state: { email, code: response.data.code } });
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError("This email is not registered.");
            } else {
                setError("Failed to send verification code. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-indigo-100 flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white border border-gray-200 shadow-md rounded-lg p-6 animate-fade-in">
                <div className="text-center space-y-2 mb-6">
                    <img src={logo} alt="Logo" className="h-auto w-23 -mb-5 -mt-5  mx-auto" />
                    <div className="text-center text-2xl font-bold text-indigo-900 cursor-default">Reset Password</div>
                    <p className="text-sm text-gray-600 cursor-default">Enter your email to receive a verification code</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            required
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-900 text-white py-2 rounded-lg hover:bg-indigo-700 transition flex justify-center items-center gap-2 cursor-pointer">
                        {isLoading ? "Sending..." : "Send Verification Code"}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-600 mt-6 cursor-default">
                    Remembered your password?{" "}
                    <Link to="/login" className="text-indigo-700 font-medium hover:underline">
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
