import { BarChart2 } from "react-feather";

const SystemOverview = ({ overview, loading = false }) => {
    if (loading) {
        return (
            <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart2 size={20} className="mr-2 text-gray-600" />
                    System Overview
                </h3>

                <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center py-3 border-b border-gray-100"
                        >
                            <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                            <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const overviewItems = [
        { label: "Total Users", value: overview.totalUsers },
        { label: "Total Courses", value: overview.totalCourses },
        { label: "Certificates Issued", value: overview.totalCertificates },
        { label: "Total Enrollments", value: overview.totalEnrollments },
        {
            label: "Completion Rate",
            value: `${overview.completionRate}%`,
            isPercentage: true,
        },
    ];

    return (
        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart2 size={20} className="mr-2 text-gray-600" />
                System Overview
            </h3>

            <div className="space-y-4">
                {overviewItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                    >
                        <span className="text-sm font-medium text-gray-700">
                            {item.label}
                        </span>
                        <span
                            className={`font-bold text-lg ${
                                item.isPercentage
                                    ? overview.completionRate >= 70
                                        ? "text-green-600"
                                        : overview.completionRate >= 50
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                    : "text-gray-900"
                            }`}
                        >
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SystemOverview;
