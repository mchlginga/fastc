import {
    Clock,
    Calendar,
    Users,
    CheckCircle,
    AlertTriangle,
} from "react-feather";

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
                        <span className="h-4 bg-gray-200 rounded w-20 animate-pulse"></span>
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

const AttendanceStats = ({ stats, loading = false }) => {
    if (loading) {
        return (
            <section className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-5">
                {[...Array(5)].map((_, index) => (
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
        <section className="grid grid-cols-1 gap-5 mb-8  lg:grid-cols-3">
            <StatCard
                title="Total Records"
                value={stats.total}
                icon={<Clock size={20} className="text-blue-600" />}
                bg="bg-blue-50"
            />
            <StatCard
                title="Today's Clock-ins"
                value={stats.today}
                icon={<Calendar size={20} className="text-emerald-600" />}
                bg="bg-emerald-50"
            />
            <StatCard
                title="Verified"
                value={stats.verified}
                icon={<CheckCircle size={20} className="text-green-600" />}
                bg="bg-green-50"
            />
        </section>
    );
};

export default AttendanceStats;
