import {
    Search,
    Filter,
    Plus,
    ChevronDown,
    ChevronUp,
    Check,
    X,
    Trash2,
    RotateCcw,
    Clock,
    RefreshCw,
} from "react-feather";
import { useState, useEffect } from "react";
import { adminCourseService } from "../../../services/userService";
import { adminUserService } from "../../../services/userService";

const CertificateFilters = ({
    searchTerm,
    setSearchTerm,
    onSearch,
    onClearSearch,
    statusFilter,
    setStatusFilter,
    courseFilter,
    setCourseFilter,
    userFilter,
    setUserFilter,
    showFilters,
    setShowFilters,
    selectedCertificates,
    onAddCertificate,
    onBulkStatusUpdate,
    onBulkRegenerate,
    onBulkExpire,
    onBulkDelete,
    stats,
    loading = false,
    onRefresh,
}) => {
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch courses and users for filters
    useEffect(() => {
        if (showFilters) {
            fetchFilterData();
        }
    }, [showFilters]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await onRefresh();
        } finally {
            setRefreshing(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleManualSearch();
        }
    };

    const handleManualSearch = () => {
        onSearch(searchTerm);
    };

    const handleInputChange = (value) => {
        setSearchTerm(value);
    };

    const handleClear = () => {
        setSearchTerm("");
        onClearSearch();
    };

    const fetchFilterData = async () => {
        try {
            setLoadingData(true);
            const [coursesResponse, usersResponse] = await Promise.all([
                adminCourseService.getCourses({ limit: 100 }),
                adminUserService.getUsers({ limit: 100 }),
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
            <div className="p-6 border-b border-gray-100">
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
        <div className="p-6 border-b border-gray-100">
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
                            placeholder="Search by user name, email, course title, or verification code..."
                            value={searchTerm}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full pl-10 pr-20 py-2.5 text-gray-700 placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-text"
                            disabled={loading}
                        />
                        {/* Search and Clear Buttons */}
                        {searchTerm && (
                            <>
                                <button
                                    onClick={handleClear}
                                    disabled={loading}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer"
                                    title="Clear search"
                                >
                                    <X size={16} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Refresh Button */}
                    <button
                        onClick={handleRefresh}
                        disabled={loading || refreshing}
                        className="flex items-center px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Refresh certificates"
                    >
                        <RefreshCw
                            size={16}
                            className={`${refreshing ? "animate-spin" : ""}`}
                        />
                    </button>

                    {/* Add Certificate Button */}
                    <button
                        onClick={onAddCertificate}
                        disabled={loading}
                        className="flex items-center px-4 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={16} className="mr-2" />
                        Create Certificate
                    </button>

                    {/* Filters Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        disabled={loading}
                        className="flex items-center px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
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
                    {selectedCertificates.size > 0 && (
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setShowBulkActions(!showBulkActions)
                                }
                                disabled={loading}
                                className="flex items-center px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {selectedCertificates.size} selected
                                <ChevronDown
                                    size={16}
                                    className={`ml-2 transition-transform duration-200 ${
                                        showBulkActions ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {showBulkActions && (
                                <div className="absolute right-0 z-10 w-56 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg shadow-gray-200/50 ring-1 ring-black ring-opacity-5">
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                onBulkStatusUpdate("active");
                                                setShowBulkActions(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors cursor-pointer"
                                        >
                                            <Check
                                                size={16}
                                                className="mr-3 text-green-600"
                                            />
                                            Activate Selected
                                        </button>
                                        <button
                                            onClick={() => {
                                                onBulkStatusUpdate("revoked");
                                                setShowBulkActions(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                                        >
                                            <X
                                                size={16}
                                                className="mr-3 text-red-600"
                                            />
                                            Revoke Selected
                                        </button>
                                        <button
                                            onClick={() => {
                                                onBulkExpire();
                                                setShowBulkActions(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors cursor-pointer"
                                        >
                                            <Clock
                                                size={16}
                                                className="mr-3 text-yellow-600"
                                            />
                                            Expire Selected
                                        </button>

                                        <button
                                            onClick={() => {
                                                onBulkRegenerate();
                                                setShowBulkActions(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors cursor-pointer"
                                        >
                                            <RotateCcw
                                                size={16}
                                                className="mr-3 text-orange-600"
                                            />
                                            Regenerate Selected
                                        </button>

                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button
                                            onClick={() => {
                                                onBulkDelete();
                                                setShowBulkActions(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                                        >
                                            <Trash2
                                                size={16}
                                                className="mr-3"
                                            />
                                            Delete Selected
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Certificate Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                disabled={loading}
                                className="w-full px-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                                <option value="revoked">Revoked</option>
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
                                    disabled={loading}
                                    className="w-full px-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="all">All Courses</option>
                                    {courses.map((course) => (
                                        <option
                                            key={course._id}
                                            value={course._id}
                                        >
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
                                    onChange={(e) =>
                                        setUserFilter(e.target.value)
                                    }
                                    disabled={loading}
                                    className="w-full px-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="all">All Users</option>
                                    {users.map((user) => (
                                        <option key={user._id} value={user._id}>
                                            {user.role === "company"
                                                ? user.companyName
                                                : `${user.firstName} ${user.surname}`}
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
                                        status: "active",
                                        label: "Active",
                                        count: stats.active,
                                    },
                                    {
                                        status: "expired",
                                        label: "Expired",
                                        count: stats.expired,
                                    },
                                    {
                                        status: "revoked",
                                        label: "Revoked",
                                        count: stats.revoked,
                                    },
                                ].map((filter) => (
                                    <button
                                        key={filter.status}
                                        onClick={() =>
                                            setStatusFilter(filter.status)
                                        }
                                        disabled={loading}
                                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border ${
                                            statusFilter === filter.status
                                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {filter.label}
                                        <span
                                            className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                                                statusFilter === filter.status
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-gray-100 text-gray-600"
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

export default CertificateFilters;
