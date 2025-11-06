import { Users, Calendar, ArrowRight } from "react-feather";
import {
    getEnrollmentDeadline,
    getCourseAccessType,
} from "../../../utils/courseUtils";

function CourseCard({
    course,
    user,
    enrollmentStatus,
    onEnroll,
    onCourseClick,
    isUserEnrolled,
    getEnrollmentStatus,
}) {
    if (!course || !course._id) {
        console.warn("Invalid course data:", course);
        return (
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 flex flex-col">
                <div className="w-full h-48 bg-gray-200 rounded-t-xl flex items-center justify-center">
                    <span className="text-gray-500">Course unavailable</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                    <h4 className="font-semibold text-gray-800 mb-2">
                        Course Not Available
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                        This course is currently unavailable.
                    </p>
                    <button
                        disabled
                        className="w-full min-h-11 py-2.5 rounded-lg text-sm font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
                    >
                        Unavailable
                    </button>
                </div>
            </div>
        );
    }

    const isEnrolling = enrollmentStatus === "enrolling";
    const enrollmentSuccess = enrollmentStatus === "success";
    const enrollmentError = enrollmentStatus === "error";

    const enrollmentDeadline = getEnrollmentDeadline(course);
    const courseAccessType = getCourseAccessType(course);

    const handleContentClick = (e) => {
        if (e.target.closest("button") || e.target.closest("a")) {
            return;
        }
        if (onCourseClick && course._id) {
            onCourseClick(course._id);
        }
    };

    const handleViewDetails = (e) => {
        e.stopPropagation();
        if (onCourseClick && course._id) {
            onCourseClick(course._id);
        }
    };

    const handleEnrollClick = (e) => {
        e.stopPropagation();
        if (onEnroll && course._id) {
            onEnroll(course._id, course.title || "this course");
        }
    };

    return (
        <div
            className="bg-white rounded-xl shadow-xs border border-gray-100 hover:shadow-sm transition-all duration-200 flex flex-col cursor-pointer group"
            onClick={handleContentClick}
        >
            <img
                src={course?.image || "/default-course.jpg"}
                alt={course?.title || ""}
                className="w-full h-48 object-cover rounded-t-xl group-hover:brightness-95 transition-all duration-200"
                onError={(e) => {
                    e.target.src = "/default-course.jpg";
                }}
                loading="lazy"
            />
            <div className="p-6 flex-1 flex flex-col">
                {/* Course badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                            enrollmentDeadline?.color ||
                            "bg-gray-100 text-gray-800"
                        }`}
                    >
                        {enrollmentDeadline?.text || "Enrollment Open"}
                    </span>
                    <span
                        className={`hidden xl:inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            courseAccessType?.color ||
                            "bg-gray-100 text-gray-800"
                        }`}
                    >
                        {courseAccessType?.text || "Self-paced"}
                    </span>
                </div>

                <h4 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {course.title || "Untitled Course"}
                </h4>

                <p className="text-gray-600 text-sm mb-4 line-clamp-1 flex-1">
                    {course.description || "No description available"}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                        <Users size={14} className="mr-1" />
                        <span>{course.skillLevel || "All Levels"}</span>
                    </div>
                </div>

                {enrollmentSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 text-xs p-2 rounded mb-3">
                        Enrollment request submitted! Waiting for approval.
                    </div>
                )}

                {enrollmentError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2 rounded mb-3">
                        Enrollment failed. Please try again.
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={handleViewDetails}
                        className="flex-1 min-h-11 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-center flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white cursor-pointer"
                    >
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                    </button>

                    {!isUserEnrolled &&
                        user?.profileStatus !== "pending" &&
                        enrollmentDeadline?.status !== "closed" && (
                            <button
                                onClick={handleEnrollClick}
                                disabled={isEnrolling}
                                className={`min-h-11 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-center flex items-center justify-center ${
                                    isEnrolling
                                        ? "bg-blue-400 text-white cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                }`}
                            >
                                {isEnrolling ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        <span className="hidden sm:inline">
                                            Enrolling...
                                        </span>
                                        <span className="sm:hidden">...</span>
                                    </div>
                                ) : (
                                    "Enroll"
                                )}
                            </button>
                        )}
                </div>

                {/* Enrollment status messages */}
                {isUserEnrolled && (
                    <div className="mt-2 text-center">
                        <span className="text-sm text-gray-600">
                            {getEnrollmentStatus &&
                            getEnrollmentStatus(course._id) === "pending"
                                ? "Pending Approval"
                                : "Already Enrolled"}
                        </span>
                    </div>
                )}

                {user?.profileStatus === "pending" && (
                    <div className="mt-2 text-center">
                        <span className="text-sm text-yellow-600">
                            Profile Pending
                        </span>
                    </div>
                )}

                {enrollmentDeadline?.status === "closed" && (
                    <div className="mt-2 text-center">
                        <span className="text-sm text-red-600">
                            Enrollment Closed
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CourseCard;
