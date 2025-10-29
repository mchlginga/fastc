import { useState } from "react";
import { X, AlertTriangle } from "react-feather";

const RevokeCertificateModal = ({ isOpen, onClose, certificate, onRevoke }) => {
    const [revoking, setRevoking] = useState(false);

    const handleConfirm = async () => {
        setRevoking(true);
        try {
            await onRevoke(certificate._id);
            onClose();
        } catch (error) {
            console.error("Revoke error:", error);
        } finally {
            setRevoking(false);
        }
    };

    if (!isOpen || !certificate) return null;

    // 🆕 FIX: Safe user display name with null checks
    const getUserDisplayName = (user) => {
        if (!user) return "Unknown User";

        if (user.role === "company" || user.role === "superAdmin") {
            return user.companyName || "Unknown Company";
        }

        const firstName = user.firstName || "";
        const surname = user.surname || "";
        const fullName = `${firstName} ${surname}`.trim();

        return fullName || user.email || "Unknown User";
    };

    // 🆕 FIX: Safe course title access
    const getCourseTitle = (course) => {
        return course?.title || "Unknown Course";
    };

    // 🆕 FIX: Safe verification code access
    const getVerificationCode = () => {
        return certificate.verificationCode || "No Code";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer">
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto cursor-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-300">
                    <div className="flex items-center">
                        <AlertTriangle
                            size={20}
                            className="text-red-600 mr-2"
                        />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Revoke Certificate
                            </h2>
                            <p className="text-sm text-gray-600">
                                This action cannot be undone
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                        disabled={revoking}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    <p className="text-gray-700">
                        Are you sure you want to revoke the certificate for:
                    </p>
                    <div className="bg-gray-50 rounded p-3">
                        <p className="font-medium text-gray-800">
                            {getUserDisplayName(certificate.user)}
                        </p>
                        <p className="text-sm text-gray-600">
                            Course: {getCourseTitle(certificate.course)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Verification Code: {getVerificationCode()}
                        </p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                        <p className="text-sm text-red-800">
                            <strong>Warning:</strong> Revoking this certificate
                            will:
                        </p>
                        <ul className="text-sm text-red-700 mt-2 list-disc list-inside space-y-1">
                            <li>Mark the certificate as revoked</li>
                            <li>Make it invalid for verification</li>
                            <li>
                                Prevent the user from using this certificate
                            </li>
                            <li>Require regeneration to restore access</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t border-gray-300 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={revoking}
                        className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={revoking}
                        className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        {revoking ? (
                            <span className="flex items-center gap-1">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Revoking...
                            </span>
                        ) : (
                            "Revoke Certificate"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RevokeCertificateModal;
