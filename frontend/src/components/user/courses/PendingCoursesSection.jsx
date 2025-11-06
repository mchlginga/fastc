import EnrollmentCard from "./EnrollmentCard";
import EmptyState from "./EmptyState";
import { Clock, Search } from "react-feather";
import { useNavigate } from "react-router-dom";

function PendingCoursesSection({
    enrollments,
    cancellingEnrollment,
    onCancelEnrollment,
    searchQuery,
}) {
    const navigate = useNavigate();

    const handleViewCourse = (enrollment) => {
        navigate(`/user/courses/${enrollment.course.id}/overview`, {
            state: { from: "pending" },
        });
    };

    return (
        <section className="p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h3 className="text-xl font-semibold text-gray-800">
                    Pending Approval
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
                            {enrollments.length !== 1 ? "s" : ""} waiting for
                            approval
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
                            <Clock size={48} className="text-gray-400" />
                        )
                    }
                    title={
                        searchQuery
                            ? "No pending requests found"
                            : "No pending requests"
                    }
                    message={
                        searchQuery
                            ? "No pending requests match your search criteria."
                            : "No pending enrollment requests."
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
                            type="pending"
                            cancellingEnrollment={cancellingEnrollment}
                            onCancelEnrollment={onCancelEnrollment}
                            onViewCourse={() => handleViewCourse(enrollment)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default PendingCoursesSection;
