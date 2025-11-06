import { useState, useEffect, useRef, useCallback } from "react";
import {
    User,
    Book,
    Eye,
    MoreVertical,
    Check,
    X,
    Edit,
    Trash2,
    Clock,
    Award,
    AlertCircle,
} from "react-feather";

const EnrollmentTableRow = ({
    enrollment,
    isSelected,
    onSelect,
    onView,
    onEdit,
    onStatusUpdate,
    onDelete,
    onApproveEnrollment, // 🆕 NEW
    rowIndex,
}) => {
    const [showActions, setShowActions] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const actionsRef = useRef(null);

    // Close actions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                actionsRef.current &&
                !actionsRef.current.contains(event.target)
            ) {
                setShowActions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleStatusUpdate = useCallback(
        async (newStatus) => {
            setIsUpdating(true);
            try {
                await onStatusUpdate(enrollment._id, newStatus);
                setShowActions(false);
            } catch (error) {
                console.error("Status update error:", error);
            } finally {
                setIsUpdating(false);
            }
        },
        [enrollment._id, onStatusUpdate]
    );

    // 🆕 NEW: Handle approve action
    const handleApprove = useCallback(async () => {
        setIsUpdating(true);
        try {
            await onApproveEnrollment(enrollment._id);
            setShowActions(false);
        } catch (error) {
            console.error("Approve enrollment error:", error);
        } finally {
            setIsUpdating(false);
        }
    }, [enrollment._id, onApproveEnrollment]);

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                bg: "bg-amber-50",
                text: "text-amber-700",
                border: "border-amber-200",
                label: "Pending",
            },
            active: {
                bg: "bg-emerald-50",
                text: "text-emerald-700",
                border: "border-emerald-200",
                label: "Active",
            },
            completed: {
                bg: "bg-blue-50",
                text: "text-blue-700",
                border: "border-blue-200",
                label: "Completed",
            },
            cancelled: {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
                label: "Cancelled",
            },
            expired: {
                bg: "bg-gray-50",
                text: "text-gray-700",
                border: "border-gray-200",
                label: "Expired",
            },
        };
        return configs[status] || configs.pending;
    };

    const statusConfig = getStatusConfig(enrollment.status);

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (error) {
            return "—";
        }
    };

    const getUserDisplayName = (user) => {
        // Handle null or undefined user
        if (!user) return "Unknown User";

        // Handle company role
        if (user.role === "company") {
            return user.companyName || "Unnamed Company";
        }

        // Handle individual user
        const firstName = user.firstName || "";
        const surname = user.surname || "";
        const fullName = `${firstName} ${surname}`.trim();

        return fullName || user.email || "Unknown User";
    };

    const getSafeUser = () => {
        return enrollment.user || {};
    };

    const getSafeCourse = () => {
        return enrollment.course || {};
    };

    const user = getSafeUser();
    const course = getSafeCourse();

    return (
        <tr
            className={`border-b border-gray-100 transition-all duration-200 ${
                isSelected
                    ? "bg-blue-50 hover:bg-blue-100"
                    : "hover:bg-gray-50/80"
            } ${isUpdating ? "opacity-60" : ""}`}
        >
            {/* Checkbox */}
            <td className="pl-6 pr-4 py-4 whitespace-nowrap">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelect}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-blue-500 focus:ring-2 focus:ring-offset-1 transition-colors"
                />
            </td>

            {/* User Info */}
            <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center group">
                    <div className="shrink-0 w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 group-hover:shadow-xs transition-shadow">
                        {user?.profilePic ? (
                            <img
                                src={user.profilePic}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        ) : (
                            <User size={16} className="text-gray-400" />
                        )}
                    </div>
                    <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[140px] group-hover:text-gray-700 transition-colors">
                            {getUserDisplayName(user)}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[140px]">
                            {user?.email || "No email"}
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                            {user?.role || "unknown"}
                        </div>
                    </div>
                </div>
            </td>

            {/* Course Info */}
            <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center group">
                    <div className="shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 mr-3 group-hover:shadow-xs transition-shadow">
                        <Book size={14} className="text-gray-400" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-40 group-hover:text-gray-700 transition-colors">
                            {course?.title || "Unknown Course"}
                        </div>
                        <div className="text-xs text-gray-500">
                            {course?.category || "—"}
                        </div>
                    </div>
                </div>
            </td>

            {/* Status */}
            <td className="px-4 py-4 whitespace-nowrap">
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                >
                    {statusConfig.icon}
                    {statusConfig.label}
                </span>
            </td>

            {/* Progress */}
            <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${enrollment.progress || 0}%` }}
                        ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                        {enrollment.progress || 0}%
                    </span>
                </div>
            </td>

            {/* Enrolled Date */}
            <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                {formatDate(enrollment.enrolledAt)}
            </td>

            {/* Access Until */}
            <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                {enrollment.accessUntil
                    ? formatDate(enrollment.accessUntil)
                    : "—"}
            </td>

            {/* Actions */}
            <td className="pr-6 pl-4 py-4 whitespace-nowrap">
                <div
                    className="flex items-center justify-end gap-1"
                    ref={actionsRef}
                >
                    {/* Quick View Button */}
                    <button
                        onClick={onView}
                        disabled={isUpdating}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>

                    {/* Actions Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowActions(!showActions)}
                            disabled={isUpdating}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
                        >
                            <MoreVertical size={16} />
                        </button>

                        {showActions && (
                            <div className="absolute right-0 z-20 w-56 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg shadow-gray-200/50 ring-1 ring-black ring-opacity-5 py-1 animate-in fade-in-0 zoom-in-95">
                                {/* 🆕 NEW: Approve Action for Pending Enrollments */}
                                {enrollment.status === "pending" && (
                                    <>
                                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Approval Action
                                        </div>
                                        <button
                                            onClick={handleApprove}
                                            disabled={isUpdating}
                                            className="flex items-center w-full px-3 py-2 text-sm text-green-700 transition-all duration-150 hover:bg-green-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            <Check
                                                size={14}
                                                className="mr-2 group-hover:scale-110 transition-transform"
                                            />
                                            {isUpdating
                                                ? "Approving..."
                                                : "Approve Enrollment"}
                                        </button>
                                        <div className="border-t border-gray-100 my-1"></div>
                                    </>
                                )}

                                {/* Status Update Section */}
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Update Status
                                </div>

                                {/* Pending Status */}
                                {enrollment.status !== "pending" && (
                                    <button
                                        onClick={() =>
                                            handleStatusUpdate("pending")
                                        }
                                        disabled={isUpdating}
                                        className="flex items-center w-full px-3 py-2 text-sm text-amber-700 transition-all duration-150 hover:bg-amber-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <Clock
                                            size={14}
                                            className="mr-2 group-hover:scale-110 transition-transform"
                                        />
                                        {isUpdating
                                            ? "Updating..."
                                            : "Set as Pending"}
                                    </button>
                                )}

                                {/* Completed Status */}
                                {enrollment.status !== "completed" && (
                                    <button
                                        onClick={() =>
                                            handleStatusUpdate("completed")
                                        }
                                        disabled={isUpdating}
                                        className="flex items-center w-full px-3 py-2 text-sm text-blue-700 transition-all duration-150 hover:bg-blue-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <Award
                                            size={14}
                                            className="mr-2 group-hover:scale-110 transition-transform"
                                        />
                                        {isUpdating
                                            ? "Updating..."
                                            : "Mark Complete"}
                                    </button>
                                )}

                                {/* Cancelled Status */}
                                {enrollment.status !== "cancelled" && (
                                    <button
                                        onClick={() =>
                                            handleStatusUpdate("cancelled")
                                        }
                                        disabled={isUpdating}
                                        className="flex items-center w-full px-3 py-2 text-sm text-red-700 transition-all duration-150 hover:bg-red-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <X
                                            size={14}
                                            className="mr-2 group-hover:scale-110 transition-transform"
                                        />
                                        {isUpdating ? "Updating..." : "Cancel"}
                                    </button>
                                )}

                                {/* Expired Status */}
                                {enrollment.status !== "expired" && (
                                    <button
                                        onClick={() =>
                                            handleStatusUpdate("expired")
                                        }
                                        disabled={isUpdating}
                                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 transition-all duration-150 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <AlertCircle
                                            size={14}
                                            className="mr-2 group-hover:scale-110 transition-transform"
                                        />
                                        {isUpdating
                                            ? "Updating..."
                                            : "Mark as Expired"}
                                    </button>
                                )}

                                <div className="border-t border-gray-100 my-1"></div>

                                {/* Edit Enrollment */}
                                <button
                                    onClick={() => {
                                        onEdit();
                                        setShowActions(false);
                                    }}
                                    disabled={isUpdating}
                                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 transition-all duration-150 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    <Edit
                                        size={14}
                                        className="mr-2 group-hover:scale-110 transition-transform"
                                    />
                                    Edit Enrollment
                                </button>

                                <div className="border-t border-gray-100 my-1"></div>

                                {/* Delete Enrollment */}
                                <button
                                    onClick={() => {
                                        onDelete();
                                        setShowActions(false);
                                    }}
                                    disabled={isUpdating}
                                    className="flex items-center w-full px-3 py-2 text-sm text-red-700 transition-all duration-150 hover:bg-red-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    <Trash2
                                        size={14}
                                        className="mr-2 group-hover:scale-110 transition-transform"
                                    />
                                    Delete Enrollment
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default EnrollmentTableRow;
