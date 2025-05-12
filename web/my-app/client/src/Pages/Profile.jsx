import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EditModal from "./../components/EditModal";
import ConfirmationModal from "./../components/ConfirmationModal"
import Header from "./../components/Header";
import axios from "axios";

function Profile() {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingField, setEditingField] = useState("");
    const [isImageEditing, setIsImageEditing] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState("");
    const [formData, setFormData] = useState({});
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("authToken"); 
                if (token) {
                    const response = await axios.get("http://localhost:5000/profile", {
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
        setFormData(type === "address" ? userData.address : {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            discord: userData.discord,
            phone: userData.phone,
        });
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const saveChanges = async () => {
    try {
        const token = localStorage.getItem("authToken");

        let updatedData = {};
        if (editingField === "personal") {
            updatedData = {
                username: formData.username,
                email: formData.email,
                discord: formData.discord,
                phone: formData.phone,
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
            "http://localhost:5000/profile",
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
            const token = localStorage.getItem("authToken");
            const response = await axios.delete("http://localhost:5000/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Account deleted:", response.data);
            localStorage.removeItem("authToken"); 
            navigate("/");  
        } catch (error) {
            console.error("Error deleting account:", error);
        }

        setIsDeleteConfirmOpen(false);  
    };

    const handleDeleteCancel = () => {
        setIsDeleteConfirmOpen(false);  
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen">
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

            {/* Personal Info */}
            <div className="w-full max-w-xl mx-auto mt-8 bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 space-y-4">
                <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-left cursor-default">Personal Information</h2>
                <button
                    onClick={() => openModal("personal")}
                    className="text-sm text-indigo-600 hover:underline font-semibold cursor-pointer">
                    Edit
                </button>
                </div>
                {[
                    { label: "Username", value: userData.username },
                    { label: "Email", value: userData.email },
                    // { label: "Password", value: userData.password },
                    { label: "Discord Account", value: userData.discord },
                    { label: "Phone number", value: userData.tel },
                ].map((field) => (
                <div key={field.label} className="flex justify-between items-center border-b pb-2">
                    <div>
                    <div className="text-xs text-gray-500 pb-1.5">{field.label}</div>
                    <div className="text-sm font-medium">{field.value}</div>
                    </div>
                </div>
                ))}
            </div>

            {/* Address Info */}
            <div className="max-w-xl mx-auto mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-4">
                <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-left cursor-default">Address</h2>
                <button
                    onClick={() => openModal("address")}
                    className="text-sm text-indigo-600 hover:underline font-semibold cursor-pointer">
                    Edit
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
                    <div className="text-xs text-gray-500 pb-1">{field.label}</div>
                    <div className="text-sm font-medium">{field.value}</div>
                    </div>
                </div>
                ))}
            </div>

            {/* Edit Modal */}
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
            className="inline-block cursor-pointer px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 transition duration-150"
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
          className="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
          onClick={() => setIsImageEditing(false)}
        >
          Cancel
        </button>

        <button
        className="px-4 py-2 text-sm bg-indigo-700 text-white rounded-md hover:bg-indigo-900"
        onClick={async () => {
            try {
            const token = localStorage.getItem("authToken");
            await axios.put(
                "http://localhost:5000/profile/image",
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
            {/* Delete Confirmation Modal */}
            {isDeleteConfirmOpen && (
                <ConfirmationModal
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}

            {/* Delete Account Button */}
            <div className="max-w-xl mx-auto mt-10 mb-10">
                <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-md py-2 font-semibold rounded-md cursor-pointer">
                    Delete Account
                </button>
            </div>
        </div>
    );
}

export default Profile;
