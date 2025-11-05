import { CheckCircle, Clipboard, Award } from "react-feather";

const RecentActivities = ({ activities, loading = false }) => {
    if (loading) {
        return (
            <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-xs">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Recent Activities
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, index) => (
                        <div key={index}>
                            <div className="flex items-center mb-4">
                                <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                            </div>
                            <div className="space-y-3">
                                {[...Array(3)].map((_, itemIndex) => (
                                    <div
                                        key={itemIndex}
                                        className="p-3 bg-gray-200 rounded-xl"
                                    >
                                        <div className="h-4 bg-gray-300 rounded w-24 animate-pulse mb-2"></div>
                                        <div className="h-3 bg-gray-300 rounded w-32 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const activitySections = [
        {
            key: "recentCompletions",
            title: "Completions",
            data: activities.recentCompletions,
            bg: "bg-green-50",
            border: "border-green-200",
        },
        {
            key: "recentEnrollments",
            title: "Enrollments",
            data: activities.recentEnrollments,
            bg: "bg-blue-50",
            border: "border-blue-200",
        },
        {
            key: "recentCertificates",
            title: "Certificates",
            data: activities.recentCertificates,
            bg: "bg-purple-50",
            border: "border-purple-200",
        },
    ];

    return (
        <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-xs">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Recent Activities
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activitySections.map((section) => (
                    <div key={section.key}>
                        <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                            {section.icon}
                            {section.title}
                        </h4>
                        {section.data.length > 0 ? (
                            <div className="space-y-3">
                                {section.data.slice(0, 3).map((item) => (
                                    <div
                                        key={item._id}
                                        className={`p-3 rounded-xl border ${section.bg} ${section.border} transition-all duration-200 hover:shadow-xs`}
                                    >
                                        <p className="font-medium text-gray-900 truncate text-sm">
                                            {item.user?.name || "User"}
                                        </p>
                                        <p className="text-gray-600 text-xs truncate">
                                            {item.course?.title || "Course"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div
                                className={`p-4 text-center rounded-xl border ${section.bg} ${section.border}`}
                            >
                                <p className="text-gray-400 text-sm">
                                    No recent {section.title.toLowerCase()}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivities;
