import { Link } from "react-router-dom";

function EmptyState({ icon, title, message, subMessage, action }) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-100">
            <div className="mx-auto mb-4 flex justify-center">{icon}</div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {title}
            </h4>
            <p className="text-gray-600 text-sm mb-2">{message}</p>
            {subMessage && (
                <p className="text-gray-500 text-xs mb-4">{subMessage}</p>
            )}
            {action && (
                <Link
                    to={action.path}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition inline-block"
                >
                    {action.label}
                </Link>
            )}
        </div>
    );
}

export default EmptyState;
