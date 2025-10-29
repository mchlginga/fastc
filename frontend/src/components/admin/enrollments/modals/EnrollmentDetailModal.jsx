import { useState, useRef, useEffect } from "react";
import {
    X,
    User,
    Book,
    Clock,
    Check,
    Edit,
    Award,
    BarChart2,
    Calendar,
} from "react-feather";
import InfoField from "./InfoField";

const EnrollmentDetailModal = ({
    isOpen,
    onClose,
    enrollment,
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

    if (!isOpen || !enrollment) return null;

    const getProfilePicUrl = (profilePicPath) => {
        if (!profilePicPath) return null;
        if (profilePicPath.startsWith("http")) return profilePicPath;
        const backendUrl =
            import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        return profilePicPath.startsWith("/uploads/")
            ? `${backendUrl}${profilePicPath}`
            : `${backendUrl}/uploads/profiles/${profilePicPath}`;
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            setUpdatingStatus(true);
            await onStatusUpdate(enrollment._id, newStatus);
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
            onEdit(enrollment);
        }, 100);
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                border: "border-yellow-200",
                label: "Pending Approval",
                icon: <Clock size={14} className="mr-1" />,
            },
            active: {
                bg: "bg-green-100",
                text: "text-green-800",
                border: "border-green-200",
                label: "Active",
                icon: <Check size={14} className="mr-1" />,
            },
            completed: {
                bg: "bg-blue-100",
                text: "text-blue-800",
                border: "border-blue-200",
                label: "Completed",
                icon: <Award size={14} className="mr-1" />,
            },
            cancelled: {
                bg: "bg-red-100",
                text: "text-red-800",
                border: "border-red-200",
                label: "Cancelled",
                icon: <X size={14} className="mr-1" />,
            },
            expired: {
                bg: "bg-gray-100",
                text: "text-gray-800",
                border: "border-gray-200",
                label: "Expired",
                icon: <Clock size={14} className="mr-1" />,
            },
        };
        return configs[status] || configs.pending;
    };

    const statusConfig = getStatusConfig(enrollment.status);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getUserDisplayName = (user) => {
        if (user.role === "company") {
            return user.companyName;
        }
        return `${user.firstName} ${user.surname}`;
    };

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
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300">
                                <User size={20} className="text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Enrollment Details
                            </h2>
                            <p className="text-sm text-gray-600">
                                {getUserDisplayName(enrollment.user)} -{" "}
                                {enrollment.course?.title}
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
                            { id: "overview", label: "Overview", icon: User },
                            {
                                id: "progress",
                                label: "Progress",
                                icon: BarChart2,
                            },
                            { id: "details", label: "Details", icon: Book },
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
                                        User Information
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoField
                                            label="Name"
                                            value={getUserDisplayName(
                                                enrollment.user
                                            )}
                                        />
                                        <InfoField
                                            label="Email"
                                            value={enrollment.user?.email}
                                        />
                                        <InfoField
                                            label="Role"
                                            value={
                                                <span className="capitalize">
                                                    {enrollment.user?.role}
                                                </span>
                                            }
                                        />
                                        {enrollment.user?.contactNumber && (
                                            <InfoField
                                                label="Contact"
                                                value={
                                                    enrollment.user
                                                        ?.contactNumber
                                                }
                                            />
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                        Course Information
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoField
                                            label="Course Title"
                                            value={enrollment.course?.title}
                                        />
                                        <InfoField
                                            label="Category"
                                            value={enrollment.course?.category}
                                        />
                                        <InfoField
                                            label="Skill Level"
                                            value={
                                                <span className="capitalize">
                                                    {
                                                        enrollment.course
                                                            ?.skillLevel
                                                    }
                                                </span>
                                            }
                                        />
                                        <InfoField
                                            label="Duration"
                                            value={enrollment.course?.duration}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Enrollment Status */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Enrollment Status
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        "pending",
                                        "active",
                                        "completed",
                                        "cancelled",
                                    ].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() =>
                                                handleStatusUpdate(status)
                                            }
                                            disabled={
                                                updatingStatus ||
                                                enrollment.status === status
                                            }
                                            className={`w-full text-left p-3 rounded border transition-colors ${
                                                enrollment.status === status
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
                                                {enrollment.status ===
                                                    status && (
                                                    <Check
                                                        size={14}
                                                        className="text-blue-600"
                                                    />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "progress" && (
                        <div className="space-y-4">
                            {/* Progress Overview */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Progress Overview
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            Overall Progress
                                        </span>
                                        <span className="text-lg font-bold text-blue-600">
                                            {enrollment.progress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div
                                            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${enrollment.progress}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">
                                        Enrollment Dates
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Enrolled:
                                            </span>
                                            <span className="font-medium">
                                                {formatDate(
                                                    enrollment.enrolledAt
                                                )}
                                            </span>
                                        </div>
                                        {enrollment.accessUntil && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Access Until:
                                                </span>
                                                <span className="font-medium">
                                                    {formatDate(
                                                        enrollment.accessUntil
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        {enrollment.completedAt && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Completed:
                                                </span>
                                                <span className="font-medium">
                                                    {formatDate(
                                                        enrollment.completedAt
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">
                                        Course Statistics
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Status:
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                                            >
                                                {statusConfig.icon}
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Last Accessed:
                                            </span>
                                            <span className="font-medium">
                                                {enrollment.lastAccessedAt
                                                    ? formatDate(
                                                          enrollment.lastAccessedAt
                                                      )
                                                    : "Never"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Completed Lessons:
                                            </span>
                                            <span className="font-medium">
                                                {enrollment.completedLessons
                                                    ?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "details" && (
                        <div className="space-y-4">
                            {/* Technical Details */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Technical Information
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">
                                                Enrollment ID
                                            </p>
                                            <p className="font-mono text-xs">
                                                {enrollment._id}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">
                                                User ID
                                            </p>
                                            <p className="font-mono text-xs">
                                                {enrollment.user?._id}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">
                                                Course ID
                                            </p>
                                            <p className="font-mono text-xs">
                                                {enrollment.course?._id}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">
                                                Created
                                            </p>
                                            <p className="font-medium">
                                                {formatDate(
                                                    enrollment.createdAt
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* System Information */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    System Information
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">
                                            Last Updated:
                                        </span>
                                        <span className="font-medium">
                                            {enrollment.updatedAt
                                                ? formatDate(
                                                      enrollment.updatedAt
                                                  )
                                                : "Never"}
                                        </span>
                                    </div>
                                    {enrollment.lastAccessedLesson && (
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">
                                                Last Lesson:
                                            </span>
                                            <span className="font-medium">
                                                {
                                                    enrollment
                                                        .lastAccessedLesson
                                                        ?.title
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>
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
                        Edit Enrollment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentDetailModal;
