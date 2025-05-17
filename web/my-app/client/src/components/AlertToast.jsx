import React, { createContext, useState, useContext } from "react";

const AlertToast = createContext();

export function ToastProvider({ children }) {
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

  return (
    <AlertToast.Provider value={{ showToastMessage }}>
        {children}
        {showToast && (
            <div className="fixed top-4 right-4 bg-red-600 text-white font-bold px-5 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
            {toastMessage}
            </div>
        )}
        </AlertToast.Provider>
    );
}

export function useToast() {
    return useContext(AlertToast);
}
