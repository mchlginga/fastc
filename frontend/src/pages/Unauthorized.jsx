import { Link } from "react-router-dom";
import { Lock } from "react-feather";

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
            <div className="bg-white shadow-md rounded-2xl p-10 max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="bg-yellow-100 p-4 rounded-full">
                        <Lock className="w-10 h-10 text-yellow-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                    Access Denied
                </h1>

                <p className="text-gray-600 mb-8">
                    You don’t have permission to view this page. Please contact
                    your administrator or return to a safe page.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        to="/"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                    >
                        Go to Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition duration-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>

            <p className="mt-8 text-sm text-gray-500">
                © 2025 FAST-C Digital Profiling System
            </p>
        </div>
    );
};

export default Unauthorized;
