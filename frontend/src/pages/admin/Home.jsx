import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Plus,
    Users,
    ChevronRight,
    Book,
    UserCheck,
    Activity,
    User,
} from "react-feather";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTrainees: 0,
        activeCourses: 0,
        pendingEnrollments: 0,
    });
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [activeCourses, setActiveCourses] = useState([]);

    useEffect(() => {
        // Simulated data loading
        setTimeout(() => {
            setStats({
                totalTrainees: 245,
                activeCourses: 8,
                pendingEnrollments: 12,
            });
            setOnlineUsers([
                {
                    name: "Juan Dela Cruz",
                    email: "juan@example.com",
                },
                {
                    name: "Ana Reyes",
                    email: "ana@example.com",
                },
                {
                    name: "Carlos Santos",
                    email: "carlos@example.com",
                },
            ]);
            setActiveCourses([
                {
                    title: "Basic Welding",
                    desc: "Mon/Wed/Fri • 25 trainees",
                },
                {
                    title: "Culinary Fundamentals",
                    desc: "Tue/Thu • 18 trainees",
                },
                {
                    title: "Pastry Making",
                    desc: "Mon/Wed • 15 trainees",
                },
                {
                    title: "Electrical Installation",
                    desc: "Sat/Sun • 10 trainees",
                },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    if (!user || !["superAdmin", "admin"].includes(user.role)) {
        return <div>Access denied. Redirecting...</div>;
    }

    const colors = [
        "bg-blue-500",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-green-500",
        "bg-purple-500",
    ];

    return (
        <div className="space-y-8 animate-fadeIn p-6">
            {/* Welcome Header */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome back, {user?.firstName || "Admin"} 👋
                </h1>
                <p className="text-gray-600 mt-1">
                    Here’s what’s happening today in your training center.
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
                <Link
                    to="/admin/courses"
                    className="bg-blue-600 text-white p-4 rounded-xl shadow-sm flex items-center justify-center font-medium hover:bg-blue-700 transition"
                >
                    <Plus size={18} className="mr-2" />
                    Add New Course
                </Link>
                <Link
                    to="/admin/users"
                    className="bg-green-600 text-white p-4 rounded-xl shadow-sm flex items-center justify-center font-medium hover:bg-green-700 transition"
                >
                    <Users size={18} className="mr-2" />
                    Manage Trainees
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[
                    {
                        title: "Total Trainees",
                        value: stats.totalTrainees,
                        color: "blue-600",
                        icon: <UserCheck className="text-blue-600" />,
                    },
                    {
                        title: "Active Courses",
                        value: stats.activeCourses,
                        color: "green-600",
                        icon: <Book className="text-green-600" />,
                    },
                    {
                        title: "Enrollments",
                        value: stats.pendingEnrollments,
                        color: "violet-600",
                        icon: <User className="text-violet-600" />,
                    },
                ].map((item, idx) => (
                    <div
                        key={idx}
                        className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300 border-t-4 border-${item.color}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-gray-600 font-medium">
                                {item.title}
                            </h3>
                            {item.icon}
                        </div>
                        <p className="text-3xl font-bold text-gray-800">
                            {loading ? "..." : item.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Active Trainees */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Active Trainees
                    </h2>
                    <Link
                        to="/admin/users"
                        className="text-blue-600 text-sm font-medium flex items-center hover:underline"
                    >
                        Manage
                        <ChevronRight size={14} className="ml-1" />
                    </Link>
                </div>
                {loading ? (
                    <div className="text-center text-gray-600">Loading...</div>
                ) : onlineUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="border-b border-gray-200 text-gray-700">
                                <tr>
                                    <th className="pb-3 font-semibold">Name</th>
                                    <th className="pb-3 font-semibold">
                                        Email
                                    </th>
                                    <th className="pb-3 font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {onlineUsers.map((trainee, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                                    >
                                        <td className="py-3 font-medium text-gray-800">
                                            {trainee.name}
                                        </td>
                                        <td className="py-3">
                                            {trainee.email}
                                        </td>
                                        <td className="py-3">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg animate-pulse">
                        <Activity className="mx-auto text-gray-400 w-12 h-12 mb-4" />
                        <p className="text-gray-600 font-medium">
                            No active trainees at the moment
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Check back later to see who's online!
                        </p>
                    </div>
                )}
            </div>

            {/* Active Courses */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Active Courses
                    </h2>
                    <Link
                        to="/admin/courses"
                        className="text-blue-600 text-sm font-medium flex items-center hover:underline"
                    >
                        View Courses
                        <ChevronRight size={14} className="ml-1" />
                    </Link>
                </div>
                {loading ? (
                    <div className="text-center text-gray-600">Loading...</div>
                ) : (
                    <div className="grid gap-4">
                        {activeCourses.map((course, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-none"
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {course.desc}
                                    </p>
                                </div>
                                <span
                                    className={`w-3 h-3 rounded-full ${
                                        colors[idx % colors.length]
                                    }`}
                                ></span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
