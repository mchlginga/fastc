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
            path: "/user/courses",
            active: !statusFilter,
            color: "bg-blue-600 text-white",
        },
        {
            label: `Active (${currentEnrollments.length})`,
            path: "/user/courses?status=active",
            active: statusFilter === "active",
            color: "bg-green-600 text-white",
        },
        {
            label: `Pending (${pendingEnrollments.length})`,
            path: "/user/courses?status=pending",
            active: statusFilter === "pending",
            color: "bg-yellow-600 text-white",
        },
        {
            label: `Completed (${completedEnrollments.length})`,
            path: "/user/courses?status=completed",
            active: statusFilter === "completed",
            color: "bg-blue-600 text-white",
        },
    ];

    return (
        <div className="flex space-x-2 mb-6">
            {tabs.map((tab, index) => (
                <Link
                    key={index}
                    to={tab.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        tab.active
                            ? tab.color
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    {tab.label}
                </Link>
            ))}
        </div>
    );
}

export default StatusTabs;
