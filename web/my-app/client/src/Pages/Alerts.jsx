import React, { useEffect, useState } from "react";
import Header from "./../components/Header";
import AlertModal from "./../components/AlertModal";
import axios from "axios";

const formatDate = (timestamp) => {
  const year = timestamp.substring(0, 4);
  const month = timestamp.substring(4, 6) - 1; 
  const day = timestamp.substring(6, 8);
  const hour = timestamp.substring(9, 11);
  const minute = timestamp.substring(11, 13);
  const second = timestamp.substring(13, 15);

  const date = new Date(year, month, day, hour, minute, second);

  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, 
  };

  return date.toLocaleString("en-US", options);
};

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

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

  const handleResolve = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a._id === id ? { ...a, resolved: true } : a))
    );
  };

  useEffect(() => {
    axios.get("http://localhost:5000/alerts")
      .then((res) => setAlerts(res.data))
      .catch((err) => console.error("Failed to fetch alerts:", err));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6 mt-0.75">Alert Center</h1>
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <div className="flex gap-4 items-center">
            <label htmlFor="date-filter" className="text-s font-medium text-gray-700">Date:</label>
            <input
              id="date-filter"
              type="date"
              className="border border-gray-300 rounded px-2 py-1"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div className="flex gap-2 flex-wrapm">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded ${
                  filter === "all" ? "bg-indigo-900 text-white" : "border border-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-3 py-1 rounded ${
                  filter === "active" ? "bg-indigo-900 text-white" : "border border-gray-300"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter("resolved")}
                className={`px-3 py-1 rounded ${
                  filter === "resolved" ? "bg-indigo-900 text-white" : "border border-gray-300"
                }`}
              >
                Resolved
              </button>
            </div>
          </div>
        </div>
        
        {filteredAlerts.length === 0 ? (
          <div className="text-center text-gray-500 py-6">No alerts found</div>
        ) : (
          filteredAlerts.map((alert, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedAlert(alert)}
              className={`cursor-pointer p-4 rounded border-2 shadow-md mb-5 ${
                alert.resolved
                  ? "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                  : "bg-red-50 border-red-200 hover:bg-red-100"
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-xl">
                      {alert.roomName || alert.user_id}
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
                  <p className="text-gray-700 text-s mt-1">{formatDate(alert.timestamp)}</p>
                  <p className="text-gray-700 text-s mt-1">
                    {alert.description || alert.note || "No description"}
                  </p>
                </div>
        
                {alert.image_url && (
                  <img
                    src={alert.image_url}
                    alt="Snapshot"
                    className="h-36 w-auto rounded shadow object-cover"
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