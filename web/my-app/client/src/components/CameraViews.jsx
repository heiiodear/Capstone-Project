import React from "react";

function CameraViews({ id, name }) {

return (
    <div className="w-full bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">{name}</h2>

        <div className="relative w-full pt-[56.25%] bg-black rounded overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-white">
            Camera {id}
        </div>
        </div>
    </div>
    );
}
  
export default CameraViews;
  