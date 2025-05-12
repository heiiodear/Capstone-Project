import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function VerifyCode() {
    const [userCode, setUserCode] = useState("");
    const navigate = useNavigate();
    const location = useLocation(); 
    const email = location.state?.email; 
    const expectedCode = location.state?.code;
    const [errorMessage, setErrorMessage] = useState("");


    const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (userCode === expectedCode.toString()) {
        navigate("/resetpassword", { state: { email } });
    } else {
        setErrorMessage("Incorrect. Please try again.");
    }
};


    return (
        <div className="min-h-screen bg-indigo-100 flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white border border-gray-200 shadow-md rounded-lg p-6 animate-fade-in">
                <div className="text-center mb-6">
                    <div className="text-center text-2xl font-bold text-indigo-900 cursor-default">Projectname</div>
                    <div className="text-center text-2xl font-bold text-indigo-900 cursor-default">Verify Code</div>
                    <p className="text-sm text-gray-600 cursor-default">Enter the 6-digit code sent to your email</p>
                    <p className="text-sm text-gray-600 cursor-default">Verification code sent to: {email}</p> 
                    {errorMessage && (
                        <p className="text-red-600 text-sm text-center">{errorMessage}</p>
                    )}

                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={userCode}
                            onChange={(e) => setUserCode(e.target.value)}
                            className="w-full text-center text-lg tracking-widest border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="------"
                            required
                            />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2 cursor-pointer">
                        Verify Code
                    </button>

                    <div className="text-center text-sm text-gray-500 cursor-default">
                        Didn’t receive the code?{" "}
                        <Link to="/forgotpassword" className="text-blue-700 hover:underline">
                            Request again
                        </Link>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default VerifyCode;
