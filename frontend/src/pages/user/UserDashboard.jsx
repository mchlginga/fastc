import { Award, Home, Book, FileText, User, LogOut, Radio, Menu, Bell, ChevronRight, CheckCircle, XCircle, Download, Eye, MapPin, Phone, Calendar, Edit } from "react-feather";
import { Link } from "react-router-dom";

const UserDashboard = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* side bar */}
            <div className="sidebar bg-white w-64 shadow-sm hidden md:block">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <Award size={32} className="text-blue-600 mr-2"/>
                        <span className="text-xl font-bold text-gray-800">FAST-C</span>
                    </div>
                </div>
                {/* navigation */}
                <nav className="p-4 space-y-1">
                    <Link to="" className="nav-active flex items-center px-4 py-3 text-sm font-medium rounded-lg">
                        <Home size={20} className="mr-3"/>
                        Dashboard
                    </Link>
                    <Link to="" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg">
                        <Book size={20} className="mr-3"/>
                        Courses
                    </Link>
                    <Link to="" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg">
                        <FileText size={20} className="mr-3"/>
                        Certificates
                    </Link>
                    <Link to="" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg">
                        <User size={20} className="mr-3"/>
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
                                <span className="ml-2 text-sm font-medium">Juan Dela Cruz</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* main content area */}
                <main className="p-6">
                    {/* welcome header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Welcome back, Juan</h1>
                        <p className="text-gray-600">Here's your training progress and latest updates</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* left column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Enrolled Courses */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Enrolled Courses</h2>
                                    <Link to="" className="text-sm text-blue-600 hover:text-blue-500 flex items-center">
                                        View all
                                        <ChevronRight size={16} className="ml-1"/>
                                    </Link>
                                </div>
                                {/* course 1 */}
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <h3 className="font-medium">Basic Welding Certification</h3>
                                            <span className="text-sm text-gray-500">Mon/Wed/Fri • 9:00-11:00 AM</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-blue-600 h-2.5 rounded-full progress-bar w-[65%]"></div>
                                        </div>
                                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                                            <span>65% completed</span>
                                            <span>12 of 20 sessions</span>
                                        </div>
                                        <div className="mt-3 flex items-center text-sm">
                                            <span className="font-medium mr-2">Attendance:</span>
                                            <span className="text-green-600 flex items-center">
                                                <CheckCircle size={16} className="mr-1"/>
                                                Present
                                            </span>
                                            <span className="mx-2">•</span>
                                            <span className="text-red-600 flex items-center">
                                                <XCircle size={16} className="mr-1"/>
                                                2 Absences
                                            </span>
                                        </div>
                                    </div>
                                    {/* course 2 */}
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <h3 className="font-medium">Pastry Making Fundamentals</h3>
                                            <span className="text-sm text-gray-500">Tue/Thu • 1:00-3:00 PM</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-green-500 h-2.5 rounded-full progress-bar w-[30%]"></div>
                                        </div>
                                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                                            <span>30% completed</span>
                                            <span>3 of 10 sessions</span>
                                        </div>
                                        <div className="mt-3 flex items-center text-sm">
                                            <span className="font-medium mr-2">Attendance:</span>
                                            <span className="text-green-600 flex items-center">
                                                <CheckCircle size={16} className="mr-1"/>
                                                Present
                                            </span>
                                            <span className="mx-2">•</span>
                                            <span className="text-red-600 flex items-center">
                                                <XCircle size={16} className="mr-1"/>
                                                0 Absences
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* certificates */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Certificates</h2>
                                    <Link to="" className="text-sm text-blue-600 hover:text-blue-500 flex items-center">
                                        View all
                                        <ChevronRight size={16} className="ml-1"/>
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* certificate 1 */}
                                    <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                                        <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                            <Award size={24} className="text-blue-600"/>
                                        </div>

                                        <div>
                                            <h3 className="font-medium">Dressmaking NC II</h3>

                                            <p className="text-sm text-gray-600 mt-1">Completed: June 15, 2025</p>
                                            <p className="text-sm text-green-600 mt-1 flex items-center">
                                                <CheckCircle  size={16} className="mr-1"/>
                                                Valid until June 15, 2027
                                            </p>

                                            <div className="mt-3 flex space-x-2">
                                                <Link to="" className="text-sm text-blue-600 hover:text-blue-500 flex items-center">
                                                    <Download size={16} className="mr-1"/>
                                                    Download
                                                </Link>
                                                <Link to="" className="text-sm text-blue-600 hover:text-blue-500 flex items-center">
                                                    <Eye size={16} className="mr-1"/>
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* certificate 2 */}
                                    <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                                        <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                            <Award size={24} className="text-blue-600"/>
                                        </div>

                                        <div>
                                            <h3 className="font-medium">Hairdressing NC II</h3>

                                            <p className="text-sm text-gray-600 mt-1">Completed: March 10, 2025</p>
                                            <p className="text-sm text-green-600 mt-1 flex items-center">
                                                <CheckCircle  size={16} className="mr-1"/>
                                                Valid until March 10, 2027
                                            </p>

                                            <div className="mt-3 flex space-x-2">
                                                <Link to="" className="text-sm text-blue-600 hover:text-blue-500 flex items-center">
                                                    <Download size={16} className="mr-1"/>
                                                    Download
                                                </Link>
                                                <Link to="" className="text-sm text-blue-600 hover:text-blue-500 flex items-center">
                                                    <Eye size={16} className="mr-1"/>
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                
                                </div>
                            </div>
                        </div>

                        {/* right columnb */}
                        <div className="space-y-6">
                            {/* profile overview */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center mb-4">
                                    <img src="pic.png" alt="Profile" className="w-16 h-16 rounded-full"/>

                                    <div className="ml-4">
                                        <h2 className="font-semibold text-gray-800">Juan Dela Cruz</h2>
                                        <p className="text-sm text-gray-600">juandelacruz@email.com</p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center">
                                        <MapPin size={16} className="text-gray-500 mr-2"/>
                                        <span>San Fernando, Pampanga</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone size={16} className="text-gray-500 mr-2"/>
                                        <span>63 912 345 6789</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar size={16} className="text-gray-500 mr-2"/>
                                        <span>Joined: January 2025</span>
                                    </div>
                                </div>

                                <Link to="" className="mt-4 w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <Edit size={16} className="w-4 h-4 mr-2"/>
                                    Edit Profile
                                </Link>
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

export default UserDashboard;