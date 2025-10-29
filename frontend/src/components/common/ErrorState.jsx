function ErrorState({ message, onRetry }) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <p className="text-red-600 text-sm mb-4">
                        Error: {message}
                    </p>
                    <button
                        onClick={onRetry}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        Retry
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ErrorState;
