import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import axios from "axios";

function Header() {
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState("https://www.engineering.columbia.edu/sites/default/files/styles/full_size_1_1/public/2024-07/Columbia_Engineering_Headshot_1_B.png?itok=n6_TL_JQ");
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem("token");
             if (!token) {
                console.error("No token found");
                setError("No token found");
                setIsLoading(false);
                return;
            }

            console.log("Fetching user profile with token:", token);

            try {
                const response = await axios.get("http://localhost:5000/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.profileImage) {
                    console.log("User profile image fetched:", response.data.profileImage);
                    setProfileImage(response.data.profileImage);
                } else {
                    console.log("No profile image found, using default");
                    setProfileImage(
                        "https://www.engineering.columbia.edu/sites/default/files/styles/full_size_1_1/public/2024-07/Columbia_Engineering_Headshot_1_B.png?itok=n6_TL_JQ"
                    );
                }
            } catch (error) {
                console.error("Failed to fetch user profile", error);
                setError("Failed to fetch profile image");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };
    
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     navigate("/");
    // };

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
                                src={profileImage}
                                alt="Profile"
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://www.engineering.columbia.edu/sites/default/files/styles/full_size_1_1/public/2024-07/Columbia_Engineering_Headshot_1_B.png?itok=n6_TL_JQ";
                                }}
                                />

                        </div>
                    </Link>
                    <button
                        type="submit"
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 font-semibold py-1 rounded-md cursor-pointer">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;
