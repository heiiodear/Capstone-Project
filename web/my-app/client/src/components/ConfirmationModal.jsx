import React from "react";

const ConfirmationModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-semibold text-indigo-900">Delete Profile?</h2>
            <p className="text-sm text-gray-800 mt-2">Are you sure you want to delete your profile?</p>
            <div className="flex justify-end space-x-4 pt-4">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                >
                    Confirm
                </button>
            </div>
        </div>
    </div>
);

export default ConfirmationModal;