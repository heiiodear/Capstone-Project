import React from "react";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'; 
import { fab } from '@fortawesome/free-brands-svg-icons'; 
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function CameraViews({ name, src, user_id, onEdit, onDelete }) {
  return (
    <div className="min-h-[300px] bg-white border-2 border-gray-200 rounded-lg shadow-md p-4 relative">
      <h2 className="text-lg font-semibold mb-2">{name}</h2>

      <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-white">
          {src ? (
            <img
              className="absolute w-full h-full object-cover rounded-lg"
              src={`http://localhost:3000/video_feed?src=${encodeURIComponent(src)}&user_id=${encodeURIComponent(user_id)}&name=${encodeURIComponent(name)}`}
              alt={`${name} feed`}
            />
          ) : (
            <span className="text-sm text-gray-400">No camera feed available</span>
          )}
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="absolute top-4 right-2 flex z-10">
          {onEdit && (
            <button
              onClick={onEdit}
              className="bg-white border-white hover:bg-indigo-200 text-sm px-2 py-1 rounded-lg cursor-pointer"
              title="Edit Camera"
            >
              <FontAwesomeIcon icon="fa-solid fa-pen" style={{color: "#312E81",}} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="bg-white border-white hover:bg-red-100 text-sm px-2 py-1 rounded-lg cursor-pointer"
              title="Delete Camera"
            >
              <FontAwesomeIcon icon="fa-solid fa-trash" style={{color: "#e00000",}} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CameraViews;
