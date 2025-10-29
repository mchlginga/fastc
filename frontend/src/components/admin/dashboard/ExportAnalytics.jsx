import { Link } from "react-router-dom";
import { Download, TrendingUp, TrendingDown } from "react-feather";

const ExportAnalytics = ({ stats, loading = false }) => {
    if (loading) {
        return (
            <section className="p-6 bg-white border border-gray-100 rounded-2xl shadow-md mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="h-6 bg-gray-300 rounded w-48 animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded w-24 animate-pulse"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="text-center">
                            <div className="bg-gray-200 rounded-2xl p-4 mb-3">
                                <div className="h-8 bg-gray-300 rounded w-16 mx-auto animate-pulse"></div>
                            </div>
                            <div className="h-4 bg-gray-300 rounded w-20 mx-auto animate-pulse mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="h-10 bg-gray-300 rounded-xl w-40 animate-pulse"></div>
                </div>
            </section>
        );
    }

    const change = stats.csvExportsThisMonth - stats.csvExportsLastMonth;
    const percentChange = stats.csvExportsPercentage;
    const isPositive = percentChange >= 0;

    const analyticsCards = [
        {
            title: "Total Exports",
            value: stats.csvExportsThisMonth,
            description: "This month",
            bg: "bg-blue-50",
            textColor: "text-blue-600",
        },
        {
            title: "Admin Exports",
            value: stats.adminExports,
            description: "By administrators",
            bg: "bg-green-50",
            textColor: "text-green-600",
        },
        {
            title: "Company Exports",
            value: stats.companyExports,
            description: "By companies",
            bg: "bg-purple-50",
            textColor: "text-purple-600",
        },
    ];

    return (
        <section className="p-6 bg-white border border-gray-100 rounded-2xl shadow-md mb-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                        <Download size={24} className="mr-3 text-blue-600" />
                        CSV Export Analytics
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                        Job matching export usage this month
                    </p>
                </div>
                <div
                    className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isPositive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                >
                    {isPositive ? (
                        <TrendingUp size={16} className="mr-1" />
                    ) : (
                        <TrendingDown size={16} className="mr-1" />
                    )}
                    {isPositive ? "+" : ""}
                    {percentChange}% vs last month
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analyticsCards.map((card, index) => (
                    <div key={index} className="text-center">
                        <div className={`${card.bg} rounded-2xl p-4 mb-3`}>
                            <p
                                className={`text-3xl font-bold ${card.textColor}`}
                            >
                                {card.value}
                            </p>
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                            {card.title}
                        </p>
                        <p className="text-xs text-gray-500">
                            {card.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                    to="/admin/job-match"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition transform hover:-translate-y-0.5 cursor-pointer shadow-md hover:shadow-lg"
                >
                    <Download size={18} className="mr-2" />
                    Go to Job Matching
                </Link>
            </div>
        </section>
    );
};

export default ExportAnalytics;
