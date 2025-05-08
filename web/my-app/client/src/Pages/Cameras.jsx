import React, { useState } from "react";
import Header from "./../components/Header";
import CameraView from "./../components/CameraViews";
import CamLayout from "./../components/CamLayout";

function Cameras() {
    const [layout, setLayout] = useState("grid");
    const [selectedCamera, setSelectedCamera] = useState(0);

    const rooms = [
        { id: 1, name: "Bedroom" },
        { id: 2, name: "Kitchen" },
        { id: 3, name: "Living Room" },
        { id: 4, name: "Bathroom" },
        { id: 5, name: "Laundry Room" },
    ];

    return (
    <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h1 className="text-3xl font-bold text-navy">Cameras</h1>
            <CamLayout layout={layout} setLayout={setLayout} />
        </div>

        {layout === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
                <CameraView key={room.id} id={room.id} name={room.name} />
            ))}
            </div>
        ) : (
            <div className="space-y-4">
            <div className="max-w-xxl mx-auto">
                <CameraView
                    id={rooms[selectedCamera].id}
                    name={rooms[selectedCamera].name}
                />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 max-w-xxl mx-auto">
                {rooms.map((room, idx) => (
                <button
                    key={room.id}
                    className={`px-3 py-2 rounded border whitespace-nowrap flex-shrink-0 ${
                    selectedCamera === idx
                        ? "bg-indigo-900 text-white"
                        : "border-indigo-900 text-indigo-900 hover:bg-indigo-900/10"
                    }`}
                    onClick={() => setSelectedCamera(idx)}
                >
                    {room.name}
                </button>
                ))}
            </div>
            </div>
        )}
        </div>
    </div>
    );
}

export default Cameras;
