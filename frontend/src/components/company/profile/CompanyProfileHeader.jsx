import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
    Camera,
    Briefcase,
    Mail,
    Phone,
    MapPin,
    Calendar,
} from "react-feather";

function CompanyProfileHeader({
    user,
    imageError,
    uploading,
    onProfilePicUpload,
    onProfilePictureClick,
    onImageError,
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

    // Format date to "June 2, 2023" format
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";

        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const Info = ({ label, value, icon }) => (
        <div className="flex items-center space-x-3">
            {icon && <div className="text-gray-400">{icon}</div>}
            <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="text-gray-800 font-medium">{value}</p>
            </div>
        </div>
    );

    const getStatusBadge = (status) => {
        const statusConfigs = {
            pending: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                border: "border-yellow-200",
                label: "Under Review",
            },
            approved: {
                bg: "bg-green-100",
                text: "text-green-800",
                border: "border-green-200",
                label: "Verified",
            },
            rejected: {
                bg: "bg-red-100",
                text: "text-red-800",
                border: "border-red-200",
                label: "Needs Update",
            },
        };
        const config = statusConfigs[status] || statusConfigs.pending;

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
                                        alt="Company Profile"
                                        className="w-full h-full object-cover"
                                        onError={onImageError}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full">
                                        <Briefcase
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
                        <h2 className="text-xl font-semibold text-gray-800 mt-4 text-center">
                            {user?.companyName || "Company Name"}
                        </h2>
                        <div className="mt-2">
                            {getStatusBadge(user?.profileStatus)}
                        </div>
                    </div>

                    <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-200 md:pl-10 pt-6 md:pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Info label="Email" value={user?.email || "N/A"} />
                            <Info
                                label="Phone"
                                value={user?.contactNumber || "N/A"}
                            />
                            <Info
                                label="Address"
                                value={user?.address || "N/A"}
                            />
                            <Info
                                label="Representative"
                                value={user?.representative?.name || "N/A"}
                            />
                            <Info
                                label="Joined"
                                value={formatDate(user?.createdAt)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CompanyProfileHeader;
