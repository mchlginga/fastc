import { Link } from "react-router-dom";
import { Plus, Users, ChevronRight } from "react-feather";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
    const { user } = useAuth();

    return (
        <div>
            {/* Welcome header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome back, {user?.firstName}
                </h1>
                <p className="text-gray-600">
                    Quick stats: 45 active trainees today • 8 active courses
                </p>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Link
                    to="/admin/courses"
                    className="bg-blue-600 text-white p-4 rounded-lg flex items-center justify-center font-medium hover:bg-blue-700"
                >
                    <Plus size={20} className="mr-2" />
                    Add New Course
                </Link>
                <Link
                    to="/admin/users"
                    className="bg-green-600 text-white p-4 rounded-lg flex items-center justify-center font-medium hover:bg-green-700"
                >
                    <Users size={20} className="mr-2" />
                    Manage Trainees
                </Link>
            </div>

            <div className="space-y-6">
                {/* Quick overviews */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Total Trainees
                        </h3>
                        <p className="text-3xl font-bold text-blue-600">223</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Active Courses
                        </h3>
                        <p className="text-3xl font-bold text-blue-600">2</p>
                        <Link
                            to="/admin/courses"
                            className="text-sm text-blue-600 mt-1 flex items-center"
                        >
                            View all
                            <ChevronRight size={16} className="ml-1" />
                        </Link>
                    </div>
                </div>

                {/* Active trainees */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Active Trainees
                        </h2>
                    </div>
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="border-b border-gray-300">
                            <tr>
                                <th className="pb-2">Name</th>
                                <th className="pb-2">Email</th>
                                <th className="pb-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-300">
                                <td className="py-2">Juan Dela Cruz</td>
                                <td className="py-2">juan@email.com</td>
                                <td className="py-2">
                                    <span className="text-green-600">
                                        Active
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="py-2">Ana Reyes</td>
                                <td className="py-2">ana@email.com</td>
                                <td className="py-2">
                                    <span className="text-green-600">
                                        Active
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Active courses */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Active Courses
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div className="border-b pb-2 border-gray-300">
                            <h3 className="font-medium">Basic Welding</h3>
                            <p className="text-sm text-gray-600">
                                Mon/Wed/Fri • 25 enrollees
                            </p>
                        </div>
                        <div className="border-b pb-2 border-gray-300">
                            <h3 className="font-medium">Pastry Making</h3>
                            <p className="text-sm text-gray-600">
                                Tue/Thu • 15 enrollees
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
