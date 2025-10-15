import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Book,
    FileText,
    Clock,
    TrendingUp,
    Activity,
    Star,
} from "react-feather";
import { useAuth } from "../../context/AuthContext";
import { getCompletions } from "../../services/authService";

function UserDashboard() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        activeCourses: 0,
        certificates: 0,
        pendingEnrollments: 0,
        courses: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const data = await getCompletions(user._id);
                const activeCourses = data.courses.filter(
                    (c) => c.status === "approved"
                ).length;
                const certificates = data.courses.filter(
                    (c) => c.progress === 100
                ).length;
                const pendingEnrollments = data.courses.filter(
                    (c) => c.status === "pending"
                ).length;

                setDashboardData({
                    activeCourses,
                    certificates,
                    pendingEnrollments,
                    courses: data.courses,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchDashboardData();
    }, [user]);

    if (loading) {
        return (
            <div className="text-gray-600 text-center text-sm py-10 animate-pulse">
                Loading your dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600 text-center text-sm py-10">
                Error: {error}
            </div>
        );
    }

    // Calculate average progress for donut visualization
    const totalProgress =
        dashboardData.courses.reduce((sum, c) => sum + c.progress, 0) || 0;
    const avgProgress =
        dashboardData.courses.length > 0
            ? Math.round(totalProgress / dashboardData.courses.length)
            : 0;

    const statCards = [
        {
            title: "Active Courses",
            icon: <Book size={26} className="text-blue-600" />,
            value: dashboardData.activeCourses,
            bg: "bg-blue-100",
            link: "/user/courses",
        },
        {
            title: "Certificates",
            icon: <FileText size={26} className="text-green-600" />,
            value: dashboardData.certificates,
            bg: "bg-green-100",
            link: "/user/certificates",
        },
        {
            title: "Pending Enrollments",
            icon: <Clock size={26} className="text-purple-600" />,
            value: dashboardData.pendingEnrollments,
            bg: "bg-purple-100",
            link: "/user/courses",
        },
        {
            title: "Avg Progress",
            icon: <TrendingUp size={26} className="text-orange-600" />,
            value: `${avgProgress}%`,
            bg: "bg-orange-100",
            link: "/user/courses",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Profile Warning */}
            {user?.profileStatus === "pending" && (
                <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                    <p className="text-sm">
                        Your profile is under review. You cannot enroll in
                        courses until approved.
                        <Link
                            to="/user/settings"
                            className="text-blue-600 hover:text-blue-800 font-medium ml-2"
                        >
                            Edit Profile
                        </Link>
                    </p>
                </div>
            )}
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl text-white p-10 mb-10 shadow-lg overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/wave-pattern.svg')] bg-cover"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, {user?.firstName || "Learner"} 👋
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Continue your learning journey and track your progress
                        below.
                    </p>
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

            {/* Progress Overview */}
            <section className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-md mb-10 overflow-hidden">
                <div className="p-8 md:w-1/3 flex justify-center items-center">
                    <div className="relative w-40 h-40">
                        <svg className="absolute inset-0" viewBox="0 0 36 36">
                            <path
                                className="text-gray-200"
                                strokeWidth="3.8"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className="text-blue-600"
                                strokeWidth="3.8"
                                strokeDasharray={`${avgProgress}, 100`}
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col justify-center items-center">
                            <span className="text-3xl font-bold text-gray-800">
                                {avgProgress}%
                            </span>
                            <span className="text-gray-500 text-sm">
                                Avg Progress
                            </span>
                        </div>
                    </div>
                </div>
                <div className="p-8 md:w-2/3">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Learning Insights
                    </h3>
                    <p className="text-gray-600 mb-4">
                        You’re doing great! Keep your streak going by completing
                        your current courses and earning more certificates.
                    </p>
                    <Link
                        to="/user/courses"
                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
                    >
                        <Activity size={16} className="mr-2" /> View My Courses
                    </Link>
                </div>
            </section>

            {/* Recent Courses */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Recent Courses
                    </h3>
                    <Link
                        to="/user/courses"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dashboardData.courses.slice(0, 4).map((course) => (
                        <div
                            key={course.courseId}
                            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium text-gray-800">
                                    {user?.profileStatus === "pending" ? (
                                        <span>{course.title}</span>
                                    ) : (
                                        <Link
                                            to={`/user/courses/${course.courseId}`}
                                            className="hover:text-blue-600"
                                        >
                                            {course.title}
                                        </Link>
                                    )}
                                </h4>
                                <span className="text-sm font-semibold text-gray-600">
                                    {course.progress}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                                <div
                                    className="bg-indigo-600 h-2.5 rounded-full"
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Status: {course.status}</span>
                                <div className="flex items-center">
                                    <Star
                                        size={14}
                                        className="mr-1 text-yellow-500"
                                    />
                                    <span>{course.rating || "4.8"}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {dashboardData.courses.length === 0 && (
                        <div className="bg-white rounded-2xl shadow-md p-6 text-center text-gray-600">
                            No courses yet —{" "}
                            <Link
                                to="/user/courses"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                enroll now
                            </Link>{" "}
                            to start learning!
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default UserDashboard;
