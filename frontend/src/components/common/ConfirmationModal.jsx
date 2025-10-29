import { X, AlertTriangle } from "react-feather";

const ConfirmationModal = ({
    isOpen = false,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "warning", // warning, danger, info
    isLoading = false,
}) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case "danger":
                return {
                    icon: <AlertTriangle size={24} className="text-red-600" />,
                    confirmButton:
                        "bg-red-600 hover:bg-red-700 focus:ring-red-500",
                    iconBg: "bg-red-100",
                };
            case "info":
                return {
                    icon: <AlertTriangle size={24} className="text-blue-600" />,
                    confirmButton:
                        "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
                    iconBg: "bg-blue-100",
                };
            case "warning":
            default:
                return {
                    icon: (
                        <AlertTriangle size={24} className="text-yellow-600" />
                    ),
                    confirmButton:
                        "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
                    iconBg: "bg-yellow-100",
                };
        }
    };

    const typeStyles = getTypeStyles();

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (!isLoading) {
            onConfirm();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[103] overflow-y-auto"
            onClick={handleBackdropClick}
        >
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                {/* Backdrop */}
                <div className="fixed inset-0 bg-black/60 transition-opacity" />

                {/* Modal panel */}
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div
                                className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${typeStyles.iconBg} sm:mx-0 sm:h-10 sm:w-10`}
                            >
                                {typeStyles.icon}
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                                    {title}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                            type="button"
                            disabled={isLoading}
                            className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${typeStyles.confirmButton} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto cursor-pointer`}
                            onClick={handleConfirm}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Processing...
                                </div>
                            ) : (
                                confirmText
                            )}
                        </button>
                        <button
                            type="button"
                            disabled={isLoading}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:mt-0 sm:w-auto cursor-pointer"
                            onClick={onClose}
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
