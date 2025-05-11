import React from "react";

const EditModal = ({ type, formData, onChange, onCancel, onSave }) => {
    const fields =
    type === "personal"
        ? ["username", "email", "password", "phone"]
        : type === "address"
        ? ["plot", "road", "district", "province", "postal"]
        : ["name", "camera address"];

    const getTitle = () => {
    switch (type) {
        case "personal":
            return "Edit Personal Information";
        case "address":
            return "Edit Address";
        case "camera":
            return "Edit Camera";
        default:
            return "Edit";
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold text-indigo-900">{getTitle()}</h2>

            {fields.map((field) => (
            <div key={field}>
                <label className="text-sm block mb-1 capitalize">{field}</label>
                <input
                type="text"
                name={field}
                value={formData[field] || ""}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>
            ))}

            <div className="flex justify-end space-x-2 pt-2">
            <button
                onClick={onCancel}
                className="px-4 py-2 text-sm rounded-md border bg-gray-100 hover:bg-gray-200"
            >
                Cancel
            </button>
            <button
                onClick={onSave}
                className="px-4 py-2 text-sm rounded-md bg-indigo-700 text-white hover:bg-indigo-900"
            >
                Save
            </button>
            </div>
        </div>
        </div>
    );
};

export default EditModal;