import { Link } from "react-router-dom";
import { Search, Bookmark, User, Eye, ChevronRight } from "react-feather";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            {/* Welcome header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome back, {user?.companyName || "Juan Company"}
                </h1>
                <p className="text-gray-600">
                    Quick stats: 1,234 trainees available • 15 shortlisted
                </p>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Link
                    to="/company/search"
                    className="bg-blue-600 text-white p-4 rounded-lg flex items-center justify-center font-medium hover:bg-blue-700"
                >
                    <Search size={20} className="mr-2" />
                    Search Trainees
                </Link>
                <Link
                    to="/company/shortlist"
                    className="bg-green-600 text-white p-4 rounded-lg flex items-center justify-center font-medium hover:bg-green-700"
                >
                    <Bookmark size={20} className="mr-2" />
                    View Shortlist
                </Link>
            </div>

            {/* AI Job Matching */}
            <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        AI Job Matching
                    </h2>
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Job Match with AI (ex: 'Caregivers with NC 2 certificate')"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                </div>
                <div className="space-y-4">
                    {/* Trainee 1 */}
                    <div className="border-b border-gray-300 pb-2 flex items-start">
                        <div className="bg-blue-50 p-3 rounded-lg mr-4">
                            <User size={24} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium">Juan Dela Cruz</h3>
                                <span className="text-sm text-green-600 font-semibold">
                                    Highly Recommended
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-1">
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Welding NC II
                                </span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Carpentry Basics
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                Valid until: June 15, 2027
                            </p>
                            <div className="mt-2 flex space-x-2">
                                <Link
                                    to="/company/trainee/juan-dela-cruz"
                                    className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                                >
                                    <Eye size={16} className="mr-1" />
                                    View Profile
                                </Link>
                                <Link
                                    to="/company/shortlist/add/juan-dela-cruz"
                                    className="text-sm text-green-600 hover:text-green-500 flex items-center"
                                >
                                    <Bookmark size={16} className="mr-1" />
                                    Shortlist
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* Trainee 2 */}
                    <div className="border-b border-gray-300 pb-2 flex items-start">
                        <div className="bg-blue-50 p-3 rounded-lg mr-4">
                            <User size={24} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium">Ana Reyes</h3>
                                <span className="text-sm text-green-600 font-semibold">
                                    85% Match
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-1">
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Carpentry NC II
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                Valid until: March 10, 2026
                            </p>
                            <div className="mt-2 flex space-x-2">
                                <Link
                                    to="/company/trainee/ana-reyes"
                                    className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                                >
                                    <Eye size={16} className="mr-1" />
                                    View Profile
                                </Link>
                                <Link
                                    to="/company/shortlist/add/ana-reyes"
                                    className="text-sm text-green-600 hover:text-green-500 flex items-center"
                                >
                                    <Bookmark size={16} className="mr-1" />
                                    Shortlist
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* Commented-out empty state */}
                    {/* <div className="text-center text-gray-600 py-4">
                        <p className="text-sm font-medium">
                            No exact matches found. Try broadening your filters.
                        </p>
                        <p className="text-sm mt-2">
                            Near matches:{" "}
                            <Link
                                to="/company/search?certificate=nc1-welding"
                                className="text-blue-600 hover:text-blue-500"
                            >
                                View NC I Welding candidates
                            </Link>
                        </p>
                    </div> */}
                </div>
            </div>

            {/* Commented-out quick overviews */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Total Trainees
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">223</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Shortlisted Candidates
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">2</p>
                    <Link
                        to="/company/shortlist"
                        className="text-sm text-blue-600 mt-1 flex items-center"
                    >
                        View all
                        <ChevronRight size={16} className="ml-1" />
                    </Link>
                </div>
            </div> */}

            {/* Commented-out search trainees */}
            {/* <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Search Trainees
                </h2>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search by name, skill, or certificate..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm min-w-1/3"
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm md:w-1/2">
                        <option value="">All Courses</option>
                        <option value="welding">Basic Welding</option>
                        <option value="pastry">Pastry Making</option>
                        <option value="dressmaking">Dressmaking</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm md:w-1/2">
                        <option value="">Certificate Validity</option>
                        <option value="valid">Valid</option>
                        <option value="expired">Expired</option>
                    </select>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 w-full">
                        Search
                    </button>
                </div>
            </div> */}
        </div>
    );
};

export default Home;
