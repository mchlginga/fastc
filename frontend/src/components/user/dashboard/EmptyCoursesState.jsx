import { Link } from "react-router-dom";
import { Book, Activity } from "react-feather";

function EmptyCoursesState({ dashboardData }) {
    const getMessage = () => {
        if (dashboardData.pendingEnrollments > 0) {
            return "You have courses waiting for approval. Once approved, they will appear here.";
        } else if (dashboardData.completedEnrollments > 0) {
            return "You've completed your courses. Explore new courses to continue learning.";
        }
        return "Start your learning journey by enrolling in available courses.";
    };

    const getButtonText = () => {
        return dashboardData.pendingEnrollments > 0
            ? "View Pending Courses"
            : "Browse Courses";
    };

    const getButtonLink = () => {
        return dashboardData.pendingEnrollments > 0
            ? "/user/courses?status=pending"
            : "/user/courses";
    };

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 text-center text-gray-600 col-span-2">
            <Book size={48} className="mx-auto mb-4 text-gray-300" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                No active courses
            </h4>
            <p className="text-gray-600 mb-4">{getMessage()}</p>
            <Link
                to={getButtonLink()}
                className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
            >
                <Activity size={16} className="mr-2" />
                {getButtonText()}
            </Link>
        </div>
    );
}

export default EmptyCoursesState;
