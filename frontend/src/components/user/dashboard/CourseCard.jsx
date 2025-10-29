import { Link } from "react-router-dom";
import { Clock } from "react-feather";
import { getStatusConfig } from "../../../utils/enrollmentUtils"; // This will now work correctly

function CourseCard({ enrollment }) {
    const statusConfig = getStatusConfig(enrollment.status);

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-100">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">
                        {enrollment.course.title}
                    </h4>
                </div>
                <StatusBadge statusConfig={statusConfig} />
            </div>

            {/* Progress bar for active courses */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${enrollment.progress}%` }}
                ></div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Progress: {enrollment.progress}%</span>
                <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{enrollment.accessStatus || "Self-paced"}</span>
                </div>
            </div>

            {/* Continue Learning button for active courses */}
            <Link
                to={`/user/courses/${enrollment.course.id}`}
                className="block w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg text-sm font-medium transition"
            >
                Continue Learning
            </Link>
        </div>
    );
}

const StatusBadge = ({ statusConfig }) => (
    <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} flex items-center`}
    >
        {statusConfig.icon}
        {statusConfig.label}
    </span>
);

export default CourseCard;
