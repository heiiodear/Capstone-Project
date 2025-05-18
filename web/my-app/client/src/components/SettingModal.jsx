import React, { useState, useEffect } from "react";
import Switch from "react-switch";

function SettingModal({
    isOpen,
    onClose,
    emailEnabled,
    setEmailEnabled,
    discordEnabled,
    setDiscordEnabled,
}) {
    const [localEmail, setLocalEmail] = useState(emailEnabled);
    const [localDiscord, setLocalDiscord] = useState(discordEnabled);

    useEffect(() => {
        setLocalEmail(emailEnabled);
        setLocalDiscord(discordEnabled);
    }, [emailEnabled, discordEnabled]);
    
    const handleSave = async () => {
        setEmailEnabled(localEmail);
        setDiscordEnabled(localDiscord);

        try {
    const token = localStorage.getItem("token"); // Adjust this line if you store token differently
    await fetch("https://capstone-server-8hss.onrender.com/notification-settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        emailEnabled: localEmail,
        discordEnabled: localDiscord,
      }),
    });
  } catch (error) {
    console.error("Failed to update settings", error);
  }

  onClose();
};
//

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-indigo-900">Notification Settings</h2>
            
            <div className="flex items-center justify-between mb-3">
            <span>Email</span>
            <Switch
                onChange={setLocalEmail}
                checked={localEmail}
                uncheckedIcon={false}
                checkedIcon={false}
                onColor="#312E81"
            />
            </div>

            <div className="flex items-center justify-between mb-3">
            <span>Discord</span>
            <Switch
                onChange={setLocalDiscord}
                checked={localDiscord}
                uncheckedIcon={false}
                checkedIcon={false}
                onColor="#312E81"
            />
            </div>

            <div className="flex justify-end gap-2 mt-6">
            <button
                onClick={onClose}
                className="bg-gray-100 text-gray-800 px-4 py-1 rounded-lg hover:bg-gray-200 cursor-pointer"
            >
                Close
            </button>
            <button
                onClick={handleSave}
                className="bg-indigo-900 text-white px-4 py-1 rounded-lg hover:bg-indigo-800 cursor-pointer"
            >
                Save
            </button>
            </div>
        </div>
    </div>
    );
}

export default SettingModal;
