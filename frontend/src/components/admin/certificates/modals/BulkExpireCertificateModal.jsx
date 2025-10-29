import { useState } from "react";
import { X, Clock, AlertTriangle, CheckCircle, XCircle } from "react-feather";

const BulkExpireCertificateModal = ({
    isOpen,
    onClose,
    selectedCount,
    onBulkExpire,
}) => {
    const [expiring, setExpiring] = useState(false);
    const [expireResult, setExpireResult] = useState(null);

    const handleConfirm = async () => {
        setExpiring(true);
        setExpireResult(null);
        try {
            await onBulkExpire();
            setExpireResult({ successful: selectedCount, failed: 0 });
        } catch (error) {
            console.error("Bulk expire error:", error);
            setExpireResult({
                successful: 0,
                failed: selectedCount,
                error: error.message,
            });
        } finally {
            setExpiring(false);
        }
    };

    const handleClose = () => {
        setExpireResult(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer">
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto cursor-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-300">
                    <div className="flex items-center">
                        <Clock size={20} className="text-yellow-600 mr-2" />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Bulk Expire Certificates
                            </h2>
                            <p className="text-sm text-gray-600">
                                Mark {selectedCount} certificates as expired
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                        disabled={expiring}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {!expireResult ? (
                        <>
                            <p className="text-gray-700">
                                Are you sure you want to mark {selectedCount}{" "}
                                certificates as expired?
                            </p>

                            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                <p className="text-sm text-yellow-800 font-medium mb-2">
                                    <AlertTriangle
                                        size={16}
                                        className="inline mr-1"
                                    />
                                    This action will:
                                </p>
                                <ul className="text-sm text-yellow-700 space-y-1">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        Mark selected certificates as "expired"
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        Set expiration date to current date
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        Make certificates invalid for
                                        verification
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        Require regeneration to restore access
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> This action can be
                                    reversed by regenerating the certificates.
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            {expireResult.failed === 0 ? (
                                <div className="text-green-600">
                                    <CheckCircle
                                        size={48}
                                        className="mx-auto mb-3"
                                    />
                                    <h3 className="text-lg font-semibold mb-2">
                                        Success!
                                    </h3>
                                    <p className="text-gray-700">
                                        Successfully expired{" "}
                                        {expireResult.successful} certificates.
                                    </p>
                                </div>
                            ) : expireResult.successful === 0 ? (
                                <div className="text-red-600">
                                    <XCircle
                                        size={48}
                                        className="mx-auto mb-3"
                                    />
                                    <h3 className="text-lg font-semibold mb-2">
                                        Failed
                                    </h3>
                                    <p className="text-gray-700">
                                        Failed to expire any certificates.{" "}
                                        {expireResult.error}
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
                                        Expired {expireResult.successful} out of{" "}
                                        {selectedCount} certificates.
                                        {expireResult.failed > 0 &&
                                            ` ${expireResult.failed} failed.`}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t border-gray-300 bg-gray-50">
                    {!expireResult ? (
                        <>
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={expiring}
                                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={expiring}
                                className="px-4 py-2 text-sm text-white bg-yellow-600 rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-2"
                            >
                                {expiring ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Expiring...
                                    </>
                                ) : (
                                    <>
                                        <Clock size={14} />
                                        Expire {selectedCount} Certificates
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BulkExpireCertificateModal;
