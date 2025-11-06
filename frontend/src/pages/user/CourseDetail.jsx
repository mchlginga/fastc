import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    Clock,
    Book,
    ChevronLeft,
    Check,
    Play,
    Lock,
    Users,
    Award,
    BarChart2,
    CheckCircle,
    Calendar,
    Camera,
} from "react-feather";
import { useAuth } from "../../context/AuthContext";
import { getCourseById } from "../../services/courseService";
import { getUserEnrollments } from "../../services/enrollmentService";
import { getFaceStatus } from "../../services/attendanceService";
import { api } from "../../services/api";
import {
    getEnrollmentDeadline,
    getCourseAccessType,
} from "../../utils/courseUtils";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import CourseDetailSkeleton from "../../components/user/courses/CourseDetailSkeleton";
import FacialRecognitionModal from "../../components/user/FacialRecognitionModal";

function CourseDetail() {
    const { courseId } = useParams();
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasEnrolledFace, setHasEnrolledFace] = useState(false);
    const [showFaceModal, setShowFaceModal] = useState(false);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);

    const cameFrom = location.state?.from || "available";

    // Add this function to check if attendance was already marked today
    const checkTodayAttendance = async () => {
        try {
            const response = await api.get(`/attendance/today/${courseId}`);
            return response.data.hasAttendanceToday;
        } catch (error) {
            console.log("Could not check today's attendance:", error);
            return false;
        }
    };

    // Update handleContinueLearning to skip face verification if already marked today
    const handleContinueLearning = async () => {
        if (!hasEnrolledFace) {
            // Show face enrollment modal first
            setShowFaceModal(true);
            return;
        }

        // Check if attendance already marked today
        const alreadyMarked = await checkTodayAttendance();

        if (alreadyMarked) {
            console.log(
                "✅ Attendance already marked today, proceeding directly to lesson"
            );
            // Navigate directly to lesson without face verification
            const nextLesson = getNextAvailableLesson();
            if (nextLesson) {
                navigate(`/user/courses/${courseId}/lesson/${nextLesson._id}`);
            }
        } else {
            // Show attendance verification modal
            setShowAttendanceModal(true);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("🔄 Starting to fetch course data...");

                // Get course details
                const courseData = await getCourseById(courseId);
                console.log("📦 Course data:", courseData);

                if (!courseData) {
                    throw new Error("Course not found");
                }
                setCourse(courseData);

                // Get ALL user enrollments and find the one for this course
                console.log("🔄 Fetching user enrollments...");
                const enrollmentsResponse = await getUserEnrollments();
                console.log("📦 All enrollments:", enrollmentsResponse);

                if (
                    enrollmentsResponse.success &&
                    enrollmentsResponse.enrollments
                ) {
                    // Find enrollment for this specific course
                    const courseEnrollment =
                        enrollmentsResponse.enrollments.find(
                            (enrollment) => enrollment.course.id === courseId
                        );
                    console.log(
                        "🎯 Found course enrollment:",
                        courseEnrollment
                    );

                    if (courseEnrollment) {
                        setEnrollment(courseEnrollment);
                    } else {
                        throw new Error("You are not enrolled in this course");
                    }
                } else {
                    throw new Error("Failed to load enrollment data");
                }

                // Check if user has enrolled face
                try {
                    const faceStatus = await getFaceStatus();
                    setHasEnrolledFace(faceStatus.hasEnrolledFace);
                } catch (faceError) {
                    console.warn("Face status check failed:", faceError);
                    setHasEnrolledFace(false);
                }
            } catch (err) {
                console.error("❌ Fetch error:", err);
                setError(err.message || "Failed to load course details.");
            } finally {
                setLoading(false);
            }
        };

        if (user && courseId) {
            fetchData();
        } else {
            setError("User or course ID not found.");
            setLoading(false);
        }
    }, [courseId, user]);

    // Debug enrollment data
    useEffect(() => {
        if (enrollment) {
            console.log("🔍 Enrollment debug data:", {
                timeRemaining: enrollment.timeRemaining,
                accessStatus: enrollment.accessStatus,
                courseDuration: course?.duration,
                enrollmentPeriod: course?.enrollmentPeriod,
                status: enrollment.status,
            });
        }
    }, [enrollment, course]);

    useEffect(() => {
        return () => {
            sessionStorage.removeItem("pendingLessonId");
        };
    }, []);

    const handleFaceEnrollmentSuccess = () => {
        setShowFaceModal(false);
        setHasEnrolledFace(true);

        // After face enrollment, check if there's a pending lesson to start
        const pendingLessonId = sessionStorage.getItem("pendingLessonId");
        if (pendingLessonId) {
            // If there's a pending lesson, proceed to attendance verification
            setTimeout(() => {
                setShowAttendanceModal(true);
            }, 500);
        }
        // If no pending lesson, user can click "Start" again on the lesson they want
    };

    const handleAttendanceSuccess = () => {
        setShowAttendanceModal(false);

        // Get the lesson ID from session storage or use next lesson
        const pendingLessonId = sessionStorage.getItem("pendingLessonId");
        const lessonIdToNavigate = pendingLessonId || nextLesson?._id;

        if (lessonIdToNavigate) {
            console.log(
                `✅ Attendance verified! Navigating to lesson: ${lessonIdToNavigate}`
            );
            navigate(`/user/courses/${courseId}/lesson/${lessonIdToNavigate}`);
            // Clear the stored lesson ID
            sessionStorage.removeItem("pendingLessonId");
        } else {
            console.log("❌ No lesson found after attendance verification");
        }
    };

    const handleStartLesson = async (lessonId) => {
        console.log("🎯 Starting lesson:", lessonId);

        if (!hasEnrolledFace) {
            // Show face enrollment modal first
            setShowFaceModal(true);
            return;
        }

        // Check if attendance already marked today
        const alreadyMarked = await checkTodayAttendance();

        if (alreadyMarked) {
            console.log(
                "✅ Attendance already marked today, proceeding directly to lesson"
            );
            // Navigate directly to lesson without face verification
            navigate(`/user/courses/${courseId}/lesson/${lessonId}`);
        } else {
            // Show attendance verification modal
            setShowAttendanceModal(true);
            // Store the lesson ID to navigate after successful verification
            sessionStorage.setItem("pendingLessonId", lessonId);
        }
    };

    const getNextAvailableLesson = () => {
        if (!enrollment || !course.lessons) return null;

        const completedLessons = enrollment.completedLessons || [];
        const nextLesson = course.lessons.find(
            (lesson) => !completedLessons.includes(lesson._id)
        );

        console.log("➡️ Next available lesson:", nextLesson);
        return nextLesson;
    };

    const getLessonStatus = (lessonId) => {
        if (!enrollment) return "locked";

        const completedLessons = enrollment.completedLessons || [];
        if (completedLessons.includes(lessonId)) {
            return "completed";
        }

        // Check if this is the next available lesson
        const nextLesson = getNextAvailableLesson();
        if (nextLesson && nextLesson._id === lessonId) {
            return "available";
        }

        // Check if previous lessons are completed
        const lessonIndex = course.lessons.findIndex(
            (lesson) => lesson._id === lessonId
        );
        if (lessonIndex > 0) {
            const prevLesson = course.lessons[lessonIndex - 1];
            if (completedLessons.includes(prevLesson._id)) {
                return "available";
            }
        }

        return lessonIndex === 0 ? "available" : "locked";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown";

        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    // Safe data access helpers
    const getCourseTitle = () => course?.title || "Untitled Course";
    const getCourseDescription = () =>
        course?.description || "No description available";
    const getCourseImage = () => course?.image || "";
    const getSkillLevel = () => course?.skillLevel || "All Levels";
    const getCategory = () => course?.category || "";
    const getDuration = () => course?.duration || "Self-paced";
    const getLessons = () => course?.lessons || [];
    const getOutcomes = () => course?.outcomes || [];
    const getRequirements = () => course?.requirements || [];

    if (loading) {
        return <CourseDetailSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50/60 py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ErrorState
                        message={error}
                        onRetry={() => window.location.reload()}
                    />
                </div>
            </div>
        );
    }

    if (!course || !enrollment) {
        return (
            <div className="min-h-screen bg-gray-50/60 py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ErrorState
                        message="Course not found"
                        onRetry={() => navigate("/user/courses")}
                    />
                </div>
            </div>
        );
    }

    const nextLesson = getNextAvailableLesson();
    const sortedLessons = getLessons().sort((a, b) => a.order - b.order) || [];
    const enrollmentDeadline = getEnrollmentDeadline(course);
    const courseAccessType = getCourseAccessType(course);

    return (
        <div className="min-h-screen bg-gray-50/60 py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Course Details
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Track your progress and continue learning
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
                            {/* Course Title & Description */}
                            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                                {getCourseTitle()}
                            </h1>

                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                {getCourseDescription()}
                            </p>

                            {/* Progress Section */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        Your Progress
                                    </span>
                                    <span className="text-sm font-bold text-blue-600">
                                        {enrollment.progress || 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${
                                                enrollment.progress || 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>
                                        {enrollment.completedLessonsCount || 0}{" "}
                                        completed
                                    </span>
                                    <span>
                                        {getLessons().length -
                                            (enrollment.completedLessonsCount ||
                                                0)}{" "}
                                        remaining
                                    </span>
                                </div>
                            </div>

                            {/* Continue Learning Button */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleContinueLearning}
                                    disabled={
                                        !nextLesson ||
                                        enrollment.status !== "active"
                                    }
                                    className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition ${
                                        !nextLesson ||
                                        enrollment.status !== "active"
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-xs"
                                    }`}
                                >
                                    {nextLesson
                                        ? "Continue Learning"
                                        : "Course Completed"}
                                </button>
                            </div>

                            {!hasEnrolledFace && (
                                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <div className="flex items-center text-yellow-800 text-sm">
                                        <Camera size={14} className="mr-2" />
                                        <span>
                                            Face enrollment required for
                                            attendance tracking
                                        </span>
                                    </div>
                                </div>
                            )}
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
                        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                Course Content
                            </h2>
                            <p className="text-gray-600 text-sm mb-4">
                                {sortedLessons.length} lessons •{" "}
                                {enrollment.completedLessonsCount || 0}{" "}
                                completed
                            </p>
                            <div className="space-y-3">
                                {sortedLessons.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Book
                                            size={48}
                                            className="text-gray-400 mx-auto mb-4"
                                        />
                                        <p className="text-gray-600 text-sm">
                                            No lessons available yet.
                                        </p>
                                    </div>
                                ) : (
                                    sortedLessons.map((lesson, index) => {
                                        const status = getLessonStatus(
                                            lesson._id
                                        );
                                        const isCompleted =
                                            status === "completed";
                                        const isAvailable =
                                            status === "available";
                                        const isLocked = status === "locked";

                                        return (
                                            <div
                                                key={lesson._id}
                                                className={`flex items-center justify-between p-4 rounded-lg border transition ${
                                                    isCompleted
                                                        ? "bg-green-50 border-green-200"
                                                        : isAvailable
                                                        ? "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
                                                        : "bg-gray-50 border-gray-200"
                                                }`}
                                            >
                                                <div className="flex items-center space-x-4 flex-1">
                                                    <div
                                                        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                                            isCompleted
                                                                ? "bg-green-100 text-green-600"
                                                                : isAvailable
                                                                ? "bg-blue-100 text-blue-600"
                                                                : "bg-gray-100 text-gray-400"
                                                        }`}
                                                    >
                                                        {isCompleted ? (
                                                            <Check size={16} />
                                                        ) : isAvailable ? (
                                                            <Play size={16} />
                                                        ) : (
                                                            <Lock size={16} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3
                                                            className={`font-medium text-sm ${
                                                                isCompleted
                                                                    ? "text-green-800"
                                                                    : isAvailable
                                                                    ? "text-gray-800"
                                                                    : "text-gray-500"
                                                            }`}
                                                        >
                                                            {lesson.title ||
                                                                "Untitled Lesson"}
                                                        </h3>
                                                        <p className="text-xs text-gray-500">
                                                            Lesson {index + 1} •{" "}
                                                            {lesson.duration ||
                                                                "Self-paced"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleStartLesson(
                                                            lesson._id
                                                        )
                                                    }
                                                    disabled={
                                                        !isAvailable ||
                                                        enrollment.status !==
                                                            "active"
                                                    }
                                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                                                        isCompleted
                                                            ? "bg-green-100 text-green-800 cursor-default"
                                                            : isAvailable &&
                                                              enrollment.status ===
                                                                  "active"
                                                            ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                    }`}
                                                >
                                                    {isCompleted
                                                        ? "Completed"
                                                        : isAvailable
                                                        ? "Start"
                                                        : "Locked"}
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Course Description */}
                        {course.description && (
                            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    About This Course
                                </h2>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {course.description}
                                </p>
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
                                        Enrolled
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {formatDate(enrollment.enrolledAt)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Access
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {enrollment.accessStatus ||
                                            enrollment.timeRemaining ||
                                            "Self-paced"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Level</span>
                                    <span className="font-medium text-gray-800">
                                        {getSkillLevel()}
                                    </span>
                                </div>
                                {enrollment.completedAt && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            Completed
                                        </span>
                                        <span className="font-medium text-gray-800">
                                            {new Date(
                                                enrollment.completedAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Face Recognition
                                    </span>
                                    <span
                                        className={`font-medium ${
                                            hasEnrolledFace
                                                ? "text-green-600"
                                                : "text-yellow-600"
                                        }`}
                                    >
                                        {hasEnrolledFace
                                            ? "Enrolled"
                                            : "Not Enrolled"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Stats */}
                        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-800 mb-4 text-sm">
                                Your Progress
                            </h3>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-2">
                                        <span className="text-xl font-bold text-blue-600">
                                            {enrollment.progress || 0}%
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Overall Progress
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-base font-bold text-gray-800">
                                            {enrollment.completedLessonsCount ||
                                                0}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Completed
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-base font-bold text-gray-800">
                                            {(enrollment.totalLessonsCount ||
                                                0) -
                                                (enrollment.completedLessonsCount ||
                                                    0)}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Remaining
                                        </div>
                                    </div>
                                </div>

                                {enrollment.status === "completed" && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                        <Award
                                            size={16}
                                            className="text-green-600 mx-auto mb-1"
                                        />
                                        <p className="text-sm font-medium text-green-800">
                                            Course Completed!
                                        </p>
                                        <p className="text-xs text-green-600 mt-1">
                                            {enrollment.completedAt
                                                ? `Completed on ${new Date(
                                                      enrollment.completedAt
                                                  ).toLocaleDateString()}`
                                                : "Congratulations!"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Face Enrollment Modal */}
            <FacialRecognitionModal
                isOpen={showFaceModal}
                onClose={() => setShowFaceModal(false)}
                onSuccess={handleFaceEnrollmentSuccess}
                courseId={courseId}
                lessonId={nextLesson?._id}
                courseTitle={getCourseTitle()}
                lessonTitle={nextLesson?.title || "Next Lesson"}
                isEnrollment={true}
            />

            {/* Attendance Verification Modal */}
            <FacialRecognitionModal
                isOpen={showAttendanceModal}
                onClose={() => setShowAttendanceModal(false)}
                onSuccess={handleAttendanceSuccess}
                courseId={courseId}
                lessonId={nextLesson?._id}
                courseTitle={getCourseTitle()}
                lessonTitle={nextLesson?.title || "Next Lesson"}
                isEnrollment={false}
            />
        </div>
    );
}

export default CourseDetail;
