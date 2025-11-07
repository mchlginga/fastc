import { useEffect } from "react";
import {
    X,
    CheckCircle,
    AlertCircle,
    AlertTriangle,
    Info,
} from "react-feather";

const ToastNotification = ({ message, type = "success", onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const getToastStyles = () => {
        switch (type) {
            case "success":
                return {
                    bg: "bg-emerald-50",
                    border: "border-emerald-200",
                    text: "text-emerald-800",
                };
            case "error":
                return {
                    bg: "bg-red-50",
                    border: "border-red-200",
                    text: "text-red-800",
                };
            case "warning":
                return {
                    bg: "bg-amber-50",
                    border: "border-amber-200",
                    text: "text-amber-800",
                };
            case "info":
                return {
                    bg: "bg-blue-50",
                    border: "border-blue-200",
                    text: "text-blue-800",
                };
            default:
                return {
                    bg: "bg-blue-50",
                    border: "border-blue-200",
                    text: "text-blue-800",
                };
        }
    };

    const styles = getToastStyles();

    return (
        <div className="fixed top-4 right-4 z-50 transform transition-all duration-300 animate-in slide-in-from-right-full">
            <div
                className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg ${styles.bg} ${styles.border} ${styles.text}`}
            >
                <div className="shrink-0">{styles.icon}</div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-relaxed">
                        {message}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default ToastNotification;
