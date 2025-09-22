import { useState } from "react";
import { Link } from "react-router-dom";
import {
    ChevronRight,
    CheckCircle,
    XCircle,
    Download,
    Eye,
} from "react-feather";

const Courses = () => {
    const [activeTab, setActiveTab] = useState("available");

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
                <p className="text-gray-600">
                    Explore training programs and track your progress
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-4">
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "available" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("available")}
                    >
                        Available
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "enrolled" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("enrolled")}
                    >
                        Enrolled
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "completed" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("completed")}
                    >
                        Completed
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div
                className={activeTab === "available" ? "" : "hidden"}
                id="available"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Course 1 */}
                    <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                        <h3 className="font-semibold text-gray-800">
                            Automotive Servicing NC II
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Learn advanced automotive repair and maintenance
                            techniques.
                        </p>
                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                            <p>
                                <span className="font-medium">Duration:</span> 6
                                months
                            </p>
                            <p>
                                <span className="font-medium">Schedule:</span>{" "}
                                Mon/Wed/Fri, 9:00 AM - 12:00 PM
                            </p>
                            <p>
                                <span className="font-medium">Slots:</span>{" "}
                                15/20 available
                            </p>
                        </div>
                        <button className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                            Enroll
                        </button>
                    </div>
                    {/* Course 2 */}
                    <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                        <h3 className="font-semibold text-gray-800">
                            Electrical Installation NC II
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Master electrical wiring and installation for
                            residential and commercial settings.
                        </p>
                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                            <p>
                                <span className="font-medium">Duration:</span> 4
                                months
                            </p>
                            <p>
                                <span className="font-medium">Schedule:</span>{" "}
                                Tue/Thu, 1:00 PM - 4:00 PM
                            </p>
                            <p>
                                <span className="font-medium">Slots:</span>{" "}
                                10/15 available
                            </p>
                        </div>
                        <button className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                            Enroll
                        </button>
                    </div>
                    {/* Course 3 */}
                    <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                        <h3 className="font-semibold text-gray-800">
                            Baking and Pastry NC II
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Develop skills in professional baking and pastry
                            production.
                        </p>
                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                            <p>
                                <span className="font-medium">Duration:</span> 3
                                months
                            </p>
                            <p>
                                <span className="font-medium">Schedule:</span>{" "}
                                Sat, 8:00 AM - 2:00 PM
                            </p>
                            <p>
                                <span className="font-medium">Slots:</span> 8/12
                                available
                            </p>
                        </div>
                        <button className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                            Enroll
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={activeTab === "enrolled" ? "" : "hidden"}
                id="enrolled"
            >
                <div className="space-y-6">
                    {/* Enrolled Course 1 */}
                    <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-800">
                                Basic Welding Certification
                            </h3>
                            <span className="text-sm text-gray-500">
                                Status: Active
                            </span>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Learn foundational welding techniques for
                                industrial applications.
                            </p>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>
                                    <span className="font-medium">
                                        Schedule:
                                    </span>{" "}
                                    Mon/Wed/Fri, 9:00 AM - 11:00 AM
                                </p>
                                <p>
                                    <span className="font-medium">Venue:</span>{" "}
                                    FAST-C Training Center, San Fernando
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Instructor:
                                    </span>{" "}
                                    Maria Santos
                                </p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full progress-bar w-[65%]"></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>65% completed</span>
                                <span>12 of 20 sessions</span>
                            </div>
                            <div className="flex items-center text-sm">
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
                            <Link
                                to="/user/course-details"
                                className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                            >
                                View Details
                                <ChevronRight size={16} className="ml-1" />
                            </Link>
                        </div>
                    </div>
                    {/* Enrolled Course 2 */}
                    <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-800">
                                Pastry Making Fundamentals
                            </h3>
                            <span className="text-sm text-gray-500">
                                Status: Pending Approval
                            </span>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Master the basics of pastry preparation and
                                baking.
                            </p>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>
                                    <span className="font-medium">
                                        Schedule:
                                    </span>{" "}
                                    Tue/Thu, 1:00 PM - 3:00 PM
                                </p>
                                <p>
                                    <span className="font-medium">Venue:</span>{" "}
                                    Online (Zoom)
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Instructor:
                                    </span>{" "}
                                    John Reyes
                                </p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full progress-bar w-[30%]"></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>30% completed</span>
                                <span>3 of 10 sessions</span>
                            </div>
                            <div className="flex items-center text-sm">
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
                            <Link
                                to="/user/course-details"
                                className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                            >
                                View Details
                                <ChevronRight size={16} className="ml-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={activeTab === "completed" ? "" : "hidden"}
                id="completed"
            >
                <div className="space-y-6">
                    {/* Completed Course 1 */}
                    <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-800">
                                Dressmaking NC II
                            </h3>
                            <span className="text-sm text-green-600">
                                Completed
                            </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>
                                <span className="font-medium">Completed:</span>{" "}
                                June 15, 2023
                            </p>
                            <p>
                                <span className="font-medium">
                                    Certificate:
                                </span>{" "}
                                Issued (Valid until June 15, 2025)
                            </p>
                            <p>
                                <span className="font-medium">Instructor:</span>{" "}
                                Ana Gomez
                            </p>
                        </div>
                        <div className="mt-4 flex space-x-2">
                            <Link
                                to="#"
                                className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                            >
                                <Download size={16} className="mr-1" />
                                Download Certificate
                            </Link>
                            <Link
                                to="/user/course-details"
                                className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                            >
                                <Eye size={16} className="mr-1" />
                                View Details
                            </Link>
                        </div>
                    </div>
                    {/* Completed Course 2 */}
                    <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-800">
                                Computer Systems Servicing NC II
                            </h3>
                            <span className="text-sm text-green-600">
                                Completed
                            </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>
                                <span className="font-medium">Completed:</span>{" "}
                                March 10, 2023
                            </p>
                            <p>
                                <span className="font-medium">
                                    Certificate:
                                </span>{" "}
                                Issued (Valid until March 10, 2025)
                            </p>
                            <p>
                                <span className="font-medium">Instructor:</span>{" "}
                                Carlos Lim
                            </p>
                        </div>
                        <div className="mt-4 flex space-x-2">
                            <Link
                                to="#"
                                className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                            >
                                <Download size={16} className="mr-1" />
                                Download Certificate
                            </Link>
                            <Link
                                to="/user/course-details"
                                className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                            >
                                <Eye size={16} className="mr-1" />
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Courses;
