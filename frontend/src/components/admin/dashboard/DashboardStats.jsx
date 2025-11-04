import { Link } from "react-router-dom";
import { Users, Book, Clipboard, UserCheck } from "react-feather";

const StatCard = ({
    title,
    value,
    icon,
    bg,
    type = "default",
    loading = false,
    link,
}) => (
    <Link
        to={link}
        className="p-5 bg-white border border-gray-100 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
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
            </div>
            <div className={`p-3 rounded-xl ${bg}`}>
                {loading ? (
                    <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                ) : (
                    icon
                )}
            </div>
        </div>
    </Link>
);

const DashboardStats = ({ stats, loading = false }) => {
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
                        link="#"
                    />
                ))}
            </section>
        );
    }

    const statCards = [
        {
            title: "Total Trainees",
            value: stats?.totalTrainees || 0,
            icon: <Users size={20} className="text-blue-600" />,
            bg: "bg-blue-50",
            link: "/admin/users",
        },
        {
            title: "Active Courses",
            value: stats?.activeCourses || 0,
            icon: <Book size={20} className="text-green-600" />,
            bg: "bg-green-50",
            link: "/admin/courses",
        },
        {
            title: "Pending Enrollments",
            value: stats?.pendingEnrollments || 0,
            icon: <Clipboard size={20} className="text-purple-600" />,
            bg: "bg-purple-50",
            link: "/admin/enrollments",
        },
        {
            title: "Pending Approvals",
            value: stats?.pendingApprovals || 0,
            icon: <UserCheck size={20} className="text-orange-600" />,
            bg: "bg-orange-50",
            link: "/admin/users?status=pending",
        },
    ];

    return (
        <section className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card, idx) => (
                <StatCard
                    key={idx}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    bg={card.bg}
                    link={card.link}
                />
            ))}
        </section>
    );
};

export default DashboardStats;
