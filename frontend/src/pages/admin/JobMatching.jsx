import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Bookmark,
    User,
    Eye,
    ChevronRight,
    Edit,
    Trash2,
} from "react-feather";

const JobMatching = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        // Placeholder for API call to search trainees (e.g., GET /trainees?query=searchQuery)
        console.log("Searching for:", e.target.value);
    };

    return (
        <div>
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    Job Matching
                </h1>
                <p className="text-gray-600">
                    Quick stats: 1,234 trainees available • 15 shortlisted
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* AI Job Matching */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                AI Job Matching
                            </h2>
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Job Match with AI (ex: 'Caregivers with NC 2 certificate')"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        <h3 className="font-medium">
                                            Juan Dela Cruz
                                        </h3>
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
                                            to="#view-profile"
                                            className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                                        >
                                            <Eye size={16} className="mr-1" />
                                            View Profile
                                        </Link>
                                        <Link
                                            to="#shortlist"
                                            className="text-sm text-green-600 hover:text-green-500 flex items-center"
                                        >
                                            <Bookmark
                                                size={16}
                                                className="mr-1"
                                            />
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
                                        <h3 className="font-medium">
                                            Ana Reyes
                                        </h3>
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
                                            to="#view-profile"
                                            className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                                        >
                                            <Eye size={16} className="mr-1" />
                                            View Profile
                                        </Link>
                                        <Link
                                            to="#shortlist"
                                            className="text-sm text-green-600 hover:text-green-500 flex items-center"
                                        >
                                            <Bookmark
                                                size={16}
                                                className="mr-1"
                                            />
                                            Shortlist
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shortlisted Candidates */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Shortlisted Candidates
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-gray-600">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3 px-4 text-left font-medium">
                                            Trainee Name
                                        </th>
                                        <th className="py-3 px-4 text-left font-medium">
                                            Skills
                                        </th>
                                        <th className="py-3 px-4 text-left font-medium">
                                            Date Added
                                        </th>
                                        <th className="py-3 px-4 text-left font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-gray-100">
                                        <td className="py-3 px-4">
                                            Maria Santos
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                Welding NC II
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            Sep 18, 2025
                                        </td>
                                        <td className="py-3 px-4 flex space-x-2">
                                            <Link
                                                to="#view-profile"
                                                className="text-blue-600 hover:text-blue-500"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <Link
                                                to="#remove-shortlist"
                                                className="text-red-600 hover:text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-100">
                                        <td className="py-3 px-4">Pedro Lim</td>
                                        <td className="py-3 px-4">
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                Electrical NC II
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            Sep 17, 2025
                                        </td>
                                        <td className="py-3 px-4 flex space-x-2">
                                            <Link
                                                to="#view-profile"
                                                className="text-blue-600 hover:text-blue-500"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <Link
                                                to="#remove-shortlist"
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
        </div>
    );
};

export default JobMatching;
