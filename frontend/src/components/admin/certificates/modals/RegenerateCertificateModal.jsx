import { useState, useRef, useEffect } from "react";
import { X, RotateCcw, AlertTriangle } from "react-feather";

const RegenerateCertificateModal = ({
    isOpen,
    onClose,
    certificate,
    onRegenerate,
}) => {
    const [regenerating, setRegenerating] = useState(false);
    const modalRef = useRef(null);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleClose = () => {
        if (regenerating) return;
        onClose();
    };

    const handleConfirm = async () => {
        if (!certificate || !certificate._id) {
            console.error("No certificate ID provided");
            return;
        }

        setRegenerating(true);
        try {
            await onRegenerate();
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

        if (user.role === "company") {
            return user.companyName || "Company User";
        }

        const firstName = user.firstName || "";
        const surname = user.surname || "";
        const fullName = `${firstName} ${surname}`.trim();

        if (fullName) {
            return fullName;
        }

        return user.email || "User";
    };

    const getCourseTitle = (course) => {
        if (!course) return "Unknown Course";
        return course.title || "Course";
    };

    const getVerificationCode = () => {
        return certificate.verificationCode || "No code available";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-xl w-full max-w-md cursor-auto transform transition-all duration-200 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
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
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        disabled={regenerating}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content - Made more compact */}
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
                        <p className="text-xs text-gray-500 mt-1">
                            Current Code: {getVerificationCode()}
                        </p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <p className="text-sm text-orange-800 font-medium mb-1 flex items-start">
                            <AlertTriangle
                                size={14}
                                className="inline mr-1 mt-0.5 shrink-0"
                            />
                            Note: Regenerating this certificate will:
                        </p>
                        <ul className="text-xs text-orange-700 space-y-0.5 list-disc list-inside">
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
                        onClick={handleClose}
                        disabled={regenerating}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={regenerating || !certificate._id}
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                    >
                        {regenerating ? (
                            <span className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
