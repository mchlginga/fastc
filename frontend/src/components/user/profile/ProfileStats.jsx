import { Book, Award } from "react-feather";

const StatCard = ({ title, value, icon, bg, description }) => (
    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between hover:-translate-y-1 hover:shadow-lg transition transform cursor-pointer border border-gray-100">
        <div className={`${bg} p-3 rounded-xl mr-4`}>{icon}</div>
        <div className="text-right">
            <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-gray-400 text-xs">{description}</p>
        </div>
    </div>
);

function ProfileStats({ stats }) {
    return (
        <section className="mb-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Learning Statistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                <StatCard
                    title="Active Courses"
                    value={stats.activeCourses}
                    icon={<Book size={26} className="text-blue-600" />}
                    bg="bg-blue-100"
                    description="Courses in progress"
                />
                <StatCard
                    title="Certificates"
                    value={stats.certificates}
                    icon={<Award size={26} className="text-green-600" />}
                    bg="bg-green-100"
                    description="Earned certificates"
                />
            </div>
        </section>
    );
}

export default ProfileStats;
