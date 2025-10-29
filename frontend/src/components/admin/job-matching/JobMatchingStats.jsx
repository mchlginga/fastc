import { Users, Award, Clock, TrendingUp } from "react-feather";

const StatCard = ({
    title,
    value,
    icon,
    bg,
    type = "default",
    loading = false,
}) => (
    <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer">
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
    </div>
);

const JobMatchingStats = ({ stats, loading = false }) => {
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
                    />
                ))}
            </section>
        );
    }

    return (
        <section className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Trainees"
                value={stats.totalTrainees}
                icon={<Users size={24} className="text-blue-600" />}
                bg="bg-blue-100"
            />
            <StatCard
                title="With Certificates"
                value={stats.traineesWithCertificates}
                icon={<Award size={24} className="text-green-600" />}
                bg="bg-green-100"
            />
            <StatCard
                title="Full-time"
                value={stats.fullTimeTrainees}
                icon={<Clock size={24} className="text-purple-600" />}
                bg="bg-purple-100"
            />
            <StatCard
                title="Part-time"
                value={stats.partTimeTrainees}
                icon={<TrendingUp size={24} className="text-orange-600" />}
                bg="bg-orange-100"
            />
        </section>
    );
};

export default JobMatchingStats;
