import { useState, useEffect, useRef } from "react";
import {
    User,
    Book,
    CheckCircle,
    Clock,
    MoreVertical,
    Eye,
    Check,
} from "react-feather";

const AttendanceTableRow = ({
    record,
    onManualVerification,
    onViewDetails,
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
            verified: {
                bg: "bg-emerald-50",
                text: "text-emerald-700",
                border: "border-emerald-200",
                label: "Verified",
            },
            pending: {
                bg: "bg-amber-50",
                text: "text-amber-700",
                border: "border-amber-200",
                label: "Pending",
            },
            failed: {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
                label: "Failed",
            },
        };
        return configs[status] || configs.pending;
    };

    const getVerificationMethodConfig = (method) => {
        const configs = {
            facial_recognition: {
                bg: "bg-blue-50",
                text: "text-blue-700",
                border: "border-blue-200",
                label: "Facial Recognition",
            },
            manual: {
                bg: "bg-purple-50",
                text: "text-purple-700",
                border: "border-purple-200",
                label: "Manual",
            },
            qr_code: {
                bg: "bg-orange-50",
                text: "text-orange-700",
                border: "border-orange-200",
                label: "QR Code",
            },
        };
        return configs[method] || configs.facial_recognition;
    };

    const statusConfig = getStatusConfig(record.status);
    const methodConfig = getVerificationMethodConfig(record.verificationMethod);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <tr
            className={`border-b border-gray-100 transition-all duration-200 ${
                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"
            } hover:bg-gray-50/80`}
        >
            {/* Trainee Info */}
            <td className="pl-6 pr-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="shrink-0 w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                        {record.user?.profilePic ? (
                            <img
                                src={record.user.profilePic}
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
                        <div className="text-sm font-medium text-gray-900 truncate max-w-160">
                            {record.user?.firstName} {record.user?.surname}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-160">
                            {record.user?.email}
                        </div>
                    </div>
                </div>
            </td>

            {/* Course */}
            <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                    {record.course?.title || "N/A"}
                </div>
            </td>

            {/* Clock-in Time */}
            <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                    {formatTime(record.verifiedAt)}
                </div>
                <div className="text-sm text-gray-500">
                    {formatDate(record.verifiedAt)}
                </div>
            </td>

            {/* Status */}
            <td className="px-4 py-4 whitespace-nowrap">
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                >
                    <span>{statusConfig.label}</span>
                </span>
            </td>

            {/* Verification Method */}
            <td className="px-4 py-4 whitespace-nowrap">
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${methodConfig.bg} ${methodConfig.text} ${methodConfig.border}`}
                >
                    {methodConfig.label}
                </span>
            </td>

            {/* Actions */}
            <td className="pr-6 pl-4 py-4 whitespace-nowrap">
                <div
                    className="flex items-center justify-end gap-1"
                    ref={actionsRef}
                >
                    {/* Quick View Button */}
                    <button
                        onClick={() => onViewDetails(record._id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                            <div className="absolute right-0 z-20 w-48 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg shadow-gray-200/50 ring-1 ring-black ring-opacity-5 py-1 animate-in fade-in-0 zoom-in-95">
                                {/* Manual Verification for pending records */}
                                {record.status === "pending" && (
                                    <button
                                        onClick={() => {
                                            onManualVerification(record._id);
                                            setShowActions(false);
                                        }}
                                        className="flex items-center w-full px-3 py-2 text-sm text-emerald-700 transition-all duration-150 hover:bg-emerald-50 cursor-pointer group"
                                    >
                                        <Check
                                            size={14}
                                            className="mr-2 group-hover:scale-110 transition-transform"
                                        />
                                        Manually Verify
                                    </button>
                                )}

                                {/* View Details Option */}
                                <button
                                    onClick={() => {
                                        onViewDetails(record._id);
                                        setShowActions(false);
                                    }}
                                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 transition-all duration-150 hover:bg-gray-50 cursor-pointer group"
                                >
                                    <Eye
                                        size={14}
                                        className="mr-2 group-hover:scale-110 transition-transform"
                                    />
                                    View Details
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default AttendanceTableRow;
