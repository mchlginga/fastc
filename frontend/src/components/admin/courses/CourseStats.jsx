import { Book, Users, Play, Award } from "react-feather";

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
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
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

const CourseStats = ({ stats, loading = false }) => {
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
                title="Total Courses"
                value={stats.total}
                icon={<Book size={20} className="text-blue-600" />}
                bg="bg-blue-50"
            />
            <StatCard
                title="Active Courses"
                value={stats.active}
                icon={<Play size={20} className="text-emerald-600" />}
                bg="bg-emerald-50"
            />
            <StatCard
                title="Total Enrollments"
                value={stats.totalEnrollments}
                icon={<Users size={20} className="text-purple-600" />}
                bg="bg-purple-50"
            />
            <StatCard
                title="Total Lessons"
                value={stats.totalLessons}
                icon={<Award size={20} className="text-orange-600" />}
                bg="bg-orange-50"
            />
        </section>
    );
};

export default CourseStats;
