import {
    Search,
    Filter,
    Plus,
    ChevronDown,
    Check,
    X,
    Trash2,
} from "react-feather";
import { useState } from "react";

const CourseFilters = ({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    showFilters,
    setShowFilters,
    selectedCourses,
    onAddCourse,
    onBulkStatusUpdate,
    onBulkDelete,
    stats,
    loading = false,
}) => {
    const [showBulkActions, setShowBulkActions] = useState(false);

    const handleClearSearch = () => {
        setSearchTerm("");
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
                            placeholder="Search courses by title, description, or tags..."
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
                    {/* Add Course Button */}
                    <button
                        onClick={onAddCourse}
                        disabled={loading}
                        className="flex items-center px-4 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Course
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

                    {/* Bulk Actions */}
                    {selectedCourses.size > 0 && (
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setShowBulkActions(!showBulkActions)
                                }
                                disabled={loading}
                                className="flex items-center px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {selectedCourses.size} selected
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
                                            className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
                                        >
                                            <Check
                                                size={16}
                                                className="mr-3 text-emerald-600"
                                            />
                                            Activate Selected
                                        </button>
                                        <button
                                            onClick={() => {
                                                onBulkStatusUpdate("inactive");
                                                setShowBulkActions(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                                        >
                                            <X
                                                size={16}
                                                className="mr-3 text-red-600"
                                            />
                                            Deactivate Selected
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
                                Course Status
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
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Category
                            </label>
                            <select
                                value={categoryFilter}
                                onChange={(e) =>
                                    setCategoryFilter(e.target.value)
                                }
                                disabled={loading}
                                className="w-full px-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="all">All Categories</option>
                                <option value="Programming">Programming</option>
                                <option value="Data Science">
                                    Data Science
                                </option>
                                <option value="Business">Business</option>
                                <option value="Design">Design</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Welding">Welding</option>
                                <option value="Beauty Care">Beauty Care</option>
                                <option value="Massage Therapy">
                                    Massage Therapy
                                </option>
                                <option value="Housekeeping">
                                    Housekeeping
                                </option>
                                <option value="Carpentry">Carpentry</option>
                                <option value="Masonry">Masonry</option>
                            </select>
                        </div>

                        {/* Quick Stats */}
                        <div className="md:col-span-2 lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quick View
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    {
                                        status: "all",
                                        label: "All Courses",
                                        count: stats.total,
                                    },
                                    {
                                        status: "active",
                                        label: "Active",
                                        count: stats.active,
                                    },
                                    {
                                        status: "inactive",
                                        label: "Inactive",
                                        count: stats.inactive,
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

export default CourseFilters;
