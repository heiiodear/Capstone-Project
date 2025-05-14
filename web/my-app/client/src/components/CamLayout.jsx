import React from "react";

function CamLayout({ layout, setLayout }) {
    return (
        <div className="flex gap-2">
            <button
                className={`px-4 py-2 rounded-lg border cursor-pointer ${
                    layout === "grid"
                    ? "bg-indigo-900 text-white"
                    : "border-indigo-900 text-indigo-900 hover:bg-indigo-100"
                }`}
                onClick={() => setLayout("grid")}>
                Grid View
            </button>
            <button
                className={`px-4 py-2 rounded-lg border cursor-pointer ${
                    layout === "single"
                    ? "bg-indigo-900 text-white"
                    : "border-indigo-900 text-indigo-900 hover:bg-indigo-100"
                }`}
                onClick={() => setLayout("single")}>
                Single View
            </button>
        </div>
    );
};
  
export default CamLayout;
  