import { useState, useRef, useEffect, useCallback } from "react";
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
    Briefcase,
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

    // Reset to overview tab when modal opens or enrollment changes
    useEffect(() => {
        if (isOpen && enrollment) {
            setActiveTab("overview");
        }
    }, [isOpen, enrollment]);

    // Handle body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

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

    const handleStatusUpdate = useCallback(
        async (newStatus) => {
            try {
                setUpdatingStatus(true);
                await onStatusUpdate(enrollment._id, newStatus);
                onClose();
            } catch (error) {
                console.error("Status update error:", error);
            } finally {
                setUpdatingStatus(false);
            }
        },
        [enrollment, onStatusUpdate, onClose]
    );

    const handleEditClick = useCallback(() => {
        onClose();
        setTimeout(() => {
            onEdit(enrollment);
        }, 100);
    }, [onClose, onEdit, enrollment]);

    const getStatusConfig = useCallback((status) => {
        const configs = {
            pending: {
                bg: "bg-amber-50",
                text: "text-amber-700",
                border: "border-amber-200",
                label: "Pending Approval",
                icon: <Clock size={14} className="mr-1" />,
            },
            active: {
                bg: "bg-emerald-50",
                text: "text-emerald-700",
                border: "border-emerald-200",
                label: "Active",
                icon: <Check size={14} className="mr-1" />,
            },
            completed: {
                bg: "bg-blue-50",
                text: "text-blue-700",
                border: "border-blue-200",
                label: "Completed",
                icon: <Award size={14} className="mr-1" />,
            },
            cancelled: {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
                label: "Cancelled",
                icon: <X size={14} className="mr-1" />,
            },
            expired: {
                bg: "bg-gray-50",
                text: "text-gray-700",
                border: "border-gray-200",
                label: "Expired",
                icon: <Clock size={14} className="mr-1" />,
            },
        };
        return configs[status] || configs.pending;
    }, []);

    const formatDate = useCallback((dateString) => {
        if (!dateString) return "—";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (error) {
            return "—";
        }
    }, []);

    const getUserDisplayName = useCallback((user) => {
        if (!user) return "Unknown User";
        if (user.role === "company") {
            return user.companyName || "Unnamed Company";
        }
        const firstName = user.firstName || "";
        const surname = user.surname || "";
        const fullName = `${firstName} ${surname}`.trim();
        return fullName || user.email || "Unknown User";
    }, []);

    // Early return for performance
    if (!isOpen || !enrollment) return null;

    const statusConfig = getStatusConfig(enrollment.status);
    const user = enrollment.user || {};
    const course = enrollment.course || {};

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col cursor-auto transform transition-all duration-200 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            {user.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-xl object-cover border border-gray-300"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                        const fallback =
                                            e.target.nextElementSibling;
                                        if (fallback)
                                            fallback.style.display = "flex";
                                    }}
                                />
                            ) : null}
                            <div
                                className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-300 ${
                                    user.profilePic ? "hidden" : "flex"
                                }`}
                            >
                                {user.role === "company" ? (
                                    <Briefcase
                                        size={20}
                                        className="text-gray-400"
                                    />
                                ) : (
                                    <User size={20} className="text-gray-400" />
                                )}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Enrollment Details
                            </h2>
                            <p className="text-sm text-gray-600">
                                {getUserDisplayName(user)} - {course.title}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex px-6">
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
                                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 cursor-pointer ${
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
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Basic Information
                                </h3>
                                <div className="space-y-4">
                                    <InfoField
                                        label="User"
                                        value={getUserDisplayName(user)}
                                    />
                                    <InfoField
                                        label="Email"
                                        value={user.email || "—"}
                                    />
                                    <InfoField
                                        label="User Role"
                                        value={
                                            <span className="capitalize text-gray-900">
                                                {user.role || "—"}
                                            </span>
                                        }
                                    />
                                    <InfoField
                                        label="Course"
                                        value={course.title || "—"}
                                    />
                                    <InfoField
                                        label="Course Category"
                                        value={course.category || "—"}
                                    />
                                    <InfoField
                                        label="Skill Level"
                                        value={
                                            <span className="capitalize text-gray-900">
                                                {course.skillLevel || "—"}
                                            </span>
                                        }
                                    />
                                    <InfoField
                                        label="Enrollment Status"
                                        value={
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                                            >
                                                {statusConfig.icon}
                                                {statusConfig.label}
                                            </span>
                                        }
                                    />
                                    {user.contactNumber && (
                                        <InfoField
                                            label="Contact Number"
                                            value={user.contactNumber}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Enrollment Status */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Enrollment Status
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        {
                                            status: "pending",
                                            label: "Pending",
                                            description:
                                                "Awaiting approval or activation",
                                        },
                                        {
                                            status: "active",
                                            label: "Active",
                                            description:
                                                "Currently enrolled and active",
                                        },
                                        {
                                            status: "completed",
                                            label: "Completed",
                                            description:
                                                "Successfully finished the course",
                                        },
                                        {
                                            status: "cancelled",
                                            label: "Cancelled",
                                            description:
                                                "Enrollment was cancelled",
                                        },
                                        {
                                            status: "expired",
                                            label: "Expired",
                                            description:
                                                "Access period has ended",
                                        },
                                    ].map((statusOption) => (
                                        <button
                                            key={statusOption.status}
                                            onClick={() =>
                                                handleStatusUpdate(
                                                    statusOption.status
                                                )
                                            }
                                            disabled={
                                                updatingStatus ||
                                                enrollment.status ===
                                                    statusOption.status
                                            }
                                            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                                                enrollment.status ===
                                                statusOption.status
                                                    ? "bg-blue-50 border-blue-200 text-blue-700"
                                                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                            } ${
                                                updatingStatus
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "cursor-pointer"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="font-medium capitalize">
                                                        {statusOption.label}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {
                                                            statusOption.description
                                                        }
                                                    </div>
                                                </div>
                                                {enrollment.status ===
                                                    statusOption.status && (
                                                    <Check
                                                        size={16}
                                                        className="text-blue-600 flex-shrink-0 ml-2"
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
                        <div className="space-y-6">
                            {/* Progress Overview */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Progress Overview
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-700">
                                            Overall Progress
                                        </span>
                                        <span className="text-lg font-bold text-blue-600">
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
                                </div>
                            </div>

                            {/* Progress Details */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Progress Details
                                </h3>
                                <div className="space-y-4">
                                    <InfoField
                                        label="Enrolled Date"
                                        value={formatDate(
                                            enrollment.enrolledAt
                                        )}
                                    />
                                    {enrollment.accessUntil && (
                                        <InfoField
                                            label="Access Until"
                                            value={formatDate(
                                                enrollment.accessUntil
                                            )}
                                        />
                                    )}
                                    {enrollment.completedAt && (
                                        <InfoField
                                            label="Completed Date"
                                            value={formatDate(
                                                enrollment.completedAt
                                            )}
                                        />
                                    )}
                                    <InfoField
                                        label="Last Accessed"
                                        value={
                                            enrollment.lastAccessedAt
                                                ? formatDate(
                                                      enrollment.lastAccessedAt
                                                  )
                                                : "Never"
                                        }
                                    />
                                    <InfoField
                                        label="Completed Lessons"
                                        value={
                                            enrollment.completedLessons
                                                ?.length || 0
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "details" && (
                        <div className="space-y-6">
                            {/* Technical Information */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Technical Information
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600 font-medium">
                                                Enrollment ID
                                            </p>
                                            <p className="font-mono text-xs text-gray-900 break-all mt-1">
                                                {enrollment._id}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 font-medium">
                                                User ID
                                            </p>
                                            <p className="font-mono text-xs text-gray-900 break-all mt-1">
                                                {user._id}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 font-medium">
                                                Course ID
                                            </p>
                                            <p className="font-mono text-xs text-gray-900 break-all mt-1">
                                                {course._id}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 font-medium">
                                                Created
                                            </p>
                                            <p className="font-medium text-gray-900 mt-1">
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
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    System Information
                                </h3>
                                <div className="space-y-3">
                                    <InfoField
                                        label="Last Updated"
                                        value={
                                            enrollment.updatedAt
                                                ? formatDate(
                                                      enrollment.updatedAt
                                                  )
                                                : "Never"
                                        }
                                    />
                                    {enrollment.lastAccessedLesson && (
                                        <InfoField
                                            label="Last Lesson Accessed"
                                            value={
                                                enrollment.lastAccessedLesson
                                                    ?.title || "—"
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleEditClick}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer flex items-center"
                    >
                        <Edit size={16} className="mr-2" />
                        Edit Enrollment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentDetailModal;
