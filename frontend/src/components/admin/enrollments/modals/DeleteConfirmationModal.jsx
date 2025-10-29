import { useState } from "react";
import { X, AlertTriangle } from "react-feather";

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    enrollment,
    isBulk = false,
    selectedCount = 0,
}) => {
    const [deleting, setDeleting] = useState(false);

    const handleConfirm = async () => {
        setDeleting(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setDeleting(false);
        }
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
                        <AlertTriangle
                            size={20}
                            className="text-red-600 mr-2"
                        />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Confirm Deletion
                            </h2>
                            <p className="text-sm text-gray-600">
                                {isBulk
                                    ? "Delete multiple enrollments"
                                    : "Delete enrollment record"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                        disabled={deleting}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    {isBulk ? (
                        <>
                            <p className="text-gray-700">
                                You are about to delete{" "}
                                <strong>
                                    {selectedCount} enrollment records
                                </strong>
                                . This action cannot be undone.
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                <p className="text-sm text-yellow-800">
                                    <strong>Warning:</strong> All selected
                                    enrollment records will be permanently
                                    removed from the system.
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-700">
                                Are you sure you want to delete the enrollment
                                record for:
                            </p>
                            <div className="bg-gray-50 rounded p-3">
                                <p className="font-medium text-gray-800">
                                    {enrollment?.user?.role === "company"
                                        ? enrollment.user.companyName
                                        : `${enrollment?.user?.firstName} ${enrollment?.user?.surname}`}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Course: {enrollment?.course?.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Progress: {enrollment?.progress}% • Status:{" "}
                                    <span className="capitalize">
                                        {enrollment?.status}
                                    </span>
                                </p>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded p-3">
                                <p className="text-sm text-red-800">
                                    <strong>
                                        This action cannot be undone.
                                    </strong>{" "}
                                    The enrollment record and all associated
                                    progress data will be permanently deleted.
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t border-gray-300 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={deleting}
                        className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={deleting}
                        className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        {deleting ? (
                            <span className="flex items-center gap-1">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Deleting...
                            </span>
                        ) : (
                            `Delete ${
                                isBulk ? `(${selectedCount})` : "Enrollment"
                            }`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
