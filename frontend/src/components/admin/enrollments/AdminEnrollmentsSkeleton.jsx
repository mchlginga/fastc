import { Users } from "react-feather";

const AdminEnrollmentsSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="flex items-center mb-3">
                        <Users size={28} className="text-blue-600 mr-3" />
                        <div className="h-8 bg-gray-300 rounded w-64 animate-pulse"></div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-96 animate-pulse"></div>
                </div>

                {/* Stats Cards Skeleton */}
                <div className="mb-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                                    <div className="text-right">
                                        <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters and Table Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Filters Skeleton */}
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

                    {/* Table Skeleton */}
                    <div className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <div className="min-w-full">
                                {/* Table Header Skeleton */}
                                <div className="bg-gray-100 border-b border-gray-200">
                                    <div className="flex px-4 py-3">
                                        {[...Array(8)].map((_, index) => (
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
                                            className={`flex px-4 py-3 ${
                                                rowIndex % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50"
                                            }`}
                                        >
                                            {[...Array(8)].map(
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEnrollmentsSkeleton;
