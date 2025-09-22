import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Eye,
    Edit,
    Trash2,
    Archive,
    Calendar,
    CheckCircle,
    FileText,
    Download,
    RefreshCw,
} from "react-feather";

const AdminCourses = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: "",
        schedule: "",
        slots: "",
        instructor: "",
        requirements: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateCourse = (e) => {
        e.preventDefault();
        console.log("Creating course:", formData);
        // Add API call to create course (e.g., POST /courses)
        setFormData({
            title: "",
            description: "",
            duration: "",
            schedule: "",
            slots: "",
            instructor: "",
            requirements: "",
        });
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    Courses Management
                </h1>
                <p className="text-gray-600">
                    Manage training programs, enrollments, and reports
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-4">
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "all" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("all")}
                    >
                        All Courses
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "create" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("create")}
                    >
                        Create Course
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "enrolled" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("enrolled")}
                    >
                        Enrolled Trainees
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "completed" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("completed")}
                    >
                        Completed Courses
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "archived" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("archived")}
                    >
                        Archived Courses
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className={activeTab === "all" ? "" : "hidden"} id="all">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        All Courses
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-600">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left font-medium">
                                        Title
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Duration
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Schedule
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Slots
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Instructor
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Status
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">
                                        Automotive Servicing NC II
                                    </td>
                                    <td className="py-3 px-4">6 months</td>
                                    <td className="py-3 px-4">
                                        Mon/Wed/Fri, 9:00 AM
                                    </td>
                                    <td className="py-3 px-4">15/20</td>
                                    <td className="py-3 px-4">Maria Santos</td>
                                    <td className="py-3 px-4 text-green-600">
                                        Active
                                    </td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-yellow-600 hover:text-yellow-500"
                                        >
                                            <Archive size={16} />
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">
                                        Electrical Installation NC II
                                    </td>
                                    <td className="py-3 px-4">4 months</td>
                                    <td className="py-3 px-4">
                                        Tue/Thu, 1:00 PM
                                    </td>
                                    <td className="py-3 px-4">10/15</td>
                                    <td className="py-3 px-4">John Reyes</td>
                                    <td className="py-3 px-4 text-green-600">
                                        Active
                                    </td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-yellow-600 hover:text-yellow-500"
                                        >
                                            <Archive size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className={activeTab === "create" ? "" : "hidden"} id="create">
                <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Create New Course
                    </h2>
                    <form onSubmit={handleCreateCourse} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Course Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Automotive Servicing NC II"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter course description"
                                rows="4"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Duration
                            </label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 6 months"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Schedule
                            </label>
                            <input
                                type="text"
                                name="schedule"
                                value={formData.schedule}
                                onChange={handleInputChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Mon/Wed/Fri, 9:00 AM - 12:00 PM"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Slots
                            </label>
                            <input
                                type="number"
                                name="slots"
                                value={formData.slots}
                                onChange={handleInputChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Instructor
                            </label>
                            <input
                                type="text"
                                name="instructor"
                                value={formData.instructor}
                                onChange={handleInputChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Maria Santos"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Requirements
                            </label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleInputChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., High School Diploma, Basic Mechanical Knowledge"
                                rows="4"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                            Create Course
                        </button>
                    </form>
                </div>
            </div>

            <div
                className={activeTab === "enrolled" ? "" : "hidden"}
                id="enrolled"
            >
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Enrolled Trainees
                    </h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Select Course
                        </label>
                        <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Automotive Servicing NC II</option>
                            <option>Electrical Installation NC II</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-600">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left font-medium">
                                        Trainee Name
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Attendance %
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Progress
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Status
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">
                                        Juan Dela Cruz
                                    </td>
                                    <td className="py-3 px-4">90%</td>
                                    <td className="py-3 px-4">65%</td>
                                    <td className="py-3 px-4 text-green-600">
                                        Active
                                    </td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Calendar size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-green-600 hover:text-green-500"
                                        >
                                            <CheckCircle size={16} />
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">Ana Gomez</td>
                                    <td className="py-3 px-4">80%</td>
                                    <td className="py-3 px-4">30%</td>
                                    <td className="py-3 px-4 text-yellow-600">
                                        Pending Approval
                                    </td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Calendar size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-green-600 hover:text-green-500"
                                        >
                                            <CheckCircle size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div
                className={activeTab === "completed" ? "" : "hidden"}
                id="completed"
            >
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Completed Courses
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-600">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left font-medium">
                                        Title
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        End Date
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Certificates Issued
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">
                                        Dressmaking NC II
                                    </td>
                                    <td className="py-3 px-4">2023-06-15</td>
                                    <td className="py-3 px-4">12/12</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <FileText size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Download size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-green-600 hover:text-green-500"
                                        >
                                            <RefreshCw size={16} />
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">
                                        Computer Systems Servicing NC II
                                    </td>
                                    <td className="py-3 px-4">2023-03-10</td>
                                    <td className="py-3 px-4">8/10</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <FileText size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Download size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-green-600 hover:text-green-500"
                                        >
                                            <RefreshCw size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div
                className={activeTab === "archived" ? "" : "hidden"}
                id="archived"
            >
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Archived/Inactive Courses
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-600">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left font-medium">
                                        Title
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Archived Date
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">
                                        Basic Welding Certification
                                    </td>
                                    <td className="py-3 px-4">2023-01-20</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <Link
                                            to="#"
                                            className="text-green-600 hover:text-green-500"
                                        >
                                            <RefreshCw size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">
                                        Pastry Making Fundamentals
                                    </td>
                                    <td className="py-3 px-4">2022-12-15</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <Link
                                            to="#"
                                            className="text-green-600 hover:text-green-500"
                                        >
                                            <RefreshCw size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCourses;
