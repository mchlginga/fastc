import CourseCard from "./CourseCard";
import EmptyState from "./EmptyState";
import { Book, Search } from "react-feather";

function AvailableCoursesSection({
    courses,
    user,
    enrollmentStatus,
    onEnroll,
    onCourseClick,
    isUserEnrolled,
    getEnrollmentStatus,
    searchQuery,
}) {
    return (
        <section className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h3 className="text-xl font-semibold text-gray-800">
                    Available Courses
                </h3>
                <div className="flex items-center gap-4">
                    {searchQuery && (
                        <span className="text-gray-600 text-sm">
                            {courses.length} result
                            {courses.length !== 1 ? "s" : ""} found
                        </span>
                    )}
                    <span className="text-gray-500 text-sm">
                        {courses.length} course{courses.length !== 1 ? "s" : ""}{" "}
                        available
                    </span>
                </div>
            </div>

            {courses.length === 0 ? (
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
                            ? "No courses found"
                            : "No courses available"
                    }
                    message={
                        searchQuery
                            ? "No courses match your search criteria. Try different keywords."
                            : "No courses available for enrollment at the moment."
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <CourseCard
                            key={course._id}
                            course={course}
                            user={user}
                            enrollmentStatus={enrollmentStatus[course._id]}
                            onEnroll={onEnroll}
                            onCourseClick={onCourseClick}
                            isUserEnrolled={isUserEnrolled(course._id)}
                            getEnrollmentStatus={getEnrollmentStatus}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default AvailableCoursesSection;
