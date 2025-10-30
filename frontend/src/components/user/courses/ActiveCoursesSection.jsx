import { useNavigate } from "react-router-dom";
import EnrollmentCard from "./EnrollmentCard";
import EmptyState from "./EmptyState";
import { Book, Search } from "react-feather";

function ActiveCoursesSection({
    enrollments,
    cancellingEnrollment,
    onCancelEnrollment,
    searchQuery,
}) {
    const navigate = useNavigate();

    // 🆕 FIXED: Proper navigation to course detail
    const handleContinueLearning = (enrollment) => {
        console.log("🎯 Navigating to course:", enrollment.course.id);
        navigate(`/user/courses/${enrollment.course.id}`);
    };

    return (
        <section className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h3 className="text-xl font-semibold text-gray-800">
                    Active Courses
                </h3>
                <div className="flex items-center gap-4">
                    {searchQuery && (
                        <span className="text-gray-600 text-sm">
                            {enrollments.length} result
                            {enrollments.length !== 1 ? "s" : ""} found
                        </span>
                    )}
                    {enrollments.length > 0 && (
                        <span className="text-gray-500 text-sm">
                            {enrollments.length} course
                            {enrollments.length !== 1 ? "s" : ""} in progress
                        </span>
                    )}
                </div>
            </div>

            {enrollments.length === 0 ? (
                <EmptyState
                    icon={
                        searchQuery ? (
                            <Search size={48} className="text-gray-400" />
                        ) : (
                            <Book size={48} className="text-gray-400" />
                        )
                    }
                    title={
                        searchQuery
                            ? "No active courses found"
                            : "No active courses"
                    }
                    message={
                        searchQuery
                            ? "No active courses match your search criteria."
                            : "You don't have any active courses."
                    }
                    action={
                        !searchQuery
                            ? {
                                  label: "Browse Available Courses",
                                  path: "/user/courses",
                              }
                            : null
                    }
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {enrollments.map((enrollment) => (
                        <EnrollmentCard
                            key={enrollment.enrollmentId}
                            enrollment={enrollment}
                            type="active"
                            cancellingEnrollment={cancellingEnrollment}
                            onCancelEnrollment={onCancelEnrollment}
                            onContinueLearning={() =>
                                handleContinueLearning(enrollment)
                            }
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default ActiveCoursesSection;
