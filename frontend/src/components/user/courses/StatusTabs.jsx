import { Link } from "react-router-dom";

function StatusTabs({
    statusFilter,
    currentEnrollments,
    pendingEnrollments,
    completedEnrollments,
}) {
    const tabs = [
        {
            label: "All Courses",
            shortLabel: "All",
            path: "/user/courses",
            active: !statusFilter,
            count: null,
            color: "bg-blue-600 text-white",
        },
        {
            label: "Active",
            shortLabel: "Active",
            path: "/user/courses?status=active",
            active: statusFilter === "active",
            count: currentEnrollments.length,
            color: "bg-green-600 text-white",
        },
        {
            label: "Pending",
            shortLabel: "Pending",
            path: "/user/courses?status=pending",
            active: statusFilter === "pending",
            count: pendingEnrollments.length,
            color: "bg-yellow-600 text-white",
        },
        {
            label: "Completed",
            shortLabel: "Completed",
            path: "/user/courses?status=completed",
            active: statusFilter === "completed",
            count: completedEnrollments.length,
            color: "bg-blue-600 text-white",
        },
    ];

    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab, index) => (
                <Link
                    key={index}
                    to={tab.path}
                    className={`px-3 sm:px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2 shrink-0 ${
                        tab.active
                            ? tab.color
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    {/* Show short label on mobile, full label on sm+ */}
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>

                    {tab.count !== null && (
                        <span
                            className={`px-1.5 py-0.5 rounded-full text-xs ${
                                tab.active
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-200 text-gray-600"
                            }`}
                        >
                            {tab.count}
                        </span>
                    )}
                </Link>
            ))}
        </div>
    );
}

export default StatusTabs;
