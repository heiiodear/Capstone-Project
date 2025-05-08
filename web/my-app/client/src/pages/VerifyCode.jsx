import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate("/resetpassword");
    };

    return (
        <div className="min-h-screen bg-indigo-100 flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white border border-gray-200 shadow-md rounded-lg p-6 animate-fade-in">
                <div className="text-center mb-6">
                <div className="text-center text-2xl font-bold text-indigo-800">Projectname</div>
                <div className="text-center text-2xl font-bold text-indigo-800">Verify Code</div>
                <p className="text-sm text-gray-600">Enter the 6-digit code sent to your email</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        className="w-full text-center text-lg tracking-widest border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="------"
                        required
                        />
                    </div>

                    <button //กดอันนี้แล้วไปหน้า reset password
                        type="submit"
                        className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition flex justify-center items-center gap-2">
                        Verify Code
                    </button>

                    <div className="text-center text-sm text-gray-500">
                        Didn’t receive the code?{" "}
                        <Link to="/forgotpassword" className="text-blue-700 hover:underline">
                            Request again
                        </Link>
                    </div>
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

export default ForgotPassword;