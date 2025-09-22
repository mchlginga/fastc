import {
    Award,
    ChevronRight,
    CheckCircle,
    XCircle,
    Download,
    Eye,
} from "react-feather";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            {/* welcome header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome back, Juan
                </h1>
                <p className="text-gray-600">
                    Here's your training progress and latest updates
                </p>
            </div>

            {/* left column */}
            <div className="lg:col-span-2 space-y-6">
                {/* Enrolled Courses */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Enrolled Courses
                        </h2>
                        <Link
                            to=""
                            className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                        >
                            View all
                            <ChevronRight size={16} className="ml-1" />
                        </Link>
                    </div>
                    {/* course 1 */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <h3 className="font-medium">
                                    Basic Welding Certification
                                </h3>
                                <span className="text-sm text-gray-500">
                                    Mon/Wed/Fri • 9:00-11:00 AM
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full progress-bar w-[65%]"></div>
                            </div>
                            <div className="flex justify-between mt-2 text-sm text-gray-600">
                                <span>65% completed</span>
                                <span>12 of 20 sessions</span>
                            </div>
                            <div className="mt-3 flex items-center text-sm">
                                <span className="font-medium mr-2">
                                    Attendance:
                                </span>
                                <span className="text-green-600 flex items-center">
                                    <CheckCircle size={16} className="mr-1" />
                                    Present
                                </span>
                                <span className="mx-2">•</span>
                                <span className="text-red-600 flex items-center">
                                    <XCircle size={16} className="mr-1" />2
                                    Absences
                                </span>
                            </div>
                        </div>
                        {/* course 2 */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <h3 className="font-medium">
                                    Pastry Making Fundamentals
                                </h3>
                                <span className="text-sm text-gray-500">
                                    Tue/Thu • 1:00-3:00 PM
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full progress-bar w-[30%]"></div>
                            </div>
                            <div className="flex justify-between mt-2 text-sm text-gray-600">
                                <span>30% completed</span>
                                <span>3 of 10 sessions</span>
                            </div>
                            <div className="mt-3 flex items-center text-sm">
                                <span className="font-medium mr-2">
                                    Attendance:
                                </span>
                                <span className="text-green-600 flex items-center">
                                    <CheckCircle size={16} className="mr-1" />
                                    Present
                                </span>
                                <span className="mx-2">•</span>
                                <span className="text-red-600 flex items-center">
                                    <XCircle size={16} className="mr-1" />0
                                    Absences
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* certificates */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Certificates
                        </h2>
                        <Link
                            to=""
                            className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                        >
                            View all
                            <ChevronRight size={16} className="ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* certificate 1 */}
                        <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                            <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                <Award size={24} className="text-blue-600" />
                            </div>

                            <div>
                                <h3 className="font-medium">
                                    Dressmaking NC II
                                </h3>

                                <p className="text-sm text-gray-600 mt-1">
                                    Completed: June 15, 2025
                                </p>
                                <p className="text-sm text-green-600 mt-1 flex items-center">
                                    <CheckCircle size={16} className="mr-1" />
                                    Valid until June 15, 2027
                                </p>

                                <div className="mt-3 flex space-x-2">
                                    <Link
                                        to=""
                                        className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                                    >
                                        <Download size={16} className="mr-1" />
                                        Download
                                    </Link>
                                    <Link
                                        to=""
                                        className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                                    >
                                        <Eye size={16} className="mr-1" />
                                        View
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* certificate 2 */}
                        <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                            <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                <Award size={24} className="text-blue-600" />
                            </div>

                            <div>
                                <h3 className="font-medium">
                                    Hairdressing NC II
                                </h3>

                                <p className="text-sm text-gray-600 mt-1">
                                    Completed: March 10, 2025
                                </p>
                                <p className="text-sm text-green-600 mt-1 flex items-center">
                                    <CheckCircle size={16} className="mr-1" />
                                    Valid until March 10, 2027
                                </p>

                                <div className="mt-3 flex space-x-2">
                                    <Link
                                        to=""
                                        className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                                    >
                                        <Download size={16} className="mr-1" />
                                        Download
                                    </Link>
                                    <Link
                                        to=""
                                        className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                                    >
                                        <Eye size={16} className="mr-1" />
                                        View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
