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
    CompanyDetails,
} from "../../components/company/profile";

import { ToastNotification, ErrorState } from "../../components/common";
import CompanyProfileSkeleton from "../../components/company/profile/CompanyProfileSkeleton";

// Icons
import {
    Clock,
    Briefcase,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    XCircle,
} from "react-feather";

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
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

                {/* Company Details & Information */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Company Details */}
                    <div className="lg:col-span-2">
                        <CompanyDetails
                            user={user}
                            onProfileUpdate={handleProfileUpdate}
                        />
                    </div>

                    {/* Status & Quick Info Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <ProfileStatusCard user={user} />
                        <QuickInfoCard user={user} />
                    </div>
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
                border: "border-yellow-200",
                text: "text-yellow-800",
                icon: <AlertCircle size={20} className="text-yellow-600" />,
                message: "Profile Under Review",
                description: "Limited access to talent matches",
            },
            approved: {
                bg: "bg-green-50",
                border: "border-green-200",
                text: "text-green-800",
                icon: <CheckCircle size={20} className="text-green-600" />,
                message: "Profile Verified",
                description: "Full access to all features",
            },
            rejected: {
                bg: "bg-red-50",
                border: "border-red-200",
                text: "text-red-800",
                icon: <XCircle size={20} className="text-red-600" />,
                message: "Profile Needs Update",
                description: "Please update your information",
            },
        };
        return configs[status] || configs.pending;
    };

    const statusConfig = getStatusConfig(user?.profileStatus);

    return (
        <div
            className={`bg-white rounded-2xl shadow-md p-6 border ${statusConfig.border} ${statusConfig.bg}`}
        >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Profile Status
            </h3>
            <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">{statusConfig.icon}</div>
                <div>
                    <p className={`font-medium ${statusConfig.text}`}>
                        {statusConfig.message}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        {statusConfig.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

// Quick Info Card Component
const QuickInfoCard = ({ user }) => {
    const infoItems = [
        {
            label: "Member Since",
            value: user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A",
            icon: <Clock size={16} className="text-gray-400" />,
        },
        {
            label: "Account Type",
            value: "Company",
            icon: <Briefcase size={16} className="text-gray-400" />,
        },
        {
            label: "Last Updated",
            value: user?.updatedAt
                ? new Date(user.updatedAt).toLocaleDateString()
                : "N/A",
            icon: <RefreshCw size={16} className="text-gray-400" />,
        },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Info
            </h3>
            <div className="space-y-3">
                {infoItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between py-2"
                    >
                        <div className="flex items-center space-x-3">
                            {item.icon}
                            <span className="text-sm text-gray-600">
                                {item.label}
                            </span>
                        </div>
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
