import { useState, useEffect } from "react";
import { ChevronRight, CheckCircle } from "react-feather";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

const Courses = () => {
    const { user } = useAuth();
    const [availableCourses, setAvailableCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                // Fetch all courses
                const { data: allCourses } = await api.get("/courses");
                // Fetch enrolled courses (completions)
                const { data: completions } = await api.get(
                    `/completion?user=${user._id}`
                );
                const enrolledCourseIds = completions.courses.map((c) =>
                    c.course.toString()
                );
                // Filter out enrolled courses from available
                const available = allCourses.filter(
                    (course) => !enrolledCourseIds.includes(course._id)
                );
                setAvailableCourses(available);
                setEnrolledCourses(completions.courses);
            } catch (err) {
                setError("Failed to load courses. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [user._id]);

    const handleEnroll = async (courseId) => {
        try {
            const { data } = await api.post("/completion", {
                user: user._id,
                course: courseId,
                title: availableCourses.find((c) => c._id === courseId).title,
                schedule: availableCourses.find((c) => c._id === courseId)
                    .schedule,
                totalSessions: availableCourses.find((c) => c._id === courseId)
                    .totalSessions,
            });
            setEnrolledCourses([...enrolledCourses, data]);
            setAvailableCourses(
                availableCourses.filter((c) => c._id !== courseId)
            );
        } catch (err) {
            setError("Failed to enroll in course.");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Courses
            </h1>

            {/* Enrolled Courses */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                    Enrolled Courses
                </h2>
                {loading ? (
                    <p className="text-sm text-gray-600">Loading courses...</p>
                ) : error ? (
                    <p className="text-sm text-red-600">{error}</p>
                ) : enrolledCourses.length ? (
                    enrolledCourses.map((course) => (
                        <div
                            key={course._id}
                            className="mb-4 border border-gray-200 rounded-lg p-4"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-base">
                                    {course.title}
                                </h3>
                                <span className="text-sm text-gray-500">
                                    {course.schedule}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-2 text-sm text-gray-600">
                                <span>{course.progress}% completed</span>
                                <span>
                                    {course.sessionsCompleted} of{" "}
                                    {course.totalSessions} sessions
                                </span>
                            </div>
                            <div className="mt-2 text-sm text-green-600 flex items-center">
                                <CheckCircle size={16} className="mr-1" />{" "}
                                Enrolled
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-600">
                        No enrolled courses.
                    </p>
                )}
            </div>

            {/* Available Courses */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                    Available Courses
                </h2>
                {loading ? (
                    <p className="text-sm text-gray-600">Loading courses...</p>
                ) : error ? (
                    <p className="text-sm text-red-600">{error}</p>
                ) : availableCourses.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {availableCourses.map((course) => (
                            <div
                                key={course._id}
                                className="border border-gray-200 rounded-lg p-4"
                            >
                                <h3 className="font-medium text-base">
                                    {course.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {course.schedule}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Sessions: {course.totalSessions}
                                </p>
                                <button
                                    onClick={() => handleEnroll(course._id)}
                                    className="mt-3 w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                    disabled={user.profileStatus !== "approved"}
                                >
                                    Enroll
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-600">
                        No available courses.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Courses;
