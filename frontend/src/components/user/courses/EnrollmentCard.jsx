import { Clock, X, CheckCircle } from "react-feather";
import { getStatusConfig } from "../../../utils/enrollmentUtils";

function EnrollmentCard({
    enrollment,
    type,
    cancellingEnrollment,
    onCancelEnrollment,
    onContinueLearning,
    onViewCertificate,
    onViewCourse,
    certificate,
}) {
    if (!enrollment || !enrollment.course) return null;

    const statusConfig = getStatusConfig(enrollment.status);

    const handleContentClick = (e) => {
        // Don't trigger if clicking on buttons
        if (e.target.closest("button") || e.target.closest("a")) {
            return;
        }
        // For active courses, navigate to course
        if (type === "active" && onContinueLearning) {
            onContinueLearning();
        }
        // For completed courses, navigate to course overview
        if (type === "completed" && onViewCourse) {
            onViewCourse();
        }
        if (type === "pending" && onViewCourse) {
            onViewCourse();
        }
    };

    const getDateLabel = () => {
        if (type === "pending") {
            // Use requestedAt for pending enrollments
            const dateToUse = enrollment.requestedAt || enrollment.enrolledAt;
            return `Requested: ${new Date(dateToUse).toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                }
            )}`;
        }

        if (type === "completed") {
            return `Completed: ${
                enrollment.completedAt
                    ? new Date(enrollment.completedAt).toLocaleDateString(
                          "en-US",
                          {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                          }
                      )
                    : "Unknown"
            }`;
        }

        // For active courses, show when they were actually enrolled
        if (type === "active" && enrollment.enrolledAt) {
            return `Enrolled: ${new Date(
                enrollment.enrolledAt
            ).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            })}`;
        }

        return enrollment.accessStatus || "Self-paced";
    };

    const getPendingStatusText = () => {
        return "Waiting for Admin Approval";
    };

    return (
        <div
            className="bg-white rounded-xl shadow-xs border border-gray-100 hover:shadow-sm transition-all duration-200 flex flex-col group cursor-pointer"
            onClick={handleContentClick}
        >
            <img
                src={enrollment.course?.image || "/default-course.jpg"}
                alt={enrollment.course?.title || "Course"}
                className="w-full h-48 object-cover rounded-t-xl group-hover:brightness-95 transition-all duration-200"
                onError={(e) => {
                    e.target.src = "/default-course.jpg";
                }}
                loading="lazy"
            />
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                        {enrollment.course.title || "Untitled Course"}
                    </h4>
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                    >
                        {statusConfig.icon}
                        {statusConfig.label}
                    </span>
                </div>

                {/* Progress bar for active courses */}
                {type === "active" && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{
                                width: `${enrollment.progress || 0}%`,
                            }}
                        ></div>
                    </div>
                )}

                {/* Completed progress bar */}
                {type === "completed" && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div
                            className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: "100%" }}
                        ></div>
                    </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    {type === "active" && (
                        <span>Progress: {enrollment.progress || 0}%</span>
                    )}

                    <span>{getDateLabel()}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-auto">
                    {type === "active" && (
                        <>
                            <button
                                onClick={onContinueLearning}
                                className="flex-1 min-h-11 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-center flex items-center justify-center cursor-pointer"
                            >
                                Continue Learning
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCancelEnrollment(
                                        enrollment.enrollmentId,
                                        enrollment.course.title
                                    );
                                }}
                                disabled={
                                    cancellingEnrollment ===
                                    enrollment.enrollmentId
                                }
                                className="min-h-11 px-4 bg-gray-500 hover:bg-gray-600 text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-center flex items-center justify-center disabled:bg-gray-400 cursor-pointer"
                            >
                                {cancellingEnrollment ===
                                enrollment.enrollmentId ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <X size={16} />
                                )}
                            </button>
                        </>
                    )}

                    {type === "pending" && (
                        <>
                            <div className="flex-1 min-h-11 bg-yellow-100 text-yellow-800 text-center py-2.5 rounded-lg text-sm font-medium flex items-center justify-center">
                                {getPendingStatusText()}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCancelEnrollment(
                                        enrollment.enrollmentId,
                                        enrollment.course.title
                                    );
                                }}
                                disabled={
                                    cancellingEnrollment ===
                                    enrollment.enrollmentId
                                }
                                className="min-h-11 px-4 bg-gray-500 hover:bg-gray-600 text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-center flex items-center justify-center disabled:bg-gray-400 cursor-pointer"
                            >
                                {cancellingEnrollment ===
                                enrollment.enrollmentId ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <X size={16} />
                                )}
                            </button>
                        </>
                    )}

                    {type === "completed" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                certificate
                                    ? onViewCertificate()
                                    : onViewCourse();
                            }}
                            className="w-full min-h-11 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-center flex items-center justify-center mt-auto cursor-pointer"
                        >
                            {certificate
                                ? "View Certificate"
                                : "Course Completed"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EnrollmentCard;
