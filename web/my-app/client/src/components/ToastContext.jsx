import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import notificationSound from "../assets/emergence-ringtone.mp3";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showNotiToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchAlerts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/alerts?userId=${userId}`);
        const allAlerts = res.data;

        // ดึง alert id ที่เคยแจ้งไปแล้ว
        const alertedIds = JSON.parse(localStorage.getItem("alertedIds") || "[]");

        const newUnnotifiedAlerts = allAlerts.filter(
          (a) => !a.resolved && !alertedIds.includes(a._id)
        );

        if (newUnnotifiedAlerts.length > 0) {
          // แจ้งเตือน
          showNotiToast("🚨 New alert received!");
          const audio = new Audio(notificationSound);
          audio.play();

          // บันทึกว่า alert ไหนแจ้งแล้ว
          const updatedIds = [...alertedIds, ...newUnnotifiedAlerts.map(a => a._id)];
          localStorage.setItem("alertedIds", JSON.stringify(updatedIds));
        }
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ToastContext.Provider value={{ showNotiToast }}>
      {children}
      {showToast && (
        <div
          className="fixed bottom-4 right-4 bg-red-600 text-white font-semibold text-xl px-7 py-5 rounded-lg shadow-lg z-50 animate-slide-in cursor-pointer"
          onClick={() => window.location.href = "/alerts"}
        >
          {toastMessage}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
