import { useState } from "react";
import { X, AlertTriangle } from "react-feather";

const RevokeCertificateModal = ({ isOpen, onClose, certificate, onRevoke }) => {
    const [revoking, setRevoking] = useState(false);

    const handleConfirm = async () => {
        if (!certificate || !certificate._id) {
            console.error("No certificate ID provided");
            return;
        }

        setRevoking(true);
        try {
            await onRevoke();
            onClose();
        } catch (error) {
            console.error("Revoke error:", error);
        } finally {
            setRevoking(false);
        }
    };

    if (!isOpen || !certificate) return null;

    const getUserDisplayName = (user) => {
        if (!user) return "Unknown User";

        // Handle company users
        if (user.role === "company") {
            return user.companyName || "Unknown Company";
        }

        // Handle individual users
        const firstName = user.firstName || "";
        const surname = user.surname || "";
        const fullName = `${firstName} ${surname}`.trim();

        return fullName || user.email || "Unknown User";
    };

    const getCourseTitle = (course) => {
        if (!course) return "Unknown Course";
        return course.title || "Unknown Course";
    };

    const getVerificationCode = () => {
        return certificate.verificationCode || "No Code Available";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto cursor-auto transform transition-all duration-200 scale-100">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <AlertTriangle
                            size={18}
                            className="text-red-600 mr-2"
                        />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Revoke Certificate
                            </h2>
                            <p className="text-xs text-gray-600">
                                This action cannot be undone
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        disabled={revoking}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content - Made more compact */}
                <div className="p-4 space-y-3">
                    <p className="text-sm text-gray-700">
                        Are you sure you want to revoke the certificate for:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="font-medium text-gray-800 text-sm">
                            {getUserDisplayName(certificate.user)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                            Course: {getCourseTitle(certificate.course)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Code: {getVerificationCode()}
                        </p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-xs text-red-800 font-medium mb-1 flex items-start">
                            <AlertTriangle
                                size={12}
                                className="inline mr-1 mt-0.5 shrink-0"
                            />
                            Warning: Revoking this certificate will:
                        </p>
                        <ul className="text-xs text-red-700 space-y-0.5 list-disc list-inside">
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
                <div className="flex justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={revoking}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={revoking || !certificate._id}
                        className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                    >
                        {revoking ? (
                            <span className="flex items-center gap-1">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Revoking...
                            </span>
                        ) : (
                            "Revoke"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RevokeCertificateModal;
