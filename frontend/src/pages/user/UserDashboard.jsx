import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserEnrollments } from "../../services/enrollmentService";
import { getUserCertificates } from "../../services/certificateService";

// Components
import {
    DashboardHeader,
    ProfileAlerts,
    StatsGrid,
    ProgressOverview,
    ActiveCoursesSection,
} from "../../components/user/dashboard";

import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";

function UserDashboard() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch enrollments and certificates in parallel
                const [enrollmentsResponse, certificatesResponse] =
                    await Promise.all([
                        getUserEnrollments(),
                        getUserCertificates(),
                    ]);

                const enrollments = enrollmentsResponse.enrollments || [];
                const certificates = certificatesResponse.certificates || [];

                // Process data with proper defaults
                const activeEnrollments = enrollments.filter(
                    (e) => e.status === "active"
                ).length;
                const completedEnrollments = enrollments.filter(
                    (e) => e.status === "completed"
                ).length;
                const pendingEnrollments = enrollments.filter(
                    (e) => e.status === "pending"
                ).length;

                const progressEnrollments = enrollments.filter(
                    (e) => e.status === "active" || e.status === "completed"
                );
                const totalProgress = progressEnrollments.reduce(
                    (sum, e) => sum + (e.progress || 0),
                    0
                );
                const avgProgress =
                    progressEnrollments.length > 0
                        ? Math.round(totalProgress / progressEnrollments.length)
                        : 0;

                setDashboardData({
                    activeEnrollments,
                    completedEnrollments,
                    pendingEnrollments,
                    certificates: certificates.length,
                    totalProgress: avgProgress,
                    enrollments,
                    userCertificates: certificates,
                });
            } catch (err) {
                console.error("Dashboard error:", err);
                setError(err.message || "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    // Show loading state
    if (loading) {
        return <LoadingState type="dashboard-skeleton" />;
    }

    // Show error state
    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={() => window.location.reload()}
            />
        );
    }

    if (!dashboardData) {
        return <LoadingState type="dashboard-skeleton" />;
    }

    return (
        <div className="min-h-screen bg-gray-50/60 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Status Alerts */}
                <ProfileAlerts user={user} />

                {/* Hero Section */}
                <DashboardHeader user={user} dashboardData={dashboardData} />

                {/* Dashboard Stats */}
                <StatsGrid dashboardData={dashboardData} />

                {/* Progress Overview */}
                <ProgressOverview dashboardData={dashboardData} />

                {/* Recent Courses - Shows only active courses */}
                <ActiveCoursesSection dashboardData={dashboardData} />
            </div>
        </div>
    );
}

export default UserDashboard;
