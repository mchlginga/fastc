import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Camera, User, Shield, Settings, Activity } from "react-feather";

function AdminProfileHeader({
    user,
    imageError,
    uploading,
    onProfilePicUpload,
    onProfilePictureClick,
    onImageError,
    systemOverview,
}) {
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            alert("Only JPEG, PNG, or WebP images are allowed.");
            return;
        }

        if (file.size > maxSize) {
            alert("Image size must be less than 5MB.");
            return;
        }

        onProfilePicUpload(file);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const profilePicUrl = user?.profilePic || null;

    const Info = ({ label, value, icon }) => (
        <div className="flex items-center space-x-3">
            {icon && <div className="text-gray-400">{icon}</div>}
            <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="text-gray-800 font-medium">{value}</p>
            </div>
        </div>
    );

    const getRoleBadge = (role) => {
        const roleConfigs = {
            superAdmin: {
                bg: "bg-purple-100",
                text: "text-purple-800",
                border: "border-purple-200",
                label: "Super Administrator",
            },
            admin: {
                bg: "bg-blue-100",
                text: "text-blue-800",
                border: "border-blue-200",
                label: "Administrator",
            },
        };
        const config = roleConfigs[role] || roleConfigs.admin;

        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
            >
                {config.label}
            </span>
        );
    };

    return (
        <section className="mb-10">
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8">
                <div className="md:flex items-center gap-10">
                    <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                        <div className="relative">
                            <div
                                className={`w-32 h-32 rounded-full shadow-sm ring-2 ring-gray-200 transition overflow-hidden bg-gray-100 flex items-center justify-center ${
                                    profilePicUrl
                                        ? "hover:scale-105 hover:ring-blue-400 cursor-pointer"
                                        : ""
                                }`}
                                onClick={onProfilePictureClick}
                            >
                                {profilePicUrl ? (
                                    <img
                                        src={profilePicUrl}
                                        alt="Admin Profile"
                                        className="w-full h-full object-cover"
                                        onError={onImageError}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full">
                                        <User
                                            size={40}
                                            className="text-gray-400"
                                        />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={triggerFileInput}
                                disabled={uploading}
                                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                title="Change profile picture"
                            >
                                {uploading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <Camera size={16} />
                                )}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                disabled={uploading}
                            />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mt-4">
                            {user?.firstName || "Admin"} {user?.surname || ""}
                        </h2>
                        <div className="mt-2">{getRoleBadge(user?.role)}</div>
                    </div>

                    <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-200 md:pl-10 pt-6 md:pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Info label="Email" value={user?.email || "N/A"} />
                            <Info
                                label="Phone"
                                value={user?.contactNumber || "N/A"}
                            />
                            <Info
                                label="Location"
                                value={user?.address || "N/A"}
                            />
                            <Info
                                label="Joined"
                                value={
                                    user?.createdAt
                                        ? new Date(
                                              user.createdAt
                                          ).toLocaleDateString()
                                        : "N/A"
                                }
                            />
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                to="/admin/settings"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center shadow-xs"
                            >
                                Settings
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminProfileHeader;
