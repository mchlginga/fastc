import StatsCard from "./StatsCard";

function StatsGrid({ dashboardData }) {
    const statCards = [
        {
            title: "Active Courses",
            icon: "Book",
            value: dashboardData.activeEnrollments,
            bg: "bg-blue-100",
            link: "/user/courses?status=active",
        },
        {
            title: "Completed",
            icon: "Award",
            value: dashboardData.completedEnrollments,
            bg: "bg-green-100",
            link: "/user/courses?status=completed",
        },
        {
            title: "Pending Approval",
            icon: "Clock",
            value: dashboardData.pendingEnrollments,
            bg: "bg-yellow-100",
            link: "/user/courses?status=pending",
        },
        {
            title: "Certificates",
            icon: "FileText",
            value: dashboardData.certificates,
            bg: "bg-purple-100",
            link: "/user/certificates",
        },
    ];

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((card, idx) => (
                <StatsCard key={idx} card={card} />
            ))}
        </section>
    );
}

export default StatsGrid;
