import { useState, useEffect, useRef } from "react";
import { User, Eye, MoreVertical, Check, X, Edit, Trash2 } from "react-feather";

const UserTableRow = ({
    user,
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

    const getStatusConfig = (status) => {
        const configs = {
            approved: {
                bg: "bg-green-100",
                text: "text-green-800",
                label: "Approved",
            },
            pending: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                label: "Pending",
            },
            rejected: {
                bg: "bg-red-100",
                text: "text-red-800",
                label: "Rejected",
            },
        };
        return configs[status] || configs.pending;
    };

    const getRoleConfig = (role) => {
        const configs = {
            superAdmin: {
                bg: "bg-purple-100",
                text: "text-purple-800",
                label: "Super Admin",
            },
            admin: { bg: "bg-blue-100", text: "text-blue-800", label: "Admin" },
            company: {
                bg: "bg-orange-100",
                text: "text-orange-800",
                label: "Company",
            },
            user: {
                bg: "bg-gray-100",
                text: "text-gray-800",
                label: "Trainee",
            },
        };
        return configs[role] || configs.user;
    };

    const statusConfig = getStatusConfig(user.profileStatus);
    const roleConfig = getRoleConfig(user.role);

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

            {/* User Info */}
            <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                        {user.profilePic ? (
                            <img
                                src={user.profilePic} // ✅ DIRECT CLOUDINARY URL
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback if image fails to load
                                    e.target.style.display = "none";
                                }}
                            />
                        ) : (
                            <User size={18} className="text-gray-400" />
                        )}
                    </div>
                    <div className="ml-3">
                        <div className="text-sm font-semibold text-gray-900 truncate max-w-[160px]">
                            {user.role === "company"
                                ? user.companyName
                                : `${user.firstName} ${user.surname}`}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[160px]">
                            {user.email}
                        </div>
                    </div>
                </div>
            </td>

            {/* Role */}
            <td className="px-4 py-3 whitespace-nowrap">
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${roleConfig.bg} ${roleConfig.text}`}
                >
                    {roleConfig.label}
                </span>
            </td>

            {/* Status */}
            <td className="px-4 py-3 whitespace-nowrap">
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                >
                    {statusConfig.label}
                </span>
            </td>

            {/* Contact */}
            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                {user.contactNumber || "—"}
            </td>

            {/* Joined Date */}
            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                {new Date(user.createdAt).toLocaleDateString()}
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
                                {user.profileStatus !== "approved" && (
                                    <button
                                        onClick={() => {
                                            onStatusUpdate(
                                                user._id,
                                                "approved"
                                            );
                                            setShowActions(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-green-700 transition-colors hover:bg-green-50 cursor-pointer"
                                    >
                                        <Check size={14} className="mr-2" />
                                        Approve User
                                    </button>
                                )}
                                {user.profileStatus !== "rejected" && (
                                    <button
                                        onClick={() => {
                                            onStatusUpdate(
                                                user._id,
                                                "rejected"
                                            );
                                            setShowActions(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-700 transition-colors hover:bg-red-50 cursor-pointer"
                                    >
                                        <X size={14} className="mr-2" />
                                        Reject User
                                    </button>
                                )}

                                {(user.profileStatus !== "approved" ||
                                    user.profileStatus !== "rejected") && (
                                    <div className="border-t border-gray-100"></div>
                                )}

                                <button
                                    onClick={() => {
                                        onEdit();
                                        setShowActions(false);
                                    }}
                                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer"
                                >
                                    <Edit size={14} className="mr-2" />
                                    Edit User
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
                                    Delete User
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default UserTableRow;
