import React, { useState, useEffect } from "react";
import Header from "./../components/Header";
import CameraView from "./../components/CameraViews";
import CamLayout from "./../components/CamLayout";
import EditModal from "./../components/EditModal";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'; 
import { fab } from '@fortawesome/free-brands-svg-icons'; 
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
library.add(fas, fab, far);
import axios from 'axios';

function Cameras() {
    const [layout, setLayout] = useState("grid");
    const [selectedCamera, setSelectedCamera] = useState(0);
    const user_id = localStorage.getItem("userId");

    const [rooms, setRooms] = useState([]);   

    useEffect(() => {
    const user_id = localStorage.getItem("userId");
    if (!user_id) {
        console.error("User ID is not found in localStorage");
        return;
    }

    axios.get(`http://localhost:5000/cameras?userId=${user_id}`)  
        .then((response) => {
            setRooms(response.data); 
        })
        .catch((error) => {
            console.error('Error fetching cameras:', error);
        });
}, []);

    
    const toggleActive = (id) => {
        setRooms(prev => prev.map(room =>
            room._id === id ? { ...room, isActive: !room.isActive } : room
        ));
    };

    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({});
    const [modalMode, setModalMode] = useState("add");
    const [editIndex, setEditIndex] = useState(null);

    const handleAddCamera = () => {
        setModalMode("add");
        setModalData({ name: "", src: "", isActive: true });
        setModalOpen(true);
    };

    const handleEditCamera = (index) => {
        setModalMode("edit");
        setEditIndex(index);
        setModalData({ ...rooms[index] });
        setModalOpen(true);
    };

    const handleModalChange = (e) => {
        setModalData({ ...modalData, [e.target.name]: e.target.value });
    };

   const handleSave = () => {
    const user_id = localStorage.getItem("userId");
    if (!user_id) {
        console.error("User ID is not found in localStorage");
        return;
    }

    const newCamera = {
        ...modalData,
        userId: user_id,
    };

    axios.post('http://localhost:5000/cameras', newCamera, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((response) => {
        setRooms(prev => [...prev, response.data]);
        setModalOpen(false); 
    })
    .catch((error) => {
        console.error('Error saving camera:', error);
    });
};


    const handleDeleteCamera = (id) => {
    axios.delete(`http://localhost:5000/cameras/${id}`)
        .then(() => {
            setRooms(prev => prev.filter(room => room._id !== id)); 
        })
        .catch((error) => {
            console.error('Error deleting camera:', error);
        });
};


    return (
        <div className="min-h-screen bg-white">
            <Header />

            <div className="container mx-auto py-6 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h1 className="text-3xl font-bold text-indigo-900">Cameras</h1>
                <CamLayout layout={layout} setLayout={setLayout} />
            </div>

            {layout === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-indigo-900">
                {rooms.map((room, index) => (
                    <CameraView
                        key={room._id}
                        id={room._id}
                        name={room.name}
                        src={room.src}
                        user_id={user_id}
                        isActive={room.isActive}
                        toggleActive={() => toggleActive(room._id)}
                        onEdit={() => handleEditCamera(index)}
                        onDelete={() => handleDeleteCamera(room._id)}
                    />
                ))}

                {/* Add Camera */}
                <div
                    onClick={handleAddCamera}
                    className="min-h-[300px] bg-indigo-100 hover:bg-indigo-200 cursor-pointer rounded-lg shadow-md p-4 flex items-center justify-center">
                    <span className="text-indigo-900 font-semibold">+ Add Camera</span>
                </div>
                </div>
                ) : (
                <div className="space-y-4">
                <div className="max-w-xxl mx-auto text-indigo-900">
                    <CameraView
                        id={rooms[selectedCamera].id}
                        name={rooms[selectedCamera].name}
                        src={rooms[selectedCamera].src}
                        user_id={user_id}
                        isActive={rooms[selectedCamera].isActive}
                        toggleActive={() => toggleActive(rooms[selectedCamera].id)}
                        onEdit={() => handleEditCamera(selectedCamera)}
                        onDelete={() => handleDeleteCamera(rooms[selectedCamera].id)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 max-w-xxl mx-auto">
                    {rooms.map((room, idx) => (
                        <button
                            key={room._id}
                            className={`px-3 py-2 rounded-lg border whitespace-nowrap flex-shrink-0 ${
                                selectedCamera === idx
                                    ? "bg-indigo-900 text-white"
                                    : "border-indigo-900 text-indigo-900 hover:bg-indigo-100"
                            }`}
                            onClick={() => setSelectedCamera(idx)}
                        >
                            {room.name}
                        </button>
                    ))}
                    {/* Add Camera */}
                    <div
                        onClick={handleAddCamera}
                        className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 cursor-pointer rounded-lg shadow-md p-4 flex items-center justify-center">
                        <span className="text-indigo-900 font-semibold">+ Add Camera</span>
                    </div>
                </div>
                </div>
                )}
            </div>

            {modalOpen && (
                <EditModal
                    type="camera"
                    formData={modalData}
                    onChange={handleModalChange}
                    onCancel={() => setModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

export default Cameras;
