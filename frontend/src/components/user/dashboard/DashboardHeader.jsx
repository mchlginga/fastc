import { Link } from "react-router-dom";

function DashboardHeader({ user, dashboardData }) {
    const getWelcomeMessage = () => {
        if (dashboardData.activeEnrollments > 0) {
            return `Continue your ${
                dashboardData.activeEnrollments
            } active course${
                dashboardData.activeEnrollments > 1 ? "s" : ""
            } and track your progress.`;
        } else if (dashboardData.pendingEnrollments > 0) {
            return `You have ${dashboardData.pendingEnrollments} course${
                dashboardData.pendingEnrollments > 1 ? "s" : ""
            } waiting for approval.`;
        }
        return "Start your learning journey by enrolling in courses.";
    };

    return (
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl text-white p-8 mb-10 shadow-lg overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('/wave-pattern.svg')] bg-cover"></div>
            <div className="relative z-10">
                <h1 className="text-4xl font-bold mb-2">
                    Welcome back, {user?.firstName || "Learner"} 👋
                </h1>
                <p className="text-blue-100 text-lg">{getWelcomeMessage()}</p>
            </div>
        </div>
    );
}

export default DashboardHeader;
