import {
    Clock,
    UserCheck,
    Book,
    Award,
    CheckCircle,
    XCircle,
} from "react-feather";

const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
        switch (type) {
            case "completion":
                return <CheckCircle size={16} className="text-green-500" />;
            case "enrollment":
                return <Book size={16} className="text-blue-500" />;
            case "certificate":
                return <Award size={16} className="text-purple-500" />;
            case "approval":
                return <UserCheck size={16} className="text-green-500" />;
            case "rejection":
                return <XCircle size={16} className="text-red-500" />;
            default:
                return <Clock size={16} className="text-gray-500" />;
        }
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const diff = now - new Date(timestamp);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return "Just now";
    };

    const formatActivityMessage = (activity) => {
        if (activity.message) return activity.message;

        // Generate message based on activity type and data
        switch (activity.type) {
            case "completion":
                return `${activity.user?.name || "User"} completed ${
                    activity.course?.title || "a course"
                }`;
            case "enrollment":
                return `${activity.user?.name || "User"} enrolled in ${
                    activity.course?.title || "a course"
                }`;
            case "certificate":
                return `${
                    activity.user?.name || "User"
                } earned a certificate for ${
                    activity.course?.title || "a course"
                }`;
            case "approval":
                return `Approved ${activity.user?.name || "user"} profile`;
            case "rejection":
                return `Rejected ${activity.user?.name || "user"} profile`;
            default:
                return "System activity occurred";
        }
    };

    return (
        <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 font-medium">
                    {formatActivityMessage(activity)}
                </p>
                <p className="text-xs text-gray-500 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {getTimeAgo(activity.timestamp)}
                </p>
            </div>
        </div>
    );
};

const RecentActivities = ({ activities }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Activities
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto">
                {activities.length > 0 ? (
                    activities
                        .slice(0, 8)
                        .map((activity) => (
                            <ActivityItem
                                key={activity.id}
                                activity={activity}
                            />
                        ))
                ) : (
                    <div className="text-center py-8">
                        <Clock
                            size={32}
                            className="mx-auto text-gray-300 mb-2"
                        />
                        <p className="text-gray-500 text-sm">
                            No recent activities
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                            System activities will appear here
                        </p>
                    </div>
                )}
            </div>

            {activities.length > 8 && (
                <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 text-sm font-medium py-2 border-t border-gray-100">
                    View All Activities
                </button>
            )}
        </div>
    );
};

export default RecentActivities;
