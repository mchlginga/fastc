import { Users, Clock, Shield, CheckCircle } from "react-feather";

const StatCard = ({ title, value, icon, bg }) => (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 flex items-center justify-between">
        <div className={`${bg} p-3 rounded-xl mr-4`}>{icon}</div>
        <div className="text-right">
            <h3 className="text-xl font-bold text-gray-800">{value}</h3>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
        </div>
    </div>
);

function CompanyProfileStats({ user }) {
    const statCards = [
        {
            title: "Account Status",
            value: user?.profileStatus === "approved" ? "Active" : "Pending",
            icon: <Shield size={22} className="text-blue-600" />,
            bg: "bg-blue-100",
        },
        {
            title: "Member Since",
            value: user?.createdAt
                ? new Date(user.createdAt).getFullYear()
                : "N/A",
            icon: <Clock size={22} className="text-green-600" />,
            bg: "bg-green-100",
        },
        {
            title: "Profile",
            value:
                user?.profileStatus === "approved" ? "Complete" : "In Review",
            icon: <CheckCircle size={22} className="text-purple-600" />,
            bg: "bg-purple-100",
        },
        {
            title: "Access",
            value: user?.profileStatus === "approved" ? "Full" : "Limited",
            icon: <Users size={22} className="text-orange-600" />,
            bg: "bg-orange-100",
        },
    ];

    return (
        <section className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <StatCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        bg={card.bg}
                    />
                ))}
            </div>
        </section>
    );
}

export default CompanyProfileStats;
