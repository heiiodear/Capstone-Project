import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'; 
import { fab } from '@fortawesome/free-brands-svg-icons'; 
import { far } from '@fortawesome/free-regular-svg-icons';
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
library.add(fas, fab, far);

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
                    <Link to="/contactus" className="hover:underline">Contact Us</Link>
                </nav>

                <div className="flex items-center gap-4 relative">
                    <Link to="/alerts" className="relative text-xl">
                        <FontAwesomeIcon icon="fa-solid fa-bell" style={{ color: "#ffffff" }} />
                    </Link>
                    <Link to="/profile">
                        <div className="relative w-8 h-8 border border-white rounded-full overflow-hidden">
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
