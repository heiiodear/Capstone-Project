import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./../components/Header";
import axios from "axios";

function Alerts() {
    const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/alerts")
      .then((res) => setAlerts(res.data))
      .catch((err) => console.error("Failed to fetch alerts:", err));
  }, []);
    
    return (
        <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold text-navy mb-6 mt-0.75">Alerts</h1>
        {alerts.map((alert, idx) => (
          <div key={idx} className="w-full bg-white rounded shadow p-4 mb-3">
            <p>{alert.user_id}</p>
            <img src={alert.image_url} alt="Fall Snapshot" className="w-64 mt-2" />
            <p><strong>Time:</strong> {alert.timestamp}</p>
          </div>
        ))}
        </div>
      </div>
    );
}

export default Alerts;