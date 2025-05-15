import React, { useState, useEffect, useRef } from "react";
import Header from "./../components/Header";
import CameraView from "./../components/CameraViews";
import CamLayout from "./../components/CamLayout";
import EditModal from "./../components/EditModal";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'; 
import { fab } from '@fortawesome/free-brands-svg-icons'; 
import { far } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';

library.add(fas, fab, far);

function Cameras() {
    const [layout, setLayout] = useState("grid");
    const [selectedCamera, setSelectedCamera] = useState(0);
    const user_id = localStorage.getItem("userId");
    const [rooms, setRooms] = useState([]);   
    const prevEmailEnabled = useRef(localStorage.getItem('emailEnabled'));
    const prevDiscordEnabled = useRef(localStorage.getItem('discordEnabled'));

    useEffect(() => {
        const interval = setInterval(() => {
        const newEmail = localStorage.getItem('emailEnabled');
        const newDiscord = localStorage.getItem('discordEnabled');

        if (
            newEmail !== prevEmailEnabled.current ||
            newDiscord !== prevDiscordEnabled.current
        ) {
            window.location.reload();
        }
        }, 1000); 

        return () => clearInterval(interval);
    }, []);

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

        const updatedCamera = {
            ...modalData,
            userId: user_id,
        };

        if (modalMode === "add") {
            axios.post('http://localhost:5000/cameras', updatedCamera, {
                headers: { 'Content-Type': 'application/json' },
            })
            .then((response) => {
                setRooms(prev => [...prev, response.data]);
                setModalOpen(false);
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error adding camera:', error);
            });
        } else if (modalMode === "edit") {
            axios.get(`http://localhost:3000/clear_camera?src=${modalData.src}&user_id=${user_id}`);
            axios.put(`http://localhost:5000/cameras/${modalData._id}`, updatedCamera, {
                headers: { 'Content-Type': 'application/json' },
            })
            .then((response) => {
                setRooms(prev => prev.map((room, i) => 
                    i === editIndex ? response.data : room
                ));
                setModalOpen(false);
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error updating camera:', error);
            });
        }
    };

    const handleDeleteCamera = (id) => {
        axios.delete(`http://localhost:5000/cameras/${id}`)
        .then(() => {
            setRooms(prev => prev.filter(room => room._id !== id)); 
        })
        .catch((error) => {
            console.error('Error deleting camera:', error);
        });

        for (const room of rooms) {
            const src = room.src || "None";
            axios.get(`http://localhost:3000/clear_camera?src=${src}&user_id=${user_id}`);
        }
        window.location.reload();
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

                        <div
                            onClick={handleAddCamera}
                            className="min-h-[300px] bg-indigo-100 hover:bg-indigo-200 cursor-pointer rounded-lg shadow-md p-4 flex items-center justify-center">
                            <span className="text-indigo-900 font-semibold">+ Add Camera</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-full max-w-4xl text-indigo-900">
                            {rooms.length > 0 ? (
                                <CameraView
                                    id={rooms[selectedCamera]._id}
                                    name={rooms[selectedCamera].name}
                                    src={rooms[selectedCamera].src}
                                    user_id={user_id}
                                    isActive={rooms[selectedCamera].isActive}
                                    toggleActive={() => toggleActive(rooms[selectedCamera]._id)}
                                    onEdit={() => handleEditCamera(selectedCamera)}
                                    onDelete={() => handleDeleteCamera(rooms[selectedCamera]._id)}
                                />
                            ) : (
                                <div className="text-center py-12">
                                    <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Cameras</h2>
                                    <p className="text-indigo-700 mb-6">You haven't added any cameras yet.</p>
                                    <button
                                        onClick={handleAddCamera}
                                        className="px-6 py-2 rounded-lg bg-indigo-900 text-white hover:bg-indigo-800 transition"
                                    >
                                        + Add Camera
                                    </button>
                                </div>
                            )}
                        </div>

                        {rooms.length > 0 && (
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full max-w-4xl px-2">
                                {rooms.map((room, idx) => (
                                    <button
                                        key={room._id}
                                        className={`inline-flex items-center px-4 py-2 rounded-lg border whitespace-nowrap flex-shrink-0 transition ${
                                            selectedCamera === idx
                                                ? "bg-indigo-900 text-white"
                                                : "border-indigo-900 text-indigo-900 hover:bg-indigo-100"
                                        }`}
                                        onClick={() => setSelectedCamera(idx)}
                                    >
                                        {room.name}
                                    </button>
                                ))}

                                <button
                                    onClick={handleAddCamera}
                                    className="inline-flex items-center px-4 py-2 rounded-lg font-semibold text-indigo-900 bg-indigo-100 hover:bg-indigo-200 flex-shrink-0 transition"
                                >
                                    + Add Camera
                                </button>
                            </div>
                        )}
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
