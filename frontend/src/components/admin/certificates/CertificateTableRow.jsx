import { useState, useEffect, useRef } from "react";
import {
    User,
    Award,
    Eye,
    MoreVertical,
    Check,
    X,
    RotateCcw,
    Download,
    ExternalLink,
    Trash2,
    Clock,
    AlertCircle,
} from "react-feather";

const CertificateTableRow = ({
    certificate,
    isSelected,
    onSelect,
    onView,
    onRevoke,
    onRegenerate,
    onDelete,
    onDownload, // NEW: Add download handler prop
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
            active: {
                bg: "bg-green-100",
                text: "text-green-800",
                label: "Active",
                icon: <Check size={12} className="mr-1" />,
            },
            expired: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                label: "Expired",
                icon: <Clock size={12} className="mr-1" />,
            },
            revoked: {
                bg: "bg-red-100",
                text: "text-red-800",
                label: "Revoked",
                icon: <X size={12} className="mr-1" />,
            },
        };
        return configs[status] || configs.active;
    };

    const statusConfig = getStatusConfig(certificate.status);

    // Check if certificate is expired
    const isExpired = new Date() > new Date(certificate.expirationDate);
    const isActive = certificate.status === "active" && !isExpired;

    // Subtle alternating row colors for better readability
    const rowBgColor = rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50";

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (error) {
            return "Invalid Date";
        }
    };

    // SAFE: User display name with null checks
    const getUserDisplayName = (user) => {
        if (!user) return "Unknown User";
        if (user.role === "company") {
            return user.companyName || "Unknown Company";
        }
        const firstName = user.firstName || "";
        const surname = user.surname || "";
        const fullName = `${firstName} ${surname}`.trim();
        return fullName || user.email || "Unknown User";
    };

    // SAFE: Get user email with null check
    const getUserEmail = (user) => {
        return user?.email || "No email";
    };

    // SAFE: Get user role with null check
    const getUserRole = (user) => {
        return user?.role
            ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
            : "Unknown";
    };

    // SAFE: Get course title with null check
    const getCourseTitle = (course) => {
        return course?.title || "Unknown Course";
    };

    // SAFE: Get course category with null check
    const getCourseCategory = (course) => {
        return course?.category || "—";
    };

    // SAFE: Get verification code with null check
    const getVerificationCode = () => {
        return certificate.verificationCode || "No Code";
    };

    // UPDATED: Handle download with proper implementation
    const handleDownload = async () => {
        try {
            if (onDownload) {
                await onDownload(certificate._id);
            }
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const handleVerify = () => {
        // Open verification in new tab
        if (certificate.verificationCode) {
            const verifyUrl = `${window.location.origin}/verify?code=${certificate.verificationCode}`;
            window.open(verifyUrl, "_blank");
        }
    };

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
                        {getProfilePicUrl(certificate.user?.profilePic) ? (
                            <img
                                src={getProfilePicUrl(
                                    certificate.user?.profilePic
                                )}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={18} className="text-gray-400" />
                        )}
                    </div>
                    <div className="ml-3">
                        <div className="text-sm font-semibold text-gray-900 truncate max-w-[140px]">
                            {getUserDisplayName(certificate.user)}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[140px]">
                            {getUserEmail(certificate.user)}
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                            {getUserRole(certificate.user)}
                        </div>
                    </div>
                </div>
            </td>

            {/* Course Info */}
            <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded flex items-center justify-center border border-gray-200 mr-3">
                        <Award size={14} className="text-gray-400" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[160px]">
                            {getCourseTitle(certificate.course)}
                        </div>
                        <div className="text-xs text-gray-500">
                            {getCourseCategory(certificate.course)}
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
                    {isExpired && certificate.status === "active" && (
                        <AlertCircle size={10} className="ml-1" />
                    )}
                </span>
            </td>

            {/* Completion Date */}
            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                {formatDate(certificate.completionDate)}
            </td>

            {/* Expiration Date */}
            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                {certificate.expirationDate
                    ? formatDate(certificate.expirationDate)
                    : "—"}
                {isExpired && (
                    <div className="text-xs text-red-500">(Expired)</div>
                )}
            </td>

            {/* Verification Code */}
            <td className="px-4 py-3 text-sm font-mono text-gray-600 whitespace-nowrap">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {getVerificationCode()}
                </code>
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

                    {/* Quick Download Button - NEW: Always visible download button */}
                    <button
                        onClick={handleDownload}
                        className="text-green-600 hover:text-green-800 cursor-pointer p-2 rounded-lg hover:bg-green-100 transition-all duration-200"
                        title="Download Certificate"
                    >
                        <Download size={16} />
                    </button>

                    {/* Quick Verify Button */}
                    {certificate.verificationCode && (
                        <button
                            onClick={handleVerify}
                            className="text-purple-600 hover:text-purple-800 cursor-pointer p-2 rounded-lg hover:bg-purple-100 transition-all duration-200"
                            title="Verify Certificate"
                        >
                            <ExternalLink size={16} />
                        </button>
                    )}

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
                                {/* Download - also available in dropdown */}
                                <button
                                    onClick={() => {
                                        handleDownload();
                                        setShowActions(false);
                                    }}
                                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer"
                                >
                                    <Download size={14} className="mr-2" />
                                    Download PDF
                                </button>

                                {/* Status Updates */}
                                {certificate.status !== "active" && (
                                    <button
                                        onClick={() => {
                                            // Handle activate
                                            setShowActions(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-green-700 transition-colors hover:bg-green-50 cursor-pointer"
                                    >
                                        <Check size={14} className="mr-2" />
                                        Activate
                                    </button>
                                )}
                                {certificate.status !== "revoked" && (
                                    <button
                                        onClick={() => {
                                            onRevoke();
                                            setShowActions(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-700 transition-colors hover:bg-red-50 cursor-pointer"
                                    >
                                        <X size={14} className="mr-2" />
                                        Revoke
                                    </button>
                                )}

                                {/* Regenerate */}
                                <button
                                    onClick={() => {
                                        onRegenerate();
                                        setShowActions(false);
                                    }}
                                    className="flex items-center w-full px-4 py-2.5 text-sm text-blue-700 transition-colors hover:bg-blue-50 cursor-pointer"
                                >
                                    <RotateCcw size={14} className="mr-2" />
                                    Regenerate
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
                                    Delete Certificate
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default CertificateTableRow;
