import { Link } from "react-router-dom";

function EmptyState({
    icon,
    title,
    message,
    subMessage,
    action,
    className = "",
}) {
    return (
        <div
            className={`bg-white rounded-xl shadow-xs border border-gray-100 p-6 text-center ${className}`}
        >
            <div className="mx-auto mb-3 flex justify-center text-gray-300">
                {icon}
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
            </h4>
            <p className="text-gray-600 text-sm mb-2">{message}</p>
            {subMessage && (
                <p className="text-gray-500 text-xs mb-4">{subMessage}</p>
            )}
            {action && (
                <Link
                    to={action.path}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {action.label}
                </Link>
            )}
        </div>
    );
}

export default EmptyState;
