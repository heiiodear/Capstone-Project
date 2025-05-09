import React from "react";

function CameraViews({name, src, user_id }) {
    console.log(src);
  return (
    <div className="w-full bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-2">{name}</h2>

      <div className="relative w-full pt-[56.25%] bg-black rounded overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-white">
          {src ? (
            <img
              className="absolute w-full h-full object-cover rounded"
              src={`http://localhost:3000/video_feed?src=${src}&user_id=${user_id}`}
              alt={`${name} feed`}
            />
          ) : (
            <span className="text-sm text-gray-400">No camera feed available</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default CameraViews;