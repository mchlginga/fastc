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
        className="p-6 bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
    >
        <div className="flex items-center justify-between">
            <div className={`${bg} p-3 rounded-xl mr-4`}>
                {loading ? (
                    <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                ) : (
                    icon
                )}
            </div>
            <div className="text-right">
                <h3 className="text-3xl font-bold text-gray-800">
                    {loading ? (
                        <div className="h-8 bg-gray-300 rounded w-16 animate-pulse"></div>
                    ) : (
                        value
                    )}
                </h3>
                <p className="text-sm font-medium text-gray-500">
                    {loading ? (
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse mt-2"></div>
                    ) : (
                        title
                    )}
                </p>
            </div>
        </div>
    </Link>
);

const DashboardStats = ({ stats, loading = false }) => {
    if (loading) {
        return (
            <section className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                    <StatCard
                        key={index}
                        title=""
                        value=""
                        icon={null}
                        bg="bg-gray-200"
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
            icon: <Users size={24} className="text-blue-600" />,
            bg: "bg-blue-100",
            link: "/admin/users",
        },
        {
            title: "Active Courses",
            value: stats?.activeCourses || 0,
            icon: <Book size={24} className="text-green-600" />,
            bg: "bg-green-100",
            link: "/admin/courses",
        },
        {
            title: "Pending Enrollments",
            value: stats?.pendingEnrollments || 0,
            icon: <Clipboard size={24} className="text-purple-600" />,
            bg: "bg-purple-100",
            link: "/admin/enrollments",
        },
        {
            title: "Pending Approvals",
            value: stats?.pendingApprovals || 0,
            icon: <UserCheck size={24} className="text-orange-600" />,
            bg: "bg-orange-100",
            link: "/admin/users?status=pending",
        },
    ];

    return (
        <section className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
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
