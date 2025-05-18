import React, { useEffect, useState } from "react";
import Header from "./../components/Header";
import AlertModal from "./../components/AlertModal";
import SettingModal from "./../components/SettingModal";
import { formatDate } from "../utils/formatDate";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'; 
import { fab } from '@fortawesome/free-brands-svg-icons'; 
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";

library.add(fas, fab, far);

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const [emailEnabled, setEmailEnabled] = useState(() => {
    const stored = localStorage.getItem('emailEnabled');
    return stored ? JSON.parse(stored) : true;
  });

  const [discordEnabled, setDiscordEnabled] = useState(() => {
    const stored = localStorage.getItem('discordEnabled');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem('emailEnabled', JSON.stringify(emailEnabled));
  }, [emailEnabled]);

  useEffect(() => {
    localStorage.setItem('discordEnabled', JSON.stringify(discordEnabled));
  }, [discordEnabled]);

  const filteredAlerts = alerts.filter((alert) => {
    const matchFilter =
      filter === "all"
        ? true  
        : filter === "active"
        ? !alert.resolved
        : alert.resolved;

    const alertDate = `${alert.timestamp.substring(0, 4)}-${alert.timestamp.substring(4, 6)}-${alert.timestamp.substring(6, 8)}`;
    const matchDate = selectedDate ? alertDate === selectedDate : true;
    return matchFilter && matchDate;
  });

  const handleResolve = async (id, newStatus, note) => {
    try {
      await axios.patch(`http://localhost:5000/alerts/${id}`, { 
        resolved: newStatus, 
        note: note 
      });
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, resolved: newStatus, note: note } : a))
      );
    } catch (err) {
      console.error("Failed to update alert status:", err);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    setSelectedDate(localDate);

    const fetchAlerts = async () => {
      if (!userId) return;

      try {
        const res = await axios.get(`http://localhost:5000/alerts?userId=${userId}`);
        setAlerts(res.data);
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      }
    };

    fetchAlerts();

    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white relative pt-16">
      <Header />

      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-indigo-900">Alert Center</h1>
          <button
            className="flex flex-col items-center text-indigo-900 hover:text-indigo-800 cursor-pointer" 
            title="Settings"
            onClick={() => setShowSettings(true)}
          >
            <FontAwesomeIcon icon="fa-solid fa-gear" className="text-xl" />
          </button>
        </div>

        <SettingModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          emailEnabled={emailEnabled}
          setEmailEnabled={setEmailEnabled}
          discordEnabled={discordEnabled}
          setDiscordEnabled={setDiscordEnabled}
        />

        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div className="flex gap-2 items-center">
            <label htmlFor="date-filter" className="text-s font-medium text-gray-700">Date:</label>
            <input
              id="date-filter"
              type="date"
              className="border border-gray-300 rounded-lg px-2 py-1"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {['all', 'active', 'resolved'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1 rounded-lg cursor-pointer ${
                  filter === type ? "bg-indigo-900 text-white" : "border border-gray-300"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="text-center text-gray-500 py-6">No alerts found</div>
        ) : (
          filteredAlerts.map((alert, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedAlert(alert)}
              className={`cursor-pointer p-4 rounded-lg border-2 shadow-md mb-5 ${
                alert.resolved
                  ? "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                  : "bg-red-50 border-red-200 hover:bg-red-100"
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-xl text-black">
                      {alert.name || alert.user_id}
                    </h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        alert.resolved
                          ? "bg-indigo-200 text-black"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {alert.resolved ? "Resolved" : "Active"}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{formatDate(alert.timestamp)}</p>
                  <p className="text-gray-700 mt-1">
                    {alert.note || (
                      alert.resolved
                        ? "Fall incident resolved. No further action required."
                        : "Immediate assistance required."
                    )}
                  </p>
                </div>
                {alert.image_url && (
                  <img
                    src={alert.image_url}
                    alt="Snapshot"
                    className="w-full md:w-48 h-auto rounded-lg shadow object-cover"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <AlertModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        formatDate={formatDate}
        onResolve={handleResolve}
      />
    </div>
  );
}

export default Alerts;