import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Book, FileText, Clock } from "react-feather";
import { useAuth } from "../../context/AuthContext";
import { getCompletions } from "../../services/authService";

function UserHome() {
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

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="text-gray-600 text-center text-sm py-10">
                Loading...
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

    return (
        <div className="max-w-6xl mx-auto px-4">
            {/* Warning Message */}
            {user?.profileStatus === "pending" && (
                <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                    <p className="text-sm">
                        Your profile is under review. You cannot enroll in
                        courses until approved.
                        <Link className="text-blue-600 hover:text-blue-800 font-medium ml-2">
                            Edit Profile
                        </Link>
                    </p>
                </div>
            )}

            {/* Welcome */}
            <section className="mb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Hello, {user?.firstName || "User"} 👋
                </h2>
                <p className="text-gray-600 text-lg">
                    Here’s your learning progress overview.
                </p>
            </section>

            {/* Overview Cards */}
            <section className="mb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center hover:shadow-lg transition">
                        <div className="bg-blue-100 p-3 rounded-lg mr-4">
                            <Book size={26} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">
                                Active Courses
                            </p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {dashboardData.activeCourses}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center hover:shadow-lg transition">
                        <div className="bg-green-100 p-3 rounded-lg mr-4">
                            <FileText size={26} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">
                                Certificates
                            </p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {dashboardData.certificates}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center hover:shadow-lg transition">
                        <div className="bg-purple-100 p-3 rounded-lg mr-4">
                            <Clock size={26} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">
                                Pending Enrollments
                            </p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {dashboardData.pendingEnrollments}
                            </h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Progress */}
            <section>
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Your Courses
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {dashboardData.courses.map((course) => (
                            <div key={course.courseId} className="p-6">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-800">
                                        {user?.profileStatus === "pending" ? (
                                            <span>{course.title}</span>
                                        ) : (
                                            <Link
                                                to={`/user/courses/${course.courseId}`}
                                                className="font-medium text-gray-800 hover:text-blue-600"
                                            >
                                                {course.title}
                                            </Link>
                                        )}
                                    </h4>
                                    <span className="text-sm font-semibold text-gray-600">
                                        {course.progress}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-indigo-600 h-2.5 rounded-full"
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}

                        {dashboardData.courses.length === 0 && (
                            <div className="p-6 text-gray-600 text-center">
                                No courses enrolled yet.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default UserHome;
