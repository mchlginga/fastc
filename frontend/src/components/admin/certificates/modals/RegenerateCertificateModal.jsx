import { useState } from "react";
import { X, RotateCcw, AlertTriangle } from "react-feather";

const RegenerateCertificateModal = ({
    isOpen,
    onClose,
    certificate,
    onRegenerate,
}) => {
    const [regenerating, setRegenerating] = useState(false);

    const handleConfirm = async () => {
        setRegenerating(true);
        try {
            await onRegenerate(certificate._id);
            onClose();
        } catch (error) {
            console.error("Regenerate error:", error);
        } finally {
            setRegenerating(false);
        }
    };

    if (!isOpen || !certificate) return null;

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

    const getCourseTitle = (course) => {
        return course?.title || "Unknown Course";
    };

    const getVerificationCode = () => {
        return certificate.verificationCode || "No Code";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto cursor-auto transform transition-all duration-200 scale-100">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <RotateCcw size={20} className="text-orange-600 mr-2" />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Regenerate Certificate
                            </h2>
                            <p className="text-sm text-gray-600">
                                Generate a new certificate file
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        disabled={regenerating}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-gray-700">
                        Are you sure you want to regenerate the certificate for:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="font-medium text-gray-800">
                            {getUserDisplayName(certificate.user)}
                        </p>
                        <p className="text-sm text-gray-600">
                            Course: {getCourseTitle(certificate.course)}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            Current Verification Code: {getVerificationCode()}
                        </p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-sm text-orange-800 font-medium mb-2">
                            <AlertTriangle size={16} className="inline mr-1" />
                            Note: Regenerating this certificate will:
                        </p>
                        <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                            <li>Create a new certificate PDF file</li>
                            <li>Generate a new verification code</li>
                            <li>Reset the certificate status to active</li>
                            <li>Extend the expiration date by 1 year</li>
                            <li>The old certificate file will be replaced</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={regenerating}
                        className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={regenerating}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                    >
                        {regenerating ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Regenerating...
                            </span>
                        ) : (
                            "Regenerate Certificate"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegenerateCertificateModal;
