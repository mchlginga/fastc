import { Link } from "react-router-dom";
import { Clock } from "react-feather";
import { getStatusConfig } from "../../../utils/enrollmentUtils";

function CourseCard({ enrollment }) {
    const statusConfig = getStatusConfig(enrollment.status);

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 hover:shadow-sm transition-all duration-200 cursor-default">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {enrollment.course.title}
                    </h4>
                </div>
                <StatusBadge statusConfig={statusConfig} />
            </div>

            {/* Progress bar for active courses */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${enrollment.progress}%` }}
                ></div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span>Progress: {enrollment.progress}%</span>
                <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{enrollment.accessStatus || "Self-paced"}</span>
                </div>
            </div>

            {/* Continue Learning button for active courses */}
            <Link
                to={`/user/courses/${enrollment.course.id}`}
                className="block w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
            >
                Continue Learning
            </Link>
        </div>
    );
}

const StatusBadge = ({ statusConfig }) => (
    <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
    >
        {statusConfig.icon}
        {statusConfig.label}
    </span>
);

export default CourseCard;
