import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Camera, User } from "react-feather";
import { getProfilePicUrl } from "../../../utils/userUtils";
import AvailabilitySelector from "./AvailabilitySelector";
import ProfileStatusBadge from "./ProfileStatusBadge";

function ProfileHeader({
    user,
    imageError,
    uploading,
    onProfilePicUpload,
    onProfilePictureClick,
    onImageError,
    onAvailabilityUpdate,
    updatingAvailability,
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

    const profilePicUrl =
        user?.profilePic && !imageError
            ? getProfilePicUrl(user.profilePic)
            : null;

    const Info = ({ label, value }) => (
        <div>
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="text-gray-800 font-medium">{value}</p>
        </div>
    );

    return (
        <section className="mb-10">
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="md:flex items-center gap-10">
                    <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                        <div className="relative">
                            <div
                                className={`w-36 h-36 rounded-full shadow-md ring-4 ring-gray-200 transition overflow-hidden bg-gray-100 flex items-center justify-center ${
                                    profilePicUrl
                                        ? "hover:scale-105 hover:ring-blue-400 cursor-pointer"
                                        : ""
                                }`}
                                onClick={onProfilePictureClick}
                            >
                                {profilePicUrl ? (
                                    <img
                                        src={profilePicUrl}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={onImageError}
                                        crossOrigin="anonymous"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full">
                                        <User
                                            size={48}
                                            className="text-gray-400"
                                        />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={triggerFileInput}
                                disabled={uploading}
                                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                        <h2 className="text-2xl font-bold text-gray-800 mt-4">
                            {user?.firstName || "User"} {user?.surname || ""}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1 capitalize">
                            {user?.role || "User"}
                        </p>

                        {/* Skills Display */}
                        {user?.skills && user.skills.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1 justify-center max-w-xs">
                                {user.skills.slice(0, 3).map((skill, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                    >
                                        {skill}
                                    </span>
                                ))}
                                {user.skills.length > 3 && (
                                    <span className="text-gray-500 text-xs">
                                        +{user.skills.length - 3} more
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-300 md:pl-10 pt-6 md:pt-0">
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

                            <AvailabilitySelector
                                currentAvailability={
                                    user?.availability || "N/A"
                                }
                                onUpdate={onAvailabilityUpdate}
                                loading={updatingAvailability}
                            />

                            <Info
                                label="Profile Status"
                                value={
                                    <ProfileStatusBadge
                                        status={user?.profileStatus}
                                    />
                                }
                            />
                        </div>
                        <Link
                            to="/user/settings"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
                        >
                            Edit Profile
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProfileHeader;
