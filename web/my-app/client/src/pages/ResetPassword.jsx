import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
        
    const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
    }

    try {
        const email = location.state?.email;

        const response = await axios.post("http://localhost:5000/api/reset-password", {
            email,
            newPassword: password,
        });

        if (response.status === 200) {
            navigate("/login");
        } else {
            setErrorMessage("Failed to reset password. Try again.");
        }
    } catch (error) {
        console.error(error);
        setErrorMessage("An error occurred while resetting password.");
    }
};


    return (
        <div className="min-h-screen bg-indigo-100 flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white border border-gray-200 shadow-md rounded-lg p-6 animate-fade-in">
                <div className="text-center mb-6">
                    <div className="text-center text-2xl font-bold text-indigo-900">Projectname</div>
                    <div className="text-center text-2xl font-bold text-indigo-900">Reset Password</div>
                    <p className="text-sm text-gray-600">Create your new password</p>
                    {errorMessage && (
                        <p className="text-red-600 text-sm text-center">{errorMessage}</p>
                    )}

                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-700">
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-700">
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;