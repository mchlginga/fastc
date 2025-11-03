import { AlertCircle, RefreshCw } from "react-feather";

function ErrorState({ message, onRetry, title = "Something went wrong" }) {
    return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-red-100 rounded-xl">
                            <AlertCircle size={24} className="text-red-600" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {message}
                    </p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ErrorState;
