import { useState, useRef, useEffect } from "react";
import {
    X,
    Book,
    Play,
    Users,
    Clock,
    Check,
    Edit,
    Award,
    BarChart2,
} from "react-feather";
import InfoField from "./InfoField";

const CourseDetailModal = ({
    isOpen,
    onClose,
    course,
    onStatusUpdate,
    onEdit,
}) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const modalRef = useRef(null);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !course) return null;

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "/default-course.jpg";
        if (imagePath.startsWith("http")) return imagePath;
        const backendUrl =
            import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        return imagePath.startsWith("/uploads/")
            ? `${backendUrl}${imagePath}`
            : `${backendUrl}/uploads/courses/${imagePath}`;
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            setUpdatingStatus(true);
            await onStatusUpdate(course._id, newStatus);
            onClose();
        } catch (error) {
            console.error("Status update error:", error);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleEditClick = () => {
        onClose();
        setTimeout(() => {
            onEdit(course);
        }, 100);
    };

    const getStatusConfig = (isActive) => {
        const configs = {
            true: {
                bg: "bg-green-100",
                text: "text-green-800",
                border: "border-green-200",
                label: "Active",
                icon: <Check size={14} className="mr-1" />,
            },
            false: {
                bg: "bg-gray-100",
                text: "text-gray-800",
                border: "border-gray-200",
                label: "Inactive",
                icon: <X size={14} className="mr-1" />,
            },
        };
        return configs[isActive] || configs.false;
    };

    const getLevelConfig = (level) => {
        const configs = {
            beginner: {
                bg: "bg-blue-100",
                text: "text-blue-800",
                label: "Beginner",
            },
            intermediate: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                label: "Intermediate",
            },
            advanced: {
                bg: "bg-red-100",
                text: "text-red-800",
                label: "Advanced",
            },
        };
        return configs[level] || configs.beginner;
    };

    const statusConfig = getStatusConfig(course.isActive);
    const levelConfig = getLevelConfig(course.skillLevel);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-300">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-300">
                                <Book size={20} className="text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Course Details
                            </h2>
                            <p className="text-sm text-gray-600">
                                {course.title}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-300">
                    <div className="flex px-4">
                        {[
                            { id: "overview", label: "Overview", icon: Book },
                            { id: "lessons", label: "Lessons", icon: Play },
                            { id: "details", label: "Details", icon: Award },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                                    activeTab === tab.id
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <tab.icon size={16} className="mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-4">
                    {activeTab === "overview" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                        Basic Information
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoField
                                            label="Title"
                                            value={course.title}
                                        />
                                        <InfoField
                                            label="Description"
                                            value={
                                                course.description ||
                                                "No description"
                                            }
                                        />
                                        <InfoField
                                            label="Category"
                                            value={course.category || "—"}
                                        />
                                        <InfoField
                                            label="Skill Level"
                                            value={
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${levelConfig.bg} ${levelConfig.text}`}
                                                >
                                                    {levelConfig.label}
                                                </span>
                                            }
                                        />
                                        <InfoField
                                            label="Status"
                                            value={
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                                                >
                                                    {statusConfig.icon}
                                                    {statusConfig.label}
                                                </span>
                                            }
                                        />
                                        <InfoField
                                            label="Duration"
                                            value={course.duration || "—"}
                                        />
                                        {course.tags &&
                                            course.tags.length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Tags
                                                    </label>
                                                    <div className="flex flex-wrap gap-1">
                                                        {course.tags.map(
                                                            (tag, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-3">
                                            Course Status
                                        </h3>
                                        <div className="space-y-2">
                                            {["active", "inactive"].map(
                                                (status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                status
                                                            )
                                                        }
                                                        disabled={
                                                            updatingStatus ||
                                                            (status ===
                                                                "active" &&
                                                                course.isActive) ||
                                                            (status ===
                                                                "inactive" &&
                                                                !course.isActive)
                                                        }
                                                        className={`w-full text-left p-3 rounded border transition-colors ${
                                                            (status ===
                                                                "active" &&
                                                                course.isActive) ||
                                                            (status ===
                                                                "inactive" &&
                                                                !course.isActive)
                                                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                                        } ${
                                                            updatingStatus
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : "cursor-pointer"
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium capitalize">
                                                                {status}
                                                            </span>
                                                            {(status ===
                                                                "active" &&
                                                                course.isActive) ||
                                                            (status ===
                                                                "inactive" &&
                                                                !course.isActive) ? (
                                                                <Check
                                                                    size={14}
                                                                    className="text-blue-600"
                                                                />
                                                            ) : null}
                                                        </div>
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Stats Section */}
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">
                                            Course Statistics
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">
                                                    Enrollments:
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                    {course.enrollmentCount ||
                                                        0}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">
                                                    Lessons:
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                    {course.lessons?.length ||
                                                        0}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">
                                                    Created:
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                    {new Date(
                                                        course.createdAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "lessons" && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">
                                Course Lessons
                            </h3>
                            {course.lessons?.length > 0 ? (
                                <div className="space-y-3">
                                    {course.lessons
                                        .sort((a, b) => a.order - b.order)
                                        .map((lesson, index) => (
                                            <div
                                                key={lesson._id || index}
                                                className="p-3 bg-gray-50 rounded border border-gray-300"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-medium text-gray-800">
                                                        {lesson.title ||
                                                            `Lesson ${
                                                                index + 1
                                                            }`}
                                                    </h4>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        {lesson.duration && (
                                                            <span className="flex items-center">
                                                                <Clock
                                                                    size={12}
                                                                    className="mr-1"
                                                                />
                                                                {
                                                                    lesson.duration
                                                                }
                                                            </span>
                                                        )}
                                                        {lesson.isRequired && (
                                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                                Required
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {lesson.content && (
                                                    <p className="text-gray-600 text-sm">
                                                        {lesson.content}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-6">
                                    No lessons added to this course yet.
                                </p>
                            )}
                        </div>
                    )}

                    {activeTab === "details" && (
                        <div className="space-y-4">
                            {/* Requirements */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Requirements
                                </h3>
                                {course.requirements?.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                                        {course.requirements.map(
                                            (requirement, index) => (
                                                <li key={index}>
                                                    {requirement}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">
                                        No requirements specified.
                                    </p>
                                )}
                            </div>

                            {/* Learning Outcomes */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Learning Outcomes
                                </h3>
                                {course.outcomes?.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                                        {course.outcomes.map(
                                            (outcome, index) => (
                                                <li key={index}>{outcome}</li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">
                                        No learning outcomes specified.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t border-gray-300 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleEditClick}
                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors cursor-pointer flex items-center"
                    >
                        <Edit size={14} className="mr-1" />
                        Edit Course
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailModal;
