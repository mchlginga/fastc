import { useState, useRef, useEffect } from "react";
import {
    X,
    User,
    Award,
    Eye,
    Download,
    ExternalLink,
    RotateCcw,
    Clock,
    Calendar,
    CheckCircle,
    XCircle,
    AlertCircle,
    Edit,
} from "react-feather";
import InfoField from "./InfoField";

const CertificateDetailModal = ({
    isOpen,
    onClose,
    certificate,
    onRevoke,
    onRegenerate,
}) => {
    const [activeTab, setActiveTab] = useState("details");
    const modalRef = useRef(null);

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

    // 🆕 FIX: Reset to details tab when certificate changes
    useEffect(() => {
        if (certificate) {
            setActiveTab("details");
        }
    }, [certificate]);

    if (!isOpen || !certificate) return null;

    // Safe user data access with fallbacks
    const user = certificate.user || {};
    const course = certificate.course || {};
    const enrollment = certificate.enrollment || {};

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
                border: "border-green-200",
                label: "Active",
                icon: <CheckCircle size={14} className="mr-1" />,
            },
            expired: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                border: "border-yellow-200",
                label: "Expired",
                icon: <Clock size={14} className="mr-1" />,
            },
            revoked: {
                bg: "bg-red-100",
                text: "text-red-800",
                border: "border-red-200",
                label: "Revoked",
                icon: <XCircle size={14} className="mr-1" />,
            },
        };
        return configs[status] || configs.active;
    };

    const statusConfig = getStatusConfig(
        certificate.effectiveStatus || certificate.status
    );
    const isExpired = new Date() > new Date(certificate.expirationDate);
    const profilePicUrl = getProfilePicUrl(user.profilePic);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getUserDisplayName = (userObj) => {
        // Safe access with null checks
        if (!userObj) return "Unknown User";

        if (userObj.role === "company") {
            return userObj.companyName || "Unknown Company";
        }

        const firstName = userObj.firstName || "";
        const surname = userObj.surname || "";

        if (!firstName && !surname) {
            return userObj.email || "Unknown User";
        }

        return `${firstName} ${surname}`.trim();
    };

    const handleDownload = async () => {
        try {
            // Implementation for download
            console.log("Downloading certificate:", certificate._id);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const handleVerify = () => {
        if (!certificate.verificationCode) {
            console.error("No verification code available");
            return;
        }

        const verifyUrl = `${window.location.origin}/verify?code=${certificate.verificationCode}`;
        window.open(verifyUrl, "_blank");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-300">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            {profilePicUrl ? (
                                <img
                                    src={profilePicUrl}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display =
                                            "flex";
                                    }}
                                />
                            ) : null}
                            <div
                                className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 ${
                                    profilePicUrl ? "hidden" : "flex"
                                }`}
                            >
                                <Award size={20} className="text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Certificate Details
                            </h2>
                            <p className="text-sm text-gray-600">
                                {getUserDisplayName(user)} -{" "}
                                {course.title || "Unknown Course"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-300">
                    <div className="flex px-4">
                        {[
                            { id: "details", label: "Details", icon: Award },
                            {
                                id: "verification",
                                label: "Verification",
                                icon: Eye,
                            },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
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
                <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-4">
                    {activeTab === "details" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                        Recipient Information
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoField
                                            label="Name"
                                            value={getUserDisplayName(user)}
                                        />
                                        <InfoField
                                            label="Email"
                                            value={user.email || "N/A"}
                                        />
                                        <InfoField
                                            label="Role"
                                            value={
                                                <span className="capitalize">
                                                    {user.role || "N/A"}
                                                </span>
                                            }
                                        />
                                        {user.contactNumber && (
                                            <InfoField
                                                label="Contact"
                                                value={user.contactNumber}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                        Certificate Information
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoField
                                            label="Course"
                                            value={course.title || "N/A"}
                                        />
                                        <InfoField
                                            label="Status"
                                            value={
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                                                >
                                                    {statusConfig.icon}
                                                    {statusConfig.label}
                                                    {isExpired &&
                                                        certificate.status ===
                                                            "active" && (
                                                            <AlertCircle
                                                                size={10}
                                                                className="ml-1"
                                                            />
                                                        )}
                                                </span>
                                            }
                                        />
                                        <InfoField
                                            label="Completion Date"
                                            value={formatDate(
                                                certificate.completionDate
                                            )}
                                        />
                                        <InfoField
                                            label="Expiration Date"
                                            value={formatDate(
                                                certificate.expirationDate
                                            )}
                                        />
                                        <InfoField
                                            label="Issued By"
                                            value={
                                                certificate.issuedBy || "FAST-C"
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Course Details */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Course Details
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">
                                                Category:
                                            </span>
                                            <p className="font-medium">
                                                {course.category || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">
                                                Skill Level:
                                            </span>
                                            <p className="font-medium capitalize">
                                                {course.skillLevel || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">
                                                Duration:
                                            </span>
                                            <p className="font-medium">
                                                {course.duration || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">
                                                Enrollment ID:
                                            </span>
                                            <p className="font-medium font-mono text-xs">
                                                {enrollment._id || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Certificate Statistics */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Certificate Statistics
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {certificate.daysUntilExpiry > 0
                                                    ? certificate.daysUntilExpiry
                                                    : 0}
                                            </div>
                                            <div className="text-gray-600 text-xs">
                                                Days Until Expiry
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {isExpired ? "No" : "Yes"}
                                            </div>
                                            <div className="text-gray-600 text-xs">
                                                Currently Valid
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {certificate.verificationCode
                                                    ? "Yes"
                                                    : "No"}
                                            </div>
                                            <div className="text-gray-600 text-xs">
                                                Verifiable
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-600">
                                                {certificate.createdAt
                                                    ? new Date(
                                                          certificate.createdAt
                                                      ).toLocaleDateString()
                                                    : "N/A"}
                                            </div>
                                            <div className="text-gray-600 text-xs">
                                                Date Created
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "verification" && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Verification Information
                                </h3>
                                <div className="space-y-3">
                                    <InfoField
                                        label="Verification Code"
                                        value={
                                            certificate.verificationCode ? (
                                                <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                                                    {
                                                        certificate.verificationCode
                                                    }
                                                </code>
                                            ) : (
                                                "N/A"
                                            )
                                        }
                                    />
                                    <InfoField
                                        label="Verification URL"
                                        value={
                                            certificate.verificationCode ? (
                                                <a
                                                    href={`${window.location.origin}/verify?code=${certificate.verificationCode}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 break-all"
                                                >
                                                    {`${window.location.origin}/verify?code=${certificate.verificationCode}`}
                                                </a>
                                            ) : (
                                                "N/A"
                                            )
                                        }
                                    />
                                    <InfoField
                                        label="Certificate ID"
                                        value={
                                            <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                                                {certificate._id || "N/A"}
                                            </code>
                                        }
                                    />
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Quick Actions
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <button
                                        onClick={handleVerify}
                                        disabled={!certificate.verificationCode}
                                        className={`flex items-center justify-center p-3 border rounded-lg transition-colors cursor-pointer ${
                                            certificate.verificationCode
                                                ? "border-green-600 text-green-600 hover:bg-green-50"
                                                : "border-gray-300 text-gray-400 cursor-not-allowed"
                                        }`}
                                    >
                                        <ExternalLink
                                            size={16}
                                            className="mr-2"
                                        />
                                        Verify Certificate
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center justify-center p-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                                    >
                                        <Download size={16} className="mr-2" />
                                        Download PDF
                                    </button>
                                    <button
                                        onClick={onRegenerate}
                                        className="flex items-center justify-center p-3 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
                                    >
                                        <RotateCcw size={16} className="mr-2" />
                                        Regenerate
                                    </button>
                                    {certificate.status !== "revoked" && (
                                        <button
                                            onClick={onRevoke}
                                            className="flex items-center justify-center p-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                        >
                                            <XCircle
                                                size={16}
                                                className="mr-2"
                                            />
                                            Revoke Certificate
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Status Information */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Status Information
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Current Status:
                                            </span>
                                            <span
                                                className={`font-medium ${statusConfig.text}`}
                                            >
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Expiration Status:
                                            </span>
                                            <span
                                                className={`font-medium ${
                                                    isExpired
                                                        ? "text-red-600"
                                                        : "text-green-600"
                                                }`}
                                            >
                                                {isExpired
                                                    ? "Expired"
                                                    : "Valid"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Verification Status:
                                            </span>
                                            <span
                                                className={`font-medium ${
                                                    certificate.verificationCode
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {certificate.verificationCode
                                                    ? "Verifiable"
                                                    : "Not Verifiable"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t border-gray-300 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                    {certificate.status !== "revoked" && (
                        <button
                            onClick={onRegenerate}
                            className="px-4 py-2 text-sm text-white bg-orange-600 rounded hover:bg-orange-700 transition-colors cursor-pointer flex items-center"
                        >
                            <RotateCcw size={14} className="mr-1" />
                            Regenerate
                        </button>
                    )}
                    {certificate.status !== "revoked" && (
                        <button
                            onClick={onRevoke}
                            className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition-colors cursor-pointer flex items-center"
                        >
                            <XCircle size={14} className="mr-1" />
                            Revoke
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CertificateDetailModal;
