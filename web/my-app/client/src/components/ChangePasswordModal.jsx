import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

function ChangePasswordModal({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState({
        currentpass: false,
        newpass: false,
        confirmpass: false,
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const toggleVisibility = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };

    const handleSave = () => {
        const { currentPassword, newPassword, confirmPassword } = formData;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return setError("All fields are required.");
        }

        if (newPassword !== confirmPassword) {
            return setError("New passwords do not match.");
        }

        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
                <h2 className="text-lg font-semibold text-indigo-900">
                    Change Password
                </h2>

                {error && <div className="text-sm text-red-600">{error}</div>}

                <div>
                    <label className="block text-sm mb-1">Current Password</label>
                    <div className="relative">
                        <input
                            type={showPassword.currentpass ? "text" : "password"}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => toggleVisibility("currentpass")}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        >
                            <FontAwesomeIcon icon={showPassword.currentpass ? faEyeSlash : faEye} />
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm mb-1">New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword.newpass ? "text" : "password"}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => toggleVisibility("newpass")}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        >
                            <FontAwesomeIcon icon={showPassword.newpass ? faEyeSlash : faEye} />
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm mb-1">Confirm New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword.confirmpass ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => toggleVisibility("confirmpass")}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        >
                            <FontAwesomeIcon icon={showPassword.confirmpass ? faEyeSlash : faEye} />
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-100 text-gray-800 text-sm px-4 py-2 rounded-lg hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-indigo-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-800"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordModal;
