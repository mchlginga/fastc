import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCourseById } from "../../services/courseService";
import {
    enrollInCourse,
    getUserEnrollments,
} from "../../services/enrollmentService";
import {
    Clock,
    Users,
    Calendar,
    ArrowLeft,
    Book,
    CheckCircle,
    Award,
    BarChart2,
} from "react-feather";
import {
    getEnrollmentDeadline,
    getCourseAccessType,
} from "../../utils/courseUtils";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import CourseOverviewSkeleton from "../../components/user/courses/CourseOverviewSkeleton";
import ToastNotification from "../../components/common/ToastNotification";

function CourseOverviewPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const location = useLocation();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolling, setEnrolling] = useState(false);
    const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
    const [userEnrollments, setUserEnrollments] = useState([]);

    // Toast notification state
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const cameFrom = location.state?.from || "available";

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [courseData, enrollmentsData] = await Promise.all([
                    getCourseById(courseId),
                    getUserEnrollments(),
                ]);

                if (!courseData) {
                    throw new Error("Course not found");
                }

                setCourse(courseData);
                setUserEnrollments(enrollmentsData.enrollments || []);
            } catch (err) {
                console.error("Error fetching course:", err);
                setError(err.message || "Failed to load course details");
                showToast(
                    "Failed to load course details. Please try again.",
                    "error"
                );
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchData();
        }
    }, [courseId]);

    // Check if user has pending enrollment for this course
    const hasPendingEnrollment = userEnrollments.some(
        (enrollment) =>
            enrollment.course?.id === courseId &&
            enrollment.status === "pending"
    );

    // Toast notification helper
    const showToast = (message, type = "success") => {
        setToast({
            show: true,
            message,
            type,
        });
    };

    const hideToast = () => {
        setToast({
            show: false,
            message: "",
            type: "success",
        });
    };

    const handleEnroll = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.profileStatus === "pending") {
            showToast(
                "Your profile is under review. You cannot enroll in courses until approved.",
                "warning"
            );
            return;
        }

        try {
            setEnrolling(true);
            await enrollInCourse(courseId);
            setEnrollmentSuccess(true);

            showToast(
                `Enrollment request submitted for "${course?.title}"! Waiting for admin approval.`,
                "success"
            );

            // Refresh enrollments to show pending status
            const enrollmentsResponse = await getUserEnrollments();
            setUserEnrollments(enrollmentsResponse.enrollments || []);
        } catch (err) {
            console.error("Enrollment error:", err);
            showToast(
                err.message ||
                    `Failed to enroll in "${course?.title}". Please try again.`,
                "error"
            );
        } finally {
            setEnrolling(false);
        }
    };

    // Safe data access helpers
    const getCourseTitle = () => course?.title || "Untitled Course";
    const getCourseDescription = () =>
        course?.description || "No description available";
    const getSkillLevel = () => course?.skillLevel || "All Levels";
    const getCategory = () => course?.category || "";
    const getDuration = () => course?.duration || "Self-paced";
    const getLessons = () => course?.lessons || [];
    const getOutcomes = () => course?.outcomes || [];
    const getRequirements = () => course?.requirements || [];

    // Show loading skeleton
    if (loading) {
        return <CourseOverviewSkeleton />;
    }

    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={() => window.location.reload()}
            />
        );
    }

    if (!course) {
        return (
            <ErrorState
                message="Course not found"
                onRetry={() => navigate("/user/courses")}
            />
        );
    }

    const enrollmentDeadline = getEnrollmentDeadline(course);
    const courseAccessType = getCourseAccessType(course);

    return (
        <div className="min-h-screen bg-gray-50/60 py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Toast Notification */}
                {toast.show && (
                    <ToastNotification
                        message={toast.message}
                        type={toast.type}
                        onClose={hideToast}
                    />
                )}

                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Course Details
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Explore course content, requirements, and
                                enrollment options
                            </p>
                        </div>
                    </div>
                </div>

                {/* Course Header Card */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden mb-8">
                    <div className="md:flex">
                        <div className="md:shrink-0 md:w-1/3">
                            <img
                                src={course?.image || "/default-course.jpg"}
                                alt={getCourseTitle()}
                                className="h-64 w-full md:h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "/default-course.jpg";
                                }}
                                loading="lazy"
                            />
                        </div>
                        <div className="p-8 md:w-2/3">
                            {/* Status Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${enrollmentDeadline.color}`}
                                >
                                    {enrollmentDeadline.text}
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${courseAccessType.color}`}
                                >
                                    {courseAccessType.displayText}
                                </span>
                                {getCategory() && (
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                        {getCategory()}
                                    </span>
                                )}
                            </div>

                            {/* Course Title & Description */}
                            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                                {getCourseTitle()}
                            </h1>

                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                {getCourseDescription()}
                            </p>

                            {/* Enrollment Action */}
                            <div className="flex gap-3">
                                {hasPendingEnrollment ? (
                                    <div className="flex-1 min-h-12 bg-amber-50 text-amber-700 text-center py-3 rounded-lg text-sm font-medium flex items-center justify-center border border-amber-200">
                                        Waiting for Admin Approval
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleEnroll}
                                        disabled={
                                            enrolling ||
                                            enrollmentSuccess ||
                                            user?.profileStatus === "pending" ||
                                            enrollmentDeadline.status ===
                                                "closed"
                                        }
                                        className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition ${
                                            enrolling ||
                                            enrollmentSuccess ||
                                            user?.profileStatus === "pending" ||
                                            enrollmentDeadline.status ===
                                                "closed"
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-xs"
                                        }`}
                                    >
                                        {enrolling ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Enrolling...
                                            </div>
                                        ) : enrollmentSuccess ? (
                                            <div className="flex items-center justify-center">
                                                Enrollment Successful!
                                            </div>
                                        ) : user?.profileStatus ===
                                          "pending" ? (
                                            "Profile Under Review"
                                        ) : enrollmentDeadline.status ===
                                          "closed" ? (
                                            "Enrollment Closed"
                                        ) : (
                                            "Enroll Now"
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* What You'll Learn */}
                        {getOutcomes().length > 0 && (
                            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    What You'll Learn
                                </h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {getOutcomes().map((outcome, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center text-gray-600 text-sm"
                                        >
                                            <CheckCircle
                                                size={14}
                                                className="mr-2 text-emerald-500 shrink-0"
                                            />
                                            <span>{outcome}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Course Content */}
                        {getLessons().length > 0 && (
                            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    Course Content
                                </h2>
                                <div className="space-y-3">
                                    {getLessons().map((lesson, index) => (
                                        <div
                                            key={lesson._id || index}
                                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                                    <span className="text-sm font-medium text-gray-600">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                                <span className="text-gray-800 text-sm">
                                                    {lesson.title ||
                                                        `Lesson ${index + 1}`}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {lesson.duration || ""}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Requirements */}
                        {getRequirements().length > 0 && (
                            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                                <h3 className="font-semibold text-gray-800 mb-3 text-sm">
                                    Requirements
                                </h3>
                                <ul className="space-y-2">
                                    {getRequirements().map(
                                        (requirement, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center text-sm text-gray-600"
                                            >
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                                                {requirement}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Course Details */}
                        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center text-sm">
                                <BarChart2 size={16} className="mr-2" />
                                Course Details
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Skill Level
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {getSkillLevel()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Total Lessons
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {getLessons().length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Access Period
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {courseAccessType.displayText}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Certificate
                                    </span>
                                    <span className="font-medium text-emerald-600">
                                        Included
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseOverviewPage;
