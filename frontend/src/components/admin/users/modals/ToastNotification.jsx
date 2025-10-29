import { useEffect } from "react";
import { X, Check, Clock } from "react-feather";

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
                return "bg-green-50 border-green-200 text-green-800";
            case "error":
                return "bg-red-50 border-red-200 text-red-800";
            default:
                return "bg-blue-50 border-blue-200 text-blue-800";
        }
    };

    const getIcon = () => {
        switch (type) {
            case "success":
                return <Check size={20} className="text-green-600 mr-3" />;
            case "error":
                return <X size={20} className="text-red-600 mr-3" />;
            default:
                return <Clock size={20} className="text-blue-600 mr-3" />;
        }
    };

    return (
        <div className="fixed top-4 right-4 z-[102] transform transition-transform duration-300 animate-in slide-in-from-right">
            <div
                className={`flex items-center p-4 rounded-lg shadow-lg border ${getToastStyles()}`}
            >
                <div className="flex items-center">
                    {getIcon()}
                    <span className="text-sm font-medium">{message}</span>
                </div>
                <button
                    onClick={onClose}
                    className="ml-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default ToastNotification;
