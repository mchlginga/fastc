import {
    Search,
    Filter,
    Plus,
    ChevronDown,
    ChevronUp,
    Check,
    X,
    Trash2,
} from "react-feather";
import { useState, useEffect } from "react";
import { adminCourseService } from "../../../services/userService";
import { adminUserService } from "../../../services/userService";

const EnrollmentFilters = ({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    courseFilter,
    setCourseFilter,
    userFilter,
    setUserFilter,
    showFilters,
    setShowFilters,
    selectedEnrollments,
    onAddEnrollment,
    onBulkStatusUpdate,
    onBulkDelete,
    stats,
    loading = false,
}) => {
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    // Fetch courses and users for filters
    useEffect(() => {
        if (showFilters) {
            fetchFilterData();
        }
    }, [showFilters]);

    const fetchFilterData = async () => {
        try {
            setLoadingData(true);
            const [coursesResponse, usersResponse] = await Promise.all([
                adminCourseService.getCourses({ limit: 100 }),
                adminUserService.getUsers({ limit: 100 })
            ]);
            
            setCourses(coursesResponse.courses || []);
            setUsers(usersResponse.users || []);
        } catch (err) {
            console.error("Error fetching filter data:", err);
        } finally {
            setLoadingData(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 border-b border-gray-100 bg-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Search Bar Skeleton */}
                    <div className="flex-1 max-w-lg">
                        <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                    {/* Action Buttons Skeleton */}
                    <div className="flex flex-wrap gap-2">
                        {[...Array(3)].map((_, index) => (
                            <div
                                key={index}
                                className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 border-b border-gray-100 bg-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Search Bar */}
                <div className="flex-1 max-w-lg">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search by user name, email, or course title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-gray-700 placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-text"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                    {/* Add Enrollment Button */}
                    <button
                        onClick={onAddEnrollment}
                        className="flex items-center px-4 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer shadow-sm"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Enrollment
                    </button>

                    {/* Filters Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer shadow-sm"
                    >
                        <Filter size={16} className="mr-2" />
                        Filters
                        {showFilters ? (
                            <ChevronUp size={16} className="ml-2" />
                        ) : (
                            <ChevronDown size={16} className="ml-2" />
                        )}
                    </button>

                    {/* Bulk Actions */}
                    {selectedEnrollments.size > 0 && (
                        <div className="relative">
                            <button className="flex items-center px-4 py-2.5 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer shadow-sm">
                                Bulk Actions ({selectedEnrollments.size})
                                <ChevronDown size={16} className="ml-2" />
                            </button>
                            <div className="absolute right-0 z-10 w-56 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                    <button
                                        onClick={() =>
                                            onBulkStatusUpdate("active")
                                        }
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors cursor-pointer"
                                    >
                                        <Check
                                            size={16}
                                            className="mr-3 text-green-600"
                                        />
                                        Activate Selected
                                    </button>
                                    <button
                                        onClick={() =>
                                            onBulkStatusUpdate("completed")
                                        }
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                                    >
                                        <Check
                                            size={16}
                                            className="mr-3 text-blue-600"
                                        />
                                        Mark as Completed
                                    </button>
                                    <button
                                        onClick={() =>
                                            onBulkStatusUpdate("cancelled")
                                        }
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                                    >
                                        <X
                                            size={16}
                                            className="mr-3 text-red-600"
                                        />
                                        Cancel Selected
                                    </button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                        onClick={onBulkDelete}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                                    >
                                        <Trash2 size={16} className="mr-3" />
                                        Delete Selected
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Enrollment Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="w-full px-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>

                        {/* Course Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Course
                            </label>
                            {loadingData ? (
                                <div className="w-full px-3 py-2.5 border border-gray-300 rounded bg-gray-100 animate-pulse">
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                </div>
                            ) : (
                                <select
                                    value={courseFilter}
                                    onChange={(e) =>
                                        setCourseFilter(e.target.value)
                                    }
                                    className="w-full px-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                                >
                                    <option value="all">All Courses</option>
                                    {courses.map((course) => (
                                        <option key={course._id} value={course._id}>
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* User Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                User
                            </label>
                            {loadingData ? (
                                <div className="w-full px-3 py-2.5 border border-gray-300 rounded bg-gray-100 animate-pulse">
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                </div>
                            ) : (
                                <select
                                    value={userFilter}
                                    onChange={(e) => setUserFilter(e.target.value)}
                                    className="w-full px-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                                >
                                    <option value="all">All Users</option>
                                    {users.map((user) => (
                                        <option key={user._id} value={user._id}>
                                            {user.role === "company" 
                                                ? user.companyName 
                                                : `${user.firstName} ${user.surname}`
                                            }
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="md:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quick View
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    {
                                        status: "all",
                                        label: "All",
                                        count: stats.total,
                                    },
                                    {
                                        status: "pending",
                                        label: "Pending",
                                        count: stats.pending,
                                    },
                                    {
                                        status: "active",
                                        label: "Active",
                                        count: stats.active,
                                    },
                                    {
                                        status: "completed",
                                        label: "Completed",
                                        count: stats.completed,
                                    },
                                ].map((filter) => (
                                    <button
                                        key={filter.status}
                                        onClick={() =>
                                            setStatusFilter(filter.status)
                                        }
                                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                                            statusFilter === filter.status
                                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                                        }`}
                                    >
                                        {filter.label}
                                        <span
                                            className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                                                statusFilter === filter.status
                                                    ? "bg-blue-200 text-blue-800"
                                                    : "bg-gray-200 text-gray-700"
                                            }`}
                                        >
                                            {filter.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnrollmentFilters;