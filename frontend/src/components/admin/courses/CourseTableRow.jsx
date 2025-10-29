import { useState, useEffect, useRef } from "react";
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

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "/default-course.jpg";
        if (imagePath.startsWith("http")) return imagePath;
        const backendUrl =
            import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        return imagePath.startsWith("/uploads/")
            ? `${backendUrl}${imagePath}`
            : `${backendUrl}/uploads/courses/${imagePath}`;
    };

    const getStatusConfig = (isActive) => {
        const configs = {
            true: {
                bg: "bg-green-100",
                text: "text-green-800",
                label: "Active",
                icon: <Check size={12} className="mr-1" />,
            },
            false: {
                bg: "bg-gray-100",
                text: "text-gray-800",
                label: "Inactive",
                icon: <X size={12} className="mr-1" />,
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

    // Subtle alternating row colors for better readability
    const rowBgColor = rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50";

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

            {/* Course Info */}
            <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                        {course.image ? (
                            <img
                                src={getImageUrl(course.image)}
                                alt="Course"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Book size={18} className="text-gray-400" />
                        )}
                    </div>
                    <div className="ml-3">
                        <div className="text-sm font-semibold text-gray-900 truncate max-w-[160px]">
                            {course.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[160px]">
                            {course.description}
                        </div>
                    </div>
                </div>
            </td>

            {/* Category */}
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {course.category || "—"}
            </td>

            {/* Level */}
            <td className="px-4 py-3 whitespace-nowrap">
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${levelConfig.bg} ${levelConfig.text}`}
                >
                    {levelConfig.label}
                </span>
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

            {/* Enrollments */}
            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                <div className="flex items-center">
                    <Users size={14} className="mr-1 text-gray-400" />
                    {course.enrollmentCount || 0}
                </div>
            </td>

            {/* Lessons */}
            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                <div className="flex items-center">
                    <Play size={14} className="mr-1 text-gray-400" />
                    {course.lessons?.length || 0}
                </div>
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
                            <div className="absolute p-1 right-0 z-20 w-48 mt-1 bg-white border rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                {/* Quick Status Updates */}
                                {!course.isActive && (
                                    <button
                                        onClick={() => {
                                            onStatusUpdate(
                                                course._id,
                                                "active"
                                            );
                                            setShowActions(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-green-700 transition-colors hover:bg-green-50 cursor-pointer"
                                    >
                                        <Check size={14} className="mr-2" />
                                        Activate Course
                                    </button>
                                )}
                                {course.isActive && (
                                    <button
                                        onClick={() => {
                                            onStatusUpdate(
                                                course._id,
                                                "inactive"
                                            );
                                            setShowActions(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-700 transition-colors hover:bg-red-50 cursor-pointer"
                                    >
                                        <X size={14} className="mr-2" />
                                        Deactivate Course
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
                                    Edit Course
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
