import { Clock } from "react-feather";

const AdminAttendanceSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50/60 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div>
                            <div className="h-7 bg-gray-200 rounded w-64 animate-pulse mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards Skeleton */}
                <div className="mb-6">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={index}
                                className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="h-7 bg-gray-200 rounded w-12 animate-pulse mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                    </div>
                                    <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters and Table Skeleton */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                    {/* Filters Skeleton */}
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

                    {/* Table Skeleton */}
                    <div className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <div className="min-w-full">
                                {/* Table Header Skeleton */}
                                <div className="bg-gray-50 border-b border-gray-100">
                                    <div className="flex pl-6 pr-4 py-4">
                                        {[...Array(6)].map((_, index) => (
                                            <div
                                                key={index}
                                                className="flex-1 px-4"
                                            >
                                                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Table Rows Skeleton */}
                                <div className="divide-y divide-gray-100">
                                    {[...Array(8)].map((_, rowIndex) => (
                                        <div
                                            key={rowIndex}
                                            className={`flex pl-6 pr-4 py-4 ${
                                                rowIndex % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50/50"
                                            }`}
                                        >
                                            {[...Array(6)].map(
                                                (_, cellIndex) => (
                                                    <div
                                                        key={cellIndex}
                                                        className="flex-1 px-4"
                                                    >
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Pagination Skeleton */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                    <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, index) => (
                                        <div
                                            key={index}
                                            className="h-8 w-8 bg-gray-200 rounded animate-pulse"
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAttendanceSkeleton;
