import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditModal from "./../components/EditModal";
import ConfirmationModal from "./../components/ConfirmationModal"
import ChangePasswordModal from "./../components/ChangePasswordModal";
import WebhookModal from "./../components/WebhookModal";
import Header from "./../components/Header";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'; 
import { fab } from '@fortawesome/free-brands-svg-icons'; 
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
library.add(fas, fab, far);
import axios from "axios";

function Profile() {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingField, setEditingField] = useState("");
    const [isImageEditing, setIsImageEditing] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState("");
    const [formData, setFormData] = useState({});
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isWebhookOpen, setIsWebhookOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token"); 
                if (token) {
                    const response = await axios.get("https://capstone-server-8hss.onrender.com/profile", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log(response.data); 
                    setUserData(response.data);
                    setUserData(response.data); 
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);

    const openModal = (type) => {
        setEditingField(type);
        if (type === "address") {
            setFormData(userData.address);
        } else if (type === "personal") {
            setFormData({
                username: userData.username,
                email: userData.email,
                discord: userData.discord,
                tel: userData.tel,
            });
        } else if (type === "change-password") {
            setFormData({ 
                password: "",
                newpassword: "",
             }); 
        } 
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const saveChanges = async () => {
        try {
            const token = localStorage.getItem("token");

            let updatedData = {};
            if (editingField === "personal") {
                updatedData = {
                    username: formData.username,
                    email: formData.email,
                    discord: formData.discord,
                    tel: formData.tel,
                };
            } else if (editingField === "address") {
                updatedData = {
                    address: {
                        plot: formData.plot,
                        road: formData.road,
                        district: formData.district,
                        province: formData.province,
                        postal: formData.postal,
                    },
                };
            } 

            const response = await axios.put(
                "https://capstone-server-8hss.onrender.com/profile",
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUserData(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     navigate("/");
    // };

    const handleDeleteClick = () => {
        setIsDeleteConfirmOpen(true); 
    };

    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem("token");
            const user_id = localStorage.getItem("userId");
            const response_camera = await axios.get(`https://capstone-server-8hss.onrender.com/cameras?userId=${user_id}`);
            const rooms = response_camera.data;

            for (const room of rooms) {
                const src = room.src || "None";
                await axios.get(`https://capstone-ai.onrender.com/clear_camera?src=${src}&user_id=${user_id}`);
            }
            const response = await axios.delete("https://capstone-server-8hss.onrender.com/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Account deleted:", response.data);
            localStorage.removeItem("token"); 
            navigate("/");  
        } catch (error) {
            console.error("Error deleting account:", error);
        }

        setIsDeleteConfirmOpen(false);  
    };

    const handleDeleteCancel = () => {
        setIsDeleteConfirmOpen(false);  
    };

    const handleChangePassword = async (passwordData) => {
        try {
            const token = localStorage.getItem("token");
    
            const response = await axios.put(
                "https://capstone-server-8hss.onrender.com/profile/password",
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            console.log("Password changed successfully:", response.data);
            alert("Password changed successfully");
            setIsChangePasswordOpen(false); // ปิด modal
        } catch (error) {
            console.error("Error changing password:", error);
            if (error.response && error.response.data && error.response.data.message) {
                alert("Error: " + error.response.data.message);
            } else {
                alert("An unexpected error occurred.");
            }
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen pt-16">
            <Header />
        
            <div className="relative">
                <div className="h-40 bg-indigo-100 rounded-b-lg"></div>

                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                <div className="relative w-24 h-24 rounded-full overflow-hidden">
                    <img
                    src={userData.profileImage}
                    alt="Profile"
                    className="object-cover w-full h-full"
                    />
                </div>
                {/* <button 
                onClick={() => setIsImageEditing(true)}
                className="absolute bottom-0 right-0 text-white bg-indigo-800 p-1 rounded-full text-xs px-2 cursor-pointer">
                    Edit
                </button> */}
                </div>
            </div>

            <div className="mt-16 text-center">
                <h1 className="text-xl font-semibold text-indigo-900 cursor-default">{userData.username}</h1>
                <p className="text-gray-500 cursor-default">{userData.email}</p>
            </div>

            <div className="max-w-4xl mx-auto p-4">
                {/* Personal Info */}
            <div className="w-full max-w-xl mx-auto mt-8 bg-white rounded-lg shadow-lg border-2 border-gray-200 p-6 space-y-4">
                <div className="flex justify-between items-center">
                <h2 className="text-lg text-indigo-900 font-semibold text-left cursor-default">Personal Information</h2>
                <button
                    onClick={() => openModal("personal")}
                    className="bg-white border-white hover:bg-indigo-200 text-sm px-2 py-1 rounded-lg cursor-pointer">
                    <FontAwesomeIcon icon="fa-solid fa-pen" style={{color: "#312E81",}} />
                </button>
                </div>
                {[
                    { label: "Username", value: userData.username },
                    { label: "Email", value: userData.email },
                    // { label: "Password", value: userData.password },
                    {
                        label: (
                        <div className="flex items-center gap-1">
                            <span>Discord Webhook URL</span>
                            <button
                            onClick={() => setIsWebhookOpen(true)}
                            className="cursor-pointer"
                            aria-label="Webhook info"
                            >
                            <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#6B7280" }} />
                            </button>
                        </div>
                        ),
                        value: <span className="text-sm break-all">{userData.discord}</span>,
                    },
                    { label: "Phone number", value: userData.tel },
                    ].map((field) => (
                <div key={field.label} className="flex justify-between items-center border-b pb-2">
                    <div>
                    <div className="text-xs text-gray-500 pb-1.5">{field.label}</div>
                    <div className="text-sm font-medium break-all">{field.value}</div>
                    </div>
                </div>
                ))}
            </div>

            <WebhookModal 
            isOpen={isWebhookOpen} 
            onClose={() => setIsWebhookOpen(false)} 
            />

            {/* Address Info */}
            <div className="max-w-xl mx-auto mt-6 bg-white rounded-lg shadow-lg border border-gray-200 p-6 space-y-4">
                <div className="flex justify-between items-center">
                <h2 className="text-lg text-indigo-900 font-semibold text-left cursor-default">Address</h2>
                <button
                    onClick={() => openModal("address")}
                    className="bg-white border-white hover:bg-indigo-200 text-sm px-2 py-1 rounded-lg cursor-pointer">
                    <FontAwesomeIcon icon="fa-solid fa-pen" style={{color: "#312E81",}} />
                </button>
                </div>
                {[
                    { label: "Plot / House number, Village", value: userData.address?.plot },
                    { label: "Road", value: userData.address?.road },
                    { label: "District", value: userData.address?.district },
                    { label: "Province", value: userData.address?.province },
                    { label: "Postal Code District Province", value: userData.address?.postal },
                ].map((field) => (
                <div key={field.label} className="flex justify-between items-center border-b pb-2">
                    <div>
                    <div className="text-xs text-gray-500 pb-1.5">{field.label}</div>
                    <div className="text-sm font-medium">{field.value}</div>
                    </div>
                </div>
                ))}
            </div>
            {/* Delete Confirmation Modal */}
            {isDeleteConfirmOpen && (
                <ConfirmationModal
                    title="Delete Account"
                    message="Are you sure you want to delete your account? This action cannot be undone."
                    confirmText="Delete"
                    confirmColor="bg-red-600 hover:bg-red-700"
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}

            <div className="max-w-xl mx-auto m-6 space-y-4">
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => setIsChangePasswordOpen(true)}
                        className="text-sm font-medium text-white bg-indigo-900 hover:bg-indigo-800 py-2.5 px-4 rounded-lg cursor-pointer"
                    >
                        Change Password
                    </button>
                    <button
                        type="button"
                        onClick={handleDeleteClick}
                        className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 py-2.5 px-4 rounded-lg cursor-pointer"
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            <ChangePasswordModal
                isOpen={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
                onSave={handleChangePassword}
            />
            </div>
            
            {isEditing && (
                <EditModal
                type={editingField}
                formData={formData}
                onChange={handleChange}
                onCancel={() => setIsEditing(false)}
                onSave={saveChanges}
                />
            )}
            {isImageEditing && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-96 shadow-lg space-y-4">
                <h2 className="text-lg font-semibold text-indigo-900">Update Profile Picture</h2>
            
            {/* Styled file upload */}
            <div className="flex flex-col items-center mt-8 space-y-2">
            <label
            htmlFor="profileImageInput"
            className="inline-block cursor-pointer px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition duration-150"
            >
            Choose File
            </label>
            <input
                id="profileImageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                const imageUrl = URL.createObjectURL(file);
                setNewImageUrl(imageUrl);
                }
            }}
            />
            {newImageUrl && (
            <div className="w-24 h-24 overflow-hidden rounded-full border">
                <img
                src={newImageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                />
            </div>
            )}
        </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
          onClick={() => setIsImageEditing(false)}
        >
          Cancel
        </button>

        <button
        className="px-4 py-2 text-sm bg-indigo-700 text-white rounded-lg hover:bg-indigo-900 cursor-pointer"
        onClick={async () => {
            try {
            const token = localStorage.getItem("token");
            await axios.put(
                "https://capstone-server-8hss.onrender.com/profile/image",
                { profileImage: newImageUrl },
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                }
            );
            setUserData({ ...userData, profileImage: newImageUrl });
            setIsImageEditing(false);
            } catch (err) {
            console.error("Error saving image:", err);
            }
        }}
        >
        Save
        </button>

            </div>
        </div>
    </div>
)}
            
        </div>
    );
}

export default Profile;
