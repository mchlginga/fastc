import StatsCard from "./StatsCard";

function StatsGrid({ dashboardData }) {
    // Add null check to prevent accessing properties of undefined
    if (!dashboardData) {
        return (
            <section className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, idx) => (
                    <div
                        key={idx}
                        className="p-5 bg-white border border-gray-100 rounded-xl shadow-xs animate-pulse"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="h-7 bg-gray-200 rounded w-12 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                        </div>
                    </div>
                ))}
            </section>
        );
    }

    const statCards = [
        {
            title: "Active Courses",
            icon: "Book",
            value: dashboardData.activeEnrollments || 0,
            bg: "bg-blue-50",
            link: "/user/courses?status=active",
        },
        {
            title: "Completed",
            icon: "Award",
            value: dashboardData.completedEnrollments || 0,
            bg: "bg-emerald-50",
            link: "/user/courses?status=completed",
        },
        {
            title: "Pending Approval",
            icon: "Clock",
            value: dashboardData.pendingEnrollments || 0,
            bg: "bg-amber-50",
            link: "/user/courses?status=pending",
        },
        {
            title: "Certificates",
            icon: "FileText",
            value: dashboardData.certificates || 0,
            bg: "bg-purple-50",
            link: "/user/certificates",
        },
    ];

    return (
        <section className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card, idx) => (
                <StatsCard key={idx} card={card} />
            ))}
        </section>
    );
}

export default StatsGrid;
