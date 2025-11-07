import { Search, X, Filter, ChevronDown, FileText } from "react-feather";
import { useState } from "react";

const CertificatesHeader = ({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    certificatesCount,
    filteredCount,
    certificates = [], // Add certificates prop with default value
    loading = false,
}) => {
    const [showFilters, setShowFilters] = useState(false);

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    // Calculate certificate counts by status
    const getCertificateCounts = () => {
        return {
            all: certificates.length,
            active: certificates.filter((c) => c.status === "active").length,
            expired: certificates.filter((c) => c.status === "expired").length,
            revoked: certificates.filter((c) => c.status === "revoked").length,
        };
    };

    const certificateCounts = getCertificateCounts();

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
                        <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
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
                            placeholder="Search certificates by title, course, or verification code..."
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

                {/* Action Buttons and Count */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Results Count */}
                    <div className="text-sm text-gray-600">
                        {searchTerm || statusFilter !== "all" ? (
                            <>
                                Showing {filteredCount} of {certificatesCount}{" "}
                                certificates
                            </>
                        ) : (
                            <>
                                {certificatesCount} certificate
                                {certificatesCount !== 1 ? "s" : ""} earned
                            </>
                        )}
                    </div>

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

                        {/* Quick Status Filters */}
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quick View
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    {
                                        status: "all",
                                        label: "All Certificates",
                                        count: certificateCounts.all,
                                    },
                                    {
                                        status: "active",
                                        label: "Active",
                                        count: certificateCounts.active,
                                    },
                                    {
                                        status: "expired",
                                        label: "Expired",
                                        count: certificateCounts.expired,
                                    },
                                    {
                                        status: "revoked",
                                        label: "Revoked",
                                        count: certificateCounts.revoked,
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

export default CertificatesHeader;
