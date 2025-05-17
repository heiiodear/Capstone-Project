import React from "react";
import { useNavigate } from "react-router-dom";

function ProjectName() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login"); 
  };

  return (
    <div className="min-h-screen bg-indigo-950 flex justify-center items-center">
      <div className="flex flex-col items-center gap-3 md:gap-4 px-4 text-center">
        <div className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white">
          Secura
        </div>
        <button
          onClick={handleClick}
          className="text-base md:text-lg font-semibold text-indigo-950 px-6 sm:px-8 md:px-10 py-2 bg-white rounded-lg
          hover:scale-110 transition-transform active:scale-95"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default ProjectName;
