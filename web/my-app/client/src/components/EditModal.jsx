import React from "react";

const EditModal = ({ type, formData, onChange, onCancel, onSave }) => {
    const fields =
  type === "personal"
    ? [
        { name: "username", label: "Username" },
        { name: "email", label: "Email" },
        { name: "discord", label: "Discord Account"},
        { name: "tel", label: "Phone number" },
      ]
    : type === "address"
    ? [
        { name: "plot", label: "Plot / House number, Village" },
        { name: "road", label: "Road" },
        { name: "district", label: "District" },
        { name: "province", label: "Province" },
        { name: "postal", label: "Postal Code" },
      ]
    : [
        { name: "name", label: "Name" },
        { name: "src", label: "Camera Address (src)" },
      ];


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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
            <div className="bg-white w-full max-w-md mx-4 sm:mx-auto p-4 sm:p-6 rounded-lg shadow-lg space-y-4 mt-10 mb-10">
                <h2 className="text-lg font-semibold text-indigo-900 cursor-default">
                {getTitle()}
                </h2>

                {fields.map((field) => (
                <div key={field.name}>
                    <label className="text-sm block mb-1">{field.label}</label>
                    <input
                    type="text"
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>
                ))}

                <div className="flex justify-end space-x-2 pt-2">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                    Cancel
                </button>
                <button
                    onClick={onSave}
                    className="px-4 py-2 text-sm rounded-lg bg-indigo-900 text-white hover:bg-indigo-800"
                >
                    Save
                </button>
                </div>
            </div>
        </div>
    );
    
};

export default EditModal;