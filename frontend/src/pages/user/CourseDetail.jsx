import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Clock, Book, ChevronLeft, Check, Play, Lock } from "react-feather";
import { useAuth } from "../../context/AuthContext";
import {
    getCourseById,
    getCompletions,
    completeLesson,
    markAttendance,
} from "../../services/authService";

function CourseDetail() {
    const { courseId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [completion, setCompletion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [cameraError, setCameraError] = useState(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const courseData = await getCourseById(courseId);
                if (!courseData) {
                    throw new Error("Course not found");
                }
                setCourse(courseData);

                if (user?._id) {
                    const completionsData = await getCompletions(user._id);
                    const userCompletion = completionsData.courses.find(
                        (c) =>
                            c.courseId === courseId && c.status === "approved"
                    );
                    setCompletion(
                        userCompletion || {
                            progress: 0,
                            timeRemaining: "30 days left",
                            completedLessons: [],
                        }
                    );
                }
            } catch (err) {
                console.error(
                    "Fetch error:",
                    err.response?.data || err.message
                );
                setError(
                    err.response?.data?.message ||
                        "Failed to load course details."
                );
            } finally {
                setLoading(false);
            }
        };

        if (user?._id && courseId) {
            fetchData();
        } else {
            setError("User or course ID not found.");
            setLoading(false);
        }
    }, [courseId, user]);

    useEffect(() => {
        if (isModalOpen) {
            // Start webcam
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                    setCameraError(null);
                })
                .catch((err) => {
                    console.error("Camera error:", err);
                    setCameraError(
                        "No camera detected. Please use a device with a camera or allow camera access."
                    );
                });
        } else {
            // Stop webcam when modal closes
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
        }

        // Cleanup on unmount
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
        };
    }, [isModalOpen]);

    const handleStartLesson = async (lessonId) => {
        setSelectedLessonId(lessonId);
        setIsModalOpen(true);
    };

    const handleVerifyAttendance = async () => {
        try {
            if (cameraError) {
                setError("Cannot verify attendance without camera access.");
                return;
            }
            await markAttendance(courseId, selectedLessonId, user._id);
            setIsModalOpen(false);
            navigate(`/user/courses/${courseId}/lesson/${selectedLessonId}`);
        } catch (err) {
            console.error(
                "Attendance error:",
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message || "Failed to mark attendance."
            );
        }
    };

    const handleCancelAttendance = () => {
        setIsModalOpen(false);
        setSelectedLessonId(null);
        setCameraError(null);
    };

    if (loading) {
        return (
            <div className="text-gray-600 text-center text-sm">Loading...</div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600 text-center text-sm">
                Error: {error}
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-gray-600 text-center text-sm">
                Course not found
            </div>
        );
    }

    const nextLesson = course.lessons.find(
        (lesson) => !completion.completedLessons.includes(lesson._id)
    );

    return (
        <div>
            {/* Course Header */}
            <section className="mb-8">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/3 min-h-0">
                            <img
                                src={course.image || "/default.png"}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="md:w-2/3 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <Link
                                        to="/user/courses"
                                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium mb-2"
                                    >
                                        <ChevronLeft
                                            size={16}
                                            className="mr-1"
                                        />
                                        Back to Courses
                                    </Link>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {course.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm mt-1">
                                        By FAST-C
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-800">
                                        {completion.progress}% Complete
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                                {course.description ||
                                    "No description available"}
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${completion.progress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <Clock
                                            size={16}
                                            className="text-gray-400 mr-2"
                                            aria-label="Time remaining"
                                        />
                                        <span className="text-gray-600 text-sm">
                                            {completion.timeRemaining}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Book
                                            size={16}
                                            className="text-gray-400 mr-2"
                                            aria-label="Lessons completed"
                                        />
                                        <span className="text-gray-600 text-sm">
                                            {completion.completedLessons.length}
                                            /{course.lessons.length} lessons
                                            completed
                                        </span>
                                    </div>
                                </div>
                                <button
                                    id="start-lesson-btn"
                                    className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                        !nextLesson
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : ""
                                    }`}
                                    aria-label="Start next lesson"
                                    disabled={!nextLesson}
                                    onClick={() =>
                                        nextLesson &&
                                        handleStartLesson(nextLesson._id)
                                    }
                                >
                                    {nextLesson
                                        ? "Start Next Lesson"
                                        : "All Lessons Completed"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Facial Recognition Modal */}
            {isModalOpen && (
                <div
                    id="attendance-modal"
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Verify Attendance
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Please position your face in the frame for
                            attendance verification.
                        </p>
                        <div
                            id="video-container"
                            className="h-48 rounded-lg overflow-hidden flex items-center justify-center"
                        >
                            {cameraError ? (
                                <p className="text-red-600 text-sm text-center px-4">
                                    {cameraError}
                                </p>
                            ) : (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    className="w-full h-full object-cover"
                                ></video>
                            )}
                        </div>
                        <div className="flex justify-end space-x-3 mt-4">
                            <button
                                id="cancel-scan"
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                aria-label="Cancel verification"
                                onClick={handleCancelAttendance}
                            >
                                Cancel
                            </button>
                            <button
                                id="confirm-scan"
                                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    cameraError
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : ""
                                }`}
                                aria-label="Verify attendance"
                                onClick={handleVerifyAttendance}
                                disabled={!!cameraError}
                            >
                                Verify
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Course Modules */}
            <section className="mb-8">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Course Modules
                        </h3>
                    </div>
                    <div className="p-6">
                        {course.lessons.length === 0 ? (
                            <p className="text-gray-600 text-sm text-center">
                                No lessons available
                            </p>
                        ) : (
                            <ul className="space-y-4">
                                {course.lessons
                                    .sort((a, b) => a.order - b.order)
                                    .map((lesson, index) => {
                                        const isCompleted =
                                            completion.completedLessons.includes(
                                                lesson._id
                                            );
                                        const isLocked =
                                            index >
                                            completion.completedLessons.length;
                                        return (
                                            <li
                                                key={lesson._id}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    {isCompleted ? (
                                                        <Check
                                                            size={20}
                                                            className="text-green-600"
                                                        />
                                                    ) : isLocked ? (
                                                        <Lock
                                                            size={20}
                                                            className="text-gray-400"
                                                        />
                                                    ) : (
                                                        <Play
                                                            size={20}
                                                            className="text-blue-600"
                                                        />
                                                    )}
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-800">
                                                            {lesson.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-600">
                                                            {lesson.duration}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                                        isCompleted
                                                            ? "bg-green-100 text-green-800 cursor-default"
                                                            : isLocked
                                                            ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                                    }`}
                                                    disabled={
                                                        isCompleted || isLocked
                                                    }
                                                    onClick={() =>
                                                        handleStartLesson(
                                                            lesson._id
                                                        )
                                                    }
                                                >
                                                    {isCompleted
                                                        ? "Completed"
                                                        : isLocked
                                                        ? "Locked"
                                                        : "Start"}
                                                </button>
                                            </li>
                                        );
                                    })}
                            </ul>
                        )}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="mb-8">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">
                            About This Course
                        </h3>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-600 text-sm mb-4">
                            {course.description || "No description available"}
                        </p>
                        <h4 className="text-sm font-medium text-gray-800 mb-2">
                            What You'll Learn
                        </h4>
                        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                            <li>
                                Core techniques for {course.title.toLowerCase()}
                            </li>
                            <li>Safety and best practices</li>
                            <li>Hands-on project skills</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default CourseDetail;
