import { useState, useEffect, useRef } from "react";
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
} from "react-feather";

const EnrollmentTableRow = ({
    enrollment,
    isSelected,
    onSelect,
    onView,
    onEdit,
    onStatusUpdate,
    onDelete,
    rowIndex,
}) => {
    const [showActions, setShowActions] = useState(false);
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

    const getProfilePicUrl = (profilePicPath) => {
        if (!profilePicPath) return null;
        if (profilePicPath.startsWith("http")) return profilePicPath;
        const backendUrl =
            import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        return profilePicPath.startsWith("/uploads/")
            ? `${backendUrl}${profilePicPath}`
            : `${backendUrl}/uploads/profiles/${profilePicPath}`;
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                label: "Pending",
                icon: <Clock size={12} className="mr-1" />,
            },
            active: {
                bg: "bg-green-100",
                text: "text-green-800",
                label: "Active",
                icon: <Check size={12} className="mr-1" />,
            },
            completed: {
                bg: "bg-blue-100",
                text: "text-blue-800",
                label: "Completed",
                icon: <Award size={12} className="mr-1" />,
            },
            cancelled: {
                bg: "bg-red-100",
                text: "text-red-800",
                label: "Cancelled",
                icon: <X size={12} className="mr-1" />,
            },
            expired: {
                bg: "bg-gray-100",
                text: "text-gray-800",
                label: "Expired",
                icon: <Clock size={12} className="mr-1" />,
            },
        };
        return configs[status] || configs.pending;
    };

    const statusConfig = getStatusConfig(enrollment.status);

    // Subtle alternating row colors for better readability
    const rowBgColor = rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50";

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        try {
            return new Date(dateString).toLocaleDateString();
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
            className={`${rowBgColor} hover:bg-blue-200/30 transition-colors group`}
        >
            {/* Checkbox */}
            <td className="px-4 py-3 whitespace-nowrap">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelect}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-blue-500"
                />
            </td>

            {/* User Info */}
            <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                        {getProfilePicUrl(user?.profilePic) ? (
                            <img
                                src={getProfilePicUrl(user?.profilePic)}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={18} className="text-gray-400" />
                        )}
                    </div>
                    <div className="ml-3">
                        <div className="text-sm font-semibold text-gray-900 truncate max-w-[140px]">
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
            <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded flex items-center justify-center border border-gray-200 mr-3">
                        <Book size={14} className="text-gray-400" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[160px]">
                            {course?.title || "Unknown Course"}
                        </div>
                        <div className="text-xs text-gray-500">
                            {course?.category || "—"}
                        </div>
                    </div>
                </div>
            </td>

            {/* Status */}
            <td className="px-4 py-3 whitespace-nowrap">
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                >
                    {statusConfig.icon}
                    {statusConfig.label}
                </span>
            </td>

            {/* Progress */}
            <td className="px-4 py-3 whitespace-nowrap">
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
            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                {formatDate(enrollment.enrolledAt)}
            </td>

            {/* Access Until */}
            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                {enrollment.accessUntil
                    ? formatDate(enrollment.accessUntil)
                    : "—"}
            </td>

            {/* Actions */}
            <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center space-x-2" ref={actionsRef}>
                    {/* Quick View Button - Always Visible */}
                    <button
                        onClick={onView}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer p-2 rounded-lg hover:bg-blue-100 transition-all duration-200"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>

                    {/* Actions Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowActions(!showActions)}
                            className="text-gray-500 hover:text-gray-700 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                        >
                            <MoreVertical size={16} />
                        </button>

                        {showActions && (
                            <div className="absolute right-0 z-20 w-48 mt-1 bg-white border rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                {/* Quick Status Updates */}
                                {enrollment.status !== "active" && (
                                    <button
                                        onClick={() => {
                                            onStatusUpdate(
                                                enrollment._id,
                                                "active"
                                            );
                                            setShowActions(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-green-700 transition-colors hover:bg-green-50 cursor-pointer"
                                    >
                                        <Check size={14} className="mr-2" />
                                        Activate
                                    </button>
                                )}
                                {enrollment.status !== "completed" && (
                                    <button
                                        onClick={() => {
                                            onStatusUpdate(
                                                enrollment._id,
                                                "completed"
                                            );
                                            setShowActions(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-blue-700 transition-colors hover:bg-blue-50 cursor-pointer"
                                    >
                                        <Award size={14} className="mr-2" />
                                        Mark Complete
                                    </button>
                                )}
                                {enrollment.status !== "cancelled" && (
                                    <button
                                        onClick={() => {
                                            onStatusUpdate(
                                                enrollment._id,
                                                "cancelled"
                                            );
                                            setShowActions(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-700 transition-colors hover:bg-red-50 cursor-pointer"
                                    >
                                        <X size={14} className="mr-2" />
                                        Cancel
                                    </button>
                                )}

                                <div className="border-t border-gray-100"></div>

                                <button
                                    onClick={() => {
                                        onEdit();
                                        setShowActions(false);
                                    }}
                                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer"
                                >
                                    <Edit size={14} className="mr-2" />
                                    Edit Enrollment
                                </button>

                                <div className="border-t border-gray-100"></div>

                                <button
                                    onClick={() => {
                                        onDelete();
                                        setShowActions(false);
                                    }}
                                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-700 transition-colors hover:bg-red-50 cursor-pointer"
                                >
                                    <Trash2 size={14} className="mr-2" />
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