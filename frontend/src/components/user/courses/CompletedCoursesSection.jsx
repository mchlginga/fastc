import { useNavigate } from "react-router-dom";
import EnrollmentCard from "./EnrollmentCard";
import EmptyState from "./EmptyState";
import { Award, Search } from "react-feather";

function CompletedCoursesSection({ enrollments, certificates, searchQuery }) {
    const navigate = useNavigate();

    return (
        <section className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h3 className="text-xl font-semibold text-gray-800">
                    Completed Courses
                </h3>
                <div className="flex items-center gap-4">
                    {searchQuery && (
                        <span className="text-gray-600 text-sm">
                            {enrollments.length} result
                            {enrollments.length !== 1 ? "s" : ""} found
                        </span>
                    )}
                    {enrollments.length > 0 && (
                        <span
                            onClick={() => navigate("/user/certificates")}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center cursor-pointer"
                        >
                            View Certificates
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
                            <Award size={48} className="text-gray-400" />
                        )
                    }
                    title={
                        searchQuery
                            ? "No completed courses found"
                            : "No completed courses"
                    }
                    message={
                        searchQuery
                            ? "No completed courses match your search criteria."
                            : "You haven't completed any courses yet."
                    }
                    subMessage={
                        !searchQuery
                            ? "Finish a course to earn a certificate."
                            : null
                    }
                    action={
                        !searchQuery
                            ? {
                                  label: "Browse Courses",
                                  path: "/user/courses",
                              }
                            : null
                    }
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {enrollments.map((enrollment) => {
                        const certificate = certificates.find(
                            (cert) => cert.course === enrollment.course.id
                        );

                        return (
                            <EnrollmentCard
                                key={enrollment.enrollmentId}
                                enrollment={enrollment}
                                type="completed"
                                certificate={certificate}
                                onViewCertificate={() =>
                                    navigate("/user/certificates")
                                }
                                onViewCourse={() =>
                                    navigate(
                                        `/user/courses/${enrollment.course.id}`
                                    )
                                }
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default CompletedCoursesSection;
