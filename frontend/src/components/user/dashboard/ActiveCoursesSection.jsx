import { Link } from "react-router-dom";
import { TrendingUp } from "react-feather";
import CourseCard from "./CourseCard";
import EmptyCoursesState from "./EmptyCoursesState";

function ActiveCoursesSection({ dashboardData }) {
    const activeCourses = dashboardData.enrollments
        .filter((enrollment) => enrollment.status === "active")
        .slice(0, 4); // Limit to 4 courses

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                    Your Active Courses
                </h3>
                <Link
                    to="/user/courses?status=active"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                    View All Active Courses{" "}
                    <TrendingUp size={16} className="ml-1" />
                </Link>
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
