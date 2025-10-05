import { Link } from "react-router-dom";
import { AlertTriangle } from "react-feather";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
            <div className="bg-white shadow-md rounded-2xl p-10 max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-gray-800 mb-3">
                    404 - Page Not Found
                </h1>

                <p className="text-gray-600 mb-8">
                    The page you’re looking for doesn’t exist or may have been
                    moved.
                </p>

                <Link
                    to="/"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                >
                    Go Back Home
                </Link>
            </div>

            <p className="mt-8 text-sm text-gray-500">
                © 2025 FAST-C Digital Profiling System
            </p>
        </div>
    );
};

export default NotFound;
