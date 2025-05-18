import React, { useState } from "react";
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";

const AlertModal = ({ alert, onClose, formatDate, onResolve }) => {
  if (!alert) return null;

  const [noteInput, setNoteInput] = useState(alert.note || "");
  const [isEditingNote, setIsEditingNote] = useState(false);
  
  const handleResolve = async () => {
    const newStatus = !alert.resolved;
    const updatedNote = noteInput.trim() ? noteInput.trim() : alert.note;

    try {
      onResolve(alert._id, newStatus, updatedNote);
      await axios.patch(`http://localhost:5000/alerts/${alert._id}`, {
        resolved: newStatus,
        note: updatedNote,
      });
      onClose();
    } catch (error) {
      console.error("Error in handleResolve:", error);
    }
  };

  const handleNoteUpdate = async () => {
    const trimmedNote = noteInput.trim();
    if (trimmedNote === alert.note) {
      setIsEditingNote(false);
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/alerts/${alert._id}`, {
        note: trimmedNote,
      });
      onResolve(alert._id, alert.resolved, trimmedNote); 
      setIsEditingNote(false);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleKeyPress = (e) => {
    console.log("Key pressed:", e.key);
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNoteUpdate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-xl font-bold cursor-pointer"
        >
          ✕
        </button>

        <h1 className="text-2xl font-bold mb-1 text-indigo-900">Alert Details</h1>
        <p className="text-gray-700 text-sm mb-4">Detailed information about this alert</p>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h2 className="text-xl font-semibold">{alert.name || alert.user_id}</h2>
          <span
            className={`text-xs px-3 py-1 rounded-full ${
              alert.resolved ? "bg-indigo-200 text-black" : "bg-red-600 text-white"
            }`}
          >
            {alert.resolved ? "Resolved" : "Active"}
          </span>
        </div>

        <p className="text-gray-700 text-sm mb-2">
          <b className="font-semibold">Time: </b>{formatDate(alert.timestamp)}
        </p>

        <div className="flex items-start mb-5 sm:mb-1">
          {!isEditingNote ? (
            <>
              <p className="text-gray-700 text-sm">
                {noteInput || (
                  alert.resolved
                    ? "Fall incident resolved. No further action required."
                    : "Immediate assistance required."
                )}
              </p>
              <button
                onClick={() => setIsEditingNote(true)}
                className="ml-2 text-sm hover:bg-indigo-200 rounded-full p-1"
              >
                <FontAwesomeIcon icon="fa-solid fa-pen" style={{ color: "#312E81" }} />
              </button>
            </>
          ) : (
            <textarea
              rows={3}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Edit note and press Enter to save"
              className="w-full border border-gray-500 rounded-lg p-2 text-sm"
              autoFocus
            />
          )}
        </div>

        {alert.video_url && (
          <ReactPlayer
            url={alert.video_url}
            controls
            width="100%"
            height="auto"
          />
        )}

        {!alert.resolved && (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleResolve}
              className="bg-indigo-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-800 cursor-pointer"
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