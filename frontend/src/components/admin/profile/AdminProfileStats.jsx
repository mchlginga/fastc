import { Users, Book, UserCheck, Clipboard } from "react-feather";

const StatCard = ({
    title,
    value,
    icon,
    bg,
    description,
    link,
    loading = false,
}) => (
    <div
        className={`p-5 bg-white border border-gray-100 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 cursor-default ${
            link && !loading ? "hover:-translate-y-0.5 cursor-pointer" : ""
        }`}
        onClick={() => link && !loading && (window.location.href = link)}
    >
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                    {loading ? (
                        <div className="h-7 bg-gray-200 rounded w-12 animate-pulse"></div>
                    ) : (
                        value.toLocaleString()
                    )}
                </h3>
                <p className="text-sm font-medium text-gray-500 mt-1">
                    {loading ? (
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    ) : (
                        title
                    )}
                </p>
                {description && !loading && (
                    <p className="text-xs text-gray-400 mt-1">{description}</p>
                )}
            </div>
            <div className={`p-3 rounded-xl ${bg}`}>
                {loading ? (
                    <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                ) : (
                    icon
                )}
            </div>
        </div>
    </div>
);

function AdminProfileStats({ stats, loading = false }) {
    const statCards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: <Users size={20} className="text-blue-600" />,
            bg: "bg-blue-50",
            link: "/admin/users",
        },
        {
            title: "Active Courses",
            value: stats.activeCourses,
            icon: <Book size={20} className="text-green-600" />,
            bg: "bg-green-50",
            link: "/admin/courses",
        },
        {
            title: "Pending Approvals",
            value: stats.pendingApprovals,
            icon: <UserCheck size={20} className="text-amber-600" />,
            bg: "bg-amber-50",
            link: "/admin/users?status=pending",
        },
        {
            title: "Total Enrollments",
            value: stats.totalEnrollments,
            icon: <Clipboard size={20} className="text-purple-600" />,
            bg: "bg-purple-50",
            link: "/admin/enrollments",
        },
    ];

    if (loading) {
        return (
            <section className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                    <StatCard
                        key={index}
                        title=""
                        value=""
                        icon={null}
                        bg="bg-gray-100"
                        loading={true}
                    />
                ))}
            </section>
        );
    }

    return (
        <section className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card, index) => (
                <StatCard
                    key={index}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    bg={card.bg}
                    description={card.description}
                    link={card.link}
                    loading={false}
                />
            ))}
        </section>
    );
}

export default AdminProfileStats;
