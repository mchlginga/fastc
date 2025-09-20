import { Award, Home, User, LogOut, Menu, ChevronRight, Edit, Search, Bookmark, Eye } from "react-feather";
import { Link } from "react-router-dom";

const CompanyDashboard = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* side bar */}
            <div className="sidebar bg-white w-64 shadow-sm hidden md:block">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <Award size={32} className="text-blue-600 mr-2"/>
                        <span className="text-xl font-bold text-gray-800">FAST-C Company</span>
                    </div>
                </div>
                {/* navigation */}
                <nav className="p-4 space-y-1">
                    <Link to="" className="nav-active flex items-center px-4 py-3 text-sm font-medium rounded-lg">
                        <Home size={20} className="mr-3"/>
                        Dashboard
                    </Link>
                    <Link to="" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg">
                        <Search size={20} className="mr-3"/>
                        Search Trainees
                    </Link>
                    <Link to="" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg">
                        <Bookmark size={20} className="mr-3"/>
                        Shortlist
                    </Link>
                    <Link to="" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg">
                        <Edit size={20} className="mr-3"/>
                        Profile
                    </Link>
                    <Link to="" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg">
                        <LogOut size={20} className="mr-3"/>
                        Logout
                    </Link>
                </nav>
            </div>

            {/* main content */}
            <div className="flex-1 overflow-auto">

                {/* top navigation */}
                <header className="bg-white shadow-sm">
                    <div className="flex justify-between items-center px-6 py-4">
                        <div className="md:hidden">
                            <button className="text-gray-600">
                                <Menu size={24}/>
                            </button>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <img src="pic.png" alt="Profile" className="w-8 h-8 rounded-full"/>
                                <span className="ml-2 text-sm font-medium">Juan Company</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* main content area */}
                <main className="p-6">
                    {/* welcome header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Welcome back, Juan Company</h1>
                        <p className="text-gray-600">Quick stats: 1,234 trainees available • 15 shortlisted</p>
                    </div>

                    {/* quick actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <Link to="" className="bg-blue-600 text-white p-4 rounded-lg flex items-center justify-center font-medium hover:bg-blue-700">
                            <Search size={20} className="mr-2"/>
                            Search Trainees
                        </Link>
                        <Link to="" className="bg-green-600 text-white p-4 rounded-lg flex items-center justify-center font-medium hover:bg-green-700">
                            <Bookmark size={20} className="mr-2"/>
                            View Shortlist
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* left column */}
                        <div className="lg:col-span-2 space-y-6">

{/*                             quick overviews
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Trainees</h3>
                                    <p className="text-3xl font-bold text-blue-600">223</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Shortlisted Candidates</h3>
                                    <p className="text-3xl font-bold text-blue-600">2</p>
                                    <Link to="" className="text-sm text-blue-600 mt-1 flex items-center">
                                        View all
                                        <ChevronRight size={16} className="ml-1" />
                                    </Link>
                                </div>
                            </div> */}

                            {/* AI job matching */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">AI Job Matching</h2>
                                </div>

                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Job Match with AI (ex: 'Caregivers with NC 2 certificate')"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                />
                                </div>

                                <div className="space-y-4">
                                    {/* trainee 1 */}
                                    <div className="border-b border-gray-300 pb-2 flex items-start">
                                        <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                            <User size={24} className="text-blue-600"/>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-medium">Juan Dela Cruz</h3>
                                                <span className="text-sm text-green-600 font-semibold">Highly Recommended</span>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-1">
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Welding NC II</span>
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Carpentry Basics</span>
                                            </div>

                                            <p className="text-sm text-gray-600 mt-1">Valid until: June 15, 2027</p>

                                            <div className="mt-2 flex space-x-2">
                                                <Link to="" className="text-sm text-blue-600 hover:text-blue-500 flex items-center">
                                                    <Eye size={16} className="mr-1"/>
                                                    View Profile
                                                </Link>
                                                <Link to="" className="text-sm text-green-600 hover:text-green-500 flex items-center">
                                                    <Bookmark size={16} className="mr-1"/>
                                                    Shortlist
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* trainee 2 */}
                                    <div className="border-b border-gray-300 pb-2 flex items-start">
                                        <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                            <User size={24} className="text-blue-600"/>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-medium">Ana Reyes</h3>
                                                <span className="text-sm text-green-600 font-semibold">85% Match</span>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-1">
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Carpentry NC II</span>
                                            </div>

                                            <p className="text-sm text-gray-600 mt-1">Valid until: March 10, 2026</p>

                                            <div className="mt-2 flex space-x-2">
                                                <Link to="" className="text-sm text-blue-600 hover:text-blue-500 flex items-center">
                                                    <Eye size={16} className="mr-1"/>
                                                    View Profile
                                                </Link>
                                                <Link to="" className="text-sm text-green-600 hover:text-green-500 flex items-center">
                                                    <Bookmark size={16} className="mr-1"/>
                                                    Shortlist
                                                </Link>
                                            </div>

{/*                                             empty state
                                            <div className=" text-center text-gray-600 py-4">
                                                <p className="text-sm font-medium">No exact matches found. Try broadening your filters.</p>
                                                <p class="text-sm mt-2">Near matches: <a href="#" class="text-blue-600 hover:text-blue-500">View NC I Welding candidates</a></p>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* search trainees
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Trainees</h2>

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

                        {/* right side */}
                        <div className="space-y-6">
                            {/* company profile */}
                            <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                                <div className="flex items-center mb-4">
                                    <img src="pic.png" alt="Company Profile" class="w-16 h-16 rounded-full"/>
                                    <div className="ml-4">
                                        <h2 className="font-semibold text-gray-800">Juan Constraction</h2>
                                        <p className="text-sm text-gray-600">juanconstruction@gmail.com</p>
                                    </div>
                                </div>
                                
                                <Link to="" className="mt-4 w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <Edit size={16} className="mr-2"/>
                                    Edit Profile
                                </Link>
                            </div>

                            {/* recent shortlist */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">Recent Shortlists</h2>

                                    <div className="flex space-x-2">
                                        <Link to="" className="text-sm text-blue-600 flex items-center">
                                            View All
                                            <ChevronRight size={16} className="ml-1"/>
                                        </Link>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="bg-blue-50 p-2 rounded-lg mr-3">
                                            <User size={24} className="text-blue-600"/>
                                        </div>

                                        <div>
                                            <h3 className="font-medium">Maria Santos</h3>
                                            <p className="text-sm text-gray-600">Welding NC II • Added Sep 18, 2025</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-blue-50 p-2 rounded-lg mr-3">
                                            <User size={24} className="text-blue-600"/>
                                        </div>

                                        <div>
                                            <h3 className="font-medium">Pedro Lim</h3>
                                            <p className="text-sm text-gray-600">Electrical NC II • Added Sep 17, 2025</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* footer */}
                <footer class="bg-gray-50 border-t border-gray-200 py-4 px-6">
                    <p class="text-xs text-center text-gray-500">
                    Developed for Fernandino Assessment and Skills Training Center (FAST-C), City of San Fernando, Pampanga — in partnership with PESO and local companies.
                </p>
                </footer>
            </div>
        </div>
    );
};

export default CompanyDashboard;