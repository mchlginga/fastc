import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    uploadProfilePic,
    updateUserProfile,
} from "../../services/userService";
import { getUserCertificates } from "../../services/certificateService";
import { getUserEnrollments } from "../../services/enrollmentService";

// Components
import {
    ProfileHeader,
    ProfileStats,
    CourseProgress,
    RecentCertificates,
    AvailabilitySelector,
    ProfilePictureModal,
} from "../../components/user/profile";

import ToastNotification from "../../components/common/ToastNotification";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import ProfileSkeleton from "../../components/user/profile/ProfileSkeleton";

function UserProfile() {
    const { user, setUser } = useAuth();
    const [stats, setStats] = useState({
        activeCourses: 0,
        certificates: 0,
    });
    const [courses, setCourses] = useState([]);
    const [recentCertificates, setRecentCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [updatingAvailability, setUpdatingAvailability] = useState(false);

    // State for modals and notifications
    const [showProfilePictureModal, setShowProfilePictureModal] =
        useState(false);
    const [toastNotification, setToastNotification] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                setLoading(true);
                setError(null);

                const [enrollmentsResponse, certificatesResponse] =
                    await Promise.all([
                        getUserEnrollments().catch((err) => {
                            console.warn("Failed to fetch enrollments:", err);
                            return { enrollments: [] };
                        }),
                        getUserCertificates().catch((err) => {
                            console.warn("Failed to fetch certificates:", err);
                            return { certificates: [] };
                        }),
                    ]);

                const enrollments = enrollmentsResponse.enrollments || [];
                const certificates = certificatesResponse.certificates || [];

                // Calculate statistics
                const activeCourses = enrollments.filter(
                    (e) => e.status === "active"
                ).length;

                const certificateCount = certificates.length;

                const recent = certificates.slice(0, 3);

                setStats({
                    activeCourses,
                    certificates: certificateCount,
                });
                setCourses(enrollments);
                setRecentCertificates(recent);
            } catch (err) {
                console.error("Profile data fetch error:", err);
                setError(err.message || "Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleProfilePicUpload = async (file) => {
        try {
            setUploading(true);
            setError(null);
            setImageError(false);

            const formData = new FormData();
            formData.append("profilePic", file);

            console.log("📤 Uploading profile picture...");
            const response = await uploadProfilePic(formData);
            console.log("✅ Upload response:", response);

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
            console.error("Profile picture upload error:", err);
            setToastNotification({
                message: err.message || "Failed to upload profile picture.",
                type: "error",
            });
        } finally {
            setUploading(false);
        }
    };

    // Handle availability update
    const handleAvailabilityUpdate = async (newAvailability) => {
        try {
            setUpdatingAvailability(true);

            const response = await updateUserProfile({
                availability: newAvailability,
            });

            // FIX: Check for response.success instead of assuming it exists
            if (response.success) {
                // Update user state
                setUser((prevUser) => ({
                    ...prevUser,
                    availability: newAvailability,
                }));

                setToastNotification({
                    message: "Availability updated successfully!",
                    type: "success",
                });
            } else {
                throw new Error(
                    response.message || "Failed to update availability"
                );
            }
        } catch (err) {
            console.error("Availability update error:", err);
            setToastNotification({
                message: err.message || "Failed to update availability.",
                type: "error",
            });
            throw err; // Re-throw to handle in component
        } finally {
            setUpdatingAvailability(false);
        }
    };

    const handleImageError = () => {
        console.log("🖼️ Image failed to load, showing fallback");
        setImageError(true);
    };

    // Handle profile picture click to open modal
    const handleProfilePictureClick = () => {
        if (user?.profilePic && !imageError) {
            setShowProfilePictureModal(true);
        }
    };

    if (loading) {
        return <ProfileSkeleton />;
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
                {/* Profile Status Warning */}
                {user?.profileStatus === "pending" && (
                    <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                        <p className="text-sm">
                            Your profile is under review. You cannot enroll in
                            courses until approved.
                        </p>
                    </div>
                )}

                {/* Profile Header Section */}
                <ProfileHeader
                    user={user}
                    imageError={imageError}
                    uploading={uploading}
                    onProfilePicUpload={handleProfilePicUpload}
                    onProfilePictureClick={handleProfilePictureClick}
                    onImageError={handleImageError}
                    onAvailabilityUpdate={handleAvailabilityUpdate}
                    updatingAvailability={updatingAvailability}
                />

                {/* Learning Statistics */}
                <ProfileStats stats={stats} />

                {/* Course Progress */}
                <CourseProgress courses={courses} />

                {/* Recent Certificates */}
                <RecentCertificates certificates={recentCertificates} />

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

export default UserProfile;
