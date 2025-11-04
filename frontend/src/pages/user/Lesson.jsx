import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ChevronLeft,
    ChevronRight,
    Check,
    Clock,
    Play,
    Lock,
    Book,
    Award,
    Download,
    X,
    Users,
    Calendar,
    BarChart2,
} from "react-feather";
import { useAuth } from "../../context/AuthContext";
import { getCourseById } from "../../services/courseService";
import {
    getEnrollmentDetails,
    completeLesson,
    getUserEnrollments,
} from "../../services/enrollmentService";
import { getUserCertificates } from "../../services/certificateService";
import ToastNotification from "../../components/common/ToastNotification";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import LessonSkeleton from "../../components/user/courses/LessonSkeleton";
import { markAttendance } from "../../services/attendanceService";

// Certificate Celebration Modal
const CertificateCelebrationModal = ({
    isOpen,
    onClose,
    courseTitle,
    onViewCertificate,
    onDownloadCertificate,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 scale-100">
                <div className="p-8 text-center">
                    {/* Celebration Animation */}
                    <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <Award size={32} className="text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        Congratulations! 🎉
                    </h3>

                    <p className="text-gray-600 mb-2">
                        You've successfully completed
                    </p>
                    <p className="text-lg font-semibold text-blue-600 mb-6">
                        {courseTitle}
                    </p>

                    <p className="text-gray-500 text-sm mb-6">
                        Your certificate has been generated and is ready to view
                        and download.
                    </p>

                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={onViewCertificate}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center cursor-pointer"
                        >
                            <Award size={18} className="mr-2" />
                            View My Certificate
                        </button>

                        <button
                            onClick={onDownloadCertificate}
                            className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center cursor-pointer"
                        >
                            <Download size={18} className="mr-2" />
                            Download Certificate
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full text-gray-600 hover:text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors cursor-pointer"
                        >
                            Continue Learning
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function Lesson() {
    const { courseId, lessonId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [completing, setCompleting] = useState(false);

    // 🆕 State for certificate generation
    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [toastNotification, setToastNotification] = useState(null);
    const [newlyGeneratedCertificate, setNewlyGeneratedCertificate] =
        useState(null);

    const [completionState, setCompletionState] = useState({
        completedLessons: new Set(),
        isInitialized: false,
    });

    const fetchLessonData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Get course details
            const courseData = await getCourseById(courseId);
            if (!courseData) {
                throw new Error("Course not found");
            }
            setCourse(courseData);

            // Get user's enrollments
            const enrollmentsResponse = await getUserEnrollments();
            if (
                !enrollmentsResponse.success ||
                !enrollmentsResponse.enrollments
            ) {
                throw new Error("Failed to load user enrollments");
            }

            // Find the enrollment for this specific course
            const courseEnrollment = enrollmentsResponse.enrollments.find(
                (enrollment) => enrollment.course.id === courseId
            );

            if (!courseEnrollment) {
                throw new Error("You are not enrolled in this course");
            }

            // Get detailed enrollment data
            const enrollmentDetails = await getEnrollmentDetails(
                courseEnrollment.enrollmentId
            );

            if (!enrollmentDetails.success || !enrollmentDetails.enrollment) {
                throw new Error("Failed to load enrollment details");
            }

            const enrollmentData = enrollmentDetails.enrollment;
            setEnrollment(enrollmentData);

            // Initialize completion state from backend
            if (enrollmentData.completedLessons) {
                const completedSet = new Set(enrollmentData.completedLessons);
                setCompletionState({
                    completedLessons: completedSet,
                    isInitialized: true,
                });
            } else {
                setCompletionState({
                    completedLessons: new Set(),
                    isInitialized: true,
                });
            }

            // Find current lesson
            const lesson = courseData.lessons?.find((l) => l._id === lessonId);
            if (!lesson) {
                throw new Error("Lesson not found");
            }
            setCurrentLesson(lesson);
        } catch (err) {
            console.error("❌ Fetch error:", err);
            setError(err.message || "Failed to load lesson.");
        } finally {
            setLoading(false);
        }
    }, [courseId, lessonId]);

    useEffect(() => {
        if (user && courseId && lessonId) {
            fetchLessonData();
        } else {
            setError("User, course, or lesson ID not found.");
            setLoading(false);
        }
    }, [user, courseId, lessonId, fetchLessonData]);

    const handleMarkAttendance = async () => {
        try {
            await markAttendance(courseId, lessonId);
            setToastNotification({
                message: "Attendance marked successfully!",
                type: "success",
            });
        } catch (error) {
            // Don't show error for already marked attendance
            if (error.response?.status === 409) {
                console.log("Attendance already marked for today");
                // Don't show error toast for this case
                return;
            }
            console.error("Error marking attendance:", error);
            setToastNotification({
                message: "Failed to mark attendance. Please try again.",
                type: "error",
            });
        }
    };

    const handleCourseCompletion = async () => {
        try {
            console.log("🎉 Course completed! Checking for certificate...");

            // Wait a moment for backend to generate certificate
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Refresh enrollment data
            const enrollmentsResponse = await getUserEnrollments();
            const courseEnrollment = enrollmentsResponse.enrollments.find(
                (enroll) => enroll.course.id === courseId
            );

            if (courseEnrollment) {
                // Check if certificate was generated
                const certificatesResponse = await getUserCertificates();
                console.log("📜 Certificates response:", certificatesResponse);
                console.log("🔍 Looking for certificate for course:", courseId);

                // 🆕 FIXED: Better certificate detection logic
                const newCertificate = certificatesResponse.certificates?.find(
                    (cert) => {
                        console.log("🔍 Checking certificate:", {
                            certCourseId: cert.course?._id || cert.course,
                            targetCourseId: courseId,
                            match:
                                (cert.course?._id || cert.course) === courseId,
                        });
                        return (cert.course?._id || cert.course) === courseId;
                    }
                );

                if (newCertificate) {
                    console.log("✅ Certificate found:", newCertificate);
                    setNewlyGeneratedCertificate(newCertificate);
                    setShowCertificateModal(true);

                    setToastNotification({
                        message:
                            "Course completed! Certificate generated successfully!",
                        type: "success",
                    });
                } else {
                    console.log(
                        "⏳ Certificate not found yet, might be generating..."
                    );
                    console.log(
                        "📋 Available certificates:",
                        certificatesResponse.certificates
                    );

                    // 🆕 IMPROVED: Try alternative detection methods
                    const alternativeCert =
                        certificatesResponse.certificates?.find((cert) =>
                            cert.title?.includes(course?.title)
                        );

                    if (alternativeCert) {
                        console.log(
                            "✅ Found certificate via title match:",
                            alternativeCert
                        );
                        setNewlyGeneratedCertificate(alternativeCert);
                        setShowCertificateModal(true);
                    } else {
                        // Show success message anyway
                        setToastNotification({
                            message:
                                "Course completed! Your certificate is being generated and will be available shortly.",
                            type: "success",
                        });

                        // 🆕 IMPROVED: Check again with more detailed logging
                        setTimeout(async () => {
                            try {
                                console.log("🔄 Retrying certificate check...");
                                const certResponse =
                                    await getUserCertificates();
                                const cert = certResponse.certificates?.find(
                                    (c) => {
                                        const certCourseId =
                                            c.course?._id || c.course;
                                        console.log("🔄 Retry check:", {
                                            certCourseId,
                                            targetCourseId: courseId,
                                        });
                                        return certCourseId === courseId;
                                    }
                                );
                                if (cert) {
                                    console.log(
                                        "✅ Certificate found on retry:",
                                        cert
                                    );
                                    setNewlyGeneratedCertificate(cert);
                                    setShowCertificateModal(true);
                                } else {
                                    console.log(
                                        "❌ Still no certificate found on retry"
                                    );
                                    console.log(
                                        "📋 Available certificates on retry:",
                                        certResponse.certificates
                                    );
                                }
                            } catch (error) {
                                console.log(
                                    "Certificate retry check failed:",
                                    error
                                );
                            }
                        }, 3000);
                    }
                }
            }
        } catch (error) {
            console.warn("Certificate check warning:", error);
            // Still show success for course completion
            setToastNotification({
                message: "Course completed successfully!",
                type: "success",
            });
        }
    };

    const handleViewCertificate = () => {
        if (newlyGeneratedCertificate) {
            try {
                // 🆕 FIXED: Get token from localStorage and pass it in URL
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error(
                        "Authentication token not found. Please log in again."
                    );
                }

                const backendUrl =
                    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
                const viewUrl = `${backendUrl}/api/certificate/${
                    newlyGeneratedCertificate.id
                }/view?token=${encodeURIComponent(token)}`;

                console.log(`🔗 Opening certificate URL: ${viewUrl}`);
                window.open(viewUrl, "_blank", "noopener,noreferrer");
            } catch (error) {
                console.error("Error viewing certificate:", error);

                // Fallback to certificates page
                setToastNotification({
                    message:
                        "Failed to open certificate. Redirecting to certificates page.",
                    type: "error",
                });
                navigate("/user/certificates");
            }
        } else {
            navigate("/user/certificates");
        }
        setShowCertificateModal(false);
    };

    const handleDownloadCertificate = async () => {
        if (newlyGeneratedCertificate) {
            try {
                const { downloadCertificateEnhanced } = await import(
                    "../../services/certificateService"
                );

                console.log("📥 Starting certificate download...");

                const blob = await downloadCertificateEnhanced(
                    newlyGeneratedCertificate.id,
                    course?.title
                );

                // 🆕 FIX: Only create download link if we have a valid blob
                if (blob && blob.size > 0) {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute(
                        "download",
                        `FAST-C_Certificate_${course?.title.replace(
                            /\s+/g,
                            "_"
                        )}.pdf`
                    );
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);

                    setToastNotification({
                        message: "Certificate downloaded successfully!",
                        type: "success",
                    });
                } else {
                    // If blob is empty, try direct download method with token
                    const token = localStorage.getItem("token");
                    const backendUrl =
                        import.meta.env.VITE_BACKEND_URL ||
                        "http://localhost:5000";
                    const directDownloadUrl = `${backendUrl}/api/certificate/${
                        newlyGeneratedCertificate.id
                    }/direct-download?token=${encodeURIComponent(token)}`;

                    // Open direct download in new tab
                    window.open(
                        directDownloadUrl,
                        "_blank",
                        "noopener,noreferrer"
                    );

                    setToastNotification({
                        message: "Certificate download initiated!",
                        type: "success",
                    });
                }
            } catch (err) {
                console.error("❌ Download error in component:", err);
                setToastNotification({
                    message:
                        err.message ||
                        "Failed to download certificate. Please try from certificates page.",
                    type: "error",
                });
            }
        } else {
            setToastNotification({
                message: "Certificate not available for download yet.",
                type: "warning",
            });
        }
        setShowCertificateModal(false);
    };

    const handleCompleteLesson = async () => {
        if (!enrollment || !completionState.isInitialized) {
            setError("Enrollment data not available");
            return;
        }

        if (isLessonCompleted()) {
            return;
        }

        try {
            setCompleting(true);

            // 🆕 FIX: Remove duplicate attendance marking - it's already done via face verification
            // await handleMarkAttendance(); // REMOVED - Attendance already marked during face verification

            // Call API to complete lesson
            await completeLesson(enrollment.id, lessonId);

            // Refresh data from backend
            const enrollmentsResponse = await getUserEnrollments();
            const courseEnrollment = enrollmentsResponse.enrollments.find(
                (enroll) => enroll.course.id === courseId
            );

            if (courseEnrollment) {
                const enrollmentDetails = await getEnrollmentDetails(
                    courseEnrollment.enrollmentId
                );
                const updatedEnrollment = enrollmentDetails.enrollment;
                setEnrollment(updatedEnrollment);

                const updatedCompletedLessons = new Set(
                    updatedEnrollment.completedLessons || []
                );
                setCompletionState({
                    completedLessons: updatedCompletedLessons,
                    isInitialized: true,
                });

                // 🆕 ENHANCED: Check if course is completed and handle certificate
                if (updatedEnrollment.status === "completed") {
                    await handleCourseCompletion();
                } else {
                    // Show lesson completion success
                    setToastNotification({
                        message: "Lesson completed successfully!",
                        type: "success",
                    });
                }
            }
        } catch (err) {
            console.error("Error completing lesson:", err);

            if (err.message.includes("already completed")) {
                fetchLessonData();
            } else {
                setError(err.message || "Failed to complete lesson.");
                setToastNotification({
                    message: "Failed to complete lesson. Please try again.",
                    type: "error",
                });
            }
        } finally {
            setCompleting(false);
        }
    };

    const getNextLesson = useCallback(() => {
        if (!course?.lessons) return null;

        const sortedLessons = [...course.lessons].sort(
            (a, b) => a.order - b.order
        );
        const currentIndex = sortedLessons.findIndex(
            (lesson) => lesson._id === lessonId
        );

        if (currentIndex < sortedLessons.length - 1) {
            return sortedLessons[currentIndex + 1];
        }
        return null;
    }, [course, lessonId]);

    const getPreviousLesson = useCallback(() => {
        if (!course?.lessons) return null;

        const sortedLessons = [...course.lessons].sort(
            (a, b) => a.order - b.order
        );
        const currentIndex = sortedLessons.findIndex(
            (lesson) => lesson._id === lessonId
        );

        if (currentIndex > 0) {
            return sortedLessons[currentIndex - 1];
        }
        return null;
    }, [course, lessonId]);

    const getLessonStatus = useCallback(
        (lesson) => {
            if (!enrollment || !completionState.isInitialized) return "locked";

            const isCompleted = completionState.completedLessons.has(
                lesson._id
            );

            if (isCompleted) {
                return "completed";
            }

            if (lesson._id === lessonId) {
                return "current";
            }

            const currentIndex =
                course.lessons?.findIndex((l) => l._id === lessonId) ?? -1;
            const lessonIndex =
                course.lessons?.findIndex((l) => l._d === lesson._id) ?? -1;

            if (lessonIndex <= currentIndex) {
                return "available";
            }

            return "locked";
        },
        [enrollment, completionState, course, lessonId]
    );

    const isLessonCompleted = useCallback(() => {
        return (
            completionState.isInitialized &&
            completionState.completedLessons.has(lessonId)
        );
    }, [completionState, lessonId]);

    const handleNavigateToLesson = useCallback(
        (targetLessonId) => {
            if (!targetLessonId) return;
            navigate(`/user/courses/${courseId}/lesson/${targetLessonId}`);
        },
        [courseId, navigate]
    );

    const renderCompletionSection = () => {
        if (!completionState.isInitialized) {
            return (
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-gray-600 text-sm">
                            Loading completion status...
                        </p>
                    </div>
                </div>
            );
        }

        const isCompleted = isLessonCompleted();

        if (isCompleted) {
            return (
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={24} className="text-green-600" />
                        </div>
                        <p className="text-green-800 font-semibold text-lg mb-2">
                            Lesson Completed
                        </p>
                        <p className="text-green-600 text-sm">
                            You've successfully completed this lesson
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                    onClick={handleCompleteLesson}
                    disabled={completing}
                    className={`w-full py-4 px-6 rounded-xl text-base font-semibold transition-all duration-200 ${
                        completing
                            ? "bg-green-600 text-white cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                >
                    {completing ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Marking as Complete...
                        </div>
                    ) : (
                        "Mark Lesson as Complete"
                    )}
                </button>
            </div>
        );
    };

    const renderNavigationButtons = () => {
        const nextLesson = getNextLesson();
        const previousLesson = getPreviousLesson();
        const isCompleted = isLessonCompleted();

        return (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                    onClick={() => handleNavigateToLesson(previousLesson?._id)}
                    disabled={!previousLesson}
                    className={`flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        previousLesson
                            ? "bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer shadow-md hover:shadow-lg"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    <ChevronLeft size={18} className="mr-2" />
                    Previous Lesson
                </button>

                <button
                    onClick={() => handleNavigateToLesson(nextLesson?._id)}
                    disabled={!nextLesson || !isCompleted}
                    className={`flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        nextLesson && isCompleted
                            ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    Next Lesson
                    <ChevronRight size={18} className="ml-2" />
                </button>
            </div>
        );
    };

    if (loading) {
        return <LessonSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ErrorState
                        message={error}
                        onRetry={() => window.location.reload()}
                    />
                </div>
            </div>
        );
    }

    if (!course || !currentLesson || !enrollment) {
        return (
            <div className="min-h-screen bg-gray-50 py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ErrorState
                        message="Lesson not found"
                        onRetry={() => navigate(`/user/courses/${courseId}`)}
                    />
                </div>
            </div>
        );
    }

    const sortedLessons =
        [...course.lessons].sort((a, b) => a.order - b.order) || [];
    const isCompleted = isLessonCompleted();
    const currentLessonIndex =
        sortedLessons.findIndex((l) => l._id === lessonId) + 1;

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link
                            to={`/user/courses/${courseId}`}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition"
                        >
                            <ChevronLeft size={20} className="mr-2" />
                            Back to {course.title}
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Lesson Header */}
                            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                Lesson {currentLessonIndex} of{" "}
                                                {sortedLessons.length}
                                            </span>
                                            {isCompleted && (
                                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                                                    <Check
                                                        size={14}
                                                        className="mr-1"
                                                    />
                                                    Completed
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                            {currentLesson.title}
                                        </h1>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            {currentLesson.description ||
                                                "No description available for this lesson."}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                                            <Clock size={16} className="mr-2" />
                                            <span>
                                                {currentLesson.duration ||
                                                    "Self-paced"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            Course Progress
                                        </span>
                                        <span className="text-sm font-bold text-blue-600">
                                            {enrollment.progress || 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${
                                                    enrollment.progress || 0
                                                }%`,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>
                                            {completionState.completedLessons
                                                .size || 0}{" "}
                                            lessons completed
                                        </span>
                                        <span>
                                            {sortedLessons.length -
                                                (completionState
                                                    .completedLessons.size ||
                                                    0)}{" "}
                                            remaining
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Lesson Content */}
                            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                                {/* Video/Content Area */}
                                <div className="aspect-w-16 aspect-h-9 bg-gray-900">
                                    {currentLesson.videoUrl ? (
                                        <iframe
                                            src={currentLesson.videoUrl}
                                            className="w-full h-96"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <div className="w-full h-96 flex items-center justify-center bg-gray-100">
                                            <div className="text-center">
                                                <Play
                                                    size={48}
                                                    className="text-gray-400 mx-auto mb-4"
                                                />
                                                <p className="text-gray-600 text-sm">
                                                    No video content available
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Lesson Content Details */}
                                <div className="p-8">
                                    {currentLesson.content && (
                                        <div className="prose max-w-none">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                                <Book
                                                    size={20}
                                                    className="mr-2 text-blue-600"
                                                />
                                                Learning Materials
                                            </h3>
                                            <div className="text-gray-600 leading-relaxed text-lg">
                                                {currentLesson.content}
                                            </div>
                                        </div>
                                    )}

                                    {/* Completion Section */}
                                    {renderCompletionSection()}

                                    {/* Navigation */}
                                    {renderNavigationButtons()}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Course Info */}
                            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <BarChart2 size={18} className="mr-2" />
                                    Course Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            Status
                                        </span>
                                        <span
                                            className={`font-medium ${
                                                enrollment.status === "active"
                                                    ? "text-green-600"
                                                    : enrollment.status ===
                                                      "completed"
                                                    ? "text-blue-600"
                                                    : "text-yellow-600"
                                            }`}
                                        >
                                            {enrollment.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                enrollment.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            Total Lessons
                                        </span>
                                        <span className="font-medium text-gray-800">
                                            {sortedLessons.length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            Completed
                                        </span>
                                        <span className="font-medium text-gray-800">
                                            {completionState.completedLessons
                                                .size || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            Remaining
                                        </span>
                                        <span className="font-medium text-gray-800">
                                            {sortedLessons.length -
                                                (completionState
                                                    .completedLessons.size ||
                                                    0)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Lesson Navigation */}
                            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="font-semibold text-gray-800 flex items-center">
                                        <Book size={16} className="mr-2" />
                                        Course Lessons
                                    </h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {sortedLessons.map((lesson, index) => {
                                        const status = getLessonStatus(lesson);
                                        const isCurrent =
                                            lesson._id === lessonId;

                                        return (
                                            <div
                                                key={lesson._id}
                                                className={`p-3 border-b border-gray-100 last:border-b-0 transition ${
                                                    isCurrent
                                                        ? "bg-blue-50 border-l-4 border-l-blue-600"
                                                        : "hover:bg-gray-50"
                                                }`}
                                            >
                                                <button
                                                    onClick={() =>
                                                        handleNavigateToLesson(
                                                            lesson._id
                                                        )
                                                    }
                                                    disabled={
                                                        status === "locked"
                                                    }
                                                    className={`w-full text-left flex items-center space-x-3 ${
                                                        status === "locked"
                                                            ? "cursor-not-allowed"
                                                            : "cursor-pointer"
                                                    }`}
                                                >
                                                    <div
                                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                                                            status ===
                                                            "completed"
                                                                ? "bg-green-100 text-green-600"
                                                                : status ===
                                                                  "current"
                                                                ? "bg-blue-100 text-blue-600"
                                                                : status ===
                                                                  "available"
                                                                ? "bg-gray-100 text-gray-600"
                                                                : "bg-gray-100 text-gray-400"
                                                        }`}
                                                    >
                                                        {status ===
                                                        "completed" ? (
                                                            <Check size={14} />
                                                        ) : status ===
                                                          "current" ? (
                                                            <Play size={14} />
                                                        ) : status ===
                                                          "available" ? (
                                                            index + 1
                                                        ) : (
                                                            <Lock size={14} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p
                                                            className={`text-sm font-medium truncate ${
                                                                status ===
                                                                "locked"
                                                                    ? "text-gray-400"
                                                                    : "text-gray-800"
                                                            }`}
                                                        >
                                                            {lesson.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {lesson.duration ||
                                                                "Self-paced"}
                                                        </p>
                                                    </div>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🆕 Certificate Celebration Modal */}
            <CertificateCelebrationModal
                isOpen={showCertificateModal}
                onClose={() => setShowCertificateModal(false)}
                courseTitle={course?.title}
                onViewCertificate={handleViewCertificate}
                onDownloadCertificate={handleDownloadCertificate}
            />

            {/* 🆕 Toast Notifications */}
            {toastNotification && (
                <ToastNotification
                    message={toastNotification.message}
                    type={toastNotification.type}
                    onClose={() => setToastNotification(null)}
                />
            )}
        </>
    );
}

export default Lesson;
