import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ChevronRight, CheckCircle, Book } from "react-feather";
import { useAuth } from "../../context/AuthContext";
import {
    getCompletions,
    createCompletions,
    getCourses,
} from "../../services/authService";

function UserCourses() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(null);
    const [enrollmentStatus, setEnrollmentStatus] = useState({});

    // ref for Available Courses section
    const availableCoursesRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const completionsData = await getCompletions(user._id);
                setCourses(completionsData.courses);

                const coursesData = await getCourses();
                setAvailableCourses(coursesData);
            } catch (err) {
                console.error(
                    "Fetch data error:",
                    err.response?.data || err.message
                );
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
            await createCompletions(courseId, user._id, endDate.toISOString());
            setEnrollmentStatus((prev) => ({
                ...prev,
                [courseId]: "pending",
            }));
            const completionsData = await getCompletions(user._id);
            setCourses(completionsData.courses);
        } catch (err) {
            console.error(
                "Enrollment error:",
                err.response?.data || err.message
            );
        }
    };

    const handleBrowseCourses = () => {
        if (availableCoursesRef.current) {
            availableCoursesRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
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

    const currentCourses = courses.filter(
        (course) => course.status === "approved" && course.progress < 100
    );
    const completedCourses = courses.filter(
        (course) => course.status === "approved" && course.progress === 100
    );

    return (
        <div>
            {/* Warning Message */}
            {user?.profileStatus === "pending" && (
                <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                    <p className="text-sm">
                        Your profile is under review. You cannot enroll in
                        courses until approved.
                        <span className="text-blue-600 hover:text-blue-800 font-medium ml-2 cursor-pointer">
                            Edit Profile
                        </span>
                    </p>
                </div>
            )}

            {/* Welcome */}
            <section className="mb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Courses
                </h2>
                <p className="text-gray-600 text-lg">
                    Continue your learning journey or explore new courses
                </p>
            </section>

            {/* Current Courses */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Your Current Courses
                    </h3>
                </div>

                {currentCourses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center text-center">
                        <Book size={32} className="text-gray-400 mb-3" />
                        <p className="text-gray-600 text-sm mb-4">
                            You don’t have any active courses yet.
                        </p>
                        <button
                            onClick={handleBrowseCourses}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        >
                            Browse Courses
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6s">
                        {currentCourses.map((course) => (
                            <div
                                key={course.courseId}
                                className="bg-white rounded-lg shadow-md flex flex-col h-full hover:shadow-lg transition"
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
                                <div className="flex flex-col flex-grow p-6">
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
                                            className="bg-indigo-600 h-2.5 rounded-full"
                                            style={{
                                                width: `${course.progress}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between items-center mt-auto">
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
                    </div>
                )}
            </section>

            {/* Completed Courses */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Completed Courses
                    </h3>
                    {completedCourses.length > 0 && (
                        <span
                            onClick={() => navigate("/user/certificates")}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center cursor-pointer"
                        >
                            View Certificates
                            <ChevronRight size={16} className="ml-1" />
                        </span>
                    )}
                </div>

                {completedCourses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center text-center ">
                        <CheckCircle size={32} className="text-gray-400 mb-3" />
                        <p className="text-gray-600 text-sm mb-2">
                            You haven’t completed any courses yet.
                        </p>
                        <p className="text-gray-500 text-xs mb-4">
                            Finish a course to earn a certificate.
                        </p>
                        <button
                            onClick={handleBrowseCourses}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        >
                            Browse Courses
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {completedCourses.map((course) => (
                            <div
                                key={course.courseId}
                                className="bg-white rounded-lg shadow-md flex flex-col h-full hover:shadow-lg transition"
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
                                    <div className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full bg-green-600">
                                        Completed
                                    </div>
                                </div>
                                <div className="flex flex-col flex-grow p-6">
                                    <h4 className="font-medium text-gray-800 mb-2">
                                        {course.title}
                                    </h4>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-green-600">
                                            100% Complete
                                        </span>
                                        <div className="flex items-center">
                                            <Clock
                                                size={16}
                                                className="text-gray-400 mr-1"
                                            />
                                            <span className="text-gray-600 text-sm">
                                                {course.timeRemaining}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            navigate("/user/certificates")
                                        }
                                        className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium text-center flex items-center justify-center"
                                    >
                                        <CheckCircle
                                            size={16}
                                            className="mr-1"
                                        />
                                        View Certificate
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Available Courses */}
            <section className="mb-8" ref={availableCoursesRef}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Available Courses
                    </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                                className="bg-white rounded-lg shadow-md flex flex-col h-full hover:shadow-lg transition"
                            >
                                <img
                                    src={course.image || "/default.png"}
                                    alt={course.title}
                                    className="w-full h-40 object-cover rounded-t-lg"
                                />
                                <div className="flex flex-col flex-grow p-6">
                                    <div className="flex items-center mb-2">
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
                                            New
                                        </span>
                                    </div>
                                    <h4 className="font-medium text-gray-800 mb-2">
                                        {course.title}
                                    </h4>
                                    <p className="text-gray-600 text-sm mb-4 flex-grow">
                                        {course.description ||
                                            "No description available"}
                                    </p>
                                    <div className="flex justify-between items-center mt-auto">
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
                                            disabled={
                                                isEnrolledOrPending ||
                                                user?.profileStatus ===
                                                    "pending"
                                            }
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                                isEnrolledOrPending ||
                                                user?.profileStatus ===
                                                    "pending"
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
