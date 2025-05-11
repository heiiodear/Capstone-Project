import React from "react";

function CameraViews({ name, src, user_id, onEdit, onDelete }) {
  return (
    <div className="w-full bg-white border-2 border-gray-200 rounded shadow-md p-4 relative">
      <h2 className="text-lg font-semibold mb-2">{name}</h2>

      <div className="relative w-full pt-[56.25%] bg-black rounded overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-white">
          {src ? (
            <img
              className="absolute w-full h-full object-cover rounded"
              src={`http://localhost:3000/video_feed?src=${src}&user_id=${user_id}&name=${name}`}
              alt={`${name} feed`}
            />
          ) : (
            <span className="text-sm text-gray-400">No camera feed available</span>
          )}
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          {onEdit && (
            <button
              onClick={onEdit}
              className="bg-white border-white hover:bg-gray-100 text-sm px-2 py-1 rounded"
              title="Edit Camera"
            >
              edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="bg-white border-white hover:bg-red-100 text-sm px-2 py-1 rounded"
              title="Delete Camera"
            >
              delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CameraViews;
