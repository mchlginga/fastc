import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, PlusCircle, ChevronRight } from "react-feather";
import { useAuth } from "../../context/AuthContext";
import {
    getCompletions,
    createCompletions,
    getCourses,
} from "../../services/authService";

function UserCourses() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]); // Enrolled/pending courses
    const [availableCourses, setAvailableCourses] = useState([]); // All courses from backend
    const [loading, setLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(null);
    const [enrollmentStatus, setEnrollmentStatus] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch enrolled/pending courses
                const completionsData = await getCompletions(user._id);
                console.log("Fetched completions:", completionsData);
                setCourses(completionsData.courses);

                // Fetch all available courses
                const coursesData = await getCourses();
                console.log("Fetched available courses:", coursesData);
                setAvailableCourses(coursesData);
            } catch (err) {
                console.error(
                    "Fetch data error:",
                    err.response?.data || err.message
                );
                // Don't set loadingError to avoid displaying errors
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const handleEnroll = async (courseId, courseTitle) => {
        try {
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 30);
            console.log("Enrolling:", { courseId, userId: user._id, endDate });
            await createCompletions(courseId, user._id, endDate.toISOString());
            setEnrollmentStatus((prev) => ({
                ...prev,
                [courseId]: "pending",
            }));
            // Refetch courses to update "Your Current Courses"
            const completionsData = await getCompletions(user._id);
            console.log(
                "Refetched completions after enrollment:",
                completionsData
            );
            setCourses(completionsData.courses);
        } catch (err) {
            console.error(
                "Enrollment error:",
                err.response?.data || err.message
            );
            // Don't set loadingError to avoid displaying errors
        }
    };

    if (loading) {
        return <div className="text-gray-600 text-center">Loading...</div>;
    }

    if (loadingError) {
        return (
            <div className="text-red-600 text-center">
                Error: {loadingError}
            </div>
        );
    }

    return (
        <div>
            {/* Welcome */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome back, {user?.firstName || "User"}!
                </h2>
                <p className="text-gray-600">
                    Continue your learning journey or explore new courses
                </p>
            </section>

            {/* Current Courses */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Your Current Courses
                    </h3>
                    <a
                        href=""
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                        View all
                        <ChevronRight size={16} className="ml-1" />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {courses
                        .filter(
                            (course) =>
                                course.status === "approved" ||
                                course.status === "pending"
                        )
                        .map((course) => (
                            <div
                                key={course.courseId}
                                className="bg-white rounded-lg shadow p-6 stat-card transition-all duration-300"
                            >
                                <div className="relative">
                                    <img
                                        src={
                                            availableCourses.find(
                                                (ac) =>
                                                    ac._id === course.courseId
                                            )?.image || "/default.png"
                                        }
                                        alt={course.title}
                                        className="w-full h-48 object-cover rounded-t-lg"
                                    />
                                    <div
                                        className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full ${
                                            course.status === "pending"
                                                ? "bg-yellow-600"
                                                : "bg-blue-600"
                                        }`}
                                    >
                                        {course.status === "pending"
                                            ? "Pending"
                                            : "Active"}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-medium text-gray-800">
                                            {course.title}
                                        </h4>
                                        <span className="text-sm font-medium">
                                            {course.progress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                        <div
                                            className="bg-indigo-600 h-2.5 rounded-full progress-bar"
                                            style={{
                                                width: `${course.progress}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-1">
                                            <Clock
                                                size={16}
                                                className="text-gray-400"
                                            />
                                            <span className="text-gray-600 text-sm">
                                                {course.timeRemaining}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/user/courses/${course.courseId}`
                                                )
                                            }
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                                course.status === "pending"
                                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                            }`}
                                            disabled={
                                                course.status === "pending"
                                            }
                                        >
                                            {course.status === "pending"
                                                ? "Pending"
                                                : "Continue"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    {courses.filter(
                        (course) =>
                            course.status === "approved" ||
                            course.status === "pending"
                    ).length === 0 && (
                        <div className="bg-white rounded-lg shadow p-6 stat-card transition-all duration-300 text-center">
                            <p className="text-gray-600 text-sm">
                                No courses enrolled yet.
                            </p>
                        </div>
                    )}
                    <div className="bg-white rounded-lg shadow p-6 stat-card transition-all duration-300 flex items-center justify-center">
                        <div className="text-center">
                            <PlusCircle
                                size={24}
                                className="mx-auto text-gray-400 mb-2"
                            />
                            <p className="text-gray-600 text-sm mb-4">
                                Add a new course to your learning journey
                            </p>
                            <button
                                onClick={() =>
                                    navigate("/user/courses#available-courses")
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                            >
                                Browse Courses
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Available Courses */}
            <section className="mb-8" id="available-courses">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Available Courses
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {availableCourses.map((course) => {
                        const isEnrolledOrPending = courses.some(
                            (c) =>
                                c.courseId === course._id &&
                                (c.status === "pending" ||
                                    c.status === "approved")
                        );
                        return (
                            <div
                                key={course._id}
                                className="bg-white rounded-lg shadow stat-card transition-all duration-300"
                            >
                                <img
                                    src={course.image || "/default.png"}
                                    alt={course.title}
                                    className="w-full h-40 object-cover rounded-t-lg"
                                />
                                <div className="p-6">
                                    <div className="flex items-center mb-2">
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
                                            New
                                        </span>
                                    </div>
                                    <h4 className="font-medium text-gray-800 mb-2">
                                        {course.title}
                                    </h4>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {course.description ||
                                            "No description available"}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-1">
                                            <Clock
                                                size={16}
                                                className="text-gray-400"
                                            />
                                            <span className="text-gray-600 text-sm">
                                                {course.duration || "N/A"}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleEnroll(
                                                    course._id,
                                                    course.title
                                                )
                                            }
                                            disabled={isEnrolledOrPending}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                                isEnrolledOrPending
                                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                            }`}
                                        >
                                            {isEnrolledOrPending
                                                ? "Pending/Enrolled"
                                                : "Enroll"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

export default UserCourses;
