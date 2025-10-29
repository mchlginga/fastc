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
        <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-600 col-span-2 border border-gray-100">
            <Book size={48} className="mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-semibold mb-2">No active courses</h4>
            <p className="mb-4">{getMessage()}</p>
            <Link
                to={getButtonLink()}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
                <Activity size={16} className="mr-2" />
                {getButtonText()}
            </Link>
        </div>
    );
}

export default EmptyCoursesState;
