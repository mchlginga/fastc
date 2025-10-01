import { useState, useEffect } from "react";
import {
    Award,
    ChevronRight,
    CheckCircle,
    XCircle,
    Download,
    Eye,
} from "react-feather";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    generateCertificate,
    getCompletions,
} from "../../services/authService";
import { api } from "../../services/api";

const UserHome = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [completionResponse, certResponse] = await Promise.all([
                    getCompletions(user._id),
                    api.get(`/certificates?user=${user._id}`),
                ]);
                console.log("UserHome courses data:", completionResponse);
                console.log("UserHome certificates data:", certResponse.data);
                setCourses(completionResponse.courses || []);
                setCertificates(certResponse.data.certificates || []);
            } catch (err) {
                setError(
                    err.message || "Failed to load data. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user._id]);

    const handleDownload = async (courseId) => {
        try {
            const blob = await generateCertificate(courseId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `certificate-${courseId}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setError("Failed to download certificate.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Profile Status Warning */}
            {user.profileStatus === "pending" && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                    <p className="text-sm">
                        Your profile is under review. You will be notified once
                        it is approved or rejected.
                        <Link
                            to="/profile-setup/step1"
                            className="text-blue-600 hover:text-blue-800 font-medium ml-2"
                        >
                            Edit Profile
                        </Link>
                    </p>
                </div>
            )}
            {user.profileStatus === "rejected" && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    <p className="text-sm">
                        Your profile was rejected. Please update your
                        information.
                        <Link
                            to="/profile-setup/step1"
                            className="text-blue-600 hover:text-blue-800 font-medium ml-2"
                        >
                            Update Profile
                        </Link>
                    </p>
                </div>
            )}

            {/* Welcome Header */}
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                    Welcome back, {user.firstName}
                </h1>
                <p className="text-sm text-gray-600">
                    Here's your training progress and latest updates
                </p>
            </div>

            {/* Enrolled Courses */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                        Enrolled Courses
                    </h2>
                    <Link
                        to="/user/courses"
                        className={`text-sm flex items-center ${
                            user.profileStatus === "approved"
                                ? "text-blue-600 hover:text-blue-500"
                                : "text-gray-400 cursor-not-allowed"
                        }`}
                        onClick={(e) =>
                            user.profileStatus !== "approved" &&
                            e.preventDefault()
                        }
                    >
                        View all <ChevronRight size={16} className="ml-1" />
                    </Link>
                </div>
                {loading ? (
                    <p className="text-sm text-gray-600">Loading courses...</p>
                ) : error ? (
                    <p className="text-sm text-red-600">{error}</p>
                ) : courses.length ? (
                    courses.map((course) => (
                        <div key={course._id} className="mb-4 md:mb-6">
                            <div className="flex justify-between mb-2">
                                <h3 className="font-medium text-base md:text-lg">
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
                            <div className="mt-3 flex items-center text-sm">
                                <span className="font-medium mr-2">
                                    Attendance:
                                </span>
                                <span className="text-green-600 flex items-center">
                                    <CheckCircle size={16} className="mr-1" />{" "}
                                    Present
                                </span>
                                <span className="mx-2">•</span>
                                <span className="text-red-600 flex items-center">
                                    <XCircle size={16} className="mr-1" />{" "}
                                    {course.absences} Absences
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-600">
                        {user.profileStatus === "approved"
                            ? "No enrolled courses."
                            : "Complete your profile to enroll in courses."}
                    </p>
                )}
            </div>

            {/* Certificates */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                        Certificates
                    </h2>
                    <Link
                        to="/user/certificates"
                        className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                    >
                        View all <ChevronRight size={16} className="ml-1" />
                    </Link>
                </div>
                {loading ? (
                    <p className="text-sm text-gray-600">
                        Loading certificates...
                    </p>
                ) : error ? (
                    <p className="text-sm text-red-600">{error}</p>
                ) : certificates.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {certificates.map((cert) => (
                            <div
                                key={cert._id}
                                className="border border-gray-200 rounded-lg p-4 flex items-start"
                            >
                                <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                    <Award
                                        size={20}
                                        className="text-blue-600"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-medium text-base">
                                        {cert.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Completed:{" "}
                                        {new Date(cert.date).toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            }
                                        )}
                                    </p>
                                    <p className="text-sm text-green-600 mt-1 flex items-center">
                                        <CheckCircle
                                            size={16}
                                            className="mr-1"
                                        />
                                        Valid until{" "}
                                        {new Date(
                                            new Date(cert.date).setFullYear(
                                                new Date(
                                                    cert.date
                                                ).getFullYear() + 2
                                            )
                                        ).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                    <div className="mt-3 flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handleDownload(cert.course)
                                            }
                                            className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                                        >
                                            <Download
                                                size={16}
                                                className="mr-1"
                                            />{" "}
                                            Download
                                        </button>
                                        <Link
                                            to={`/user/certificates/${cert._id}`}
                                            className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                                        >
                                            <Eye size={16} className="mr-1" />{" "}
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-600">
                        No certificates available.
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserHome;
