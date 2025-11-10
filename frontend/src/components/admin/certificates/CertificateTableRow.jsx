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
    onDownload,
    onActivate,
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

    // Handle revoke with loading state
    const handleRevoke = async () => {
        setIsUpdating(true);
        try {
            await onRevoke();
            setShowActions(false);
        } catch (error) {
            console.error("Revoke error:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    //  Handle activate with loading state
    const handleActivate = async () => {
        setIsUpdating(true);
        try {
            await onActivate();
            setShowActions(false);
        } catch (error) {
            console.error("Activate error:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            active: {
                bg: "bg-emerald-50",
                text: "text-emerald-700",
                border: "border-emerald-200",
                label: "Active",
            },
            expired: {
                bg: "bg-yellow-50",
                text: "text-yellow-700",
                border: "border-yellow-200",
                label: "Expired",
            },
            revoked: {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
                label: "Revoked",
            },
        };
        return configs[status] || configs.active;
    };

    const statusConfig = getStatusConfig(certificate.status);

    // Check if certificate is expired
    const isExpired = new Date() > new Date(certificate.expirationDate);
    const isActive = certificate.status === "active" && !isExpired;

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
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
        if (certificate.verificationCode) {
            const verifyUrl = `${window.location.origin}/verify?code=${certificate.verificationCode}`;
            window.open(verifyUrl, "_blank");
        }
    };

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
                    disabled={isUpdating}
                />
            </td>

            {/* User Info */}
            <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center group">
                    <div className="shrink-0 w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 group-hover:shadow-xs transition-shadow">
                        {certificate.user?.profilePic ? (
                            <img
                                src={certificate.user.profilePic}
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
                        <div className="text-sm font-medium text-gray-900 truncate max-w-40 group-hover:text-gray-700 transition-colors">
                            {getUserDisplayName(certificate.user)}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-40">
                            {getUserEmail(certificate.user)}
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                            {getUserRole(certificate.user)}
                        </div>
                    </div>
                </div>
            </td>

            {/* Course Info */}
            <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="shrink-0 w-8 h-8 bg-gray-100 rounded flex items-center justify-center border border-gray-200 mr-3">
                        <Award size={14} className="text-gray-400" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-40">
                            {getCourseTitle(certificate.course)}
                        </div>
                        <div className="text-xs text-gray-500">
                            {getCourseCategory(certificate.course)}
                        </div>
                    </div>
                </div>
            </td>

            {/* Status */}
            <td className="px-4 py-4 whitespace-nowrap">
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                >
                    {statusConfig.label}
                    {isExpired && certificate.status === "active" && (
                        <AlertCircle size={10} className="ml-1" />
                    )}
                </span>
            </td>

            {/* Completion Date */}
            <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                {formatDate(certificate.completionDate)}
            </td>

            {/* Expiration Date */}
            <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                {certificate.expirationDate
                    ? formatDate(certificate.expirationDate)
                    : "—"}
                {isExpired && (
                    <div className="text-xs text-red-500">(Expired)</div>
                )}
            </td>

            {/* Verification Code */}
            <td className="px-4 py-4 text-sm font-mono text-gray-600 whitespace-nowrap">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {getVerificationCode()}
                </code>
            </td>

            {/* Actions */}
            <td className="pr-6 pl-4 py-4 whitespace-nowrap">
                <div
                    className="flex items-center justify-end gap-1"
                    ref={actionsRef}
                >
                    {/* Quick View Button - Always Visible */}
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
                                {/* Download */}
                                <button
                                    onClick={() => {
                                        handleDownload();
                                        setShowActions(false);
                                    }}
                                    disabled={isUpdating}
                                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 transition-all duration-150 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    <Download
                                        size={14}
                                        className="mr-2 group-hover:scale-110 transition-transform"
                                    />
                                    Download PDF
                                </button>

                                {/* Verify */}
                                {certificate.verificationCode && (
                                    <button
                                        onClick={() => {
                                            handleVerify();
                                            setShowActions(false);
                                        }}
                                        disabled={isUpdating}
                                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 transition-all duration-150 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <ExternalLink
                                            size={14}
                                            className="mr-2 group-hover:scale-110 transition-transform"
                                        />
                                        Verify Certificate
                                    </button>
                                )}

                                {/* Status Updates */}
                                {certificate.status !== "active" && (
                                    <button
                                        onClick={handleActivate}
                                        disabled={isUpdating}
                                        className="flex items-center w-full px-3 py-2 text-sm text-green-700 transition-all duration-150 hover:bg-green-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <Check
                                            size={14}
                                            className="mr-2 group-hover:scale-110 transition-transform"
                                        />
                                        {isUpdating
                                            ? "Activating..."
                                            : "Activate"}
                                    </button>
                                )}

                                {/* Show Revoke only for non-revoked certificates */}
                                {certificate.status !== "revoked" && (
                                    <button
                                        onClick={handleRevoke}
                                        disabled={isUpdating}
                                        className="flex items-center w-full px-3 py-2 text-sm text-red-700 transition-all duration-150 hover:bg-red-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <X
                                            size={14}
                                            className="mr-2 group-hover:scale-110 transition-transform"
                                        />
                                        {isUpdating ? "Revoking..." : "Revoke"}
                                    </button>
                                )}

                                {/* Regenerate */}
                                <button
                                    onClick={() => {
                                        onRegenerate();
                                        setShowActions(false);
                                    }}
                                    disabled={isUpdating}
                                    className="flex items-center w-full px-3 py-2 text-sm text-blue-700 transition-all duration-150 hover:bg-blue-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    <RotateCcw
                                        size={14}
                                        className="mr-2 group-hover:scale-110 transition-transform"
                                    />
                                    Regenerate
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
