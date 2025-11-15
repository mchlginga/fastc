import { Award, CheckCircle, XCircle, Clock, TrendingUp } from "react-feather";

const StatCard = ({
    title,
    value,
    icon,
    bg,
    type = "default",
    loading = false,
}) => (
    <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 cursor-default">
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
                        <span className="inline-block h-4 bg-gray-200 rounded w-20 animate-pulse"></span>
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
    </div>
);

const CertificateStats = ({ stats, loading = false }) => {
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
            <StatCard
                title="Total Certificates"
                value={stats.total}
                icon={<Award size={20} className="text-blue-600" />}
                bg="bg-blue-50"
            />
            <StatCard
                title="Active Certificates"
                value={stats.active}
                icon={<CheckCircle size={20} className="text-green-600" />}
                bg="bg-green-50"
            />
            <StatCard
                title="Expired Certificates"
                value={stats.expired}
                icon={<Clock size={20} className="text-yellow-600" />}
                bg="bg-yellow-50"
            />
            <StatCard
                title="Revoked Certificates"
                value={stats.revoked}
                icon={<XCircle size={20} className="text-red-600" />}
                bg="bg-red-50"
            />
        </section>
    );
};

export default CertificateStats;
