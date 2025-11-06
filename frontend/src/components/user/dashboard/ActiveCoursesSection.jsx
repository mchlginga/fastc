import { Link } from "react-router-dom";
import { TrendingUp } from "react-feather";
import CourseCard from "./CourseCard";
import EmptyCoursesState from "./EmptyCoursesState";

function ActiveCoursesSection({ dashboardData }) {
    // Add null check
    if (!dashboardData) {
        return (
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 animate-pulse"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                </div>
                                <div className="h-6 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4"></div>
                            <div className="flex justify-between items-center text-sm mb-4">
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    const activeCourses =
        dashboardData.enrollments
            ?.filter((enrollment) => enrollment.status === "active")
            .slice(0, 4) || []; // Limit to 4 courses

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    Your Active Courses
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeCourses.map((enrollment) => (
                    <CourseCard
                        key={enrollment.enrollmentId}
                        enrollment={enrollment}
                    />
                ))}

                {activeCourses.length === 0 && (
                    <EmptyCoursesState dashboardData={dashboardData} />
                )}
            </div>
        </section>
    );
}

export default ActiveCoursesSection;
