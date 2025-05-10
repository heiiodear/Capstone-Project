import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EditModal from "./../components/EditModal";
import Header from "./../components/Header";

function Profile() {
    const [mockdata, setMockdata] = useState({
        username: "John Doe",
        email: "johndoe@gmail.com",
        password: "••••••••",
        discord: "discord account",
        phone: "0000000000",

        address: {
            plot: "123 Example 1",
            road: "Example Road",
            district: "Example District",
            province: "Bangkok",
            postal: "10000"
        },
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingField, setEditingField] = useState("");
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const openModal = (type) => {
        setEditingField(type);
        setFormData(type === "address" ? mockdata.address : {
            username: mockdata.username,
            email: mockdata.email,
            password: mockdata.password,
            discord: mockdata.discord,
            phone: mockdata.phone,
        });
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const saveChanges = () => {
        if (editingField === "personal") {
        setMockdata({ ...mockdata, ...formData });
        } else if (editingField === "address") {
        setMockdata({ ...mockdata, address: formData });
        }
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate("/");
    };

    return (
        <div className="min-h-screen">
            <Header />
        
            <div className="relative">
                <div className="h-40 bg-indigo-100 rounded-b-lg"></div>

                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                <div className="relative w-24 h-24 rounded-full overflow-hidden">
                    <img
                    src="https://i.pinimg.com/originals/a8/44/c8/a844c8bcff2ad5328aa25f12637fb1ca.jpg"
                    alt="Profile"
                    className="object-cover w-full h-full"
                    />
                </div>
                <button className="absolute bottom-0 right-0 text-white bg-indigo-900 p-1 rounded-full text-xs px-2">
                    Edit
                </button>
                </div>
            </div>

            <div className="mt-16 text-center">
                <h1 className="text-xl font-semibold text-indigo-900">{mockdata.username}</h1>
                <p className="text-gray-500">{mockdata.email}</p>
            </div>

            {/* Personal Info */}
            <div className="w-full max-w-xl mx-auto mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-4">
                <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-left">Personal Information</h2>
                <button
                    onClick={() => openModal("personal")}
                    className="text-sm text-indigo-600 hover:underline font-semibold">
                    Edit
                </button>
                </div>
                {[
                    { label: "Username", value: mockdata.username },
                    { label: "Email", value: mockdata.email },
                    { label: "Password", value: mockdata.password },
                    { label: "Discord Account", value: mockdata.discord },
                    { label: "Phone number", value: mockdata.phone },
                ].map((field) => (
                <div key={field.label} className="flex justify-between items-center border-b pb-2">
                    <div>
                    <div className="text-xs text-gray-500 pb-1">{field.label}</div>
                    <div className="text-sm font-medium">{field.value}</div>
                    </div>
                </div>
                ))}
            </div>

            {/* Address Info */}
            <div className="max-w-xl mx-auto mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-4">
                <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-left">Address</h2>
                <button
                    onClick={() => openModal("address")}
                    className="text-sm text-indigo-600 hover:underline font-semibold">
                    Edit
                </button>
                </div>
                {[
                    { label: "Plot / House number, Village", value: mockdata.address?.plot },
                    { label: "Road", value: mockdata.address?.road },
                    { label: "District", value: mockdata.address?.district },
                    { label: "Province", value: mockdata.address?.province },
                    { label: "Postal Code District Province", value: mockdata.address?.postal },
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
            <div className="max-w-xl mx-auto mt-10 mb-10">
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-md py-2 font-semibold rounded-md">
                    Delete Account
                </button>
            </div>
        </div>
    );
}

export default Profile;
