import { X, AlertTriangle, Info, AlertCircle } from "react-feather";

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
                    icon: <AlertTriangle size={20} className="text-red-600" />,
                    confirmButton:
                        "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white",
                    iconBg: "bg-red-50",
                    textColor: "text-red-600",
                };
            case "info":
                return {
                    icon: <Info size={20} className="text-blue-600" />,
                    confirmButton:
                        "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white",
                    iconBg: "bg-blue-50",
                    textColor: "text-blue-600",
                };
            case "warning":
            default:
                return {
                    icon: <AlertCircle size={20} className="text-amber-600" />,
                    confirmButton:
                        "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white",
                    iconBg: "bg-amber-50",
                    textColor: "text-amber-600",
                };
        }
    };

    const typeStyles = getTypeStyles();

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !isLoading) {
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all cursor-auto">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div
                            className={`shrink-0 p-3 rounded-xl ${typeStyles.iconBg}`}
                        >
                            {typeStyles.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {message}
                            </p>
                        </div>
                        {!isLoading && (
                            <button
                                onClick={onClose}
                                className="shrink-0 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <button
                        type="button"
                        disabled={isLoading}
                        className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        disabled={isLoading}
                        className={`px-4 py-2.5 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer ${typeStyles.confirmButton}`}
                        onClick={handleConfirm}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
