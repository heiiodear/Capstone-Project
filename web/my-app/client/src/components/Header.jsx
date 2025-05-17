import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'; 
import { fab } from '@fortawesome/free-brands-svg-icons'; 
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAlertNotifications } from './../hooks/useAlertNotifications';
library.add(fas, fab, far);
import axios from "axios";

function Header() {
    useAlertNotifications();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState("https://www.engineering.columbia.edu/sites/default/files/styles/full_size_1_1/public/2024-07/Columbia_Engineering_Headshot_1_B.png?itok=n6_TL_JQ");
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [activeAlerts, setActiveAlerts] = useState(0);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    useEffect(() => {
        const fetchUserProfileAndAlerts = async () => {
            const token = localStorage.getItem("token");
            const user_id = localStorage.getItem("userId");
            if (!token) {
                console.error("No token found");
                setError("No token found");
                setIsLoading(false);
                return;
            }

            try {
                const profileRes = await axios.get("http://localhost:5000/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProfileImage(profileRes.data.profileImage || profileImage);

                if (user_id) {
                const alertRes = await axios.get(`http://localhost:5000/dashboard?user_id=${user_id}`);
                console.log("Fetched activeAlerts:", alertRes.data.activeAlerts); 
                setActiveAlerts(alertRes.data.activeAlerts || 0);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
                setError("Failed to fetch profile or alerts");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfileAndAlerts();
    }, []);

    const handleLogout = async () => {
        // const user_id = localStorage.getItem("userId");
        // const response = await axios.get(`http://localhost:5000/cameras?userId=${user_id}`);
        // const rooms = response.data;

        // for (const room of rooms) {
        //     const src = room.src || "None";
        //     await axios.get(`http://localhost:3000/clear_camera?src=${src}&user_id=${user_id}`);
        // }

        localStorage.removeItem("token");
        navigate("/");
    };
    
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     navigate("/");
    // };

    return (
        <header className="bg-indigo-900 text-white shadow-md py-3 px-5 relative z-50">
            <div className="max-w-9xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        className="md:hidden text-white"
                        onClick={toggleSidebar}
                    >
                        <FaBars className="w-5 h-5" />
                    </button>
                    <Link to="/dashboard" className="text-xl font-bold">
                        <span className="hidden sm:inline">Secura</span>
                    </Link>
                </div>

                <nav className="hidden md:flex gap-6 text-md font-medium">
                    <Link to="/dashboard" className="hover:underline cursor-pointer">Dashboard</Link>
                    <Link to="/alerts" className="hover:underline cursor-pointer">Alerts</Link>
                    <Link to="/cameras" className="hover:underline cursor-pointer">Cameras</Link>
                    <Link to="/contactus" className="hover:underline cursor-pointer">Contact Us</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link to="/alerts" className="relative">
                        <FontAwesomeIcon icon="bell" className="absolute -top-2.5 right-0.25 text-white text-xl" />
                        {activeAlerts > 0 && (
                            <span className="absolute -top-4 -right-3 bg-red-600 text-white text-[12px] font-semibold rounded-full px-2 flex items-center justify-center z-50">
                                {activeAlerts}
                            </span>
                        )}
                    </Link>
                    <Link to="/profile">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://www.engineering.columbia.edu/sites/default/files/styles/full_size_1_1/public/2024-07/Columbia_Engineering_Headshot_1_B.png?itok=n6_TL_JQ";
                            }}
                            />
                    </Link>
                    <button
                        type="submit"
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 font-semibold py-1 rounded-lg cursor-pointer">
                        Logout
                    </button>
                </div>
            </div>

                {/* Sidebar Menu */}
                <div className={`fixed top-0 left-0 w-64 h-full bg-white shadow-md transform transition-transform duration-300 ease-in-out z-50 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex justify-between items-center px-5 py-4 border-b">
                    <h2 className="text-indigo-900 font-bold text-lg">Secura</h2>
                    <button onClick={closeSidebar}>
                    <FaTimes className="text-indigo-900 text-xl" />
                    </button>
                </div>
                <nav className="flex flex-col gap-4 px-5 py-4 text-indigo-900 font-medium">
                    <Link to="/dashboard" onClick={closeSidebar}>Dashboard</Link>
                    <Link to="/alerts" onClick={closeSidebar}>Alerts</Link>
                    <Link to="/cameras" onClick={closeSidebar}>Cameras</Link>
                    <Link to="/contactus" onClick={closeSidebar}>Contact Us</Link>
                </nav>
                </div>

                {/* Backdrop */}
                {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={closeSidebar}
        ></div>
        )}
     </header>
    );
};

export default Header;
