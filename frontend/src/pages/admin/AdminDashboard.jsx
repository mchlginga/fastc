import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
    getDashboardStats,
    getOnlineUsers,
    getRecentActivities,
    getSystemOverview,
    subscribeToStats,
} from "../../services/statisticsService";

// Components
import {
    DashboardHeader,
    DashboardStats,
    ExportAnalytics,
    SystemOverview,
    RecentActivities,
    AdminDashboardSkeleton,
} from "../../components/admin/dashboard";

// Common Components
import { ErrorState } from "../../components/common";

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalTrainees: 0,
        activeCourses: 0,
        pendingEnrollments: 0,
        pendingApprovals: 0,
        csvExportsThisMonth: 0,
        csvExportsLastMonth: 0,
        csvExportsPercentage: 0,
        adminExports: 0,
        companyExports: 0,
        uniqueExporters: 0,
        onlineUsers: 0,
    });
    const [overview, setOverview] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalCertificates: 0,
        totalEnrollments: 0,
        completionRate: 0,
        popularCourses: [],
        userGrowth: [],
    });
    const [activities, setActivities] = useState({
        recentCompletions: [],
        recentEnrollments: [],
        recentCertificates: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [statsData, onlineData, activitiesData, overviewData] =
                    await Promise.all([
                        getDashboardStats(),
                        getOnlineUsers(),
                        getRecentActivities(),
                        getSystemOverview(),
                    ]);

                setStats(statsData);
                setOverview(overviewData);
                setActivities(activitiesData);
                setLastUpdated(new Date());
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError(
                    err.response?.data?.message ||
                        "Failed to load dashboard data"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();

        // Set up real-time updates
        const unsubscribe = subscribeToStats(
            ({ stats: newStats, onlineUsers }) => {
                setStats((prev) => ({ ...prev, ...newStats, onlineUsers }));
                setLastUpdated(new Date());
            }
        );

        // Cleanup subscription
        return unsubscribe;
    }, []);

    if (loading) {
        return <AdminDashboardSkeleton />;
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <DashboardHeader
                    user={user}
                    onlineUsers={stats.onlineUsers}
                    lastUpdated={lastUpdated}
                />

                {/* Main Stats Grid */}
                <DashboardStats stats={stats} />

                {/* CSV Export Analytics */}
                <ExportAnalytics stats={stats} />

                {/* System Overview & Recent Activities */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* System Overview */}
                    <div className="lg:col-span-1">
                        <SystemOverview overview={overview} />
                    </div>

                    {/* Recent Activities */}
                    <div className="lg:col-span-2">
                        <RecentActivities activities={activities} />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
