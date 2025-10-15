import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    Clipboard,
    FileText,
    Users,
    UserCheck,
    Activity,
    AlertCircle,
    TrendingUp,
    Clock,
    Download,
} from "react-feather";
import {
    getDashboardStats,
    getOnlineUsers,
    getRecentActivities,
} from "../../services/statisticsService";

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
    });
    const [onlineUsers, setOnlineUsers] = useState(0);
    const [activities, setActivities] = useState({
        recentCompletions: [],
        recentEnrollments: [],
        recentCertificates: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const change = stats.csvExportsThisMonth - stats.csvExportsLastMonth;
    let percentChange = 0;
    if (stats.csvExportsLastMonth === 0) {
        percentChange = stats.csvExportsThisMonth > 0 ? 100 : 0;
    } else {
        percentChange = ((change / stats.csvExportsLastMonth) * 100).toFixed(1);
    }

    const sign = change > 0 ? "+" : change < 0 ? "-" : "";

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [statsData, onlineData, activitiesData] =
                    await Promise.all([
                        getDashboardStats(),
                        getOnlineUsers(),
                        getRecentActivities(),
                    ]);

                setStats(statsData);
                setOnlineUsers(onlineData.onlineUsers);
                setActivities(activitiesData);
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

        // Refresh data every 60 seconds
        const interval = setInterval(fetchDashboardData, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center bg-red-50 p-8 rounded-2xl">
                    <AlertCircle
                        className="mx-auto text-red-600 mb-4"
                        size={48}
                    />
                    <h2 className="text-xl font-semibold text-red-900 mb-2">
                        Error Loading Dashboard
                    </h2>
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Trainees",
            icon: <Users size={26} className="text-blue-600" />,
            value: stats.totalTrainees,
            bg: "bg-blue-100",
            link: "/admin/users",
        },
        {
            title: "Active Courses",
            icon: <FileText size={26} className="text-green-600" />,
            value: stats.activeCourses,
            bg: "bg-green-100",
            link: "/admin/courses",
        },
        {
            title: "Pending Enrollments",
            icon: <Clipboard size={26} className="text-purple-600" />,
            value: stats.pendingEnrollments,
            bg: "bg-purple-100",
            link: "/admin/users",
        },
        {
            title: "Pending Approvals",
            icon: <UserCheck size={26} className="text-orange-600" />,
            value: stats.pendingApprovals,
            bg: "bg-orange-100",
            link: "/admin/users",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl text-white p-10 mb-10 shadow-lg overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/wave-pattern.svg')] bg-cover"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, {user?.firstName || "Admin"} 👋
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Here's what's happening today in FAST-C training center.
                    </p>
                    <div className="mt-4 flex items-center space-x-4">
                        <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                            <Activity size={16} className="mr-2" />
                            <span className="text-sm font-medium">
                                {onlineUsers} users online
                            </span>
                        </div>
                        <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                            <Clock size={16} className="mr-2" />
                            <span className="text-sm font-medium">
                                {new Date().toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((card, idx) => (
                    <Link
                        key={idx}
                        to={card.link}
                        className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between hover:-translate-y-1 hover:shadow-lg transition transform cursor-pointer"
                    >
                        <div className={`${card.bg} p-3 rounded-xl mr-4`}>
                            {card.icon}
                        </div>
                        <div className="text-right">
                            <h3 className="text-3xl font-bold text-gray-800">
                                {card.value}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {card.title}
                            </p>
                        </div>
                    </Link>
                ))}
            </section>

            {/* CSV Export Usage */}
            <section className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-md mb-10 overflow-hidden">
                <div className="p-8 md:w-1/3 flex justify-center items-center">
                    <div className="relative w-40 h-40">
                        <svg className="absolute inset-0" viewBox="0 0 36 36">
                            <path
                                className="text-gray-200"
                                strokeWidth="3.8"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className="text-blue-600"
                                strokeWidth="3.8"
                                strokeDasharray={`${percentChange}, 100`}
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col justify-center items-center">
                            <span className="text-3xl font-bold text-gray-800">
                                {`${sign}${Math.abs(percentChange)}%`}
                            </span>
                            <span className="text-gray-500 text-sm">
                                vs Last Month
                            </span>
                        </div>
                    </div>
                </div>
                <div className="p-8 md:w-2/3">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                        <Download size={24} className="mr-2 text-blue-600" />
                        CSV Export Usage This Month
                    </h3>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">
                                Total Exports
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                                {stats.csvExportsThisMonth}
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">
                                Admin Exports
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                                {stats.adminExports}
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">
                                Company Exports
                            </p>
                            <p className="text-2xl font-bold text-purple-600">
                                {stats.companyExports}
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/admin/job-match"
                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
                    >
                        <Download size={16} className="mr-2" /> View Job
                        Matching
                    </Link>
                </div>
            </section>

            {/* Recent Activities */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Completions */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <TrendingUp size={20} className="mr-2 text-green-600" />
                        Recent Completions
                    </h3>
                    {activities.recentCompletions.length > 0 ? (
                        <ul className="space-y-3">
                            {activities.recentCompletions.map((completion) => (
                                <li
                                    key={completion._id}
                                    className="border-l-4 border-green-500 pl-3 py-2"
                                >
                                    <p className="text-sm font-medium text-gray-800">
                                        {completion.user?.name || "Unknown"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {completion.course?.title ||
                                            "Unknown Course"}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(
                                            completion.updatedAt
                                        ).toLocaleDateString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            No recent completions
                        </p>
                    )}
                </div>

                {/* Recent Enrollments */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Clipboard size={20} className="mr-2 text-purple-600" />
                        Recent Enrollments
                    </h3>
                    {activities.recentEnrollments.length > 0 ? (
                        <ul className="space-y-3">
                            {activities.recentEnrollments.map((enrollment) => (
                                <li
                                    key={enrollment._id}
                                    className="border-l-4 border-purple-500 pl-3 py-2"
                                >
                                    <p className="text-sm font-medium text-gray-800">
                                        {enrollment.user?.name || "Unknown"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {enrollment.course?.title ||
                                            "Unknown Course"}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(
                                            enrollment.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            No recent enrollments
                        </p>
                    )}
                </div>

                {/* Recent Certificates */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FileText size={20} className="mr-2 text-blue-600" />
                        Recent Certificates
                    </h3>
                    {activities.recentCertificates.length > 0 ? (
                        <ul className="space-y-3">
                            {activities.recentCertificates.map(
                                (certificate) => (
                                    <li
                                        key={certificate._id}
                                        className="border-l-4 border-blue-500 pl-3 py-2"
                                    >
                                        <p className="text-sm font-medium text-gray-800">
                                            {certificate.user?.name ||
                                                "Unknown"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {certificate.course?.title ||
                                                "Unknown Course"}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(
                                                certificate.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </li>
                                )
                            )}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            No recent certificates
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
