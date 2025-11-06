import { Link } from "react-router-dom";
import { Activity, Award } from "react-feather";

function ProgressOverview({ dashboardData }) {
    // Add null check
    if (!dashboardData) {
        return (
            <section className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-xs border border-gray-100 mb-8 overflow-hidden">
                <div className="p-8 md:w-1/3 flex justify-center items-center">
                    <div className="w-40 h-40 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="p-8 md:w-2/3 border-l border-gray-100">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-6 animate-pulse"></div>
                    <div className="flex gap-3">
                        <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
                        <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                    </div>
                </div>
            </section>
        );
    }

    const getProgressMessage = () => {
        if (dashboardData.activeEnrollments > 0) {
            return "You're making great progress! Keep going to earn more certificates and enhance your skills.";
        } else if (dashboardData.pendingEnrollments > 0) {
            return "Your course enrollments are pending admin approval. You'll be notified once approved to start learning.";
        }
        return "Ready to start learning? Browse available courses and begin your certification journey.";
    };

    return (
        <section className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-xs border border-gray-100 mb-8 overflow-hidden">
            <div className="p-8 md:w-1/3 flex justify-center items-center">
                <CircularProgress progress={dashboardData.totalProgress || 0} />
            </div>
            <div className="p-8 md:w-2/3 border-l border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Learning Insights
                </h3>
                <p className="text-gray-600 mb-4">{getProgressMessage()}</p>
                <div className="flex gap-3">
                    <Link
                        to="/user/courses"
                        className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                    >
                        <span className="hidden sm:inline">
                            {dashboardData.activeEnrollments > 0
                                ? "Continue Learning"
                                : "Browse Courses"}
                        </span>
                        <span className="sm:hidden">Continue</span>
                    </Link>
                    {dashboardData.certificates > 0 && (
                        <Link
                            to="/user/certificates"
                            className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                        >
                            <span className="hidden sm:inline">
                                View Certificates
                            </span>
                            <span className="sm:hidden">View</span>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}

const CircularProgress = ({ progress }) => (
    <div className="relative w-40 h-40">
        <svg className="absolute inset-0" viewBox="0 0 36 36">
            <path
                className="text-gray-200"
                strokeWidth="3.8"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
                className="text-blue-600"
                strokeWidth="3.8"
                strokeDasharray={`${progress}, 100`}
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
        </svg>
        <div className="absolute inset-0 flex flex-col justify-center items-center">
            <span className="text-3xl font-bold text-gray-900">
                {progress}%
            </span>
            <span className="text-xs text-gray-500 mt-1">Overall Progress</span>
        </div>
    </div>
);

export default ProgressOverview;
