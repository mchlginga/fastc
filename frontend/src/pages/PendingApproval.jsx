import { useNavigate } from "react-router-dom";
import { Award, Clock } from "react-feather";
import { useAuth } from "../context/AuthContext";

const PendingApproval = () => {
    const navigate = useNavigate();
    const { handleLogout } = useAuth();

    const Logout = async () => {
        try {
            await handleLogout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleContactSupport = () => {
        window.location.href = "mailto:support@fastc.com";
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                    <Award size={40} className="text-blue-600 mr-2" />
                    <h1 className="text-2xl font-bold text-gray-800">FAST-C</h1>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-yellow-100 p-4 rounded-full">
                        <Clock className="w-10 h-10 text-yellow-500" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Your Account is Under Review
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
                    Our FAST-C admin team is currently verifying your details.
                    You’ll receive an email once your account is approved.
                </p>

                {/* Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        onClick={Logout}
                        className="w-full px-5 py-3 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 cursor-pointer"
                    >
                        Logout
                    </button>
                    <button
                        onClick={handleContactSupport}
                        className="w-full px-5 py-3 rounded-lg text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 cursor-pointer"
                    >
                        Contact Support
                    </button>
                </div>
            </div>

            {/* Footer */}
            <p className="mt-8 text-center text-sm text-gray-500">
                © 2025 FAST-C Digital Profiling System
            </p>
        </div>
    );
};

export default PendingApproval;
