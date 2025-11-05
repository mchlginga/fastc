import { Link } from "react-router-dom";
import {
    Users,
    Book,
    Clipboard,
    Settings,
    Download,
    Shield,
} from "react-feather";

const QuickActions = () => {
    const actions = [
        {
            title: "Manage Users",
            description: "View and manage all system users",
            link: "/admin/users",
            bg: "bg-blue-50",
            border: "border-blue-200",
        },
        {
            title: "Course Management",
            description: "Create and manage courses",
            link: "/admin/courses",
            bg: "bg-green-50",
            border: "border-green-200",
        },
        {
            title: "Enrollments",
            description: "Process course enrollments",
            link: "/admin/enrollments",
            bg: "bg-purple-50",
            border: "border-purple-200",
        },
        {
            title: "Job Matching",
            description: "Manage CSV exports and job matches",
            link: "/admin/job-match",
            bg: "bg-orange-50",
            border: "border-orange-200",
        },
        {
            title: "System Settings",
            description: "Configure system preferences",
            link: "/admin/settings",
            bg: "bg-gray-50",
            border: "border-gray-200",
        },
        {
            title: "Admin Tools",
            description: "Advanced administration tools",
            link: "/admin/tools",
            bg: "bg-red-50",
            border: "border-red-200",
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
            </h3>

            <div className="grid grid-cols-1 gap-3">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        to={action.link}
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 ${action.bg} ${action.border}`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="shrink-0">{action.icon}</div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-800 truncate">
                                    {action.title}
                                </h4>
                                <p className="text-xs text-gray-600 truncate">
                                    {action.description}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
