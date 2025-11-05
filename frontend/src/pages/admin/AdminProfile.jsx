import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { uploadProfilePic } from "../../services/userService";
import {
    getDashboardStats,
    getRecentActivities,
    getSystemOverview,
    getOnlineUsers,
} from "../../services/statisticsService";

// Components
import {
    AdminProfileHeader,
    AdminProfileStats,
    SystemOverview,
    RecentActivities,
    QuickActions,
    ProfilePictureModal,
} from "../../components/admin/profile";

import { ToastNotification, ErrorState } from "../../components/common";
import AdminProfileSkeleton from "../../components/admin/profile/AdminProfileSkeleton";

function AdminProfile() {
    const { user, setUser } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeCourses: 0,
        pendingApprovals: 0,
        totalEnrollments: 0,
    });
    const [systemOverview, setSystemOverview] = useState({
        totalCertificates: 0,
        completionRate: 0,
        onlineUsers: 0,
        totalCourses: 0,
        totalEnrollments: 0,
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageError, setImageError] = useState(false);

    // State for modals and notifications
    const [showProfilePictureModal, setShowProfilePictureModal] =
        useState(false);
    const [toastNotification, setToastNotification] = useState(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            if (!user) return;

            try {
                setLoading(true);
                setError(null);

                const [
                    dashboardStats,
                    activitiesData,
                    overviewData,
                    onlineData,
                ] = await Promise.all([
                    getDashboardStats().catch((err) => {
                        console.warn("Failed to fetch dashboard stats:", err);
                        return {
                            totalTrainees: 0,
                            activeCourses: 0,
                            pendingEnrollments: 0,
                            pendingApprovals: 0,
                        };
                    }),
                    getRecentActivities().catch((err) => {
                        console.warn("Failed to fetch recent activities:", err);
                        return { activities: [] };
                    }),
                    getSystemOverview().catch((err) => {
                        console.warn("Failed to fetch system overview:", err);
                        return {
                            totalUsers: 0,
                            totalCourses: 0,
                            totalCertificates: 0,
                            totalEnrollments: 0,
                            completionRate: 0,
                        };
                    }),
                    getOnlineUsers().catch((err) => {
                        console.warn("Failed to fetch online users:", err);
                        return { onlineUsers: 0 };
                    }),
                ]);

                // Set admin-specific stats
                setStats({
                    totalUsers: dashboardStats.totalTrainees || 0,
                    activeCourses: dashboardStats.activeCourses || 0,
                    pendingApprovals: dashboardStats.pendingApprovals || 0,
                    totalEnrollments: dashboardStats.pendingEnrollments || 0,
                });

                // Set system overview
                setSystemOverview({
                    totalCertificates: overviewData.totalCertificates || 0,
                    completionRate: overviewData.completionRate || 0,
                    onlineUsers: onlineData.onlineUsers || 0,
                    totalCourses: overviewData.totalCourses || 0,
                    totalEnrollments: overviewData.totalEnrollments || 0,
                });

                // Set recent activities from API
                if (activitiesData.activities) {
                    const formattedActivities = activitiesData.activities.map(
                        (activity) => ({
                            id: activity._id,
                            type: activity.type || "system",
                            message:
                                activity.description ||
                                activity.message ||
                                "System activity",
                            timestamp: new Date(
                                activity.createdAt || activity.timestamp
                            ),
                            user: activity.user,
                            course: activity.course,
                        })
                    );
                    setRecentActivities(formattedActivities);
                } else {
                    setRecentActivities([]);
                }
            } catch (err) {
                console.error("Admin profile data fetch error:", err);
                setError(err.message || "Failed to load admin profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [user]);

    const handleProfilePicUpload = async (file) => {
        try {
            setUploading(true);
            setError(null);
            setImageError(false);

            const formData = new FormData();
            formData.append("profilePic", file);

            console.log("📤 Uploading admin profile picture...");
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
            console.error("Admin profile picture upload error:", err);
            setToastNotification({
                message: err.message || "Failed to upload profile picture.",
                type: "error",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleImageError = () => {
        console.log("🖼️ Admin image failed to load, showing fallback");
        setImageError(true);
    };

    // Handle profile picture click to open modal
    const handleProfilePictureClick = () => {
        if (user?.profilePic && !imageError) {
            setShowProfilePictureModal(true);
        }
    };

    if (loading) {
        return <AdminProfileSkeleton />;
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
                                Admin Profile
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Manage your profile and view system overview
                            </p>
                        </div>
                    </div>
                </div>

                {/* Admin Profile Header Section */}
                <AdminProfileHeader
                    user={user}
                    imageError={imageError}
                    uploading={uploading}
                    onProfilePicUpload={handleProfilePicUpload}
                    onProfilePictureClick={handleProfilePictureClick}
                    onImageError={handleImageError}
                    systemOverview={systemOverview}
                />

                {/* Admin Statistics */}
                <AdminProfileStats stats={stats} />

                {/* System Overview & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* System Overview */}
                    <div className="lg:col-span-2">
                        <SystemOverview overview={systemOverview} />
                    </div>

                    {/* Quick Actions & Recent Activities Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <QuickActions />
                        <RecentActivities activities={recentActivities} />
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

export default AdminProfile;
