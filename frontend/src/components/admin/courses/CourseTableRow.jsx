import { useState, useEffect, useRef, useCallback } from "react";
import {
    Book,
    Eye,
    MoreVertical,
    Check,
    X,
    Edit,
    Trash2,
    Users,
    Play,
} from "react-feather";

const CourseTableRow = ({
    course,
    isSelected,
    onSelect,
    onView,
    onEdit,
    onStatusUpdate,
    onDelete,
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
                await onStatusUpdate(course._id, newStatus);
                setShowActions(false);
            } catch (error) {
                console.error("Status update error:", error);
            } finally {
                setIsUpdating(false);
            }
        },
        [course._id, onStatusUpdate]
    );

    const getStatusConfig = (isActive) => {
        const configs = {
            true: {
                bg: "bg-emerald-50",
                text: "text-emerald-700",
                border: "border-emerald-200",
                label: "Active",
            },
            false: {
                bg: "bg-gray-100",
                text: "text-gray-800",
                border: "border-gray-200",
                label: "Inactive",
            },
        };
        return configs[isActive] || configs.false;
    };

    const getLevelConfig = (level) => {
        const configs = {
            beginner: {
                bg: "bg-blue-50",
                text: "text-blue-800",
                label: "Beginner",
                border: "border-blue-200",
            },
            intermediate: {
                bg: "bg-yellow-50",
                text: "text-yellow-800",
                label: "Intermediate",
                border: "border-blue-200",
            },
            advanced: {
                bg: "bg-red-50",
                text: "text-red-800",
                label: "Advanced",
                border: "border-blue-200",
            },
        };
        return configs[level] || configs.beginner;
    };

    const statusConfig = getStatusConfig(course.isActive);
    const levelConfig = getLevelConfig(course.skillLevel);

    // Subtle alternating row colors for better readability
    const rowBgColor = rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50";

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

            {/* Course Info */}
            <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center group">
                    <div className="shrink-0 w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 group-hover:shadow-xs transition-shadow">
                        {course.image ? (
                            <img
                                src={course.image}
                                alt="Course"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        ) : (
                            <Book size={16} className="text-gray-400" />
                        )}
                    </div>
                    <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-40 group-hover:text-gray-700 transition-colors">
                            {course.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-40">
                            {course.description}
                        </div>
                    </div>
                </div>
            </td>

            {/* Category */}
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                {course.category || "—"}
            </td>

            {/* Level */}
            <td className="px-4 py-4 whitespace-nowrap">
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${levelConfig.bg} ${levelConfig.text} ${levelConfig.border}`}
                >
                    {levelConfig.label}
                </span>
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

            {/* Enrollments */}
            <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                <div className="flex items-center">
                    <Users size={14} className="mr-1 text-gray-400" />
                    {course.enrollmentCount || 0}
                </div>
            </td>

            {/* Lessons */}
            <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                <div className="flex items-center">
                    <Play size={14} className="mr-1 text-gray-400" />
                    {course.lessons?.length || 0}
                </div>
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
                            <div className="absolute right-0 z-20 w-48 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg shadow-gray-200/50 ring-1 ring-black ring-opacity-5 py-1 animate-in fade-in-0 zoom-in-95">
                                {/* Quick Status Updates */}
                                {!course.isActive && (
                                    <button
                                        onClick={() =>
                                            handleStatusUpdate("active")
                                        }
                                        disabled={isUpdating}
                                        className="flex items-center w-full px-3 py-2 text-sm text-emerald-700 transition-all duration-150 hover:bg-emerald-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <Check
                                            size={14}
                                            className="mr-2 group-hover:scale-110 transition-transform"
                                        />
                                        {isUpdating
                                            ? "Updating..."
                                            : "Activate Course"}
                                    </button>
                                )}
                                {course.isActive && (
                                    <button
                                        onClick={() =>
                                            handleStatusUpdate("inactive")
                                        }
                                        disabled={isUpdating}
                                        className="flex items-center w-full px-3 py-2 text-sm text-red-700 transition-all duration-150 hover:bg-red-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <X
                                            size={14}
                                            className="mr-2 group-hover:scale-110 transition-transform"
                                        />
                                        {isUpdating
                                            ? "Updating..."
                                            : "Deactivate Course"}
                                    </button>
                                )}

                                {(course.isActive || !course.isActive) && (
                                    <div className="border-t border-gray-100 my-1"></div>
                                )}

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
                                    Edit Course
                                </button>

                                <div className="border-t border-gray-100 my-1"></div>

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
                                    Delete Course
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default CourseTableRow;
