import React from "react";

const AlertModal = ({ alert, onClose, formatDate, onResolve }) => {
  if (!alert) return null;
  
  console.log("Rendering AlertModal with alert:", alert);
  
  const handleResolve = () => {
    const newStatus = !alert.resolved;
    console.log(`Toggling alert ID ${alert._id} to resolved: ${newStatus}`);
    try {
      onResolve(alert._id, newStatus);
      onClose();
    } catch (error) {
      console.error("Error in handleResolve:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <button
          onClick={() => {
            console.log("Close button clicked");
            onClose();
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-xl font-bold m-4"
        >
          ✕
        </button>
        
        <h1 className="text-2xl font-bold mb-2 text-indigo-900">Alert Details</h1>
        <p className="text-gray-700 text-s mb-2">Detailed information about this alert</p>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold mb-2">{alert.roomName || alert.user_id}</h2>
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
        <p className="text-gray-700 text-sm mb-2"><b className="font-semibold">Time: </b>{formatDate(alert.timestamp)}</p>
        <p className="text-gray-700 text-sm mb-5">{alert.description || alert.note || "No description available."}</p>
        
        {alert.image_url && (
          <img
            src={alert.image_url}
            alt="Monitoring Clip"
            className="w-full rounded shadow"
          />
        )}
        
        {!alert.resolved && (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleResolve}
              className="bg-indigo-900 text-white px-4 py-2 rounded hover:bg-indigo-800"
            >
              Resolved
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertModal;