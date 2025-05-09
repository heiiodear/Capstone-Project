import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

function Header() {
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate("/");
    };

    return (
        <div className="bg-indigo-900 text-white shadow-md py-3 px-5">
            <div className="max-w-9xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        className="md:hidden">
                        <FaBars className="w-5 h-5" />
                    </button>
                    <Link to="/dashboard" className="text-xl font-bold flex items-center gap-2">
                        <span className="hidden sm:inline">Projectname</span>
                    </Link>
                </div>

                <nav className="hidden md:flex gap-6 text-md font-medium">
                    <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                    <Link to="/alerts" className="hover:underline">Alerts</Link>
                    <Link to="/cameras" className="hover:underline">Cameras</Link>
                    <Link to="/settings" className="hover:underline">Settings</Link>
                </nav>

                <div className="flex items-center gap-4 relative">
                    {/* <Link to="/alerts" className="relative">
                        <FaBell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-2 bg-red-500 text-xs text-white rounded-full px-1.5 py-0.5">
                        </span>
                    </Link> */}
                    <Link to="/profile">
                        {/* <FaUser className="w-5 h-5"/> */}
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <img
                            src="https://i.pinimg.com/originals/a8/44/c8/a844c8bcff2ad5328aa25f12637fb1ca.jpg"
                            alt="Profile"
                            className="object-cover w-full h-full"
                            />
                        </div>
                    </Link>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 font-semibold py-1 rounded-md">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;
