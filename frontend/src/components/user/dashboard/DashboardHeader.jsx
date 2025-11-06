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
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Welcome back, {user?.firstName || "Learner"}
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                        {getWelcomeMessage()}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DashboardHeader;
