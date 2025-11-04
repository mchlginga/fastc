import { useState } from "react";
import {
    X,
    RotateCcw,
    AlertTriangle,
    CheckCircle,
    XCircle,
} from "react-feather";

const BulkRegenerateCertificateModal = ({
    isOpen,
    onClose,
    selectedCount,
    onBulkRegenerate,
}) => {
    const [regenerating, setRegenerating] = useState(false);
    const [regenerateResult, setRegenerateResult] = useState(null);

    const handleConfirm = async () => {
        setRegenerating(true);
        setRegenerateResult(null);
        try {
            const result = await onBulkRegenerate();
            setRegenerateResult(result);
        } catch (error) {
            console.error("Bulk regenerate error:", error);
            setRegenerateResult({
                successful: 0,
                failed: selectedCount,
                error: error.message,
            });
        } finally {
            setRegenerating(false);
        }
    };

    const handleClose = () => {
        setRegenerateResult(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto cursor-auto transform transition-all duration-200 scale-100">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <RotateCcw size={20} className="text-orange-600 mr-2" />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Bulk Regenerate Certificates
                            </h2>
                            <p className="text-sm text-gray-600">
                                Generate new certificate files for{" "}
                                {selectedCount} certificates
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

                {/* Content */}
                <div className="p-6 space-y-4">
                    {!regenerateResult ? (
                        <>
                            <p className="text-gray-700">
                                Are you sure you want to regenerate{" "}
                                {selectedCount} certificates?
                            </p>

                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <p className="text-sm text-orange-800 font-medium mb-2">
                                    <AlertTriangle
                                        size={16}
                                        className="inline mr-1"
                                    />
                                    This action will:
                                </p>
                                <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                                    <li>
                                        Create new PDF files for all selected
                                        certificates
                                    </li>
                                    <li>Generate new verification codes</li>
                                    <li>Reset certificate status to active</li>
                                    <li>Extend expiration dates by 1 year</li>
                                    <li>Replace old certificate files</li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> This process may take
                                    several minutes depending on the number of
                                    certificates.
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            {regenerateResult.failed === 0 ? (
                                <div className="text-green-600">
                                    <CheckCircle
                                        size={48}
                                        className="mx-auto mb-3"
                                    />
                                    <h3 className="text-lg font-semibold mb-2">
                                        Success!
                                    </h3>
                                    <p className="text-gray-700">
                                        Successfully regenerated{" "}
                                        {regenerateResult.successful}{" "}
                                        certificates.
                                    </p>
                                </div>
                            ) : regenerateResult.successful === 0 ? (
                                <div className="text-red-600">
                                    <XCircle
                                        size={48}
                                        className="mx-auto mb-3"
                                    />
                                    <h3 className="text-lg font-semibold mb-2">
                                        Failed
                                    </h3>
                                    <p className="text-gray-700">
                                        Failed to regenerate any certificates.{" "}
                                        {regenerateResult.error}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-orange-600">
                                    <AlertTriangle
                                        size={48}
                                        className="mx-auto mb-3"
                                    />
                                    <h3 className="text-lg font-semibold mb-2">
                                        Partial Success
                                    </h3>
                                    <p className="text-gray-700">
                                        Regenerated{" "}
                                        {regenerateResult.successful} out of{" "}
                                        {selectedCount} certificates.
                                        {regenerateResult.failed > 0 &&
                                            ` ${regenerateResult.failed} failed.`}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    {!regenerateResult ? (
                        <>
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={regenerating}
                                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={regenerating}
                                className="px-4 py-2.5 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer flex items-center gap-2"
                            >
                                {regenerating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Regenerating...
                                    </>
                                ) : (
                                    <>
                                        <RotateCcw size={14} />
                                        Regenerate {selectedCount} Certificates
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleClose}
                            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BulkRegenerateCertificateModal;
