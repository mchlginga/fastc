import {
    Search,
    Filter,
    ChevronDown,
    X,
    Download,
    RefreshCw,
} from "react-feather";
import { useState } from "react";

const AttendanceFilters = ({
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    courseFilter,
    setCourseFilter,
    statusFilter,
    setStatusFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    showFilters,
    setShowFilters,
    onExportCSV,
    stats,
    loading = false,
    onRefresh,
}) => {
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await onRefresh();
        } finally {
            setRefreshing(false);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    const handleClearDateRange = () => {
        setStartDate("");
        setEndDate("");
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
                        {[...Array(2)].map((_, index) => (
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
                            placeholder="Search by trainee name, email, or course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 text-gray-700 placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-text"
                            disabled={loading}
                        />
                        {/* Clear Search Button */}
                        {searchTerm && (
                            <button
                                onClick={handleClearSearch}
                                disabled={loading}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer"
                                title="Clear search"
                            >
                                <X size={16} />
                            </button>
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
                        title="Refresh attendance"
                    >
                        <RefreshCw
                            size={16}
                            className={`${refreshing ? "animate-spin" : ""}`}
                        />
                    </button>

                    {/* Export CSV Button */}
                    <button
                        onClick={onExportCSV}
                        disabled={loading}
                        className="flex items-center px-4 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download size={16} className="mr-2" />
                        Export CSV
                    </button>

                    {/* Filters Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        disabled={loading}
                        className="flex items-center px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Filter size={16} className="mr-2" />
                        Filters
                        <ChevronDown
                            size={16}
                            className={`ml-2 transition-transform duration-200 ${
                                showFilters ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Date Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Date Range
                            </label>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                disabled={loading}
                                className="w-full px-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="all">All Dates</option>
                                <option value="today">Today</option>
                                <option value="yesterday">Yesterday</option>
                                <option value="thisWeek">This Week</option>
                                <option value="lastWeek">Last Week</option>
                                <option value="thisMonth">This Month</option>
                                <option value="lastMonth">Last Month</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>

                        {/* Course Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Course
                            </label>
                            <select
                                value={courseFilter}
                                onChange={(e) =>
                                    setCourseFilter(e.target.value)
                                }
                                disabled={loading}
                                className="w-full px-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="all">All Courses</option>
                                <option value="construction">
                                    Construction
                                </option>
                                <option value="beauty">
                                    Beauty & Wellness
                                </option>
                                <option value="hospitality">Hospitality</option>
                                <option value="technology">Technology</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                disabled={loading}
                                className="w-full px-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="all">All Status</option>
                                <option value="verified">Verified</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>

                        {/* Custom Date Range */}
                        {dateFilter === "custom" && (
                            <div className="md:col-span-2 lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Custom Date Range
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) =>
                                            setStartDate(e.target.value)
                                        }
                                        className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) =>
                                            setEndDate(e.target.value)
                                        }
                                        className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {(startDate || endDate) && (
                                        <button
                                            onClick={handleClearDateRange}
                                            className="px-3 py-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                            title="Clear date range"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quick View
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                {
                                    status: "all",
                                    label: "All Records",
                                    count: stats.total,
                                },
                                {
                                    status: "today",
                                    label: "Today",
                                    count: stats.today,
                                },
                                {
                                    status: "verified",
                                    label: "Verified",
                                    count: stats.verified,
                                },
                                {
                                    status: "pending",
                                    label: "Pending",
                                    count: stats.pending,
                                },
                                {
                                    status: "failed",
                                    label: "Failed",
                                    count: stats.failed,
                                },
                            ].map((filter) => (
                                <button
                                    key={filter.status}
                                    onClick={() => {
                                        if (
                                            [
                                                "verified",
                                                "pending",
                                                "failed",
                                            ].includes(filter.status)
                                        ) {
                                            setStatusFilter(filter.status);
                                        } else if (filter.status === "today") {
                                            setDateFilter("today");
                                            setStatusFilter("all");
                                        } else {
                                            setDateFilter("all");
                                            setStatusFilter("all");
                                        }
                                    }}
                                    disabled={loading}
                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border ${
                                        (filter.status === statusFilter &&
                                            filter.status !== "all" &&
                                            filter.status !== "today") ||
                                        (filter.status === "today" &&
                                            dateFilter === "today")
                                            ? "bg-blue-50 text-blue-700 border-blue-200"
                                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {filter.label}
                                    <span
                                        className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                                            (filter.status === statusFilter &&
                                                filter.status !== "all" &&
                                                filter.status !== "today") ||
                                            (filter.status === "today" &&
                                                dateFilter === "today")
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
            )}
        </div>
    );
};

export default AttendanceFilters;
