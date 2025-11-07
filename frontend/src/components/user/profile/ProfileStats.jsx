import { Book, Award, TrendingUp } from "react-feather";

const StatCard = ({ title, value, icon, bg, iconColor }) => (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-5 hover:shadow-sm transition-all duration-200 cursor-default">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                    {value}
                </h3>
                <p className="text-sm font-medium text-gray-500 mt-1">
                    {title}
                </p>
            </div>
            <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
        </div>
    </div>
);

function ProfileStats({ stats, courses = [] }) {
    const calculateOverallProgress = () => {
        const progressEnrollments = courses.filter(
            (e) => e.status === "active" || e.status === "completed"
        );

        const totalProgress = progressEnrollments.reduce(
            (sum, e) => sum + (e.progress || 0),
            0
        );

        const avgProgress =
            progressEnrollments.length > 0
                ? Math.round(totalProgress / progressEnrollments.length)
                : 0;

        return avgProgress;
    };

    const overallProgress = calculateOverallProgress();

    return (
        <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Learning Statistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <StatCard
                    title="Active Courses"
                    value={stats.activeCourses}
                    icon={<Book size={20} className="text-blue-700" />}
                    bg="bg-blue-50"
                />
                <StatCard
                    title="Certificates"
                    value={stats.certificates}
                    icon={<Award size={20} className="text-emerald-700" />}
                    bg="bg-emerald-50"
                />
                <StatCard
                    title="Average Completion"
                    value={`${overallProgress}%`}
                    icon={<TrendingUp size={20} className="text-amber-700" />}
                    bg="bg-amber-50"
                />
            </div>
        </section>
    );
}

export default ProfileStats;
