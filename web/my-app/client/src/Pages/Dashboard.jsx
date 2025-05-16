import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./../components/Header";
import { formatDate } from "../utils/formatDate";
import { useLocation } from "react-router-dom";

function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        activeAlerts: 0,
        safeRooms: 0,
        roomStatuses: {},
    });

    useEffect(() => {
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
        console.error("User ID not found in localStorage.");
        return;
    }

    axios.get("http://localhost:5000/dashboard", {
        params: { user_id: userId }
    })
    .then((res) => setDashboardData(res.data))
    .catch((err) => console.error("Failed to fetch dashboard:", err));
    
}, []);


    const { activeAlerts, safeRooms, roomStatuses } = dashboardData;

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <div className="container mx-auto py-6 px-4">
                <h1 className="text-3xl font-bold text-indigo-900 mb-6">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="border-2 border-gray-200 rounded-lg p-4 shadow-md">
                        <p className="text-sm text-gray-500">Active Alerts</p>
                        <div className="flex items-center mt-2">
                            <div className="w-3 h-3 bg-red-600 rounded-full mr-2" />
                            <p className="text-2xl font-bold text-indigo-900">{activeAlerts}</p>
                        </div>
                    </div>
                    <div className="border-2 border-gray-200 rounded-lg p-4 shadow-md">
                        <p className="text-sm text-gray-500">Safe Rooms</p>
                        <div className="flex items-center mt-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                            <p className="text-2xl font-bold text-indigo-900">{safeRooms}</p>
                        </div>
                    </div>
                </div>

                {/* Room Status Section */}
                <div className="mt-10">
                    <h2 className="text-xl font-semibold text-indigo-900 mb-4">Room Status</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {Object.entries(roomStatuses).map(([room, status]) => {
                            const statusDetails = status === "alert"
                                ? { text: "Immediate attention required", color: "bg-red-600" }
                                : { text: "All clear", color: "bg-green-500" };

                            return (
                                <div key={room} className="flex justify-between items-center border-2 border-gray-200 rounded-lg p-4 shadow-md">
                                    <div>
                                        <h3 className="font-semibold text-lg">{room}</h3>
                                        <p className="text-sm text-gray-600">{statusDetails.text}</p>
                                    </div>
                                    <div className={`h-4 w-4 rounded-full ${statusDetails.color}`} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
