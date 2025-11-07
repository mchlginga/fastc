// C:\Users\y\OneDrive\Desktop\fastc\frontend\src\pages\company\CompanyProfile.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
    uploadProfilePic,
    updateUserProfile,
} from "../../services/userService";

// Components
import {
    CompanyProfileHeader,
    CompanyProfileStats,
} from "../../components/company/profile";

import { ToastNotification, ErrorState } from "../../components/common";
import CompanyProfileSkeleton from "../../components/company/profile/CompanyProfileSkeleton";

function CompanyProfile() {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageError, setImageError] = useState(false);

    // State for modals and notifications
    const [showProfilePictureModal, setShowProfilePictureModal] =
        useState(false);
    const [toastNotification, setToastNotification] = useState(null);

    useEffect(() => {
        const fetchCompanyData = async () => {
            if (!user) return;

            try {
                setLoading(true);
                setError(null);

                // Company profile doesn't need complex stats like admin
                // Just ensure user data is loaded
                await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading
            } catch (err) {
                console.error("Company profile data fetch error:", err);
                setError(err.message || "Failed to load company profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, [user]);

    const handleProfilePicUpload = async (file) => {
        try {
            setUploading(true);
            setError(null);
            setImageError(false);

            const formData = new FormData();
            formData.append("profilePic", file);

            console.log("Uploading company profile picture...");
            const response = await uploadProfilePic(formData);
            console.log("Upload response:", response);

            if (response.success) {
                // Force refresh by updating user state
                setUser((prevUser) => ({
                    ...prevUser,
                    ...response.user,
                }));

                // Reset image error to force re-render
                setImageError(false);

                // Show success toast notification
                setToastNotification({
                    message: "Profile picture updated successfully!",
                    type: "success",
                });

                // Clear any previous error messages
                setError(null);
            } else {
                throw new Error(response.message || "Upload failed");
            }
        } catch (err) {
            console.error("Company profile picture upload error:", err);
            setToastNotification({
                message: err.message || "Failed to upload profile picture.",
                type: "error",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleProfileUpdate = async (profileData) => {
        try {
            setLoading(true);
            const response = await updateUserProfile(profileData);

            if (response.success) {
                setUser((prevUser) => ({
                    ...prevUser,
                    ...response.user,
                }));

                setToastNotification({
                    message: "Profile updated successfully!",
                    type: "success",
                });
            }
        } catch (err) {
            console.error("Company profile update error:", err);
            setToastNotification({
                message: err.message || "Failed to update profile.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleImageError = () => {
        console.log("Company image failed to load, showing fallback");
        setImageError(true);
    };

    // Handle profile picture click to open modal
    const handleProfilePictureClick = () => {
        if (user?.profilePic && !imageError) {
            setShowProfilePictureModal(true);
        }
    };

    if (loading) {
        return <CompanyProfileSkeleton />;
    }

    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/60 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Company Profile
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Manage your company profile and view overview
                            </p>
                        </div>
                    </div>
                </div>

                {/* Company Profile Header Section */}
                <CompanyProfileHeader
                    user={user}
                    imageError={imageError}
                    uploading={uploading}
                    onProfilePicUpload={handleProfilePicUpload}
                    onProfilePictureClick={handleProfilePictureClick}
                    onImageError={handleImageError}
                />

                {/* Company Statistics */}
                <CompanyProfileStats user={user} />

                {/* Status & Quick Info Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    <ProfileStatusCard user={user} />
                    <QuickInfoCard user={user} />
                </div>

                {/* Profile Picture Modal */}
                <ProfilePictureModal
                    isOpen={showProfilePictureModal}
                    onClose={() => setShowProfilePictureModal(false)}
                    profilePicUrl={user?.profilePic}
                    imageError={imageError}
                />

                {/* Toast Notifications */}
                {toastNotification && (
                    <ToastNotification
                        message={toastNotification.message}
                        type={toastNotification.type}
                        onClose={() => setToastNotification(null)}
                    />
                )}
            </div>
        </div>
    );
}

// Profile Status Card Component
const ProfileStatusCard = ({ user }) => {
    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                bg: "bg-yellow-50",
                text: "text-yellow-800",
                message: "Profile Under Review",
                description: "Limited access to talent matches",
            },
            approved: {
                bg: "bg-green-50",
                text: "text-green-800",
                message: "Profile Verified",
                description: "Full access to all features",
            },
            rejected: {
                bg: "bg-red-50",
                text: "text-red-800",
                message: "Profile Needs Update",
                description: "Please update your information",
            },
        };
        return configs[status] || configs.pending;
    };

    const statusConfig = getStatusConfig(user?.profileStatus);

    return (
        <div className={`bg-white rounded-xl shadow-xs ${statusConfig.bg} p-6`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Profile Status
            </h3>
            <div className="space-y-2">
                <p className={`font-medium ${statusConfig.text}`}>
                    {statusConfig.message}
                </p>
                <p className="text-sm text-gray-600">
                    {statusConfig.description}
                </p>
            </div>
        </div>
    );
};

// Format date to "June 12, 2023" format
const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

// Quick Info Card Component
const QuickInfoCard = ({ user }) => {
    const infoItems = [
        {
            label: "Member Since",
            value: formatDate(user?.createdAt),
        },
        {
            label: "Account Type",
            value: "Company",
        },
        {
            label: "Last Updated",
            value: formatDate(user?.updatedAt),
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Info
            </h3>
            <div className="space-y-3">
                {infoItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between py-2"
                    >
                        <span className="text-sm text-gray-600">
                            {item.label}
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Profile Picture Modal Component
const ProfilePictureModal = ({
    isOpen,
    onClose,
    profilePicUrl,
    imageError,
}) => {
    if (!isOpen) return null;

    const displayUrl = profilePicUrl && !imageError ? profilePicUrl : null;

    return (
        <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 cursor-pointer"
            onClick={onClose}
        >
            <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                {displayUrl ? (
                    <img
                        src={displayUrl}
                        alt="Company Profile"
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onError={(e) => {
                            console.warn(
                                "Failed to load profile picture:",
                                displayUrl
                            );
                        }}
                    />
                ) : (
                    <div className="text-white text-lg">
                        No profile picture available
                    </div>
                )}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors cursor-pointer"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default CompanyProfile;
