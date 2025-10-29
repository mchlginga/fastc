import {
    BarChart2,
    Award,
    Target,
    Users,
    Book,
    Clipboard,
} from "react-feather";

const SystemOverview = ({ overview }) => {
    const overviewItems = [
        {
            label: "Total Certificates",
            value: overview.totalCertificates || 0,
            icon: <Award size={18} className="text-purple-600" />,
        },
        {
            label: "Completion Rate",
            value: `${overview.completionRate || 0}%`,
            icon: <Target size={18} className="text-green-600" />,
        },
        {
            label: "Online Users",
            value: overview.onlineUsers || 0,
            icon: <Users size={18} className="text-blue-600" />,
        },
        {
            label: "Total Courses",
            value: overview.totalCourses || 0,
            icon: <Book size={18} className="text-orange-600" />,
        },
        {
            label: "Total Enrollments",
            value: overview.totalEnrollments || 0,
            icon: <Clipboard size={18} className="text-indigo-600" />,
        },
    ];

    // Calculate system health based on completion rate
    const getSystemHealth = () => {
        const rate = overview.completionRate || 0;
        if (rate >= 70)
            return {
                status: "Excellent",
                color: "text-green-600",
                bg: "bg-green-100",
            };
        if (rate >= 50)
            return {
                status: "Good",
                color: "text-yellow-600",
                bg: "bg-yellow-100",
            };
        return {
            status: "Needs Attention",
            color: "text-red-600",
            bg: "bg-red-100",
        };
    };

    const systemHealth = getSystemHealth();

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <BarChart2 size={20} className="mr-2 text-gray-600" />
                System Overview
            </h3>

            <div className="space-y-4 mb-6">
                {overviewItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                {item.icon}
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-700">
                                    {item.label}
                                </span>
                            </div>
                        </div>
                        <span
                            className={`font-bold text-lg ${
                                item.label.includes("Rate")
                                    ? overview.completionRate >= 70
                                        ? "text-green-600"
                                        : overview.completionRate >= 50
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                    : "text-gray-900"
                            }`}
                        >
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* System Health Summary */}
            <div className="p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    System Health
                </h4>
                <div className="flex items-center justify-between">
                    <div>
                        <span
                            className={`text-sm font-medium ${systemHealth.color}`}
                        >
                            {systemHealth.status}
                        </span>
                        <p className="text-xs text-gray-600 mt-1">
                            Based on completion rate and system metrics
                        </p>
                    </div>
                    <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${systemHealth.bg} ${systemHealth.color}`}
                    >
                        {overview.completionRate || 0}% Rate
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemOverview;
