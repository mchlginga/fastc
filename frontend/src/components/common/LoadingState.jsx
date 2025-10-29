import DashboardSkeleton from "../user/dashboard/DashboardSkeleton";
import CoursesSkeleton from "../user/courses/CoursesSkeleton";
import CourseOverviewSkeleton from "../user/courses/CoursesSkeleton";

function LoadingState({ message = "Loading...", type = "spinner" }) {
    if (type === "spinner") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-sm">{message}</p>
                </div>
            </div>
        );
    }

    if (type === "dashboard-skeleton") {
        return <DashboardSkeleton />;
    }

    if (type === "courses-skeleton") {
        return <CoursesSkeleton />;
    }

    if (type === "course-overview") {
        return <CourseOverviewSkeleton />;
    }

    return null;
}

export default LoadingState;
