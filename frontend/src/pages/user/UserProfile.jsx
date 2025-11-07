import { useState, useEffect, useCallback } from "react";
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
} from "../../components/user/profile";

// Common Components
import {
    LoadingState,
    ErrorState,
    ToastNotification,
} from "../../components/common";

// Skeleton Component
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
    const [toastNotification, setToastNotification] = useState(null);

    const fetchData = useCallback(async () => {
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
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleProfilePicUpload = async (file) => {
        try {
            setError(null);

            const formData = new FormData();
            formData.append("profilePic", file);

            const response = await uploadProfilePic(formData);

            if (response.success) {
                setUser((prevUser) => ({
                    ...prevUser,
                    ...response.user,
                }));

                setToastNotification({
                    message: "Profile picture updated successfully!",
                    type: "success",
                });

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
        }
    };

    const handleAvailabilityUpdate = async (newAvailability) => {
        try {
            const response = await updateUserProfile({
                availability: newAvailability,
            });

            if (response.success) {
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
            throw err;
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
        <div className="min-h-screen bg-gray-50/60 py-6">
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

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        My Profile
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Manage your profile, track progress, and view
                        certificates
                    </p>
                </div>

                {/* Profile Header Section */}
                <ProfileHeader
                    user={user}
                    onProfilePicUpload={handleProfilePicUpload}
                    onAvailabilityUpdate={handleAvailabilityUpdate}
                />

                {/* Learning Statistics */}
                <ProfileStats stats={stats} courses={courses} />

                {/* Course Progress */}
                <CourseProgress courses={courses} />

                {/* Recent Certificates */}
                <RecentCertificates certificates={recentCertificates} />

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
