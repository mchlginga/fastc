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

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition transform hover:-translate-y-1 flex flex-col">
            <img
                src={enrollment.course?.image || "/default-course.jpg"}
                alt={enrollment.course?.title || "Course"}
                className="w-full h-48 object-cover rounded-t-2xl"
                onError={(e) => {
                    e.target.src = "/default-course.jpg";
                }}
                loading="lazy"
            />
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-800">
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
                            className="bg-blue-600 h-2.5 rounded-full"
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
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: "100%" }}
                        ></div>
                    </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    {type === "active" && (
                        <span>Progress: {enrollment.progress || 0}%</span>
                    )}
                    {type === "completed" && (
                        <span className="text-green-600 font-medium">
                            100% Complete
                        </span>
                    )}
                    <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>
                            {type === "pending"
                                ? `Enrolled: ${new Date(
                                      enrollment.enrolledAt
                                  ).toLocaleDateString()}`
                                : type === "completed"
                                ? `Completed: ${
                                      enrollment.completedAt
                                          ? new Date(
                                                enrollment.completedAt
                                            ).toLocaleDateString()
                                          : "Unknown"
                                  }`
                                : enrollment.accessStatus || "Self-paced"}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-auto">
                    {type === "active" && (
                        <>
                            <button
                                onClick={onContinueLearning}
                                className="flex-1 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition text-center flex items-center justify-center cursor-pointer"
                            >
                                Continue Learning
                            </button>
                            <button
                                onClick={() =>
                                    onCancelEnrollment(
                                        enrollment.enrollmentId,
                                        enrollment.course.title
                                    )
                                }
                                disabled={
                                    cancellingEnrollment ===
                                    enrollment.enrollmentId
                                }
                                className="min-h-[44px] px-4 bg-gray-500 hover:bg-gray-600 text-white py-2.5 rounded-lg text-sm font-medium transition text-center flex items-center justify-center disabled:bg-gray-400 cursor-pointer"
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
                            <div className="flex-1 min-h-[44px] bg-yellow-100 text-yellow-800 text-center py-2.5 rounded-lg text-sm font-medium flex items-center justify-center">
                                Waiting for Admin Approval
                            </div>
                            <button
                                onClick={() =>
                                    onCancelEnrollment(
                                        enrollment.enrollmentId,
                                        enrollment.course.title
                                    )
                                }
                                disabled={
                                    cancellingEnrollment ===
                                    enrollment.enrollmentId
                                }
                                className="min-h-[44px] px-4 bg-gray-500 hover:bg-gray-600 text-white py-2.5 rounded-lg text-sm font-medium transition text-center flex items-center justify-center disabled:bg-gray-400 cursor-pointer"
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
                            onClick={
                                certificate ? onViewCertificate : onViewCourse
                            }
                            className="w-full min-h-[44px] bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium transition text-center flex items-center justify-center mt-auto cursor-pointer"
                        >
                            <CheckCircle size={16} className="mr-2" />
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
