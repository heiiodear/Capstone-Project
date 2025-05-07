import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="min-h-screen bg-indigo-100 flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white border border-gray-200 shadow-md rounded-lg p-6 animate-fade-in">
                <div className="text-center mb-6">
                    <div className="text-center text-2xl font-bold text-indigo-800">Projectname</div>
                    <div className="text-center text-2xl font-bold text-indigo-800">Reset Password</div>
                    <p className="text-sm text-gray-600">Create your new password</p>
                </div>

                <form className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2">
                        Reset Password
                    </button>
                </form>

                <div className="text-center text-sm text-gray-600 mt-6">
                    Remember your password?{" "}
                    <Link to="/login" className="text-blue-700 font-medium hover:underline">
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;