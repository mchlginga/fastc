import { Users, Book, UserCheck, Clipboard } from "react-feather";

const StatCard = ({ title, value, icon, bg, description, link }) => (
    <div
        className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between hover:-translate-y-1 hover:shadow-lg transition transform cursor-pointer border border-gray-100"
        onClick={() => link && (window.location.href = link)}
    >
        <div className={`${bg} p-3 rounded-xl mr-4`}>{icon}</div>
        <div className="text-right">
            <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-gray-400 text-xs">{description}</p>
        </div>
    </div>
);

function AdminProfileStats({ stats }) {
    const statCards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: <Users size={26} className="text-blue-600" />,
            bg: "bg-blue-100",
            description: "Registered users",
            link: "/admin/users",
        },
        {
            title: "Active Courses",
            value: stats.activeCourses,
            icon: <Book size={26} className="text-green-600" />,
            bg: "bg-green-100",
            description: "Available courses",
            link: "/admin/courses",
        },
        {
            title: "Pending Approvals",
            value: stats.pendingApprovals,
            icon: <UserCheck size={26} className="text-orange-600" />,
            bg: "bg-orange-100",
            description: "Awaiting review",
            link: "/admin/users?status=pending",
        },
        {
            title: "Total Enrollments",
            value: stats.totalEnrollments,
            icon: <Clipboard size={26} className="text-purple-600" />,
            bg: "bg-purple-100",
            description: "Course enrollments",
            link: "/admin/enrollments",
        },
    ];

    return (
        <section className="mb-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
                System Statistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <StatCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        bg={card.bg}
                        description={card.description}
                        link={card.link}
                    />
                ))}
            </div>
        </section>
    );
}

export default AdminProfileStats;
