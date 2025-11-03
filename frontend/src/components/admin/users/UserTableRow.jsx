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
                bg: "bg-emerald-50",
                text: "text-emerald-700",
                border: "border-emerald-200",
                label: "Approved",
            },
            pending: {
                bg: "bg-amber-50",
                text: "text-amber-700",
                border: "border-amber-200",
                label: "Pending",
            },
            rejected: {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
                label: "Rejected",
            },
        };
        return configs[status] || configs.pending;
    };

    const getRoleConfig = (role) => {
        const configs = {
            superAdmin: {
                bg: "bg-purple-50",
                text: "text-purple-700",
                border: "border-purple-200",
                label: "Super Admin",
            },
            admin: {
                bg: "bg-blue-50",
                text: "text-blue-700",
                border: "border-blue-200",
                label: "Admin",
            },
            company: {
                bg: "bg-orange-50",
                text: "text-orange-700",
                border: "border-orange-200",
                label: "Company",
            },
            user: {
                bg: "bg-gray-50",
                text: "text-gray-700",
                border: "border-gray-200",
                label: "Trainee",
            },
        };
        return configs[role] || configs.user;
    };

    const statusConfig = getStatusConfig(user.profileStatus);
    const roleConfig = getRoleConfig(user.role);

    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150">
            {/* Checkbox */}
            <td className="pl-6 pr-4 py-4 whitespace-nowrap">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelect}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-blue-500 focus:ring-2 focus:ring-offset-1"
                />
            </td>

            {/* User Info */}
            <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                        {user.profilePic ? (
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
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[160px]">
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
            <td className="px-4 py-4 whitespace-nowrap">
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}`}
                >
                    {roleConfig.label}
                </span>
            </td>

            {/* Status */}
            <td className="px-4 py-4 whitespace-nowrap">
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                >
                    {statusConfig.label}
                </span>
            </td>

            {/* Contact */}
            <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                {user.contactNumber || <span className="text-gray-400">—</span>}
            </td>

            {/* Joined Date */}
            <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })}
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
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>

                    {/* Actions Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowActions(!showActions)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                            <MoreVertical size={16} />
                        </button>

                        {showActions && (
                            <div className="absolute right-0 z-20 w-48 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg shadow-gray-200/50 ring-1 ring-black ring-opacity-5 py-1">
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
                                        className="flex items-center w-full px-3 py-2 text-sm text-emerald-700 transition-colors hover:bg-emerald-50 cursor-pointer"
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
                                        className="flex items-center w-full px-3 py-2 text-sm text-red-700 transition-colors hover:bg-red-50 cursor-pointer"
                                    >
                                        <X size={14} className="mr-2" />
                                        Reject User
                                    </button>
                                )}

                                {(user.profileStatus !== "approved" ||
                                    user.profileStatus !== "rejected") && (
                                    <div className="border-t border-gray-100 my-1"></div>
                                )}

                                <button
                                    onClick={() => {
                                        onEdit();
                                        setShowActions(false);
                                    }}
                                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer"
                                >
                                    <Edit size={14} className="mr-2" />
                                    Edit User
                                </button>

                                <div className="border-t border-gray-100 my-1"></div>

                                <button
                                    onClick={() => {
                                        onDelete();
                                        setShowActions(false);
                                    }}
                                    className="flex items-center w-full px-3 py-2 text-sm text-red-700 transition-colors hover:bg-red-50 cursor-pointer"
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
