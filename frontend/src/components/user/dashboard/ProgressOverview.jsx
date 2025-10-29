import { Link } from "react-router-dom";
import { Activity, Award } from "react-feather";

function ProgressOverview({ dashboardData }) {
    const getProgressMessage = () => {
        if (dashboardData.activeEnrollments > 0) {
            return "You're making great progress! Keep going to earn more certificates and enhance your skills.";
        } else if (dashboardData.pendingEnrollments > 0) {
            return "Your course enrollments are pending admin approval. You'll be notified once approved to start learning.";
        }
        return "Ready to start learning? Browse available courses and begin your certification journey.";
    };

    return (
        <section className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-md mb-10 overflow-hidden border border-gray-100">
            <div className="p-8 md:w-1/3 flex justify-center items-center">
                <CircularProgress progress={dashboardData.totalProgress} />
            </div>
            <div className="p-8 md:w-2/3 border-l border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Learning Insights
                </h3>
                <p className="text-gray-600 mb-4">{getProgressMessage()}</p>
                <div className="flex gap-3">
                    <Link
                        to="/user/courses"
                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
                    >
                        <Activity size={16} className="mr-2" />
                        {dashboardData.activeEnrollments > 0
                            ? "Continue Learning"
                            : "Browse Courses"}
                    </Link>
                    {dashboardData.certificates > 0 && (
                        <Link
                            to="/user/certificates"
                            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
                        >
                            <Award size={16} className="mr-2" /> View
                            Certificates
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
            <span className="text-3xl font-bold text-gray-800">
                {progress}%
            </span>
            <span className="text-gray-500 text-sm">Overall Progress</span>
        </div>
    </div>
);

export default ProgressOverview;
